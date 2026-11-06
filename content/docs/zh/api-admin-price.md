---
title: 定价与网关
description: 会员计划、积分包、模型定价、从网关拉模型并导入、订单退款和积分调整。
---

CRUD 会员 / 积分包 / 模型定价、退款、调账是 **RootAuth**（`role ≥ 100`）。普通管理员只读。`model` 必须与网关标识一致，这是 `GET /generation/models` 的唯一数据源。
