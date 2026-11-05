---
title: Architecture
description: How the studio, admin and partner consoles talk to easytv-api, plus gateway and storage.
---

```
easytv-web      ──┐
easytv-manage   ──┼──▶  easytv-api (Gin)  ── MySQL / Redis
easytv-partner  ──┘           │            ── object storage (local / OSS / Qiniu)
                              │            ── ffmpeg
                              ▼
                    New API-compatible gateway
                              ▼
                    Kling · Jimeng · Seedance · Sora · GPT · …
```

## Auth

- Studio and partner console: `Authorization: Bearer <token>` plus `EasyTV-User: <user id>`
- Admin calls `/admin/*` and needs `role ≥ 10`
- Team space uses `EasyTV-Team: <team_id>`; default is the personal space
- CORS echoes the request origin, so the three front ends can live on different hosts

## Runtime config

Environment variables are read once at process start. Site name, payments, gateway URL, invite rules and similar live in the backend `setting` table. Changes in the admin console apply immediately; you do not restart the API.

Storage is one of local `upload/`, Aliyun OSS or Qiniu. Image-to-video needs the gateway to fetch the source: OSS / Qiniu already expose public URLs; local storage needs `UPLOAD_BASE_URL` (or setting `UploadBaseUrl`) so the gateway can reach the file.

Multi-node APIs use `WORKER_TAG`: each process only handles jobs stamped with the same tag.

## Contract

Change [`API.md` in easytv-api](https://github.com/easytv-ai/easytv-api/blob/main/API.md) before you change code. See [API overview](/docs/api) for the short version.
