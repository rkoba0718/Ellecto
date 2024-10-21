const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// const url = 'mongodb://root:password@oss-project-map-mongo-1:27017'; // For production environment
const url = 'mongodb://root:password@ossprojectmap-mongo-1:27017'; // For Test environment
// const url = 'mongodb://root:password@localhost:27017'; // For debug
// const dbName = 'ProjSelector';
const dbName = 'testDB'; // For Test environment
const collectionName = 'ubuntu';

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

// ライセンス情報を抽出する関数
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

// MongoDBに接続し、ライセンス情報を更新する関数
async function updateLicenseInDB(packageName, licenseInfo) {
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
                License: licenseInfo
            }
        };

        const updateResult = await collection.updateOne(filter, update);

        if (updateResult.matchedCount === 0) {
            console.log(`No document found with packageName: ${packageName}`);
        } else {
            console.log(`Successfully updated license for packageName: ${packageName}`);
        }
    } catch (err) {
        console.error('Error updating document:', err);
    } finally {
        // MongoDB接続を終了
        await client.close();
    }
}

async function main() {
    const sourceDir = process.argv[2];  // ソースコードのディレクトリ
    const packageName = process.argv[3];

    if (!packageName || !sourceDir) {
        console.error('No packageName or sourceDir provided.');
        process.exit(1);
    }

    try {
        // ライセンス情報を取得
        const output = await extractLicenseInfo(sourceDir);

        // MongoDBに結果をアップデート
        await updateLicenseInDB(packageName, output);
    } catch (error) {
        console.error('Error extracting license data:', error);
        process.exit(1);
    }
}

main();
