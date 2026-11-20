---
title: インストールとデプロイ
description: EasyTV のデプロイに必要な依存関係と、Docker とソースのどちらを選ぶか。
---

最小構成は **API + MySQL + OpenAI 互換ゲートウェイ 1 つ** です。スタジオと管理コンソールはあとから追加できます。それらがなくても、まず `/healthz` が通ることを確認できます。

## 用意するもの

| コンポーネント | 説明 |
| --- | --- |
| MySQL 8.x | 必須。初回起動時に AutoMigrate でテーブルを作成します |
| Redis | 推奨。未設定の場合、レート制限と認証コードはメモリを使います |
| ffmpeg / ffprobe | 合成、フレーム抽出、音声と映像の分離 |
| OpenAI 互換ゲートウェイ | テキスト / 画像 / 動画 / 音声モデルの入口 |
| Node.js 22.21+ と pnpm 10+ | フロントエンドをソースから実行する場合のみ必要 |

## どちらを選ぶか

| 方法 | 向いている場面 |
| --- | --- |
| [Docker Compose](/docs/install-docker) | 推奨。コマンド 1 つで API を起動し、任意で `full` を指定するとスタジオと管理コンソールもまとめて起動します |
| [ソースから実行](/docs/install-source) | バックエンドやフロントエンドを変更するとき |
| バイナリ + systemd | 本番マシンに Docker を入れたくないとき。GitHub Releases から Linux 用パッケージをダウンロードします |

## ポート

| サービス | ポート |
| --- | --- |
| easytv-api | 8383 |
| easytv-web | 3005 |
| easytv-manage | 3006 |
| easytv-partner | 3010 |

ブラウザがローカルマシン以外からコンテナにアクセスする場合は、`.env` の `PUBLIC_API_URL` と `PUBLIC_STUDIO_URL` を、ブラウザが実際に開くアドレスに設定してください。
