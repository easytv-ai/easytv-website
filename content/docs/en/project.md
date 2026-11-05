---
title: Project overview
description: What the four product repos do, default ports, and why the marketing site is off the creation path.
---

EasyTV is four deployable repositories that share one [API contract](/docs/api). Change `easytv-api/API.md` before you change any client.

![Studio](/images/docs/studio.png)

## Repositories

| Repo | Role | Port | Docs |
| --- | --- | --- | --- |
| [easytv-api](https://github.com/easytv-ai/easytv-api) | Go API: auth, canvas, tasks, billing, storage, gateway | 8383 | [API reference](/docs/api) |
| [easytv-web](https://github.com/easytv-ai/easytv-web) | Studio: canvas, one-prompt film, director, community | 3005 | [Studio](/docs/studio) |
| [easytv-manage](https://github.com/easytv-ai/easytv-manage) | Admin: users, review, prices, gateway, growth | 3006 | [Admin](/docs/admin) |
| [easytv-partner](https://github.com/easytv-ai/easytv-partner) | Partner console: rebates, withdrawals, kits | 3010 | [Partner](/docs/partner) |

The marketing site [easytv-website](https://github.com/easytv-ai/easytv-website) is docs and landing only.

## Who calls whom

```
easytv-web      ──┐
easytv-manage   ──┼──▶  easytv-api  ── MySQL / Redis / object storage
easytv-partner  ──┘         │
                            ▼
                    New API compatible gateway
```

All three clients send `Authorization: Bearer` + `EasyTV-User`. Admin also needs `role ≥ 10`. Model calls never go to vendors directly.

## Run locally

With the four repos on this machine, open the ports above. Docker Compose `--profile full` starts API, studio and admin; partner is `pnpm dev` on its own. See [quick start](/docs/quickstart) and [from source](/docs/install-source).
