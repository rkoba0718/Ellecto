const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const { config } = require('./config');

async function extractCommitDate(filepath) {
    if (fs.existsSync(filepath)) {
        try {
            const lines = fs.readFileSync(filepath, 'utf8').split('\n');
            for (const line of lines) {
                if (line.startsWith('Date:')) {
                    // コミット日の行を見つけたら抽出
                    const dateStr = line.replace('Date:', '').trim();

                    // Dateオブジェクトを使って形式を変換
                    const commitDate = new Date(dateStr);

                    // YYYY-MM-DD形式にフォーマット
                    const formattedDate = [
                    commitDate.getFullYear(),
                    String(commitDate.getMonth() + 1).padStart(2, '0'), // 月は0始まりなので+1する
                    String(commitDate.getDate()).padStart(2, '0')
                    ].join('-');

                    return formattedDate;
                }
            }
        } catch (err) {
            console.error(`Error reading ${filepath}:`, err);
        }
    } else {
        console.log(`${filepath} file not exist`);
        return null
    }
}

async function insertCommitDateInDB(projectName, firstCommitDate, lastCommitDate) {
    const client = new MongoClient(config.url);

    try {
        // MongoDBに接続
        await client.connect();
        console.log('Connected to the database');

        // データベースとコレクションを取得
        const db = client.db(config.dbName);
        const collection = db.collection(config.collectionName);

        // projectNameに一致するデータを検索
        const filter = { Name: projectName };

        // データベースをアップデート
        const update = {
            $set: {
                FirstCommitDate: firstCommitDate,
                LastCommitDate: lastCommitDate
            }
        };

        const updateResult = await collection.updateOne(filter, update);

        if (updateResult.matchedCount === 0) {
            console.log(`No document found with projectName: ${projectName}`);
        } else {
            console.log(`Successfully updated document with projectName: ${projectName}`);
        }
    } catch (err) {
        console.error('Error updating document:', err);
    } finally {
        // MongoDB接続を終了
        await client.close();
    }
};

async function main() {
    const projectName = process.argv[2];

    try {
        const firstCommitDate = await extractCommitDate(`first_${projectName}.txt`).then((d) => d);
        const lastCommitDate = await extractCommitDate(`last_${projectName}.txt`).then((d) => d);
        await insertCommitDateInDB(projectName, firstCommitDate, lastCommitDate);
    } catch (error) {
        console.error('Error insert commit date data:', error);
    }
};

main();