---
title: 订单与支付
description: 报价、下单、轮询、关单。金额单位元，服务端重新计价，前端报价仅供参考。
---

公开报价可匿名；下单需要 [鉴权](/docs/api-auth)。支付通道复用微信 Native / 支付宝。

订单 `kind`：`membership` / `points`。`status`：`pending` → `paid` / `closed` / `refunded`。生产必须配 `ServerAddress`，否则渠道找不到回调。
