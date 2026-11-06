---
title: 生成任务
description: 创建、轮询、取消、重试。积分先预扣后结算；模型必须在 model_price 生效清单里。
---

需要 [鉴权](/docs/api-auth)。画布 Inspector「生成」和对话栏文本任务都走这组。模型清单可匿名，见 [模型](/docs/api-models)。

状态机：`pending` → `running` → `succeeded` / `failed` / `cancelled`。

- 积分按 `model_price` **先预扣**（`freeze`），成功 `settle`，失败 / 取消退回（`unfreeze`，365 天有效）。
- `params.count` 只能是 1。
- `model` 不在生效清单：`模型暂未接入`，不落库。
- 余额不够：`积分不足，还需 N 积分`。
- 生成只走 EasyAPI / New API 兼容网关，不直连厂商。
