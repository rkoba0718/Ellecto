# Ubuntuイメージをベースにする
FROM ubuntu:latest

# パッケージリストを更新し、Node.jsをインストールする
RUN apt-get update && apt-get install -y \
    nodejs \
    npm && \
    # ubuntuのpackage listを取得する
    apt-get update && \
    apt list 2>/dev/null > packages.txt && \
    # packageのソースコードを取得するための設定
    cp /etc/apt/sources.list /etc/apt/sources.list~ && \
    sed -Ei 's/^# deb-src /deb-src /' /etc/apt/sources.list && \
    apt-get update

# ローカルファイルをコピー
COPY input.txt /tmp/
COPY test.sh /tmp/
COPY split.js /tmp/
COPY extract.js /tmp/

