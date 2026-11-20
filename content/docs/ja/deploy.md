---
title: 本番デプロイ
description: ドメインの分け方、Nginx のリバースプロキシ、Cloudflare、マルチノードのワーカー、公開前のチェックリスト。
---

ローカルでは [Docker Compose](/docs/install-docker) で十分です。外部にサービスを提供する場合は、4 つのプロセスを別々のサブドメインに分け、1 つの API を共有する構成をおすすめします。

## 推奨ドメイン

| サービス | 例 | 説明 |
| --- | --- | --- |
| easytv-api | `https://api.example.com` | すべてのフロントエンドの `NUXT_PUBLIC_API_BASE_URL` |
| easytv-web | `https://studio.example.com` | `NUXT_PUBLIC_SITE_URL` / 管理コンソールの「サイト」にあるスタジオのアドレス |
| easytv-manage | `https://admin.example.com` | 無防備なままインターネットに公開しないでください。少なくとも IP 許可リストか VPN を設定します |
| easytv-partner | `https://partner.example.com` | 管理コンソールの `NUXT_PUBLIC_PARTNER_URL` |

CORS は任意の `Origin` をそのまま返し、資格情報を許可するので、3 つのクライアントを別々のドメインに置けます。認証は Cookie ではなく Header で行うため、リバースプロキシで CSRF 対策の層を別に設ける必要はありません。

## Nginx

API の生成とアップロードは、どちらも時間がかかり、サイズも大きくなることがあります：

```nginx
server {
    listen 443 ssl;
    server_name api.example.com;

    client_max_body_size 512m;
    proxy_read_timeout 300s;
    proxy_send_timeout 300s;

    location / {
        proxy_pass http://127.0.0.1:8383;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

フロントエンドの 3 つの Nuxt アプリ：

- **Cloudflare Workers**（リポジトリの既定）：`cp .env.example .env.production && pnpm deploy`
- **Node ホスト**：`NITRO_PRESET=node-server pnpm build` のあと `node .output/server/index.mjs`
- **Docker**：GHCR のイメージを使い、実行時にすべての `NUXT_PUBLIC_*` を上書きします

## マルチノードの API

各 API プロセスは、自分のタグが付いたジョブだけを処理します。環境変数は `WORKER_TAG` です。生成タスク、合成、メディアジョブはいずれもタグで振り分けられます。タグのないプロセスは、タグの付いていないジョブを処理します。

MySQL は必ず共有してください。Redis は強く推奨します（レート制限と認証コードに使います。未設定の場合はプロセス内メモリを使うため、マルチノードではノードごとに別々に計算されます）。オブジェクトストレージには OSS / Qiniu を使い、各ノードのローカルディスクは使わないでください。

## 公開前のチェックリスト

1. `ROOT_PASSWORD`、`CRYPTO_SECRET`（32 文字以上）、MySQL のパスワードをすべて変更する
2. `DEBUG=false`
3. [ゲートウェイを接続](/docs/gateway) して価格を取り込む
4. [オブジェクトストレージ](/docs/storage) を OSS / Qiniu に切り替える。またはローカルディスクに公開の `UploadBaseUrl` を設定する
5. [決済](/docs/billing)：`ServerAddress` に `https://api.example.com` を入力する
6. SMTP または SMS を設定し、「認証コードをログに出力」を無効にする
7. スタジオの `NUXT_PUBLIC_SITE_URL`、`NUXT_PUBLIC_MEDIA_HOSTS`
8. `/legal/*` の規約文を、自社の事業主体と法令に合わせて見直す
9. 管理コンソールを全世界に公開しない
