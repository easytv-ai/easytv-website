---
title: 订单与支付
description: 报价、下单、轮询、关单。金额单位元，服务端重新计价，前端报价仅供参考。
---

公开报价可匿名；下单需要 [鉴权](/docs/api-auth)。支付通道复用微信 Native / 支付宝，不另接 SDK。

订单 `kind`：`membership` / `points`。`status`：`pending` → `paid` / `closed` / `refunded`。`order_no` 同时作为支付单号。

## GET `/billing/plans`

匿名。上架的会员计划、积分包和促销。

```bash
curl "$API/billing/plans"
```

`data = { plans, packs, promo }`。`promo.member_day` 是每月会员日折扣。

## GET `/billing/model-prices`

匿名。生效中的模型定价，定价页对比表和 Inspector 预估用。

## POST `/billing/quote`

报价。可匿名；带登录态时积分包按会员价。请求字段与下单相同（不要 `payment_method`）。

```json
{
  "kind": "membership",
  "plan_code": "creator",
  "edition": "creator",
  "cycle": "year",
  "seats": 1,
  "add_on": false
}
```

响应 `{ origin, price, points, title, months, add_on_points, add_on_price }`。`price` 才是应付。

## POST `/user/order`

下单并发起支付。

| 字段 | 说明 |
| --- | --- |
| `kind` | `membership` / `points` |
| `plan_code` / `pack_code` | 二选一 |
| `edition` | `creator` / `team`，仅会员 |
| `cycle` | `month` / `quarter` / `year` |
| `seats` | 创作版恒 1；团队版 2–10 |
| `add_on` | 是否加购积分 |
| `payment_method` | `wechat_native` / `alipay_f2f` / `alipay_pc` |

```bash
curl -X POST "$API/user/order" \
  -H "Authorization: Bearer $TOKEN" \
  -H "EasyTV-User: $UID" \
  -H "Content-Type: application/json" \
  -d '{"kind":"points","pack_code":"p30","payment_method":"wechat_native"}'
```

响应 `{ order, quote, pay, pay_error? }`。

- `wechat_native` / `alipay_f2f`：`pay.code_url` 二维码
- `alipay_pc`：`pay.payment_url` 跳转
- 渠道未开通：`pay` 为 null，订单保留 pending

## GET `/user/order/:id`

支付页每 3 秒轮询直到 `paid` / `closed`。

## GET `/user/order`

我的订单。`status?`，分页。

## POST `/user/order/:id/pay`

对待支付订单换渠道：`{ payment_method }`。

## POST `/user/order/:id/close`

取消待支付。

## 回调

`POST /wechat/webhook`、`POST /alipay/webhook`。生产必须配 `ServerAddress`（或 setting 里的站点地址），否则渠道找不到回调。漏单可 `POST /user/recharge/status` `{ trade_no }` 主动查单补入账。
