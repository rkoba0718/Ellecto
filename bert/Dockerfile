FROM python:3.9

# 必要なPythonパッケージをインストール
COPY requirements.txt /tmp/
COPY *.py /tmp/
COPY *.sh /tmp/
RUN pip install -r requirements.txt
