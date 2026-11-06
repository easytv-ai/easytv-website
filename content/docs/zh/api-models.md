---
title: 模型
description: 可用模型清单和详情。清单 = model_price 表 status=1，是创建任务的唯一白名单。
---

这两条都 **可匿名**。创建任务前先拉清单，再用返回的 `model` 去 `POST /user/task`。网关没配或表空时返回空数组。

每条附带积分定价：`unit`（`second` / `image` / `call`）、`points_per_unit`、`member_points_per_unit`、`priced`。运营从网关拉取并导入见 [定价与网关](/docs/api-admin-price)。
