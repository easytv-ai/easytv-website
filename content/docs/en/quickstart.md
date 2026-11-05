---
title: Quick start
description: Empty machine to first film: Docker, admin sign-in, gateway, one-prompt film.
---

Aim for a finished clip in **about 15 minutes**. You need Docker 24+ and a [New API](https://github.com/QuantumNous/new-api)-compatible token that can call text, image and video models.

More install options: [Install](/docs/install). Feature tour: [Studio](/docs/studio).

## 1. Bring the stack up

```bash
git clone https://github.com/easytv-ai/easytv-api.git
cd easytv-api
cp .env.example .env
```

Edit `.env`:

- `ROOT_PASSWORD` — first admin password (username defaults to `admin`)
- `CRYPTO_SECRET` — `openssl rand -hex 32`

```bash
docker compose --profile full up -d
curl http://localhost:8383/healthz
```

| Open | URL |
| --- | --- |
| API | http://localhost:8383 |
| Studio | http://localhost:3005 |
| Admin | http://localhost:3006 |

The partner console is separate; see [Partner console](/docs/partner).

## 2. Sign in to admin

Open http://localhost:3006 with `admin` and your `ROOT_PASSWORD`.

Change settings in this order (all under **System**, applied immediately):

1. **Site**: public studio URL `http://localhost:3005` (invites and payment callbacks)
2. **Gateway**: New API-compatible Base URL and Key → pull models → **import prices**
3. **Model pricing**: check text / image / video unit prices (unpriced models cannot generate)

Details: [Connect a gateway](/docs/gateway).

## 3. Give the admin some credits

Generation spends credits. On **Users**, find `admin` and grant a test lot (or open a membership plan).

You can also pay on `/pricing`, but local tests usually just top up by hand.

## 4. Run one-prompt film

Open http://localhost:3005/create (sign in with the same `admin` account).

1. Type a sentence, pick 15 / 30 / 60 seconds
2. Generate a plan (one text-model charge)
3. Review characters, scenes, shots, then **build canvas**
4. Layer-generate character stills, shot stills, shot video, voice-over
5. Compose: ffmpeg concat, burn subtitles, mix BGM; free accounts get a watermark

Full walkthrough: [One-prompt film](/docs/create).

## 5. Next

- Edit shots on the canvas: [Free canvas](/docs/canvas)
- Block cameras: [3D director stage](/docs/director)
- Sell plans: [Billing](/docs/billing)
- Put it on your own domain: [Production](/docs/deploy)
