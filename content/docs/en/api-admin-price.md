---
title: Pricing and gateway
description: Plans, packs, model prices, fetch/import from the gateway, refunds and credit adjustments.
---

Mutating plans / packs / prices, refunds and adjustments is **RootAuth** (`role ≥ 100`). Regular admins are read-only. `model` must match the gateway id — it is the only source for `GET /generation/models`.
