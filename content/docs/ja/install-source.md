---
title: ソースから実行
description: API、スタジオ、管理コンソール、パートナーコンソールを個別に起動します。コードを変更するときに便利です。
---

## バックエンド

Go 1.27+、MySQL 8.x、任意で Redis、そして `PATH` 上の `ffmpeg` / `ffprobe` が必要です。

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS easytv DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
git clone https://github.com/easytv-ai/easytv-api.git
cd easytv-api
cp .env.example .env
go run . --port 8383
```

`.env` に `SQL_DSN`、`ROOT_PASSWORD`、`CRYPTO_SECRET` を設定します。任意でデモデータを投入できます：

```bash
go run ./cmd/seed --env-file .env
```

## スタジオ

Node.js 22.21+（ドキュメントは Nuxt 4.6 の要件に合わせています。リポジトリの `engines` には 22.5+ と書かれています）と pnpm 10+ が必要です。

```bash
git clone https://github.com/easytv-ai/easytv-web.git
cd easytv-web
pnpm install
cp .env.example .env.development
```

`NUXT_PUBLIC_API_BASE_URL` を `http://127.0.0.1:8383` に変更してから：

```bash
pnpm dev          # http://localhost:3005
```

バックエンドがなくても、トップページ、探索、スキルライブラリは開けます。制作機能ではログインダイアログが表示されます。**pnpm** を使ってください。npm / cnpm は使わないでください。

## 管理コンソール

```bash
git clone https://github.com/easytv-ai/easytv-manage.git
cd easytv-manage
pnpm install
cp .env.example .env.development
pnpm dev          # http://localhost:3006
```

API の初回起動時に作成された `admin` アカウントでログインします。

## パートナーコンソール

```bash
git clone https://github.com/easytv-ai/easytv-partner.git
cd easytv-partner
pnpm install
cp .env.example .env.development
pnpm dev          # http://localhost:3010
```

任意の EasyTV アカウントでログインできます。まだパートナーでないアカウントは、参加申請ページに移動します。

## バイナリ + systemd

Docker を入れたくない場合は、[Releases](https://github.com/easytv-ai/easytv-api/releases) から Linux 用パッケージをダウンロードするか、自分でコンパイルします：

```bash
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -trimpath -ldflags="-s -w" -o easytv-api .
```

```ini
# /etc/systemd/system/easytv-api.service
[Unit]
Description=EasyTV API
After=network.target mysql.service

[Service]
User=easytv
WorkingDirectory=/opt/easytv-api
ExecStart=/opt/easytv-api/easytv-api --port 8383 --env-file /opt/easytv-api/.env
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

systemd のないホストでは、リポジトリにある `deploy.sh start|stop|restart|status` を使えます。リバースプロキシの例は [API 概要](/docs/api) を参照してください。
