---
title: Admin console
description: What easytv-manage covers, and the settings to change first after go-live.
---

The admin console talks to `/admin/*` on the API, repository [easytv-manage](https://github.com/easytv-ai/easytv-manage). Sign in with the `admin` account created on first boot.

## What you can manage

| Area | Pages |
| --- | --- |
| People | Users, team quotas, channel partners |
| Content | Works, featured films, categories, banners, skills, prompts, styles, subjects, projects, assets, canvases |
| Community | Comment / report / feed review, notices, notifications |
| Money | Orders, top-ups, withdrawals, ledger, plans, credit packs, model prices, invoices |
| Growth | Campaigns, invite and check-in, dashboards |
| System | Site, payments, gateway, growth and invoices (super-admin only) |

These writes go to the `setting` table; the API does not need a restart.

System settings (super-admin only) are tabbed: site, SMS, invoices, payments, gateway & storage, AI chat, media tools. Growth rules (invite, check-in, compose default models, payout rate) live on the Growth page.

## First-run checklist

1. **System → Gateway**: New API-compatible URL and key, pull models, import prices
2. **System → Site**: public studio URL (invites and callbacks)
3. **System → Payments**: WeChat Pay / Alipay if you sell plans or credits
4. **Model pricing**: per-model credit prices

## Run

```bash
pnpm dev          # :3006
```

```bash
docker run -d -p 3006:3006 \
  -e NUXT_PUBLIC_API_BASE_URL=https://api.example.com \
  -e NUXT_PUBLIC_STUDIO_URL=https://studio.example.com \
  -e NUXT_PUBLIC_PARTNER_URL=https://partner.example.com \
  ghcr.io/easytv-ai/easytv-manage:latest
```

`NUXT_PUBLIC_PARTNER_URL` is the “open partner console” link. Without a backend the sign-in page has a demo account that only browses the UI. `role ≥ 10` is required; gateway / payments / site settings need super-admin (`role ≥ 100`).
