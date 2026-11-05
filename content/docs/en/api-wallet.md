---
title: Wallet
description: Credit balance, lots, ledger and membership. Credits are the only unit; leftover quota is not used for generation.
---

Needs [auth](/docs/api-auth). Public pricing: [Orders](/docs/api-order).

Lots expire; spend oldest-expiry first. Balance = remaining unexpired lots. Membership = monthly grant + member price.

## GET `/user/wallet`

```json
{
  "success": true,
  "data": {
    "balance": 12000,
    "frozen": 150,
    "expiring_in_7d": 800,
    "membership": {
      "plan_code": "creator",
      "plan_name": "Creator",
      "edition": "creator",
      "seats": 1,
      "expires_at": 1738000000,
      "next_grant_at": 1732600000
    }
  }
}
```

`membership` is `null` without a plan. `frozen` is in-flight task holds. With `EasyTV-Team` you see the team-space wallet.

## GET `/user/points/log`

`type?` = `grant` / `freeze` / `settle` / `unfreeze` / `expire` / `adjust`.

## GET `/user/points/lots`

Unexpired lots for “N credits expire on …”.

## GET `/user/membership`

Same object as `wallet.membership`.

## GET `/user/usage`

Concurrency and storage. Team: `GET /user/team/usage`.
