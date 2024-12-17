#!/usr/bin/env bash

node createUpdateListFile.js;
mkdir GitClone;
cp UpdateNameList.txt GitClone;
cd GitClone;
while IFS= read -r line;
do
    CLONE_URL=`node ../displayGitCloneURL.js $line`;
    if git clone $CLONE_URL; then
        DIR=`ls -d */`;
        cd $DIR;
        git log --max-parents=0 --reverse > ../first_$line.txt 2>&1;
        git log -1 > ../last_$line.txt 2>&1;
        cd ..;
        rm -rf $DIR;
        node ../insertCommitDate.js $line;
    else
        node ../insertCommitDate.js $line; ## CommitDateにnullを登録
    fi
done < UpdateNameList.txt
cd ..;
rm -rf GitClone;