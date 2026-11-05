---
title: 钱包
description: 积分余额、批次、流水和会员状态。积分是唯一计价单位，不再用遗留 quota。
---

需要 [鉴权](/docs/api-auth)。公开定价页用 [订单](/docs/api-order) 里的 `/billing/plans`。

积分按批次管理，消耗 **最早过期优先**。余额 = 未过期批次剩余之和。会员 = 每月发积分 + 会员价。

## GET `/user/wallet`

```bash
curl "$API/user/wallet" \
  -H "Authorization: Bearer $TOKEN" \
  -H "EasyTV-User: $UID"
```

```json
{
  "success": true,
  "data": {
    "balance": 12000,
    "frozen": 150,
    "expiring_in_7d": 800,
    "membership": {
      "plan_code": "creator",
      "plan_name": "创作",
      "edition": "creator",
      "seats": 1,
      "expires_at": 1738000000,
      "next_grant_at": 1732600000
    }
  }
}
```

没有会员时 `membership` 为 `null`。`frozen` 是进行中任务的预扣。带 `EasyTV-Team` 时看的是团队空间钱包（见 [团队](/docs/api-team)）。

## GET `/user/points/log`

流水。`type?` = `grant` / `freeze` / `settle` / `unfreeze` / `expire` / `adjust`，分页。

`amount` 正入负出。`biz_type` + `biz_no` 指向订单号或任务单号。

## GET `/user/points/lots`

未过期批次，前端展示「XX 积分将于 X 日到期」。

## GET `/user/membership`

当前会员，字段同 `wallet.membership`，方便单独刷新。

## GET `/user/usage`

个人额度卡片（并发、云存储）。团队用量：`GET /user/team/usage`。
