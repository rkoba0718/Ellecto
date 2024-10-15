#!/usr/bin/env bash

cd Inputs;
rm -rf *;
cd ..;
cd Results;
rm -rf *;
cd ..;
cp ../shared/* Inputs;
mvn -e exec:java -Dexec.mainClass="org.crossminer.similaritycalculator.CrossSim.Runner";
mvn -e exec:java -Dexec.mainClass="org.importor.MongoDataInsert";