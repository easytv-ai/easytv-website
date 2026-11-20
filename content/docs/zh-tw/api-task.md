---
title: 生成任務
description: 建立、輪詢、取消、重試。積分先預扣後結算；模型必須在 model_price 生效清單裡。
---

需要 [驗證](/docs/api-auth)。畫布 Inspector「生成」和對話欄文字任務都走這組。模型清單可匿名，見 [模型](/docs/api-models)。

狀態機：`pending` → `running` → `succeeded` / `failed` / `cancelled`。

- 積分依 `model_price` **先預扣**（`freeze`），成功 `settle`，失敗 / 取消退回（`unfreeze`，365 天有效）。
- `params.count` 只能是 1。
- `model` 不在生效清單：`模型暂未接入`，不寫入資料庫。
- 餘額不夠：`积分不足，还需 N 积分`。
- 生成只走 OpenAI 相容閘道，不直連廠商。
