---
title: 設定
description: API の必須環境変数、フロントエンドの NUXT_PUBLIC_*、setting テーブルで変更するもの。
---

設定は 2 層に分かれます。プロセスの起動時に読み込まれる環境変数と、管理コンソールから即時反映される `setting` テーブルです。コメント付きの完全な一覧は、各リポジトリの `.env.example` にあります。

## API 必須

| 変数 | 説明 |
| --- | --- |
| `SQL_DSN` | MySQL DSN。例：`user:pass@tcp(127.0.0.1:3306)/easytv?charset=utf8mb4&parseTime=true&loc=Local` |
| `ROOT_PASSWORD` | 最初の管理者のパスワード。システムに管理者がおらず、これも未設定の場合は起動を拒否します |
| `CRYPTO_SECRET` | 認証コードとトークンの署名に使う HMAC シークレット。本番では 32 文字以上のランダムな文字列 |

## API よく使うもの

| 変数 | 既定値 | 説明 |
| --- | --- | --- |
| `PORT` | `8383` | HTTP ポート（`--port` が優先） |
| `DEBUG` | `false` | 詳細ログと SQL の出力 |
| `REDIS_CONN_STRING` | — | 未設定の場合、レート制限 / 認証コードはメモリを使います |
| `UPLOAD_DIR` | `./upload` | ローカルストレージのディレクトリ |
| `FFMPEG_PATH` / `FFPROBE_PATH` | `PATH` から取得 | setting で上書きすることもできます |
| `WORKER_TAG` | — | マルチノード時に、このタグが付いたジョブだけを処理します |

ゲートウェイ、決済、OSS / Qiniu、SMTP、SMS の多くも環境変数に書けますが、本番では **システム設定** で変更するのが一般的で、再起動が不要になります。

## 任意の連携

| 領域 | 変数 / setting |
| --- | --- |
| メール認証コード | `EMAIL_VERIFICATION_ENABLED`、`SMTP_*`、`VERIFICATION_VALID_MINUTES`。開発時はメール送信を無効にでき、認証コードは API ログに出力されます |
| SMS（SubMail） | `SMS_ENABLED`、`SUBMAIL_*`、`SMS_SIGNATURE` |
| モデルゲートウェイ | setting の `EasyAPIGatewayBaseUrl` / `EasyAPIGatewayKey` / `EasyAPIGatewayEnabled`。単価は `model_price` テーブルにあります |
| Alibaba Cloud OSS | `OSS_BUCKET`、`OSS_ENDPOINT`、`OSS_ACCESS_KEY_ID`、`OSS_ACCESS_KEY_SECRET`、`OSS_BASE_URL`、`OSS_PREFIX`。`OSS_BUCKET` を設定すると、ローカルの `upload/` には書き込まなくなります |
| Qiniu | setting の `QiniuAccessKey` / `QiniuSecretKey` / `QiniuBucketName` / `QiniuDomain`。有効にすると素材は公開 URL になり、画像から動画を生成する際に `UPLOAD_BASE_URL` を設定する必要がなくなります |
| 決済 | `WECHATPAY_*`、`ALIPAY_APPID` または対応する setting。コールバックのドメインには setting の `ServerAddress` を使います |
| 無料枠 | `FREE_CONCURRENT`、`FREE_STORAGE_GB` |

## Docker Compose の追加変数

これらは `easytv-api` の `.env` に書き、Compose だけが使います：

| 変数 | 既定値 | 説明 |
| --- | --- | --- |
| `MYSQL_PASSWORD` | `change-me-easytv` | 同梱 MySQL のアプリ用アカウントのパスワード |
| `MYSQL_ROOT_PASSWORD` | `change-me-root` | 同梱 MySQL の root |
| `PUBLIC_API_URL` | `http://localhost:8383` | **ブラウザ** が API にアクセスするアドレス。コンテナ内のホスト名ではありません |
| `PUBLIC_STUDIO_URL` | `http://localhost:3005` | スタジオの公開アドレス |
| `API_PORT` / `WEB_PORT` / `MANAGE_PORT` | 8383 / 3005 / 3006 | ホスト側のポートマッピング |

## スタジオ `easytv-web`

すべて公開の実行時設定です（フロントエンドのバンドルに含まれるため、**シークレットを入れないでください**）。

| 変数 | 必須 | 説明 |
| --- | --- | --- |
| `NUXT_PUBLIC_API_BASE_URL` | はい | API のアドレス |
| `NUXT_PUBLIC_SITE_URL` | 本番では必須 | canonical、sitemap、OG |
| `NUXT_PUBLIC_SITE_NAME` | いいえ | 既定値は `EasyTV` |
| `NUXT_PUBLIC_MEDIA_HOSTS` | いいえ | メディアプロキシが追加で許可する OSS / CDN のドメイン |
| `NUXT_PUBLIC_CONTACT_EMAIL` | いいえ | 規約ページの連絡先メールアドレス |

開発時は `.env.development`、本番ビルドは `.env.production` を読み込みます。

## 管理コンソール `easytv-manage`

| 変数 | 説明 |
| --- | --- |
| `NUXT_PUBLIC_API_BASE_URL` | API のアドレス |
| `NUXT_PUBLIC_STUDIO_URL` | スタジオのアドレス：ヘッダーの「公式サイト」、審査から再生ページへの遷移、静的アセット |
| `NUXT_PUBLIC_PARTNER_URL` | パートナーコンソールのアドレス：パートナーページの「パートナーコンソールを開く」 |
| `NUXT_PUBLIC_SITE_NAME` | タイトルバーのサイト名 |

## パートナーコンソール `easytv-partner`

| 変数 | 説明 |
| --- | --- |
| `NUXT_PUBLIC_API_BASE_URL` | API のアドレス |
| `NUXT_PUBLIC_STUDIO_URL` | スタジオのアドレス：ヘッダーの「公式サイト」と、販促リンクのフォールバック |
| `NUXT_PUBLIC_SITE_NAME` | タイトルバーのサイト名 |
