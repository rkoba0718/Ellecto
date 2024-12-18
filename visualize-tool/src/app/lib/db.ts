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
export async function searchProjects(
    searchTerm: string,
    language: string,
    license: string,
    minYears: number | '',
    lastUpdateYears: number | '',
    lastUpdateMonths: number | '',
    maxDependencies: number | '',
    weight: any
) {
    const db = await connectToDatabase();
    const collection = db.collection(process.env.UBUNTU_COLLECTION_NAME as string);

    // キーワード正規表現を単語境界を緩和して作成
    const keywordRegex = new RegExp(searchTerm.split(' ').join('|'), 'i');
    const languageRegex = new RegExp(language.split(' ').join('|'), 'i');
    const licenseRegex = new RegExp(license.split(' ').join('|'), 'i');

    // 今日の日付を取得
    const currentDate = new Date();
    const lastUpdateThreshold = new Date();
    if (lastUpdateYears !== '') {
        lastUpdateThreshold.setFullYear(currentDate.getFullYear() - lastUpdateYears);
    }
    if (lastUpdateMonths !== '') {
        lastUpdateThreshold.setMonth(currentDate.getMonth() - lastUpdateMonths);
    }

    const query = {
        $and: [
            { $or: [
                { Name: { $regex: keywordRegex } },
                { Section: { $regex: keywordRegex } },
                { 'Description.summary': { $regex: keywordRegex } },
                { 'Description.detail': { $regex: keywordRegex } }
            ]},
            { $or: [
                { 'Language.Lang1.Name': { $regex: languageRegex } },
                { 'Description.summary': { $regex: languageRegex } },
            ]},
            { License: { $regex: licenseRegex } },
            minYears !== '' ? { FirstCommitDate: { $lte: `${currentDate.getFullYear() - minYears}-12-31` } } : {},
            lastUpdateYears !== '' || lastUpdateMonths !== '' ? { LastCommitDate: { $gte: lastUpdateThreshold.toISOString().split('T')[0] } } : {},
            maxDependencies !== '' ? { 'NumberOfBuild-Depends': { $lte: maxDependencies } } : {}
        ],
        // 機能を提供しないパッケージを除外
        $nor: [
            { Name: { $regex: '-doc$', $options: 'i' } },
            { Name: { $regex: '-dev$', $options: 'i' } },
            { Name: { $regex: '-data$', $options: 'i' } },
        ]
    };

    const limit = 2000; // 制限を2000に設定
    const results = await collection.find(query).limit(limit).toArray();

    // スコアリング処理
    const scoredResults = results.map((project) => {
        let score = 0;

        // 検索ワードのスコア加算
        const keywords = searchTerm.split(' ');
        keywords.map((keyword) => {
            const escapeKeyword = escapeRegExp(keyword);
            if (new RegExp(escapeKeyword, 'i').test(project.Name)) score += weight.searchTerm * 1;
            if (new RegExp(escapeKeyword, 'i').test(project.Section)) score += weight.searchTerm * 1;
            if (new RegExp(escapeKeyword, 'i').test(project.Description['summary'])) score += weight.searchTerm * 3;
            if (new RegExp(escapeKeyword, 'i').test(project.Description['detail'])) score += weight.searchTerm * 1;
        })

        // Description.summaryにすべてのキーワードが含まれる場合にさらにスコア加算
        const allKeywordsInSummary = keywords.every((keyword) =>
            new RegExp(escapeRegExp(keyword), 'i').test(project.Description['summary'])
        );
        if (allKeywordsInSummary) {
            score += 1;
        }

        // 言語のスコア加算
        if (language !== '') {
            const languages = language.split(' ');
            languages.map((lang) => {
                const escapeLang = escapeRegExp(lang);
                if (new RegExp(escapeLang, 'i').test(project.Description['summary'])) score += weight.language * 1;
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

        // 開発履歴のスコア加算
        if (minYears !== '') {
            if (project.FirstCommitDate && project.FirstCommitDate <= `${currentDate.getFullYear() - minYears}-12-31`) score += weight.minYears * 1;
        }

        // 最終更新のスコア加算
        if (lastUpdateMonths !== '') {
            if (project.LastCommitDate && project.LastCommitDate >= lastUpdateThreshold.toISOString().split('T')[0]) score += weight.lastUpdateMonths * 1;
        }

        // 依存関係のスコア加算
        if (maxDependencies !== '') {
            if (project['NumberOfBuild-Depends'] !== 0 && project['NumberOfBuild-Depends'] <= maxDependencies) score += weight.maxDependencies * 1;
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

// 与えられたプロジェクトIDのプロジェクトのLastCommitDate（最新コミット日）を更新する関数
export async function updateLastCommitDate(projectId: ObjectId, lastCommitDate: string) {
    const db = await connectToDatabase();
    const collection = db.collection(process.env.UBUNTU_COLLECTION_NAME as string);

    await collection.updateOne(
        { _id: projectId },
        { $set: { LastCommitDate: lastCommitDate } }
    );
};