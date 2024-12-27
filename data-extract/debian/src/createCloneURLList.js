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
        let list = '';

        // パッケージごとの処理
        while (await data.hasNext()) {
            let clone_url = 'none';
            const project = await data.next();
            const name = project.Name;
            if (project.Distribution !== 'Debian') {
                continue;
            }

            if (project.APIURL) {
                if (project.APIURL.includes('github.com')) {
                    clone_url = project.APIURL;
                } else if (project.URL && project.URL['Vcs-Git']) {
                    clone_url = project.URL['Vcs-Git'];
                } else {
                    clone_url = project.APIURL;
                }
            } else {
                if (project.URL && project.URL['Vcs-Git']) {
                    clone_url = project.URL['Vcs-Git'];
                }
            }
            list += `${name}\t${clone_url}\n`;
        }

        fs.writeFileSync('CloneURLList.txt', list, 'utf-8');

        console.log('List File created successfully');
    } catch (err) {
        console.error(err);
    } finally {
        // MongoDB接続を終了
        await client.close();
    }
};

main();