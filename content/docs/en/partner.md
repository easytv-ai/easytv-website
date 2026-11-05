---
title: Partner console
description: Self-serve rebates and promo tools in easytv-partner for MCNs, schools and KOLs.
---

The partner console talks to `/user/partner/*`, repository [easytv-partner](https://github.com/easytv-ai/easytv-partner). Partners sign in with a normal EasyTV account, apply, and after approval get a referral link and code.

## What a partner can do

| Area | Notes |
| --- | --- |
| Dashboard | Customers, paid customers, sales and rebates; 7 / 30 / 90-day trend |
| Customers | Masked nicknames, source, first payment, lifetime spend |
| Rebates & withdrawals | Ledger, history, apply (Alipay / WeChat / bank) |
| Bonus codes | Claims, sign-ups, paid conversions |
| Promo materials | Link, QR, copy, rules |
| Application | Apply, resubmit after rejection, edit contacts |

Rebate rates, attribution windows and review live in the admin console under **System → Growth** and the Partners page. Admins can also issue a one-time ticket into a partner's console.

## Run

```bash
pnpm dev          # :3010
```

`NUXT_PUBLIC_API_BASE_URL` points at the API; `NUXT_PUBLIC_STUDIO_URL` points at the studio (promo-link fallback).

Docker:

```bash
docker run -d -p 3010:3010 \
  -e NUXT_PUBLIC_API_BASE_URL=https://api.example.com \
  -e NUXT_PUBLIC_STUDIO_URL=https://studio.example.com \
  ghcr.io/easytv-ai/easytv-partner:latest
```

Admins can issue a one-time ticket on the Partners page in the admin console and open `/console?ticket=` straight into that partner's console.
