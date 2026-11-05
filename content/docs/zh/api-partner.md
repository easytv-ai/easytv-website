---
title: 渠道控制台
description: easytv-partner 用的 /user/partner/console/* 。和创作台同一套登录，数据只限本人名下。
---

渠道后台 [easytv-partner](https://github.com/easytv-ai/easytv-partner) **不另建账号**。伙伴用自己的 EasyTV 账号登录，鉴权仍是 UserAuth。昵称脱敏，不含客户手机号 / 邮箱 / 订单明细。

## POST `/user/partner/apply`

`{ name, kind, contact, intro }`。已申请过返回当前状态。

## GET `/user/partner/me`

未申请返回 `null`。已通过返回伙伴资料、推广链接、客户数、成交、返佣、可提现和最近几笔。

## GET `/partner/:code`

公开落地页 `{ name, intro, valid }`。

## GET `/user/partner/console/overview`

看板。`GET /user/partner/me` 的全部字段 + `rebate_months`、本月 `{ new_customers, paid_users, orders, amount, rebate }`、`server_time`。

未申请：`success=false, code="not_applied"`。待审 / 驳回 / 停用照常返回 `partner`（`month` 为 0），前端按 `partner.status` 展示状态页。

```bash
curl "$API/user/partner/console/overview" \
  -H "Authorization: Bearer $TOKEN" \
  -H "EasyTV-User: $UID"
```

## GET `/user/partner/console/stats`

`range=7d|30d|90d`。日趋势（含今天，缺日期补 0）：

```json
{
  "success": true,
  "data": {
    "rows": [{ "date": "2026-11-05", "new_customers": 2, "orders": 1, "amount": 199, "rebate": 29.85 }],
    "start_date": "2026-10-06",
    "end_date": "2026-11-05",
    "totals": { "new_customers": 12, "orders": 8, "amount": 1600, "rebate": 240 }
  }
}
```

`amount` 客户实付、`rebate` 返佣，人民币元。只统计有效返佣流水。

## GET `/user/partner/console/customers`

`paid=1|0`、`sort=recent|amount`、分页。昵称脱敏。

## GET `/user/partner/console/bonus-codes`

归属到我的口令红包及效果，只读。创建仍在运营后台。

## PUT `/user/partner/console/profile`

`{ name?, kind?, contact, intro }`。

- 待审：可改全部
- 已驳回：改完自动回到待审
- 已通过：只能改 `contact` / `intro`
- 已停用：不可改

未通过时 `stats` / `customers` / `bonus-codes` 返回 `code="not_approved"`。

返佣与提现复用：`GET /user/bills/self`、`GET /user/withdraw/self`、`POST /user/withdraw`。余额是用户 `quota` 折算的人民币，**不是创作积分**。

运营审核：`GET /admin/partner`、`PUT /admin/partner/:id/review` `{ action: approve|reject|disable, rebate_rate?, remark? }`。通过后可用 `POST /admin/user/:id/console_access` 免密打开渠道后台。
