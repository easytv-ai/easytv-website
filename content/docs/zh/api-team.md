---
title: 团队
description: 团队空间、邀请、席位。只有请求头带 EasyTV-Team 时生成才花团队积分池。
---

需要 [鉴权](/docs/api-auth)。

- 缺省 / `EasyTV-Team: 0`：个人空间，花自己的钱包。
- `EasyTV-Team: <team_id>`：团队空间，成员生成从 owner 积分池预扣。

一个人只属于一个团队。购买团队版会员即成为 owner，席位 = 订单 `seats`（2–10）。
