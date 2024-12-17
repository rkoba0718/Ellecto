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

        // 各プロジェクトにAPIURLフィールドを追加
        while (await projects.hasNext()) {
            const project = await projects.next();
            let APIURL = null;
            if (project.URL) {
                if (project.URL.Homepage && project.URL.Homepage.includes('github.com')) {
                    APIURL = project.URL.Homepage;
                } else if (project.URL['Vcs-Browser']) {
                    APIURL = project.URL['Vcs-Browser'];
                }
            }

            // プロジェクトに新たなAPIURLフィールドを追加して更新
            await collection.updateOne(
                { _id: project._id },
                { $set: { APIURL: APIURL } }
            );
            console.log(`Updated project ${project.Name} with API URL.`);
        }
    } catch (err) {
        console.error(err);
    } finally {
        // MongoDB接続を終了
        await client.close();
    }
};

main();