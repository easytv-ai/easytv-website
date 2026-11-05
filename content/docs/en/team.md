---
title: Sign-in, roles and teams
description: Email / SMS / WeChat, admin roles, and who pays in personal vs team space.
---

## Sign-in

Studio and partner console share one account system.

| Method | API | Notes |
| --- | --- | --- |
| Email + password | `POST /user/login` | |
| SMS code | `GET /sms/verification` + `POST /user/sms_login` | Auto-registers if unknown |
| WeChat Open Platform | OAuth | Set the callback host in admin; in dev you can print OTPs in the API log |

The response includes `access_token`. Every authenticated call then sends:

```
Authorization: Bearer <access_token>
EasyTV-User: <user_id>
```

Admin uses `/admin/*` and needs `role ≥ 10`. System settings, refunds and credit adjustments need super-admin `role ≥ 100` (the first-boot `admin`).

Admins can mint a one-time console ticket into the studio or partner console (impersonation for support).

## Team space

Studio header: **personal** / **team**. A user belongs to at most one team. Header `EasyTV-Team: <team_id>` (missing or 0 = personal).

Rules:

1. Personal space always spends your own wallet, even if you are on a team
2. Team space spends the **owner’s credit pool**; an expired team plan is rejected (`team_expired`)
3. Existing projects stay personal; the author can move them in or out
4. Roles `admin` / `editor` / `viewer`. Viewers cannot generate with team credits
5. If you are removed, the API returns `team_forbidden`; the client should drop the header and switch back

Membership has a single-seat creator edition and a team edition (2–10 seats, discount in `BillingPromo`). Concurrency and storage follow the plan.
