---
title: アーキテクチャ
description: スタジオ、管理コンソール、パートナーコンソールが easytv-api につながる仕組みと、ゲートウェイおよびストレージ。
---

[はじめに](/docs) ページのアーキテクチャ図は、テーマに合わせて色が変わる版です。3 つのクライアントはすべて同じ API を呼び出し、モデルへのリクエストはそこからゲートウェイに転送されます。

```
easytv-web      ──┐
easytv-manage   ──┼──▶  easytv-api (Gin)  ── MySQL / Redis
easytv-partner  ──┘           │            ── object storage (local / OSS / Qiniu)
                              │            ── ffmpeg
                              ▼
                    OpenAI-compatible gateway
                              ▼
                    Kling · Jimeng · Seedance · Sora · GPT · …
```

## 認証

- スタジオとパートナーコンソール：`Authorization: Bearer <token>` + `EasyTV-User: <user id>`
- 管理コンソールは `/admin/*` を使い、さらにロール `role ≥ 10` が必要です
- チームスペースは `EasyTV-Team: <team_id>` を使い、省略時は個人スペースになります
- CORS はリクエスト元をそのまま返すので、3 つのクライアントを別々のドメインにデプロイできます

## 実行時の設定

環境変数はプロセスの起動時に一度だけ読み込まれます。サイト名、決済、ゲートウェイのアドレス、招待ルールなどはバックエンドの `setting` テーブルにあり、管理コンソールで変更するとすぐに反映されます。API を再起動する必要はありません。

ストレージは 3 つのうち 1 つを選びます：ローカルの `upload/`、Alibaba Cloud OSS、Qiniu。画像から動画を生成するときは、ゲートウェイが素材を取得できる必要があります。OSS / Qiniu は公開 URL を返します。ローカルストレージの場合は `UPLOAD_BASE_URL`（または setting の `UploadBaseUrl`）を設定し、ゲートウェイからアクセスできるようにします。

マルチノードの API では `WORKER_TAG` を使います。各プロセスは、同じタグが付いたジョブだけを処理します。

## 契約

API を変えるときは、まず [`easytv-api` の API.md](https://github.com/easytv-ai/easytv-api/blob/main/API.md) を変更し、そのあとで 3 つのフロントエンドを変更します。要約は [API 概要](/docs/api) を参照してください。
