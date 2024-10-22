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

export async function searchProjects(searchTerm: string, language: string, license: string) {
    const db = await connectToDatabase();
    const collection = db.collection(process.env.UBUNTU_COLLECTION_NAME as string);

    // 検索クエリの作成
    const query: any = {};
    if (searchTerm) {
        // TODO: 検索ロジック
        query.Name = { $regex: searchTerm, $options: 'i' }; // キーワード検索
    }
    if (language) {
        query.Language['Lang1'] = language;
    }
    if (license) {
        query.License = license;
    }

    // クエリの実行
    return collection.find(query).toArray();
};