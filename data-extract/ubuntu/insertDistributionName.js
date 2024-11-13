const { MongoClient } = require('mongodb');

// const url = 'mongodb://root:password@oss-project-map-mongo-1:27017'; // For production environment
const url = 'mongodb://root:password@ossprojectmap-mongo-1:27017'; // For Test environment
// const url = 'mongodb://root:password@localhost:27017'; // For debug
// const dbName = 'ProjSelector';
const dbName = 'testDB'; // For Test environment
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