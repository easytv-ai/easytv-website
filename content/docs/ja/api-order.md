---
title: 注文と決済
description: 見積もり、注文、ポーリング、クローズ。金額の単位は人民元で、サーバー側で再計算されます。フロントエンドの見積もりは参考値です。
---

公開の見積もりは匿名で呼び出せます。注文には [認証](/docs/api-auth) が必要です。決済チャネルは WeChat Native / Alipay を利用します。

注文の `kind`：`membership` / `points`。`status`：`pending` → `paid` / `closed` / `refunded`。本番環境では `ServerAddress` の設定が必須で、未設定だと決済チャネルがコールバック先を見つけられません。
