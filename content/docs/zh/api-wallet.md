---
title: 钱包
description: 积分余额、批次、流水和会员状态。积分是唯一计价单位，不再用遗留 quota。
---

需要 [鉴权](/docs/api-auth)。公开定价页用 [订单](/docs/api-order) 里的 `/billing/plans`。

积分按批次管理，消耗 **最早过期优先**。余额 = 未过期批次剩余之和。带 `EasyTV-Team` 时看的是团队空间钱包。
