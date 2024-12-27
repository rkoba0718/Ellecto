const { MongoClient } = require('mongodb');
const fs = require('fs');
const { config } = require('./config');

async function main() {
    const client = new MongoClient(config.url, { useUnifiedTopology: true });

    try {
        // MongoDBに接続
        await client.connect();
        console.log('Connected to the database');

        // データベースとコレクションを取得
        const db = client.db(config.dbName);
        const collection = db.collection(config.collectionName);

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