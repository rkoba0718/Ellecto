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

        // 各プロジェクトに対してPackageフィールドのDescriptionを結合し，DBを更新
        while (await projects.hasNext()) {
            const project = await projects.next();

            // 既にソースパッケージのDescriptionを持つなら何もしない
            if (project.Description) {
                continue;
            }

            // Description結合用の配列
            const summaries = [];
            const details = [];

            // Packageフィールドのpackage[n]のDescription.summaryとDescription.detailを結合
            const packageData = project.Package ? project.Package : {};
            Object.keys(packageData).forEach(pkgNumber => {
                const description = packageData[pkgNumber].Description
                    ? packageData[pkgNumber].Description
                    : {
                        summary: '',
                        detail: ''
                    };
                summaries.push(description.summary);
                details.push(description.detail);
            });

            // 結合したDescriptionフィールドを作成
            const newDescription = {
                summary: summaries.join(" "),
                detail: details.join(" ")
            };

            // プロジェクトに新たなDescriptionフィールドを追加して更新
            await collection.updateOne(
                { _id: project._id },
                { $set: { Description: newDescription } }
            );
            console.log(`Updated project ${project.Name} with new Description.`);
        }
    } catch (err) {
        console.error(err);
    } finally {
        // MongoDB接続を終了
        await client.close();
    }
};

main();