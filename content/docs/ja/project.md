---
title: プロジェクト紹介
description: 4 つのプロダクトリポジトリそれぞれの役割、既定のポート、公式サイトが制作の経路にないこと。
---

EasyTV は個別にデプロイできる 4 つのリポジトリに分かれており、1 つの [API 契約](/docs/api) を共有します。API を変えるときは、まず `easytv-api/API.md` を変更し、そのあとで 3 つのフロントエンドを変更します。

![スタジオ](/images/docs/studio.png)

## リポジトリ

| リポジトリ | 役割 | 既定のポート | ドキュメント |
| --- | --- | --- | --- |
| [easytv-api](https://github.com/easytv-ai/easytv-api) | Go バックエンド：認証、キャンバス、タスク、課金、ストレージ、ゲートウェイアダプター | 8383 | [API リファレンス](/docs/api) |
| [easytv-web](https://github.com/easytv-ai/easytv-web) | スタジオ：キャンバス、ワンプロンプト制作、ディレクターステージ、コミュニティ | 3005 | [スタジオ](/docs/studio) |
| [easytv-manage](https://github.com/easytv-ai/easytv-manage) | 管理コンソール：ユーザー、審査、価格設定、ゲートウェイ、グロース | 3006 | [管理コンソール](/docs/admin) |
| [easytv-partner](https://github.com/easytv-ai/easytv-partner) | パートナー向けセルフサービスコンソール：報酬、出金、販促素材 | 3010 | [パートナーコンソール](/docs/partner) |

公式サイト [easytv-website](https://github.com/easytv-ai/easytv-website) は紹介とこのドキュメントだけを担い、生成には関与しません。

## 呼び出しの関係

```
easytv-web      ──┐
easytv-manage   ──┼──▶  easytv-api  ── MySQL / Redis / object storage
easytv-partner  ──┘         │
                            ▼
                    OpenAI-compatible gateway
```

3 つのクライアントはすべて `Authorization: Bearer` + `EasyTV-User` を使います。管理コンソールではさらに `role ≥ 10` が必要です。モデルへのリクエストはベンダーに直接接続せず、必ずあなたが設定したゲートウェイを経由します。

## ローカルでの起動

4 つのリポジトリがすべてローカルマシンにある場合は、それぞれのポートを開くだけです。Docker Compose の `--profile full` は API、スタジオ、管理コンソールを起動します。パートナーコンソールは個別に `pnpm dev` で起動します。手順は [クイックスタート](/docs/quickstart) と [ソースから実行](/docs/install-source) を参照してください。
