const { MongoClient } = require('mongodb');

const url = 'mongodb://root:password@ossprojectmap-mongo-1:27017';
// const url = 'mongodb://root:password@localhost:27017'; // For debug
const dbName = 'ProjSelector';
// const dbName = 'testDB'; // For debug
const collectionName = 'ubuntu';

const calculateLanguagePercentage = (languageData) => {
    const languages = [];

    // 言語ごとのコード行数を取り出す．headerとSUMは除外
    for (const [language, value] of Object.entries(languageData)) {
        if (language !== 'header' && language !== 'SUM') {
            languages.push({ language, code: value.code });
        }
    }

    // 全体のコード行数
    const totalCode = languageData.SUM.code;

    // 各言語の割合を計算
    const languagePercentages = languages.map(({ language, code }) => {
        const percentage = ((code / totalCode) * 100).toFixed(2);
        return { language, percentage: parseFloat(percentage) };
    });

    // 割合の降順にソート
    languagePercentages.sort((a, b) => b.percentage - a.percentage);

    // 上位3つの言語を取り出し、それ以降は "Other" としてまとめる
    const result = {};
    let otherPercentage = 0;

    languagePercentages.forEach((item, index) => {
        if (index < 3) {
            result[`lang${index + 1}`] = `${item.language} ${item.percentage}%`;
        } else {
            otherPercentage += item.percentage;
        }
    });

    // "Other" の割合を追加（上位3つ以外がある場合）
    if (otherPercentage > 0) {
        result.other = `Other ${otherPercentage.toFixed(2)}%`;
    }

    return result;
};

async function insertLanguageInDB(packageName, languagePercentages) {
    const client = new MongoClient(url);

    try {
        // MongoDBに接続
        await client.connect();
        console.log('Connected to the database');

        // データベースとコレクションを取得
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // packageNameに一致するデータを検索
        const filter = { Name: packageName };

        // データベースをアップデート
        const update = {
            $set: {
                language: languagePercentages
            }
        };

        const updateResult = await collection.updateOne(filter, update);

        if (updateResult.matchedCount === 0) {
            console.log(`No document found with packageName: ${packageName}`);
        } else {
            console.log(`Successfully updated document with packageName: ${packageName}`);
        }
    } catch (err) {
        console.error('Error updating document:', err);
    } finally {
        // MongoDB接続を終了
        await client.close();
    }
};

async function main() {
    const clocOutput = process.argv[2];
    const packageName = process.argv[3];

    if (!clocOutput) {
        console.error('No cloc output provided.');
        process.exit(1);
    }

    try {
        const languageData = JSON.parse(clocOutput);
        const result = calculateLanguagePercentage(languageData);
        await insertLanguageInDB(packageName, result);
    } catch (error) {
        console.error('Error parsing JSON data:', error);
        process.exit(1);
    }
};

main();