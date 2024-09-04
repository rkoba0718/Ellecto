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
RUN cp /etc/apt/sources.list.d/ubuntu.sources /etc/apt/sources.list.d/ubuntu.sources~ && \
    sed -Ei 's/^Types: deb$/Types: deb deb-src/' /etc/apt/sources.list.d/ubuntu.sources  && \
    apt-get update

# ローカルファイルをコピー
COPY input.txt /tmp/
COPY *.sh /tmp/
COPY *.js /tmp/
COPY package.json /tmp/

# package.jsonを反映
RUN cd tmp && \
    npm install
