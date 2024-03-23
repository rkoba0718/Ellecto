import { Octokit } from "octokit";
import readline from 'readline';
import fs from 'fs';
import { callGetUserRepos } from "./apis/getUserRepos.js";
import { getPopularRepos } from "./apis/getPopularRepos.js";

const octokit = new Octokit({
  auth: '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',
});
const input = [];

// 入力の読み込み
const filePath = 'input/input.txt';
const fileStream = fs.createReadStream(filePath);
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity // 改行コードを自動で処理
});

rl.on('line', (line) => {
  input.push(line)
});
rl.on('close', async () => {
  // const [result, trimmedRepos] = await callGetUserRepos(octokit, input);
  const [result, trimmedRepos] = await getPopularRepos(octokit);

  // 結果をJSONファイルに書き込む
  const outputPath = 'out/out.json';
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

  const trimmedOutPath = 'out/trimmedOut.json';
  fs.writeFileSync(trimmedOutPath, JSON.stringify(trimmedRepos, null, 2));

  console.log("succeed");
});
