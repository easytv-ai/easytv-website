---
title: 管理侧总表
description: 运营后台 /admin/* 。role ≥ 10；改系统设置、退款、调积分要 role ≥ 100。
---

调用方是 [easytv-manage](https://github.com/easytv-ai/easytv-manage)。鉴权同 [用户侧](/docs/api-auth)，另加管理员角色。

超级管理员（`role ≥ 100`，RootAuth）才能：系统设置、注销用户、换绑、调额度、提现打款、订单退款 / 手动已支付、积分调整、会员计划 / 积分包 / 促销 / 模型定价的增删改。普通管理员调这些返回 `权限不足`。

拆开的详细页：

- [用户](/docs/api-admin-user) — 列表、启用、身份、代登、注销
- [审核](/docs/api-admin-review) — 作品、举报、评论、分类、轮播、公告、技能
- [定价与网关](/docs/api-admin-price) — 会员、积分包、模型定价、网关、订单、调账

## 内容与任务只读

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/admin/project` | 全站项目。`user_id?, keyword?, status?` |
| GET | `/admin/canvas` | 全站画布（不含 graph） |
| GET | `/admin/asset` | 全站资产 |
| GET | `/admin/task` | 全站任务。`status?, type?` |
| PUT | `/admin/project/:id/status` | `{ status: 1 \| 2 }` 恢复 / 进回收站 |
| DELETE | `/admin/project/:id` | 物理删除（含画布） |

列表项附 `owner_name`。画布另附 `node_count`。`?status=1|2` 按回收站过滤。

## 系统设置

`GET /admin/setting/:key`、`PUT /admin/setting/:key`。改完立即生效，不必重启 API。网关地址、站点名、邀请规则、通知类型开关都在这里。
