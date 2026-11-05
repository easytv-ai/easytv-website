---
title: Community and skills
description: Public feed, follow/rank, comment review, and how skill templates are listed and paid out.
---

The studio is also a public film community. Operators review works, comments and skills in admin.

![Explore feed](/images/docs/explore.png)

## Works

Creators publish from an asset: `POST /user/work`. Public feed `GET /work`, player `/watch/:id` (view count +1). Authors can expose a making-of at `/process/:id`.

Studio routes:

| Path | Meaning |
| --- | --- |
| `/explore` | Feed, featured first |
| `/studio` | Recommended |
| `/following` | Following |
| `/rank` | Rankings |
| `/author/:id` | Author |
| `/watch/:id` | Player |

Likes, comments and reports need sign-in. Admin **Works / community audit / reports** takes things down. Featured films and home banners are scheduled separately.

## Skills

A skill is a reusable workflow (prompt + optional canvas graph).

- Plaza `/skills`: official plus approved user skills
- Creators submit with `POST /user/skill/:id/submit`; admin **Skills** reviews
- Other people running your skill accrue a share; payout as credits or CNY (rate `GrowthPointsPerYuan`, default 20 credits/yuan)

Admin also maintains the prompt library, style library and subject library (character turnarounds) as canvas references.

## Growth

Invite `/invite/:code`, partner `/partner/:code` or `/p/:code`, bonus codes — attribution is written at register. Rules live under **System → Growth**: signup grant, check-in, invite reward, attribution window. See [Partner console](/docs/partner).

Campaigns: `/campaign`, configured under admin **Campaigns**.
