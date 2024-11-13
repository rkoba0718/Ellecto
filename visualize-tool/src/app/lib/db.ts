import { MongoClient, ObjectId } from "mongodb";

const url = process.env.DB_URL as string;
let client: MongoClient | null = null;

export async function connectToDatabase() {
    if (!client) {
        client = new MongoClient(url);
        await client.connect();
    }
    return client.db(process.env.DB_NAME);
};

// 正規表現の特殊文字をエスケープする関数
const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $&は一致した部分全体を参照
}

// 与えられたキーワードやライセンスなどの情報からDBを検索し，スコア順に返す関数
export async function searchProjects(searchTerm: string, language: string, license: string, weight: any) {
    const db = await connectToDatabase();
    const collection = db.collection(process.env.UBUNTU_COLLECTION_NAME as string);

    const query: any = {};

    // クエリ作成（複数キーワードに対応するため分割）
    const keywords = searchTerm.split(' ').map((term: string) => ({
        $or: [
            { Name: { $regex: escapeRegExp(term), $options: 'i' } },
            { Section: { $regex: escapeRegExp(term), $options: 'i' } },
            { 'Description.summary': { $regex: escapeRegExp(term), $options: 'i' } },
            { 'Description.detail': { $regex: escapeRegExp(term), $options: 'i' } }
        ]
    }));
    const languages = language !== ''
        ? language.split(' ').map((lang: string) => ({
                $or: [
                    { 'Description.summary': { $regex: escapeRegExp(lang), $options: 'i' } },
                    { 'Description.detail': { $regex: escapeRegExp(lang), $options: 'i' } },
                    { 'Language.Lang1.Name': { $regex: escapeRegExp(lang), $options: 'i' } }
                ]
            }))
            : [];
    const licenses = license !== ''
        ? license.split(' ').map((lic: string) => ({ License: { $regex: lic, $options: 'i' } }))
        : [];
    query.$or = [
        ...keywords,
        ...languages,
        ...licenses,
    ];

    const results = await collection.find(query).toArray();

    // スコアリング処理
    const scoredResults = results.map((project) => {
        let score = 0;

        // 検索ワードのスコア加算
        const keywords = searchTerm.split(' ');
        keywords.map((keyword) => {
            const escapeKeyword = escapeRegExp(keyword);
            if (new RegExp(escapeKeyword, 'i').test(project.Name)) score += weight.searchTerm * 2;
            if (new RegExp(escapeKeyword, 'i').test(project.Section)) score += weight.searchTerm * 1;
            if (new RegExp(escapeKeyword, 'i').test(project.Description['summary'])) score += weight.searchTerm * 2;
            if (new RegExp(escapeKeyword, 'i').test(project.Description['detail'])) score += weight.searchTerm * 1;
        })

        // 言語のスコア加算
        if (language !== '') {
            const languages = language.split(' ');
            languages.map((lang) => {
                const escapeLang = escapeRegExp(lang);
                if (new RegExp(escapeLang, 'i').test(project.Description['summary'])) score += weight.language * 1;
                if (new RegExp(escapeLang, 'i').test(project.Description['detail'])) score += weight.language * 1;
                if (new RegExp(escapeLang, 'i').test(project.Language.Lang1.Name)) score += weight.language * 1;
            })
        }

        // ライセンスのスコア加算
        if (license !== '') {
            const licenses = license.split(' ');
            licenses.map((lic) => {
                const escapeLic = escapeRegExp(lic);
                if (new RegExp(escapeLic, 'i').test(project.License)) score += weight.license * 1;
            })
        }

        return { ...project, score };
    });

    // スコア順にソート
    return scoredResults.sort((a, b) => b.score - a.score);
};

// 与えられたpackageNameの類似度計算結果を取得する関数
export async function getSimilarProjects(packageName: string): Promise<string[]> {
    const db = await connectToDatabase();
    const collection = db.collection(process.env.SIMILARITY_COLLECTION_NAME as string);

    // 類似度データを取得し、上位5件のキー（プロジェクト名）を抽出
    const similarityData = await collection.findOne({ Name: packageName });
    if (!similarityData) throw new Error(`${packageName}'s similar data not found`);

    // 類似度が高い順にソートし、Top5を取得
    const sortedProjectNames = Object.entries(similarityData)
        .filter(([key, value]) => key !== "Name" && typeof value === "number" && value > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([key]) => key);

    return sortedProjectNames;
};

// 与えられたプロジェクト名のデータを取得する関数
export async function getProjectDetails(projectName: string): Promise<any> {
    const db = await connectToDatabase();
    const collection = db.collection(process.env.UBUNTU_COLLECTION_NAME as string);

    // プロジェクト名でデータベースから詳細情報を取得
    const project = await collection.findOne({ Name: projectName });
    if (!project) throw new Error(`Project ${projectName} not found`);

    return project;
};

// REST APIによって，取得したコミットデータをDBに保存する関数（キャッシュすることで，apiレスポンスの回数を減らすことができる）
export async function cacheCommitData(projectId: ObjectId, monthlyCommits: { [month: string]: number }, lastFetchDate: Date) {
    const db = await connectToDatabase();
    const collection = db.collection(process.env.UBUNTU_COLLECTION_NAME as string);

    const commitData = {
        lastFetchDate: lastFetchDate,
        cacheData: monthlyCommits
    }
    await collection.updateOne(
        { _id: projectId },
        { $set: { Commit: commitData } }
    );
};