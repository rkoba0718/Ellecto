const { MongoClient } = require('mongodb');
const { config } = require('./config');

const projectName = process.argv[2];

async function main() {
    const client = new MongoClient(config.url, { useUnifiedTopology: true });

    try {
        // MongoDBに接続
        await client.connect();

        // データベースとコレクションを取得
        const db = client.db(config.dbName);
        const collection = db.collection(config.collectionName);

        // データを取得
        const project = await collection.findOne({ Name: projectName });

        if (project.APIURL) {
            if (project.APIURL.includes('github.com')) {
                console.log(project.APIURL);
            } else if (project.URL && project.URL['Vcs-Git']) {
                console.log(project.URL['Vcs-Git']);
            } else {
                console.log(project.APIURL)
            }
        } else {
            if (project.URL && project.URL['Vcs-Git']) {
                console.log(`${project.URL['Vcs-Git']}`);
            }
        }
    } catch (err) {
        console.error(err);
    } finally {
        // MongoDB接続を終了
        await client.close();
    }
};

main();