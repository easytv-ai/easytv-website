---
title: オブジェクトストレージ
description: ローカルの upload、Alibaba Cloud OSS、Qiniu のどれを選ぶか。画像から動画の生成に公開 URL が必要な理由。
---

生成物、ユーザーのアップロード、合成した完成映像は、すべてどこかに保存する必要があります。3 つのうち 1 つを選びます。実行中に切り替えることができ、コードの変更は不要です。

## ローカルディスク

既定の方式です。ディレクトリは `UPLOAD_DIR`（既定は `./upload`）で、外部には `GET /upload/*` で公開されます。

Docker Compose は、このディレクトリを名前付きボリューム `upload` に置きます。画像から動画を生成するときは、ゲートウェイが素材を **HTTP GET** できる必要があります：

- ローカルでの動作確認：setting の `UploadBaseUrl` を、ゲートウェイからアクセスできるアドレスに設定します。例：`http://YOUR_PUBLIC_IP:8383/upload`、またはトンネル経由のアドレス
- 同じマシン 1 台だけで試し、ゲートウェイもローカルにある場合：`http://host.docker.internal:8383/upload` で足りることもあります

公開 URL がない場合、画像から動画 / 参考画像を使う生成は失敗します。テキストから動画は通常影響を受けません。

## Alibaba Cloud OSS

環境変数（起動時に一度だけ読み込まれます）：

| 変数 | 説明 |
| --- | --- |
| `OSS_BUCKET` | 設定すると OSS が有効になり、ローカルには書き込まなくなります |
| `OSS_ENDPOINT` | 例：`oss-cn-hangzhou.aliyuncs.com` |
| `OSS_ACCESS_KEY_ID` / `OSS_ACCESS_KEY_SECRET` | 本番では最小権限のサブアカウント（PutObject / GetObject）を使います |
| `OSS_BASE_URL` | CDN または Bucket の公開ドメイン |
| `OSS_PREFIX` | オブジェクトのプレフィックス。既定値は `easytv` |
| `OSS_PUBLIC_READ` | 公開読み取りにするかどうか |

有効にすると、`/upload/*` はメインのパスではなくなります。バケットに CORS が設定されていない場合、スタジオのトリミング / フレーム抽出でピクセルを読み取れないため、そのドメインを `NUXT_PUBLIC_MEDIA_HOSTS` に追加し、サーバーサイドのプロキシを使います。

## Qiniu

setting に書き込みます（管理コンソールの **システム → ゲートウェイとストレージ**）。即時に反映されます：

`QiniuAccessKey` / `QiniuSecretKey` / `QiniuBucketName` / `QiniuDomain`

有効にすると、アップロードと生成物は Qiniu CDN の公開 URL を使うため、画像から動画の生成で `UploadBaseUrl` を設定する必要は通常ありません。フロントエンドからの直接アップロード用の認証情報：`GET /user/qiniu/upload-token`、`GET /user/qiniu/key`。

## どれを選ぶか

| 場面 | おすすめ |
| --- | --- |
| ローカル開発 | ローカル。画像から動画が必要になったら `UploadBaseUrl` を設定 |
| 1 台でのセルフホスト | ローカルディスク。Nginx で `/upload/` を直接配信 |
| 本番で CDN が必要 | OSS または Qiniu。Bucket を公開読み取りにするか、署名付き URL を使用 |
