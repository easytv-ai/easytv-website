---
title: スタジオ
description: easytv-web でできること、よく使うルート、自分のバックエンドに向ける方法。
---

スタジオはクリエイターが使うフロントエンドで、リポジトリは [easytv-web](https://github.com/easytv-ai/easytv-web) です。機能ごとの説明は、[キャンバス](/docs/canvas)、[ワンプロンプト制作](/docs/create)、[ディレクターステージ](/docs/director)、[コミュニティ](/docs/community)、[ログインとチーム](/docs/team) を参照してください。

![スタジオのトップページとおすすめ作品](/images/docs/studio.png)

## できること

- **フリーキャンバス**：テキスト、画像、動画、音声、絵コンテグループのノードをつなぐだけで実行。バージョン履歴と読み取り専用の共有を備えます
- **ワンプロンプト制作**：企画書、キャラクターとシーン、カット割りとナレーションを自動で用意し、カットごとに磨き込めます
- **3D ディレクターステージ**：ブラウザ上で立ち位置とカメラ位置を決め、カットの記述をキャンバスに書き戻します
- **ブラウザ内編集**：FFmpeg.wasm によるローカルでのトリミング、分割、結合
- **コミュニティ**：探索、フォロー、ランキング、コメント、公開再生ページ
- **スキルとプロンプト**：再利用できるワークフローテンプレート
- **7 言語**：簡体字中国語 / 繁体字中国語 / 英語 / フランス語 / 日本語 / ロシア語 / ベトナム語

## よく使うルート

| パス | 説明 |
| --- | --- |
| `/agent` | トップページ（`/` は 301 でここにリダイレクトされます） |
| `/explore` `/studio` `/following` `/rank` | 作品フィード、おすすめ、フォロー中、ランキング |
| `/create` | ワンプロンプト制作：入力 → 企画書 → レイヤーごとの生成 → 合成 |
| `/canvas` | フリーキャンバス。`?id=` で既存のものを開き、`?project_id=` でプロジェクトから新規作成 |
| `/canvas/director` | 3D ディレクターステージ。シーンは同じキャンバスに書き戻されます |
| `/share/:token` | キャンバスの読み取り専用共有 |
| `/projects` `/assets` `/subjects` `/prompts` | プロジェクトと素材ライブラリ |
| `/skills` | スキルライブラリ |
| `/watch/:id` | 完成映像の再生 |
| `/pricing` | 料金プラン |
| `/settings` | アカウント、チーム、注文、請求書、招待 |
| `/legal/*` | 利用規約、プライバシー、AI ガイドライン（サンプルの文面です。公開前にご自身で確認してください） |

## デプロイ

Cloudflare Workers プリセット：

```bash
cp .env.example .env.production
pnpm deploy
```

Node ホスト：`NITRO_PRESET=node-server pnpm build` のあと `node .output/server/index.mjs`。

Docker：

```bash
docker run -d -p 3005:3005 \
  -e NUXT_PUBLIC_API_BASE_URL=https://api.example.com \
  -e NUXT_PUBLIC_SITE_URL=https://studio.example.com \
  ghcr.io/easytv-ai/easytv-web:latest
```
