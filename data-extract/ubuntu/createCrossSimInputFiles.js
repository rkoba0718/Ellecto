const fs = require('fs');
const { MongoClient } = require('mongodb');

// const url = 'mongodb://root:password@oss-project-map-mongo-1:27017'; // For production environment
const url = 'mongodb://root:password@ossprojectmap-mongo-1:27017'; // For Test environment
// const url = 'mongodb://root:password@localhost:27017'; // For debug
// const dbName = 'ProjSelector';
const dbName = 'testDB'; // For Test environment
const collectionName = 'ubuntu';

const KEYS_HAVE_ONE_ELEMENT = [
    'Source',
    'Section',
];

const KEYS_HAVE_MULTIPLE_ELEMENT = [
    'Maintainers',
    'URL'
];

const KEYS_HAVE_OBJECT = [
    'Depends',
    'Pre-Depends',
    'Build-Depends',
    'Recommends',
    'Suggests',
    'Tag',
];

const generateGraphString = (node_id, name_id) => {
    return `${node_id}#${name_id}\n`;
};

const generateNotGraphString = (node_id, value) => {
    return `${node_id}\t${value}\n`;
};

const isAlreadyExistRepositoryIds = (repository, id) => {
    return repository.includes(id) ? true : false;
};

const findValueInDictionary = (dictionary, value, repository) => {
    const indices = [];
    let index = dictionary.indexOf(value);
    while (index !== -1) {
        indices.push(index);
        index = dictionary.indexOf(value, index + 1);
    }
    if (indices.length === 0) {
        // 新たに特徴量としての頂点として登録が必要なため，nullを返す
        return null;
    } else if (indices.length === 1) {
        // 見つかったidがRepositoryListに登録されているかどうかを判定
        // 登録されている場合→見つかった唯一のidはグラフノードの起点としてのidなので，新たに特徴量としての頂点として登録が必要なため，nullを返す
        // 登録されていない場合→見つかった唯一のidは特徴量としての頂点なので，そのidと値を返す
        if (isAlreadyExistRepositoryIds(repository, indices[0])) {
            return null
        } else {
            return ({
                index: indices[0],
                value: value
            });
        }
    } else {
        // 複数発見した場合，repositoryに登録されていないもののnode_idを返す
        // 同じ要素は高々2つしか存在しない（グラフノードの起点 or 特徴量としての頂点）ので，ループはすぐ終了する
        let id;
        for (let i = 0; i < indices.length; i++) {
            if (!isAlreadyExistRepositoryIds(repository, indices[i])) {
                id = indices[i];
            }
        }
        return ({
            index: id,
            value: value
        });
    }
};

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
        const data = await collection.find({}).toArray();

        // 書き込み内容を保管する変数
        let repository_list = '';
        let dictionary = '';
        let graph = '';

        // 重複要素を判定するために使用する配列
        let dictionary_values = [];
        let repository_ids = [];

        // ファイルに記述するノード番号
        // 各ノードごとに固有のid
        let node_id = 0;
        data.forEach((item) => {
            // Graphに記述する基点要素の番号
            // node_id#name_idのように記述
            let name_id;
            Object.keys(item).map((key) => {
                const value = item[key];

                // プロジェクト名をRepositoryListに追加
                if (key === 'Name') {
                    name_id = node_id;
                    repository_list += generateNotGraphString(node_id, value);
                    dictionary += generateNotGraphString(node_id, value);
                    graph += generateGraphString(node_id, name_id);
                    dictionary_values.push(value);
                    repository_ids.push(node_id);
                    node_id++;
                } else {
                    // 各ノードをDictionaryとGraphに追加
                    // 要素を追加した場合にのみGraphに要素を追加し，node_idを更新（全ての要素を考慮するわけではない）
                    if (KEYS_HAVE_ONE_ELEMENT.includes(key)) {
                        const find_value = findValueInDictionary(dictionary_values, value, repository_ids);
                        if (find_value === null) {
                            dictionary += generateNotGraphString(node_id, value);
                            graph += generateGraphString(node_id, name_id);
                            dictionary_values.push(value);
                            node_id++;
                        } else { // 既にdictionaryに存在する場合は，Graphにのみ追加
                            graph += generateGraphString(find_value.index, name_id);
                        }
                    } else if (KEYS_HAVE_MULTIPLE_ELEMENT.includes(key)) {
                        Object.keys(value).map((k) => {
                            const accumulate_value = key === 'Maintainers' ? value[k].Name : value[k];
                            const find_value = findValueInDictionary(dictionary_values, accumulate_value, repository_ids);
                            if (find_value === null) {
                                dictionary += generateNotGraphString(node_id, accumulate_value);
                                graph += generateGraphString(node_id, name_id);
                                dictionary_values.push(accumulate_value);
                                node_id++;
                            } else { // 既にdictionaryに存在する場合は，Graphにのみ追加
                                graph += generateGraphString(find_value.index, name_id);
                            }
                        })
                    } else if (KEYS_HAVE_OBJECT.includes(key)) {
                        value.map((v) => {
                            const accumulate_value = `${v.Name}${v.Operator !== null ? ` ${v.Operator}` : ''}${v.Version !== null ? ` ${v.Version}` : ''}`;
                            const find_value = findValueInDictionary(dictionary_values, accumulate_value, repository_ids);
                            if (find_value === null) {
                                dictionary += generateNotGraphString(node_id, accumulate_value);
                                graph += generateGraphString(node_id, name_id);
                                dictionary_values.push(accumulate_value);
                                node_id++;
                            } else { // 既にdictionaryに存在する場合は，Graphにのみ追加
                                graph += generateGraphString(node_id, name_id);
                            }
                        });
                    }
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
};

main();