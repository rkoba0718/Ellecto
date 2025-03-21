#!/usr/bin/env bash

cp ../packages.txt ./;
mkdir controlDatas;
while IFS= read -r line;
do
    if [ "$line" != "Listing..." ]; then
        PACKAGE_NAME=`node split.js $line`;
        mkdir $PACKAGE_NAME;
        cd $PACKAGE_NAME;
        apt source $PACKAGE_NAME;
        DIR=`ls -d */`;
        cd ..;
        node extract.js $PACKAGE_NAME/$DIR/debian/control;
        cp $PACKAGE_NAME.json ./controlDatas/;
        rm $PACKAGE_NAME.json;
        rm -rf $PACKAGE_NAME;
        node dbimport.js controlDatas/$PACKAGE_NAME.json;
    fi
done < packages.txt
node --max-old-space-size=8192 createCrossSimInputFiles.js;
cp RepositoryList.txt /shared/;
cp Dictionary.txt /shared/;
cp Graph.txt /shared/;