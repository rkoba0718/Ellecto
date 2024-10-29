import argparse
import os
from pymongo import MongoClient
from transformers import pipeline



# プログラム使用方法
# python summarize.py [-e] [--plus-summary-tokens [n]] [--plus-detail-tokens [m]]
#     -e（オプション）: エラーファイル（summarized_error.txt）に記載されているプロジェクトのみに対して要約タスクを実行．
#     --plus-summary-tokens（オプション，default=10）: バイナリパッケージのDescription.summaryの要約を生成する際の加算するトークン数の個数．
#     --plus-detail-tokens（オプション，default=100）: バイナリパッケージのDescription.detailの要約を生成する際の加算するトークン数の個数．
# 使用例
# python summarize.py --plus-summary-tokens 10 --plus-detail-tokens 50
# python summarize.py -e --plus-summary-tokens 20 --plus-detail-tokens 70



# MongoDBの設定
# MONGODB_URI = "mongodb://root:password@oss-project-map-mongo-1:27017" # For production environment
MONGODB_URI = "mongodb://root:password@ossprojectmap-mongo-1:27017" # For Test environment
# DATABASE_NAME = "ProjSelector" # For production environment
DATABASE_NAME = "testDB" # For Test environment
COLLECTION_NAME = "ubuntu"

# 要約モデルのパイプライン設定
summarizer = pipeline("summarization", model="bert-base-uncased")

# 要約文字列を生成する最小のトークン数
MIN_TOKENS = 20

# エラーログファイルの設定
ERROR_LOG_FILE = "summarized_error.txt"

# MongoDBに接続し、データベースとコレクションを返す
def connect_to_mongo(uri):
    client = MongoClient(uri)
    db = client[DATABASE_NAME]
    collection = db[COLLECTION_NAME]
    return collection

# summarized_error.txtからエラーが発生したプロジェクト名を読み込む
def load_error_projects():
    try:
        with open(ERROR_LOG_FILE, "r") as f:
            error_projects = set(line.strip() for line in f if line.strip())

        # ファイルの読み込みが終わったらファイルを削除
        os.remove(ERROR_LOG_FILE)
        print(f"{ERROR_LOG_FILE} is removed.")

        return error_projects
    except FileNotFoundError:
        print(f"{ERROR_LOG_FILE} is not found.")
        return set()

# テキストを入力長さの割合に基づいて動的に要約し，最小トークン数を設定
def summarize_text(text, length_ratio=0.3, plus_tokens=100):
    input_length = len(text.split())

    # トークン数が閾値以下ならそのまま返す
    if input_length < MIN_TOKENS:
        return text  # BERT要約を行わず、そのまま返す

    max_length = input_length + plus_tokens  # 元の入力にmax_new_tokensを追加
    min_length = int(max_length * 0.5)  # max_lengthの50%を最低文字数とする

    try:
        summary = summarizer(text, max_length=max_length, min_length=min_length, do_sample=False, truncation=True)
        return summary[0]['summary_text']
    except Exception as e:
        print(f"Summarization failed: {e}")
        return None  # 失敗した場合はNoneを返す

# プロジェクトのDescriptionフィールドを生成し，要約を追加
def process_project_description(project, plus_summary_tokens, plus_detail_tokens):
    # Descriptionがある場合はスキップ
    if "Description" in project:
        return project  # 何も変更しない

    # PackageフィールドからDescriptionのsummaryとdetailを収集
    summaries = []
    details = []
    package_data = project.get("Package", {})

    # Packageの長さが1であれば、そのDescriptionをそのまま使用
    if len(package_data) == 1:
        # 最初のパッケージデータを取得
        single_pkg_description = list(package_data.values())[0].get("Description", {})
        project["Description"] = {
            "summary": single_pkg_description.get("summary", ""),
            "detail": single_pkg_description.get("detail", "")
        }
        return project  # 要約せずに返す

    # Packageが複数の場合はsummaryとdetailを収集
    for pkg_key, pkg_data in project.get("Package", {}).items():
        pkg_description = pkg_data.get("Description", {})
        summaries.append(pkg_description.get("summary", "") + "\n")
        details.append(pkg_description.get("detail", "") + "\n")

    # 各要素をテキストにまとめる
    summary_text = " ".join(summaries)
    detail_text = " ".join(details)

    # summary_textとdetail_textを指定の長さで要約
    summarized_summary = summarize_text(summary_text, length_ratio=0.3, plus_tokens=plus_summary_tokens)
    summarized_detail = summarize_text(detail_text, length_ratio=0.5, plus_tokens=plus_detail_tokens)

    # 要約が失敗した場合、エラーログに追記し、処理を中止
    if summarized_summary is None or summarized_detail is None:
        with open(ERROR_LOG_FILE, "a") as f:
            f.write(f"{project.get('Name', 'Unknown Name')}\n")
        return project  # Descriptionフィールドを追加せず返す

    # 新しいDescriptionフィールドを追加
    project["Description"] = {
        "summary": summarized_summary,
        "detail": summarized_detail
    }

    return project

# MongoDBのすべてのプロジェクトについてDescriptionフィールドを追加または更新
def update_projects(error_only=False, plus_summary_tokens=10, plus_detail_tokens=100):
    collection = connect_to_mongo(MONGODB_URI)

    # -eオプションが指定された場合、エラーのプロジェクトのみを対象にする
    if error_only:
        error_projects = load_error_projects()
        query = {"Name": {"$in": list(error_projects)}}
    else:
        query = {}

    for project in collection.find(query):
        updated_project = process_project_description(project, plus_summary_tokens, plus_detail_tokens)
        collection.update_one({"_id":project["_id"]}, {"$set": updated_project})

if __name__ == "__main__":
    # コマンドライン引数のパーサを設定
    parser = argparse.ArgumentParser(description="MongoDBプロジェクト要約スクリプト")
    parser.add_argument("-e", "--error-only", action="store_true", help="エラーのプロジェクトのみを対象とする")
    parser.add_argument("--plus-summary-tokens", type=int, default=10, help="summary要約用のplus_tokens値")
    parser.add_argument("--plus-detail-tokens", type=int, default=100, help="detail要約用のplus_tokens値")
    args = parser.parse_args()

    # オプションに基づいてupdate_projectsを実行
    update_projects(
        error_only=args.error_only,
        plus_summary_tokens=args.plus_summary_tokens,
        plus_detail_tokens=args.plus_detail_tokens
    )
