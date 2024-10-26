import { MongoClient } from "mongodb";

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

export async function searchProjects(searchTerm: string, language: string, license: string, weight: any) {
    const db = await connectToDatabase();
    const collection = db.collection(process.env.UBUNTU_COLLECTION_NAME as string);

    const query: any = {};

    // クエリ作成（複数キーワードに対応するため分割）
    if (searchTerm) {
        const keywords = searchTerm.split(' ').map((term: string) => ({
            $or: [
                { Name: { $regex: escapeRegExp(term), $options: 'i' } },
                { Section: { $regex: escapeRegExp(term), $options: 'i' } },
                { 'Description.summary': { $regex: escapeRegExp(term), $options: 'i' } },
                { 'Description.detail': { $regex: escapeRegExp(term), $options: 'i' } }
            ]
        }));
        const languages = language
            ? language.split(' ').map((lang: string) => ({
                    $or: [
                        { 'Description.summary': { $regex: escapeRegExp(lang), $options: 'i' } },
                        { 'Description.detail': { $regex: escapeRegExp(lang), $options: 'i' } },
                        { 'Language.Lang1.Name': { $regex: escapeRegExp(lang), $options: 'i' } }
                    ]
                }))
                : [];
        const licenses = license
            ? license.split(' ').map((lic: string) => ({ License: { $regex: lic, $options: 'i' } }))
            : [];
        query.$or = [
            ...keywords,
            ...languages,
            ...licenses,
        ];
    }

    const results = await collection.find(query).toArray();

    // スコアリング処理
    const scoredResults = results.map((project) => {
        let score = 0;

        // 検索ワードのスコア加算
        if (searchTerm) {
            const keywords = searchTerm.split(' ');
            keywords.map((keyword) => {
                const escapeKeyword = escapeRegExp(keyword);
                if (new RegExp(escapeKeyword, 'i').test(project.Name)) score += weight.searchTerm * 2;
                if (new RegExp(escapeKeyword, 'i').test(project.Section)) score += weight.searchTerm * 1;
                if (new RegExp(escapeKeyword, 'i').test(project.Description['summary'])) score += weight.searchTerm * 2;
                if (new RegExp(escapeKeyword, 'i').test(project.Description['detail'])) score += weight.searchTerm * 1;
            })
        }

        // 言語のスコア加算
        if (language) {
            const languages = language.split(' ');
            languages.map((lang) => {
                const escapeLang = escapeRegExp(lang);
                if (new RegExp(escapeLang, 'i').test(project.Description['summary'])) score += weight.language * 1;
                if (new RegExp(escapeLang, 'i').test(project.Description['detail'])) score += weight.language * 1;
                if (new RegExp(escapeLang, 'i').test(project.Language.Lang1.Name)) score += weight.language * 1;
            })
        }

        // ライセンスのスコア加算
        if (license) {
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