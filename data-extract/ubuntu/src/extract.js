const fs = require('fs');

const KEYS = [
	'package',
	'version',
	'standards-version',
	'maintainer',
	'uploaders',
	'xsbc-original-maintainer',
	'description',
	'section',
	'priority',
	'essential',
	'architecture',
	'origin',
	'bugs',
	'homepage',
	'vcs-browser',
	'vcs-git',
	'tag',
	'multi-arch',
	'source',
	'subarchitecture',
	'kernel-version',
	'installer-menu-item',
	'depends',
	'pre-depends',
	'build-depends',
	'recommends',
	'suggests',
	'breaks',
	'conflicts',
	'replaces',
	'provides',
	'built-using',
	'rules-requires-root',
	'testsuite',
  'build-depends-arch',
  'build-depends-indep',
  'build-conflicts',
  'build-conflicts-arch',
  'build-conflicts-indep',
  'package-type',
  'kernel-version',
  'installer-menu-item',
  'enhances',
];

const KEYS_WHICH_VALUES_SPLIT_COMMA_OR_PIPE = [
  'depends',
  'pre-depends',
  'build-depends',
  'build-depends-arch',
  'build-depends-indep',
  'recommends',
  'suggests',
];

const KEYS_WHICH_VALUES_SPLIT_COMMA = [
  'tag',
  'breaks',
  'conflicts',
  'replaces',
  'provides',
  'built-using',
  'build-conflicts',
  'build-conflicts-arch',
  'build-conflicts-indep',
  'enhances',
];

const insertData = (currentPackage, key, value, package_flag, package_number) => {
  // valueが空の場合はreturn
  if (value === '') {
    return
  };

  if (package_flag) {
    currentPackage.Package[package_number][key] = value;
  } else {
    currentPackage[key] = value;
  }
};

const addData = (currentPackage, addDataKey ,key, value) => {
  // valueが空の場合はreturn
  if (value === '') {
    return
  };

  currentPackage[addDataKey] = {
    ...currentPackage[addDataKey],
    [key]: value,
  }
};

const separateName_Version_Operator_Architecture = (values) => {
  const output = [];

  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    if (value.includes('(') && value.includes('[')) { // ()と[]によって，VersionとArchitectureが与えられている場合の処理
      const [name, remain] = value.split('(').map(v => v.trim());
      const [operator_and_version, tmp] = remain.split(')').map(v => v.trim());
      const [operator, version] = operator_and_version.split(' ').map(v => v.trim());
      const architecture = tmp.replace('[', '').replace(']', '').trim();
      if (name !== '') {
        output.push({
          Name: name,
          Operator: operator,
          Version: version,
          Architecture: architecture
        });
      }
    } else if (value.includes('(')) { // ()によって，Versionのみが与えられている場合の処理
      const [name, tmp] = value.split('(').map(v => v.trim());
      const [operator, version] = tmp.replace(')', '').split(' ').map(v => v.trim());
      if (name !== '') {
        output.push({
          Name: name,
          Operator: operator,
          Version: version,
          Architecture: null
        });
      }
    } else if (value.includes('[')) { // []によって，Architectureのみが与えられている場合の処理
      const [name, tmp] = value.split('[').map(v => v.trim());
      const architecture = tmp.replace(']', '').trim();
      if (name !== '') {
        output.push({
          Name: name,
          Operator: null,
          Version: null,
          Architecture: architecture
        });
      }
    } else { // ()や[]がない時 = nameだけの場合の処理
      if (value !== '') {
        output.push({
          Name: value,
          Operator: null,
          Version: null,
          Architecture: null
        });
      }
    }
  }

  return output;
};

const pushValuesAfterSplitCommaAndPipe = (value, values) => {
  const no_comma_value = value.split(',').map(cv => cv.trim());
  no_comma_value.map(v => {
    if (v.includes('|')) {
      const no_pipe_value = v.split('|').map(pv => pv.trim());
      for (let i = 0; i < no_pipe_value.length; i++) {
        values.push(no_pipe_value[i]);
      }
    } else if (v !== '') {
      values.push(v);
    }
  });
};

const pushValuesAfterSplitComma = (value, values) => {
  const no_comma_value = value.split(',').map(cv => cv.trim());
  no_comma_value.map(v => {
    if (v !== '') {
      values.push(v);
    }
  });
};

const parseControlFile = (controlFileContent, package_name) => {
  const addNewLineFileContent = `${controlFileContent}\n`; // controlファイルの末尾に改行を加える→ファイルごとの違い（最終行が空行かどうか）を必ず空行があるように揃える
  const lines = addNewLineFileContent.split('\n');

  let previousKey = '';
  let description_values = {
    summary: '',
    detail: ''
  };
  let values = []; // ','や'|'で区切られた複数の値をまとめて管理する配列
  let currentPackage = {};
  let package_flag = false; // バイナリパッケージの情報を扱っているかを管理するフラグ
  let package_counter = 1; // 何番目のバイナリパッケージであるかをカウントする自然数

  insertData(currentPackage, 'Name', package_name, package_flag, `package${package_counter}`);

  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === '') { // 空行を読み込んだ時の処理
      if (previousKey !== '') {
        if (previousKey === 'Description') {
          insertData(currentPackage, previousKey, {
            summary: description_values.summary,
            detail: description_values.detail
          }, package_flag, `package${package_counter}`);
          previousKey = '';
          description_values = {
            summary: '',
            detail: ''
          };
        } else if (previousKey === 'Uploaders') {
          const length = values.length;
          for (let i = 0; i < length; i++) {
            const [name, remain] = values[i].split(' <');
            const email = remain.split('>')[0];
            addData(currentPackage, 'Maintainers', `Uploaders${i+1}`,{
              Name: name,
              Email: email
            });
          }
          previousKey = '';
          values = [];
        } else if (KEYS_WHICH_VALUES_SPLIT_COMMA_OR_PIPE.includes(previousKey.toLowerCase())
          || KEYS_WHICH_VALUES_SPLIT_COMMA.includes(previousKey.toLowerCase())) {
            const out = separateName_Version_Operator_Architecture(values);
            insertData(currentPackage, previousKey, out, package_flag, `package${package_counter}`);
            previousKey = '';
            values = [];
        }
      }
      if (package_flag) {
        package_counter++;
      }
      package_flag = false;
      continue;
    } else if (lines[i].startsWith(`#`)) { // コメント行を読み込んだ時の処理
      continue;
    }

    const line = lines[i];
    // 読み込み行を":"で分割，key, valueは下の2個のif節内以外では変更されない
    let [key, value, ...remains] = line.split(':').map(part => part.trim());
    if (!KEYS.includes(key.toLowerCase()) && value) {// 分割した最初の文字列がKEYS配列にない文字列かつvalueが存在する時の処理
      // key: valueの状態ではないため，結合することで戻す
      // Build-Depends
      //  ${misc:Depends}, ,,, ←この行に対応
      // などの処理に対応するためのif節
      key = `${key}:${value}`;
      if (remains.length !== 0) {
        const length = remains.length;
        for (let i = 0; i < length; i++) {
          key = `${key}:${remains[i]}`;
        }
      }
    }
    if (remains.length !== 0) { // ":"が2回以上出現する場合の処理
      // 2回目以降の文字列を全てvalueに結合
      // Homepage: https://play0ad.com/
      // などの文字列に対応するためのif節
      const length = remains.length;
      for (let i = 0; i < length; i++) {
        value = `${value}:${remains[i]}`;
      }
    }

    if (KEYS.includes(key.toLowerCase())) {
      // 複数行に渡って書かれる可能性のあるデータを以前のキーに従って値を保存
      if (previousKey === 'Description') {
        insertData(currentPackage, previousKey, {
          summary: description_values.summary,
          detail: description_values.detail
        }, package_flag, `package${package_counter}`);
        previousKey = '';
        description_values = {
          summary: '',
          detail: ''
        };
      } else if (previousKey === 'Uploaders') {
        const length = values.length;
        for (let i = 0; i < length; i++) {
          const [name, remain] = values[i].split(' <');
          const email = remain.split('>')[0];
          addData(currentPackage, 'Maintainers', `Uploaders${i+1}`,{
            Name: name,
            Email: email
          });
        }
        previousKey = '';
        values = [];
      } else if (KEYS_WHICH_VALUES_SPLIT_COMMA_OR_PIPE.includes(previousKey.toLowerCase())
        || KEYS_WHICH_VALUES_SPLIT_COMMA.includes(previousKey.toLowerCase())) {
          const out = separateName_Version_Operator_Architecture(values);
          insertData(currentPackage, previousKey, out, package_flag, `package${package_counter}`);
          previousKey = '';
          values = [];
      }

      if (key.includes('Maintainer')) {
        const [name, remain] = value.split(' <');
        const email = remain.split('>')[0];
        addData(currentPackage, 'Maintainers', key,{
          Name: name,
          Email: email
        });
      } else if (key == 'Homepage' || key.includes('Vcs') || key === 'Bugs') {
        addData(currentPackage, 'URL', key, value);
      } else if (key.includes('Version')) {
        addData(currentPackage, 'Version', key, value);
      } else if (key === 'Description') {
        description_values = {
          summary: value,
          detail: ''
        };
      } else if (key === 'Uploaders') {
        pushValuesAfterSplitComma(value, values);
      } else if (key === 'Package') {
        // Packageフィールドがない場合，作成
        if (currentPackage[key] === undefined) {
          currentPackage[key] = {};
        }
        currentPackage.Package[`package${package_counter}`] = {}
        package_flag = true;
        insertData(currentPackage, 'Name', value, package_flag, `package${package_counter}`);
      } else if (KEYS_WHICH_VALUES_SPLIT_COMMA_OR_PIPE.includes(key.toLowerCase())) {
        pushValuesAfterSplitCommaAndPipe(value, values);
      } else if (KEYS_WHICH_VALUES_SPLIT_COMMA.includes(key.toLowerCase())) {
        pushValuesAfterSplitComma(value, values);
      } else {
        insertData(currentPackage, key, value, package_flag, `package${package_counter}`);
      }
      previousKey = key;
    } else {
      if (previousKey === 'Description') {
        description_values = {
          ...description_values,
          detail: `${description_values.detail} ${key}`
        };
      } else if (previousKey === 'Uploaders') {
        pushValuesAfterSplitComma(key, values);
      } else if (KEYS_WHICH_VALUES_SPLIT_COMMA_OR_PIPE.includes(previousKey.toLowerCase())) {
        pushValuesAfterSplitCommaAndPipe(key, values);
      } else if (KEYS_WHICH_VALUES_SPLIT_COMMA.includes(previousKey.toLowerCase())) {
        pushValuesAfterSplitComma(key, values);
      }
    }
  }

  return currentPackage;
};

const convertToJSON = (controlFileContent, package_name) => {
  const packages = parseControlFile(controlFileContent, package_name);
  return packages;
};

function main() {
  // Read the control file content from a file
  const controlFileContent = fs.readFileSync(process.argv[2], 'utf-8');
  const [package_name, ...remain] = process.argv[2].split('/');
  // Convert to JSON
  const jsonOutput = convertToJSON(controlFileContent, package_name);
  // Write JSON to a file
  fs.writeFileSync(`${package_name}.json`, JSON.stringify(jsonOutput, null, 2));
};

main();


