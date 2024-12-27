const fs = require('fs');
const path = require('path');

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

// ライセンスの対応表（ライセンス名: 短識別子）
// https://licenses.opensource.jp/ のサイトに載っているライセンスリストを参考に作成
// 使用法：licenseMapping[key]
// keyは取得したライセンスの情報（全て小文字に変換したもの）
const licenseMapping = {
  '0-clause bsd license': '0BSD',
  '1-clause bsd license': 'BSD-1-Clause',
  '2-clause bsd license': 'BSD-2-Clause',
  '3-clause bsd license': 'BSD-3-Clause',
  'academic free license': 'AFL',
  'apache software license': 'Apache',
  'apache license': 'Apache',
  'apple public source license': 'APSL',
  'artistic license': 'Artistic',
  'attribution assurance license': 'AAL',
  'boost software license': 'BSL',
  'bsd+patent': 'BSD-2-Clause-Patent',
  'common development and distribution license': 'CDDL',
  'common public license': 'CPL',
  'cua office public license': 'CUA-OPL',
  'eclipse public license': 'EPL',
  'ecos license': 'eCos',
  'educational community license': 'ECL',
  'eiffel forum license': 'EFL',
  'entessa public license': 'Entessa',
  'eu datagrid software license': 'EUDatagrid',
  'fair license': 'Fair',
  'frameworx license': 'Frameworx-1.0',
  'gnu affero general public license': 'AGPL',
  'gnu general public license': 'GPL',
  'gnu lesser general public license': 'LGPL',
  'historical permission notice and disclaimer': 'HPND',
  'ibm public license': 'IPL',
  'intel open source license': 'Intel',
  'ipa font license': 'IPA',
  'isc license': 'ISC',
  'jabber open source license': 'jabberpl',
  'lawrence berkeley national labs bsd variant license': 'BSD-3-Clause-LBNL',
  'lucent public license': 'LPL',
  'expat': 'MIT',
  'mit license': 'MIT',
  'mit no attribution license': 'MIT-0',
  'mitre collaborative virtual workspace license': 'CVW',
  'motosoto license': 'Motosoto',
  'mozilla public license': 'MPL',
  'mulan permissive software license': 'MulanPSL',
  'multics license': 'Multics',
  'nasa open source agreement': 'NASA',
  'naumen public license': 'Naumen',
  'nethack general public license': 'NGPL',
  'nokia open source license': 'Nokia',
  'ntp license': 'NTP',
  'clc research public license': 'OCLC',
  'open group test suite license': 'OGTSL',
  'open software license': 'OSL',
  'openldap public license': 'OLDAP',
  'php license': 'PHP',
  'python license': 'Python',
  'cnri python license': 'CNRI-Python',
  'q public license': 'QPL',
  'realnetworks public source license': 'RPSL',
  'reciprocal public license': 'RPL',
  'ricoh source code public license': 'RSCPL',
  'sil open font license': 'OFL',
  'sleepycat license': 'Sleepycat',
  'sun industry standards source license': 'SISSL',
  'sun public license': 'SPL',
  'sybase open watcom public license': 'Watcom',
  'university of illinois/ncsa open source license': 'NCSA',
  'the unlicense': 'Unlicense',
  'vovida software license': 'VSL',
  'wxwindows library license': 'WXwindows',
  'x.net license': 'Xnet',
  'zope public license': 'ZPL',
  'zlib/libpng license': 'Zlib'
};

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

async function extractLicenseInfo(sourceDir) {
  let licenseInfo = '';
  let versionInfo = '';

  // `debian/copyright` ファイルからライセンス情報を取得
  const debianCopyrightPath = path.join(sourceDir, 'debian', 'copyright');
  if (fs.existsSync(debianCopyrightPath)) {
    try {
      const lines = fs.readFileSync(debianCopyrightPath, 'utf8').split('\n');
      const licenseRegex = /^License:\s*(.*)$/m;
      for (const line of lines) {
        const match = line.match(licenseRegex);
        if (match) {
          licenseInfo = match[1].trim();
          break;
        }
      }
    } catch (err) {
      console.error(`Error reading debian/copyright:`, err);
    }
  }

  // `COPYING` や `LICENSE` ファイルをチェック
  if (licenseInfo === '') {
    const licenseFiles = ['COPYING', 'LICENSE'];
    for (const file of licenseFiles) {
      const licenseFilePath = path.join(sourceDir, file);
      let noEmptyLines = 0;
      if (fs.existsSync(licenseFilePath)) {
        try {
          const lines = fs.readFileSync(licenseFilePath, 'utf-8').split('\n');
          for (const line of lines) {
            if (line.trim()) {
              if (noEmptyLines === 0) {
                licenseInfo = line.trim();
              } else if (noEmptyLines === 1) {
                const versionMatch = line.match(/Version\s+([\d.]+)/i);
                versionInfo = versionMatch !== null ? versionMatch[1] : '';
              }
              noEmptyLines++;
              if (noEmptyLines === 2) {
                break;
              }
            }
          }
          break;
        } catch (err) {
          console.error(`Error reading ${file}:`, err);
        }
      }
    }
  }

  const lowerLicenseInfo = licenseInfo.toLowerCase();
  const insertLicense = licenseMapping[lowerLicenseInfo] === undefined ? licenseInfo : licenseMapping[lowerLicenseInfo];
  const output = versionInfo === '' ? insertLicense : `${insertLicense}-${versionInfo}`;
  return output;
}

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

const addDistribution = (data) => {
  insertData(data, 'Distribution', 'Debian', false, null);
};

const addDescription = (data) => {
  const currentData = data;
  if (currentData.Package) {
    const filterPackageKeys = Object.keys(currentData.Package).filter((key) => currentData.Package[key].Name === currentData.Name);
    const key = filterPackageKeys.length !== 0 ? filterPackageKeys[0] : 'package1';
    if (currentData.Package[key].Description) {
      insertData(data, 'Description', currentData.Package[key].Description, false, null);
    } else {
      insertData(data, 'Description', { summary: '', detail: '' }, false, null);
    }
  }
};

async function addLicense(data, licenseDirPath) {
  const license = await extractLicenseInfo(licenseDirPath);
  insertData(data, 'License', license, false, null);
}

const addDepends = (data) => {
  const currentData = data;
  if (currentData.Package) {
    const filterPackageKeys = Object.keys(currentData.Package).filter((key) => currentData.Package[key].Name === currentData.Name);
    const key = filterPackageKeys.length !== 0 ? filterPackageKeys[0] : 'package1';
    if (currentData.Package[key].Depends) {
      insertData(data, 'Depends', currentData.Package[key].Depends, false, null);
      insertData(data, 'NumberOfDepends', currentData.Package[key].Depends.length, false, null);
    } else {
      insertData(data, 'Depends', null, false, null);
      insertData(data, 'NumberOfDepends', 0, false, null);
    }
  }
};

const addAPIURL = (data) => {
  const currentData = data;
  let APIURL = null;
  if (currentData.URL) {
    if (currentData.URL.Homepage && currentData.URL.Homepage.includes('github.com')) {
      APIURL = currentData.URL.Homepage;
    } else if (currentData.URL['Vcs-Browser']) {
      APIURL = currentData.URL['Vcs-Browser'];
    }
  }
  insertData(data, 'APIURL', APIURL, false, null);
};

async function convertToJSON(controlFileContent, package_name, licenseDirPath) {
  let extractData = parseControlFile(controlFileContent, package_name);
  addDistribution(extractData);
  await addLicense(extractData, licenseDirPath);
  addAPIURL(extractData);
  addDepends(extractData);
  addDescription(extractData);
  return extractData;
};

async function main() {
  // Read the control file content from a file
  const controlFileContent = fs.readFileSync(process.argv[2], 'utf-8');
  const [package_name, ...remain] = process.argv[2].split('/');
  const licenseDirPath = `${package_name}/${remain[0]}`;
  // Convert to JSON
  const jsonOutput = await convertToJSON(controlFileContent, package_name, licenseDirPath);
  // Write JSON to a file
  fs.writeFileSync(`${package_name}.json`, JSON.stringify(jsonOutput, null, 2));
};

main();