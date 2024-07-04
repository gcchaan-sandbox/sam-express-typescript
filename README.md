# sam-express-typescript

本プロジェクトではSAM CLIによりデプロイするサーバーレスアプリです。次のファイルがあります。

- app - Lambdaで実行するコード
- app/tests - テストコード
- template.yaml - AWSリソースの定義

## 必要ツール

SAM CLIを利用するために以下が必要です。

* SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* Node.js - [Install Node.js 20](https://nodejs.org/en/), including the NPM package management tool.
* Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community)

## ローカル開発

```bash
sam-express-typescript$ docker compose up -d
```

### DynamodB Localのセットアップ

ホストマシンにて以下awsコマンドを実行してテーブルを作成します

```
aws dynamodb \
  --profile $AWS_PROFILE \
  --region ap-northeast-1 \
  --endpoint-url http://localhost:8000 \
    create-table \
  --table-name CallbackTesterLog \
  --attribute-definitions \
    AttributeName=UserId,AttributeType=S \
    AttributeName=Unixtime,AttributeType=N \
  --key-schema \
    AttributeName=UserId,KeyType=HASH \
    AttributeName=Unixtime,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST
```


### ローカル動作確認

テーブル一覧
```
aws --profile $AWS_PROFILE dynamodb list-tables --region ap-northeast-1 --endpoint-url http://localhost:8000
```

テーブル削除
```
aws dynamodb \
  --profile $AWS_PROFILE \
  --region ap-northeast-1 \
  --endpoint-url http://localhost:8000 \
    delete-table \
  --table-name CallbackTesterLog
```

リクエスト
```
curl -X POST http://localhost:8080/user/42 -H "Accept: application/json" -H "Content-type: application/json" -d '{ "name" : "42" }'
curl -X GET http://localhost:8080/user/42
```

### ローカルトラブルシュート

npmパッケージを更新したらコンテナにログインしてインストールします
```
docker compose exec -it app /bin/bash
npm install
```

### テスト

DynamoDB Localを使ってテストを実行する

```bash
$ docker compose exec -it app /bin/bash
# npm install
# npm run test
```

## デプロイ

```bash
make deploy
```


## ログ確認

```bash
### 過去ログ表示
sam-express-typescript$ make logs

### Tail
sam-express-typescript$ make tail
```

## 削除

```bash
sam delete --stack-name sam-express-typescript --profile $AWS_PROFILE
```
