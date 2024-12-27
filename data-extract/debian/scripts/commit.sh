#!/usr/bin/env bash

node createCloneURLList.js;
node concat.js;
mkdir GitClone;
cp ConcatCloneList.txt GitClone;
cd GitClone;
# 1行ずつ読み取り
while IFS= read -r line; do
    # タブで分割して配列に格納
    IFS=$'\t' read -ra fields <<< "$line"
    IFS=$', ' read -ra names <<< "${fields[0]}"
    if git clone ${fields[1]}; then
        DIR=`ls -d */`;
        cd $DIR;
        for name in "${names[@]}"; do
            git log --max-parents=0 --reverse > ../first_${name}.txt 2>&1;
            git log -1 > ../last_${name}.txt 2>&1;
        done
        cd ..;
        rm -rf $DIR;
        for name in "${names[@]}"; do
            node ../insertCommitDate.js $name;
        done
        echo "success insert commit date: ${fields[0]}";
    else
        echo "${fields[0]} can not git clone."
    fi
done < ConcatCloneList.txt
cd ..;
rm -rf GitClone;
