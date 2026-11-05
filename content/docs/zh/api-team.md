---
title: 团队
description: 团队空间、邀请、席位。只有请求头带 EasyTV-Team 时生成才花团队积分池。
---

需要 [鉴权](/docs/api-auth)。空间头见契约 20。

- 缺省 / `EasyTV-Team: 0`：个人空间，花自己的钱包。
- `EasyTV-Team: <team_id>`：团队空间，成员生成从 owner 积分池预扣（会员有效期内按会员价）。

一个人只属于一个团队。购买团队版会员即成为 owner，席位 = 订单 `seats`（2–10）。

## GET `/user/team`

```json
{
  "success": true,
  "data": {
    "id": 3,
    "name": "工作室",
    "owner_id": 1,
    "seats": 5,
    "used_seats": 2,
    "role": "owner",
    "members": [],
    "active": true,
    "expires_at": 1738000000,
    "pool_balance": 40000,
    "invite_code": "AB12CD34"
  }
}
```

不在团队时 `data` 为 `null`。`invite_code` 仅 owner 可见。

## PUT `/user/team`

`{ name }` 改名，仅 owner。

## POST `/user/team/invite`

重新生成邀请码，旧码失效。仅 owner。

## POST `/user/team/join`

`{ code }` 加入。一人只能进一个团队。

## GET `/user/team/usage`

团队用量（并发、存储、本月积分）。设置页额度卡片用。

角色与只读画布见契约 15、11.6。团队增强接口（邀请、移除成员）见契约 10.5 / 10.10。
