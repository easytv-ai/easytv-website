---
title: Teams
description: Team space and invites. Generation spends the owner pool only when EasyTV-Team is set.
---

Needs [auth](/docs/api-auth). See contract 20.

- Missing / `EasyTV-Team: 0`: personal space, own wallet.
- `EasyTV-Team: <id>`: team space, freeze from the owner pool (member price while the plan is active).

One team per user. Buying a team plan makes you owner; seats = order `seats` (2–10).

## GET `/user/team`

`null` if you are not on a team. `invite_code` is owner-only.

## PUT `/user/team`

`{ name }`, owner.

## POST `/user/team/invite`

Rotates the invite code.

## POST `/user/team/join`

`{ code }`.

## GET `/user/team/usage`

Concurrency, storage, month-to-date credits.
