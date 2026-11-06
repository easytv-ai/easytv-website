---
title: Generation tasks
description: Create, poll, cancel, retry. Credits freeze first; the model must be on the live model_price list.
---

Needs [auth](/docs/api-auth). Canvas Inspector generate and the chat text task use this group. The model list is anonymous — see [Models](/docs/api-models).

State: `pending` → `running` → `succeeded` / `failed` / `cancelled`.

- Credits **freeze** on create, `settle` on success, `unfreeze` on fail/cancel (365-day lots).
- `params.count` must be 1.
- Unknown `model` returns `模型暂未接入` and stores nothing.
- Short balance returns `积分不足，还需 N 积分`.
- Generation only goes through an EasyAPI / New API compatible gateway.
