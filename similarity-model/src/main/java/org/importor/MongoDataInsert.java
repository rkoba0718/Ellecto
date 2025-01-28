package org.importor;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;

public class MongoDataInsert {
    public static void main(String[] args) {
        String directoryPath = "./Results";
        String mongoUri = "mongodb://root:password@oss-project-map-mongo-1:27017";
        // String mongoUri = "mongodb://root:password@localhost:27017"; // For Debug
        // String dbName = "testDB"; // For Debug
        String dbName = "ProjSelector"; // For Production Environment
        String collectionName = "similarity";

        // MongoDBに接続
        try (MongoClient mongoClient = MongoClients.create(mongoUri)) {
            MongoDatabase database = mongoClient.getDatabase(dbName);
            MongoCollection<Document> collection = database.getCollection(collectionName);

            // Resultsフォルダ内のすべてのtxtファイルを取得
            File directory = new File(directoryPath);
            File[] txtFiles = directory.listFiles((dir, name) -> name.endsWith(".txt"));

            if (txtFiles != null) {
                for (File file : txtFiles) {
                    String fileName = file.getName();
                    System.out.println("Processing file: " + fileName);

                    // ファイルを読み込み、データを整形してMongoDBに挿入
                    Map<String, Object> projectData = parseFile(file);
                    if (!projectData.isEmpty()) {
                        insertDataToMongo(collection, projectData);
                    }
                }
            } else {
                System.out.println("No .txt files found in the directory.");
            }
        }
    }

    // ファイルを読み込んでMapに変換するメソッド
    private static Map<String, Object> parseFile(File file) {
        Map<String, Object> projectData = new LinkedHashMap<>();

        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String line;
            String projectName = null;

            while ((line = br.readLine()) != null) {
                String[] parts = line.split("\t");

                if (projectName == null) {
                    projectName = parts[0]; // 最初のプロジェクト名を取得
                    projectData.put("Name", projectName);
                }

                String relatedProject = parts[1];
                double similarity = Double.parseDouble(parts[2]);

                // 同一プロジェクトの類似度以外のプロジェクト名と類似度をMapに追加
                if (!projectName.equals(relatedProject)) {
                    projectData.put(relatedProject, similarity);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return projectData;
    }

    // MongoDBにデータを挿入するメソッド
    private static void insertDataToMongo(MongoCollection<Document> collection, Map<String, Object> projectData) {
        Document doc = new Document(projectData);
        collection.insertOne(doc);
        System.out.println("Inserted data: " + projectData.get("Name"));
    }
}
