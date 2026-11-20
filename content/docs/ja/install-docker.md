---
title: Docker Compose
description: easytv-api リポジトリの compose ファイルで API をワンコマンドで起動します。フロントエンド一式も任意で起動できます。
---

Docker 24+ と Compose v2 が必要です。

```bash
git clone https://github.com/easytv-ai/easytv-api.git
cd easytv-api
cp .env.example .env
```

`.env` を編集し、少なくとも次の 2 項目を変更します：

- `ROOT_PASSWORD`：最初の管理者のパスワード（ユーザー名の既定値は `admin`）
- `CRYPTO_SECRET`：HMAC シークレット。本番環境では `openssl rand -hex 32` で生成します

続いて：

```bash
docker compose up -d
curl http://localhost:8383/healthz
```

Compose は `ghcr.io/easytv-ai/easytv-api:latest` を取得し、MySQL 8.4、Redis 7、そして 8383 で待ち受ける API を起動します。アップロードファイルとログは名前付きボリュームに保存されます。初回起動時にテーブルと管理者が自動で作成されます。

## スタジオと管理コンソールも起動する

```bash
docker compose --profile full up -d
```

- スタジオ http://localhost:3005
- 管理コンソール http://localhost:3006

イメージは GHCR（`easytv-web`、`easytv-manage`）から取得します。パートナーコンソール `easytv-partner` は現在のところ個別にデプロイする必要があります。[パートナーコンソール](/docs/partner) を参照してください。

LAN 内やほかのマシンからアクセスする場合は、`.env` でブラウザが実際に開けるアドレスに変更します：

```bash
PUBLIC_API_URL=http://192.168.1.10:8383
PUBLIC_STUDIO_URL=http://192.168.1.10:3005
```

`NUXT_PUBLIC_API_BASE_URL` はフロントエンドのバンドルに含まれます。コンテナ内部のホスト名 `http://api:8383` を指定しても、ブラウザからは開けません。

本番では、既定の `MYSQL_PASSWORD` / `MYSQL_ROOT_PASSWORD` を必ず変更してください。

## API イメージをローカルでビルドする

既定ではビルド済みイメージを取得します。ローカルで build するには、`docker-compose.yml` の API サービスにある `build: .` のコメントを外します。

イメージは `linux/amd64` と `linux/arm64` で提供され、タグはバージョンに従います。ほかに `latest` と `main` があります。
