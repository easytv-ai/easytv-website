---
title: 訂單與金流
description: 報價、下單、輪詢、關單。金額單位元，伺服器端重新計價，前端報價僅供參考。
---

公開報價可匿名；下單需要 [驗證](/docs/api-auth)。付款通道沿用微信 Native / 支付寶。

訂單 `kind`：`membership` / `points`。`status`：`pending` → `paid` / `closed` / `refunded`。正式環境必須設定 `ServerAddress`，否則付款通路找不到回呼。
