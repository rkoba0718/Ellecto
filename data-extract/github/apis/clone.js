import fs from 'fs';
import { exec } from 'child_process';

// JSONファイルのパス
const jsonFilePath = 'out/out.json';

// clone先のディレクトリパス
const dir = 'repos';

fs.readFile(jsonFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error(`ファイルを読み込めませんでした: ${err}`);
    return;
  }

  try {
    // JSONデータをパース
    const jsonData = JSON.parse(data);

    // `clone_url`のみを抽出して Git リポジトリをクローン
    jsonData.forEach(item => {
		const cloneUrl = item.clone_url;
		const destinationDir = `${dir}/${item.name}`;
		console.log(`Cloning repository from ${cloneUrl} to ${destinationDir}`);

		// Git コマンドを実行してリポジトリをクローン
		exec(`git clone ${cloneUrl} ${destinationDir}`, (error, stdout, stderr) => {
		  // 結果をJSONファイルに書き込む
		  const outputPath = `${destinationDir}/out.json`;
		  fs.writeFileSync(outputPath, JSON.stringify(item, null, 2));

		  if (error) {
			console.error(`Git clone error: ${error.message}`);
			return;
		  }
		  if (stderr) {
			console.error(`Git clone stderr: ${stderr}`);
			return;
		  }
		  console.log(`Git clone completed: ${stdout}`);
		});
  	});
  } catch (parseError) {
    console.error(`JSON parse error: ${parseError}`);
  }
});