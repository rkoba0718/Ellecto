const { MongoClient } = require('mongodb');
const fs = require('fs');
const { config } = require('./config');

async function main() {
    const file = process.argv[2];
    const client = new MongoClient(config.url);
    let name_list = '';

    if (fs.existsSync(file)) {
        try {
            // MongoDBに接続
            await client.connect();
            console.log('Connected to the database');

            // データベースとコレクションを取得
            const db = client.db(config.dbName);
            const collection = db.collection(config.collectionName);

            const lines = fs.readFileSync(file, 'utf8').split('\n');
            for (const line of lines) {
                if (line === 'Listing...') continue;

                const projectName = line.split(' ')[0].split('/')[0];
                const project = await collection.findOne({
                    Name: projectName,
                    Distribution: 'Ubuntu'
                });
                if (!project) {
                    name_list += `${projectName}\n`;
                }
            }
            fs.writeFileSync('NotExistProjectList.txt', name_list, 'utf-8');
            console.log('File created successfully');
        } catch (err) {
            console.error(`Error reading ${file}:`, err);
        } finally {
            // MongoDB接続を終了
            await client.close();
        }
    } else {
        console.log(`${file} file not exist`);
    }
};

main();