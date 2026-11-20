---
title: パートナーコンソール
description: easytv-partner は、MCN、教育機関、KOL 向けのセルフサービス型の報酬・販促コンソールです。
---

パートナーコンソールは `/user/partner/*` と連携します。リポジトリは [easytv-partner](https://github.com/easytv-ai/easytv-partner) です。パートナーは通常の EasyTV アカウントでログインして参加を申請し、承認されると専用リンクと専用コードを受け取ります。

## パートナーができること

| 領域 | 説明 |
| --- | --- |
| ダッシュボード | 顧客数、有料顧客、売上と報酬。7 / 30 / 90 日の推移 |
| 紐づく顧客 | マスクされたニックネーム、流入元、初回の支払い、累計支払額 |
| 報酬と出金 | 取引履歴、出金履歴、出金申請（Alipay / WeChat / 銀行口座） |
| ボーナスコード | 受け取り、登録、有料転換 |
| 販促素材 | リンク、QR コード、コピー文、ルール |
| 参加申請 | 申請、却下後の再申請、連絡先の変更 |

報酬率、アトリビューション期間、審査は、管理コンソールの **システム → グロース** と「パートナー」ページで設定します。管理者は 1 回限りのチケットを発行して、特定のパートナーのコンソールに直接入ることもできます。

## 実行

```bash
pnpm dev          # :3010
```

`NUXT_PUBLIC_API_BASE_URL` は API を、`NUXT_PUBLIC_STUDIO_URL` はスタジオを指します（販促リンクのフォールバック）。

Docker：

```bash
docker run -d -p 3010:3010 \
  -e NUXT_PUBLIC_API_BASE_URL=https://api.example.com \
  -e NUXT_PUBLIC_STUDIO_URL=https://studio.example.com \
  ghcr.io/easytv-ai/easytv-partner:latest
```

管理者は管理コンソールの「パートナー」ページで 1 回限りのチケットを発行し、`/console?ticket=` を開いて特定のパートナーのコンソールに直接入ることができます。
