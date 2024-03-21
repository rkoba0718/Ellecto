# Ubuntuイメージをベースにする
FROM ubuntu:latest

# パッケージリストを更新
RUN apt-get update && apt-get install -y \
    curl

# version 16.x(LTS版)のNode.jsをインストールする
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - &&\
    apt-get install -y \
    nodejs \
    dpkg-dev

# ubuntuのpackage listを取得する
RUN apt-get update && \
    apt list 2>/dev/null > packages.txt

# packageのソースコードを取得するための設定
RUN cp /etc/apt/sources.list /etc/apt/sources.list~ && \
    sed -Ei 's/^# deb-src /deb-src /' /etc/apt/sources.list && \
    apt-get update

# ローカルファイルをコピー
COPY input.txt /tmp/
COPY test.sh /tmp/
COPY *.js /tmp/
COPY package.json /tmp/

# package.jsonを反映
RUN cd tmp && \
    npm install
