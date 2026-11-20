---
title: モデル
description: 利用可能なモデルの一覧と詳細。一覧は model_price テーブルの status=1 で、タスク作成時の唯一のホワイトリストです。
---

この 2 つのエンドポイントはどちらも **匿名で呼び出せます**。タスクを作成する前に一覧を取得し、返された `model` を `POST /user/task` に渡します。ゲートウェイが未設定、またはテーブルが空の場合は空配列を返します。

各行にはクレジット価格が付きます：`unit`（`second` / `image` / `call`）、`points_per_unit`、`member_points_per_unit`、`priced`。運営担当がゲートウェイから取得して取り込む手順は [価格設定とゲートウェイ](/docs/api-admin-price) を参照してください。
