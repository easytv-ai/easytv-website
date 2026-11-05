---
title: Admin API index
description: /admin/* for easytv-manage. role ≥ 10; settings, refunds and credit edits need role ≥ 100.
---

Caller is [easytv-manage](https://github.com/easytv-ai/easytv-manage). Same headers as [auth](/docs/api-auth), plus admin role.

RootAuth (`role ≥ 100`): settings, deactivate users, rebind, quotas, payouts, refunds / mark-paid, credit adjust, CRUD on plans / packs / promo / model prices. Other admins get `权限不足`.

Detail pages:

- [Users](/docs/api-admin-user)
- [Review](/docs/api-admin-review)
- [Pricing](/docs/api-admin-price)

Read-only site lists: `GET /admin/project|canvas|asset|task`. Status 1/2 moves between live and trash. Settings: `GET/PUT /admin/setting/:key`, live without restart.
