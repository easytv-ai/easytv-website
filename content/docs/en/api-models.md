---
title: Models
description: The live catalog is model_price status=1 — the only whitelist for POST /user/task.
---

Both routes are **anonymous**. Pull the list, then send that `model` string to create a task.

Each row includes `unit` (`second` / `image` / `call`), `points_per_unit`, `member_points_per_unit`, `priced`.

## GET `/generation/models`

```bash
curl "$API/generation/models"
```

Empty list if the gateway is unset or `model_price` is empty — every generate then says not connected. Import from the gateway: [Admin pricing](/docs/api-admin-price).

Video estimate = `duration × unit price`. Images per image; text / audio per call. Members use `member_points_per_unit`.

## GET `/generation/models/detail`

Required query `model` (alias `model_name`). Merges local credit prices with gateway `/pricing/detail`. Send `Accept-Language`. Gateway down: prices still return, display fields empty, `gateway_available: false`.

Errors: `缺少模型标识 model`, `模型不存在或未上架`. Gateway cost fields are never forwarded.
