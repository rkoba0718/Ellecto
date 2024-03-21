const fs = require('fs');
const { MongoClient } = require('mongodb');

const url = 'mongodb://root:password@dataextracts-mongo-1:27017';
const dbName = 'testDB';

const jsonFilePath = process.argv[2];

async function main() {
    const client = new MongoClient(url, { useUnifiedTopology: true });

    try {
        // MongoDBに接続
        await client.connect();
        console.log('Connected to the database');

        // データベースとコレクションを取得
        const db = client.db(dbName);
        const collection = db.collection('ubuntu');

        // JSONファイルからデータを読み取り
        const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
        const data = JSON.parse(jsonData);

        // データを挿入
        const result = await collection.insertOne(data);
        console.log(`${result.insertedCount} documents inserted`);

    } catch (err) {
        console.log('Error occurred while connecting to MongoDB', err);
    } finally {
        // 接続をクローズ
        await client.close();
        console.log('Connection to MongoDB closed');
    }
}

main();