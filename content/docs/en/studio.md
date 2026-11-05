---
title: Studio
description: What easytv-web does, main routes, and how to point it at your API.
---

The studio is the creator front end, repository [easytv-web](https://github.com/easytv-ai/easytv-web). Feature guides: [canvas](/docs/canvas), [one-prompt film](/docs/create), [director](/docs/director), [community](/docs/community), [sign-in and teams](/docs/team).

![Studio home and featured films](/images/docs/studio.png)

## What it does

- **Free canvas**: text, image, video, audio and storyboard-group nodes, with version history and read-only sharing
- **One-prompt film**: plan, characters, scenes, shots and voice-over, then refine shot by shot
- **3D director stage**: block and set cameras in the browser; shot descriptions write back to the canvas
- **In-browser edit**: FFmpeg.wasm trim, split, concat
- **Community**: explore, follow, rankings, comments, public player
- **Skills and prompts**: reusable workflow templates
- **Seven locales**: Simplified / Traditional Chinese, English, French, Japanese, Russian, Vietnamese

## Routes

| Path | Meaning |
| --- | --- |
| `/agent` | Home (`/` 301s here) |
| `/explore` `/studio` `/following` `/rank` | Feed, featured, following, rankings |
| `/create` | One-prompt film: prompt → plan → layered gen → compose |
| `/canvas` | Free canvas. `?id=` opens one, `?project_id=` creates from a project |
| `/canvas/director` | 3D director stage; the scene writes back to the same canvas |
| `/share/:token` | Read-only canvas share |
| `/projects` `/assets` `/subjects` `/prompts` | Projects and libraries |
| `/skills` | Skill plaza |
| `/watch/:id` | Public player |
| `/pricing` | Plans |
| `/settings` | Account, team, orders, invoices, invites |
| `/legal/*` | Terms, privacy, AI guidelines (sample copy — review before go-live) |

## Deploy

Cloudflare Workers preset:

```bash
cp .env.example .env.production
pnpm deploy
```

Node host: `NITRO_PRESET=node-server pnpm build`, then `node .output/server/index.mjs`.

Docker:

```bash
docker run -d -p 3005:3005 \
  -e NUXT_PUBLIC_API_BASE_URL=https://api.example.com \
  -e NUXT_PUBLIC_SITE_URL=https://studio.example.com \
  ghcr.io/easytv-ai/easytv-web:latest
```
