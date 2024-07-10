const fs = require('fs');
const { MongoClient } = require('mongodb');

const url = 'mongodb://root:password@ossprojectmap-mongo-1:27017';
const dbName = 'testDB';

const KEYS_HAVE_ONE_ELEMENT = [
    '_id',
    'Source',
    'Section',
];

const KEYS_HAVE_MULTIPLE_ELEMENT = [
    'Maintainer',
    'Uploaders'
];

const KEYS_HAVE_OBJECT = [
    'Depends',
    'Pre-Depends',
    'Build-Depends',
];

const provideDictionaryStringForOneElement = (node_id, value) => {
    return `${node_id}\t${value}\n`;
};

const provideDictionaryStringForMultipleElement = (node_id, key, value) => {
    if (key === 'Maintainer' || key === 'Uploaders') {
        return `${node_id}\t${value.Maintainer}\n`;
    }

    return '';
};

const provideDictionaryStringForObject = (node_id, value) => {
    let output = '';
    let next_id = node_id;
    value.map((v, index) => {
        output += `${node_id + index}\t${v.Name}\n`;
        next_id++;
    });
    return [output, next_id];
};

async function main() {
    const client = new MongoClient(url, { useUnifiedTopology: true });

    try {
        // MongoDBに接続
        await client.connect();
        console.log('Connected to the database');

        // データベースとコレクションを取得
        const db = client.db(dbName);
        const collection = db.collection('ubuntu');

        // データを取得
        const data = await collection.find({}).toArray();

        // 書き込み内容を保管する変数
        let repository_list = '';
        let dictionary = '';
        let graph = '';

        // ファイルに記述するノード番号
        // 各ノードごとに固有のid
        let node_id = 0;
        data.forEach((item) => {
            let name_id;
                Object.keys(item).map((key, index) => {
                    const value = item[key];

                    // プロジェクト名をRepositoryListに追加
                    if (index === 0) {
                        repository_list += `${node_id}\t${value}\n`;
                        name_id = node_id;
                    }

                    // 各ノードをDictionaryとGraphに追加
                    // 要素を追加した場合にのみGraphに要素を追加し，node_idを更新（全ての要素を考慮するわけではない）
                    if (KEYS_HAVE_ONE_ELEMENT.includes(key)) {
                        dictionary += provideDictionaryStringForOneElement(node_id, value);
                        graph += `${node_id}#${name_id}\n`;
                        node_id++;
                    } else if (KEYS_HAVE_MULTIPLE_ELEMENT.includes(key)) {
                        dictionary += provideDictionaryStringForMultipleElement(node_id, key, value);
                        graph += `${node_id}#${name_id}\n`;
                        node_id++;
                    } else if (KEYS_HAVE_OBJECT.includes(key)) {
                        const [output, next_id] = provideDictionaryStringForObject(node_id, value);
                        dictionary += output;
                        for (let i = node_id; i < next_id; i++) {
                            graph += `${i}#${name_id}\n`;
                        }
                        node_id = next_id;
                    }
                });
        });

        fs.writeFileSync('RepositoryList.txt', repository_list, 'utf-8');
        fs.writeFileSync('Dictionary.txt', dictionary, 'utf-8');
        fs.writeFileSync('Graph.txt', graph, 'utf-8');

        console.log('Files generated successfully');

    } catch (err) {
        console.log('Error occurred while connecting to MongoDB', err);
    } finally {
        // 接続をクローズ
        await client.close();
        console.log('Connection to MongoDB closed');
    }
}

main();