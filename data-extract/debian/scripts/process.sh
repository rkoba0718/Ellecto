#!/usr/bin/env bash

cp ../packages.txt ./;
node createNotExistProjectList.js packages.txt;
mkdir data;
while IFS= read -r line;
do
    mkdir $line;
    cd $line;
    if apt source $line; then
        DIR=`ls -d */`;
        cd ..;
        node extract.js $line/$DIR/debian/control;
        mv $line.json ./data/;
        node insertJSONData.js data/$line.json;
        rm data/$line.json;
        cd $line;
        CLOC=$(cloc $DIR --json --exclude-lang=diff,YAML,JSON,XML,Markdown);
        node ../insertLanguage.js "$CLOC" $line;
        cd ..;
        rm -rf $line;
    else
        echo "apt source error";
    fi
done < NotExistProjectList.txt
rm -rf data;