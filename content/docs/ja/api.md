---
title: API リファレンス
description: EasyTV の完全な API ドキュメント。リソースごとにまとめ、各エンドポイントにパラメータの型と 200 レスポンスを掲載しています。
---

バックエンドは完全な REST API を提供しており、**制作とユーザー** と **管理とパートナー** の 2 系統に分かれます。スタジオ、管理コンソール、パートナーコンソールは同じログインを共有します。**認証に Cookie を使わないでください。**

- Base URL：`NUXT_PUBLIC_API_BASE_URL`。ローカルの既定値は `http://127.0.0.1:8383` です。curl では `$API` と書きます。
- HTTP ステータスは **常に 200** です。成否は JSON の `success` で判定します。
- 時刻：Unix 秒。`deleted_at` が空であれば未削除です。
- ページネーション：`?page=1&page_size=20`（上限 100）。
- 論理削除：`DELETE` はごみ箱に移動し、30 日後に物理削除されます。

```json
{ "success": true, "message": "", "data": {} }
{ "success": false, "message": "reason" }
```

認証ヘッダーは `Authorization: Bearer <token>` と `EasyTV-User` です。エンティティと状態遷移の全容は [`easytv-api/API.md`](https://github.com/easytv-ai/easytv-api/blob/main/API.md) に書かれています。**API を変えるときは、まずそのファイルを変更してください。**
