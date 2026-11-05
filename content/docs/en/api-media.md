---
title: Media jobs
description: Local ffmpeg (crop, silence) and model-backed jobs (upscale, subtitles). Create is 30/min.
---

Needs [auth](/docs/api-auth) plus optional `EasyTV-Team`. `engine=local` is free and needs ffmpeg on the server. `engine=model` also creates a generation task; low credits / unpriced models fail the create call and do not insert a job.

## GET `/user/media/actions`

Availability list. The studio toolbar is driven by this.

## POST `/user/media/jobs`

`asset_id` or `task_id` (use the task output). Teammate assets are allowed in team space.

```json
{
  "action": "crop",
  "asset_id": 123,
  "params": { "rect": { "x": 0, "y": 0.8, "w": 1, "h": 0.2 } },
  "node_id": "video-3",
  "canvas_id": 12
}
```

Job `status`: `0` queued / `1` running / `2` ok / `-1` failed.

## GET `/user/media/jobs` · GET `/user/media/jobs/:id`

Filter `canvas_id` / `project_id` / `asset_id` / `action` / `active=1`. Cancel model jobs via `POST /user/task/:id/cancel`. Local jobs finish in seconds and have no cancel.

Local actions: `crop`, extract frames, split, concat, `remove_silence`. Model actions need matching `abilities` (`upscale`, `remove_subtitle`, `transcribe`, …). Params: contract 23.3 / 35.
