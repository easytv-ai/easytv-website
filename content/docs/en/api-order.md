---
title: Orders and payments
description: Quote, place, poll, close. Amounts are yuan; the server re-prices. The UI quote is informational.
---

Quotes may be anonymous; placing an order needs [auth](/docs/api-auth). Channels: WeChat Native / Alipay. `kind`: `membership` / `points`. Status: `pending` → `paid` / `closed` / `refunded`. `order_no` is also the payment trade no.

## GET `/billing/plans`

Anonymous. `{ plans, packs, promo }`. `promo.member_day` is the monthly member-day discount.

## GET `/billing/model-prices`

Live model prices for the pricing page and Inspector estimate.

## POST `/billing/quote`

Same body as place-order minus `payment_method`. Logged-in users get member pack prices. Response `{ origin, price, points, title, … }`. `price` is what you pay.

## POST `/user/order`

`kind`, `plan_code` or `pack_code`, `edition`, `cycle`, `seats`, `add_on`, `payment_method` (`wechat_native` / `alipay_f2f` / `alipay_pc`).

Response `{ order, quote, pay, pay_error? }`. QR in `pay.code_url`; Alipay PC uses `pay.payment_url`. Unconfigured channel: `pay` is null, order stays pending.

## GET `/user/order/:id`

Poll every 3s until `paid` / `closed`.

## POST `/user/order/:id/pay`

Retry a pending order with another `{ payment_method }`.

## POST `/user/order/:id/close`

Cancel pending.

Callbacks: `POST /wechat/webhook`, `POST /alipay/webhook`. Production needs `ServerAddress`. Missed webhooks: `POST /user/recharge/status` `{ trade_no }`.
