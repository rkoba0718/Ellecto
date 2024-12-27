const { MongoClient } = require('mongodb');
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
        const projects = collection.find({});

        // 各プロジェクトにOSName=ubuntuを追加
        while (await projects.hasNext()) {
            const project = await projects.next();
            const DistributionName = 'Ubuntu';

            // プロジェクトに新たなOSフィールドを追加して更新
            await collection.updateOne(
                { _id: project._id },
                { $set: { Distribution: DistributionName } }
            );
            console.log(`Updated project ${project.Name} with Distribution name.`);
        }
    } catch (err) {
        console.error(err);
    } finally {
        // MongoDB接続を終了
        await client.close();
    }
};

main();