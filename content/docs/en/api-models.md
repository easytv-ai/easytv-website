---
title: Models
description: Live catalog and detail. The list is model_price.status=1 — the only create-task whitelist.
---

Both routes are **anonymous**. Fetch the list, then pass `model` into `POST /user/task`. An unset gateway or empty table returns `[]`.

Each row includes credit pricing: `unit` (`second` / `image` / `call`), `points_per_unit`, `member_points_per_unit`, `priced`. Ops import from the gateway on [Pricing](/docs/api-admin-price).
