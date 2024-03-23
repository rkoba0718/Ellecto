# OpenJDKイメージをベースにする
FROM ubuntu:latest


# Mavenをインストールする
RUN apt-get update && \
    apt-get install -y maven

# Javaアプリケーションのソースコードとpom.xmlをコピーする
COPY . /tmp/

# Mavenを使用してアプリケーションをビルドする
# RUN mvn clean install

