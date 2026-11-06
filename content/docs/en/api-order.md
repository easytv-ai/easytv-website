---
title: Orders and payments
description: Quote, place, poll, close. Amounts are CNY; the server re-prices, client quotes are hints.
---

Quotes can be anonymous; placing an order needs [auth](/docs/api-auth). Channels are WeChat Native and Alipay.

`kind`: `membership` / `points`. `status`: `pending` → `paid` / `closed` / `refunded`. Production must set `ServerAddress` or the channel cannot callback.
