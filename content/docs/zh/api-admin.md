---
title: 管理侧总表
description: 运营后台 /admin/* 。role ≥ 10；改系统设置、退款、调积分要 role ≥ 100。
---

调用方是 [easytv-manage](https://github.com/easytv-ai/easytv-manage)。鉴权同 [用户侧](/docs/api-auth)，另加管理员角色。

超级管理员（`role ≥ 100`，RootAuth）才能：系统设置、注销用户、换绑、调额度、提现打款、订单退款 / 手动已支付、积分调整、会员计划 / 积分包 / 促销 / 模型定价的增删改。普通管理员调这些返回 `权限不足`。

拆开的详细页在左侧：用户、审核、定价与网关。
