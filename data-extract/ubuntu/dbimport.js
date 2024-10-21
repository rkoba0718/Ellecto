const fs = require('fs');
const { MongoClient } = require('mongodb');

// const url = 'mongodb://root:password@oss-project-map-mongo-1:27017'; // For production environment
const url = 'mongodb://root:password@ossprojectmap-mongo-1:27017'; // For Test environment
// const dbName = 'ProjSelector';
const dbName = 'testDB'; // For Test environment
const collectionName = 'ubuntu';

const jsonFilePath = process.argv[2];

async function main() {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    const [dir_name, file_name] = jsonFilePath.split('/');
    const [package_name, extension] = file_name.split('.');

    try {
        // MongoDBに接続
        await client.connect();
        console.log('Connected to the database');

        // データベースとコレクションを取得
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // JSONファイルからデータを読み取り
        const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
        const data = JSON.parse(jsonData);
        // data._id = package_name;

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