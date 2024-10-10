mkdir update;
cd update;
node ../createUpdateListFile.js;
while IFS= read -r line;
do
    mkdir $line;
    cd $line;
    apt source $line;
    DIR=`ls -d */`;
    CLOC=$(cloc $DIR --json --exclude-lang=diff,YAML,JSON,XML,Markdown);
    node ../../insertLanguage.js "$CLOC" $line;
    cd ..;
    rm -rf *;
done < UpdateNameList.txt