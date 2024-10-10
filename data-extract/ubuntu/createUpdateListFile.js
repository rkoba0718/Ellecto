const { MongoClient } = require('mongodb');
const fs = require('fs');

const url = 'mongodb://root:password@ossprojectmap-mongo-1:27017';
// const url = 'mongodb://root:password@localhost:27017'; // For debug
const dbName = 'testDB'; // For debug
const collectionName = 'ubuntu';

async function main() {
    const client = new MongoClient(url, { useUnifiedTopology: true });

    try {
        // MongoDBに接続
        await client.connect();
        console.log('Connected to the database');

        // データベースとコレクションを取得
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // データを取得
        const data = collection.find({});

        // DBに存在するpackageの名前リストを保管する変数
        let name_list = '';

        // パッケージごとの処理
        while (await data.hasNext()) {
            const packageData = await data.next();
            const packageName = packageData.Name;

            name_list += `${packageName}\n`;
        }

        fs.writeFileSync('UpdateNameList.txt', name_list, 'utf-8');

        console.log('Update List File created successfully');
    } catch (err) {
        console.error(err);
    } finally {
        // MongoDB接続を終了
        await client.close();
    }
};

main();