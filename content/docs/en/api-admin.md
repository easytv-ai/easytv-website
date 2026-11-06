---
title: Admin API
description: /admin/* for the operator console. role ≥ 10; settings, refunds and credit adjustments need role ≥ 100.
---

Caller is [easytv-manage](https://github.com/easytv-ai/easytv-manage). Same auth as [users](/docs/api-auth), plus an admin role.

RootAuth (`role ≥ 100`) is required for settings, deactivating users, rebinding, quota, payouts, refunds / mark-paid, credit adjustments, and mutating plans / packs / promo / model prices. Regular admins get `权限不足`.

Detailed groups on the left: users, review, pricing.
