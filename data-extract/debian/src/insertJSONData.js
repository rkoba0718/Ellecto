const fs = require('fs');
const { MongoClient } = require('mongodb');
const { config } = require('./config');


async function main() {
    const client = new MongoClient(config.url, { useUnifiedTopology: true });
    const jsonFilePath = process.argv[2];

    try {
        // MongoDBに接続
        await client.connect();
        console.log('Connected to the database');

        // データベースとコレクションを取得
        const db = client.db(config.dbName);
        const collection = db.collection(config.collectionName);

        // JSONファイルからデータを読み取り
        const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
        const data = JSON.parse(jsonData);

        // データを挿入
        await collection.insertOne(data);
        console.log(`${jsonFilePath} inserted`);

    } catch (err) {
        console.log('Error occurred while connecting to MongoDB', err);
    } finally {
        // 接続をクローズ
        await client.close();
        console.log('Connection to MongoDB closed');
    }
}

main();