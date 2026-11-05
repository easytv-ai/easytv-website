---
title: Install
description: What you need to deploy EasyTV, and when to pick Docker versus source.
---

The minimum stack is **API + MySQL + a New API-compatible gateway**. The studio and admin console can come later; `/healthz` is enough to prove the backend is up.

## You need

| Piece | Notes |
| --- | --- |
| MySQL 8.x | Required. First boot AutoMigrates the schema |
| Redis | Recommended. Without it, rate limits and OTP fall back to memory |
| ffmpeg / ffprobe | Compose, frame extract, audio split |
| New API-compatible gateway | Entry for text / image / video / audio models |
| Node.js 22.21+ and pnpm 10+ | Only if you run the front ends from source |

## Which path

| Path | When |
| --- | --- |
| [Docker Compose](/docs/install-docker) | Default. One command for the API; `full` also starts studio and admin |
| [Run from source](/docs/install-source) | When you are changing backend or front-end code |
| Binary + systemd | Production hosts that should not run Docker; grab a Linux build from GitHub Releases |

## Ports

| Service | Port |
| --- | --- |
| easytv-api | 8383 |
| easytv-web | 3005 |
| easytv-manage | 3006 |
| easytv-partner | 3010 |

If the browser is not on localhost, set `PUBLIC_API_URL` and `PUBLIC_STUDIO_URL` in `.env` to the URLs the browser actually opens.
