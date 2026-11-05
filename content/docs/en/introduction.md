---
title: Introduction
description: What EasyTV is, how the four repositories split work, and who should deploy it.
---

EasyTV is an open-source, self-hosted AI short-drama studio. In the browser you turn a one-line idea into a finished film: a node canvas for scripts, storyboards, images, video and audio; a 3D director stage for blocking and cameras; a one-prompt pipeline that plans, generates and composes. Credits, model pricing, payments and an admin console are built in.

Think of it as the **New API of short-drama creation**: models still go through your [New API](https://github.com/QuantumNous/new-api)-compatible gateway. EasyTV owns the creative workflow and operations.

## Four repositories

| Repo | Role | Default port |
| --- | --- | --- |
| [easytv-api](https://github.com/easytv-ai/easytv-api) | Go backend: auth, canvas, agent, compose, billing, storage | 8383 |
| [easytv-web](https://github.com/easytv-ai/easytv-web) | Studio: canvas, one-prompt film, director, community | 3005 |
| [easytv-manage](https://github.com/easytv-ai/easytv-manage) | Admin: users, review, pricing, gateway, growth | 3006 |
| [easytv-partner](https://github.com/easytv-ai/easytv-partner) | Partner console: rebates, withdrawals, promo materials | 3010 |

The marketing site is [easytv-website](https://github.com/easytv-ai/easytv-website) and is not on the creation path.

## Who it is for

- You want a self-hosted AI short-drama / short-video workbench and you keep the models and data
- You already run (or will run) a New API / One API style gateway
- You need credits, plans, payments and moderation, not just a few generate calls

## Creator surface

- [Free canvas](/docs/canvas): text / image / video / audio / storyboard / director nodes
- [One-prompt film](/docs/create): plan → layered gen → compose
- [3D director stage](/docs/director): blocking and cameras written back to the canvas
- [Media tools](/docs/media): ffmpeg crop/filmstrip, plus ability-gated upscale / subtitle removal
- [Community and skills](/docs/community): public films, skill payouts
- [Sign-in and teams](/docs/team): email / SMS / WeChat, personal vs team space

## Operator surface

- [Admin console](/docs/admin): users, review, pricing, payments, growth
- [Gateway](/docs/gateway) and [billing](/docs/billing)
- [Partner console](/docs/partner): rebates, withdrawals, promo kits
- [Storage](/docs/storage) and [production](/docs/deploy)

## What it is not

EasyTV is **not** a model gateway. Text, image, video and audio calls are forwarded to the OpenAI-compatible gateway you configure. Without a gateway the studio still opens, but generation does not run.

## Next

Follow [Quick start](/docs/quickstart) from Docker to the first film. Changing code: [Run from source](/docs/install-source).
