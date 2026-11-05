---
title: One-prompt film
description: One sentence in; a planned, layered, subtitled film out.
---

Path `/create`. The wizard is: input → plan → layered generate → compose → done. Contract: API.md §8.2.

![One-prompt film](/images/docs/create.png)

Anonymous visitors can see step 1; generating a plan requires sign-in. Wizard state lives in sessionStorage keyed by screenplay id; refresh or `?screenplay=` resumes.

## Flow

### 1. Input

One prompt (about 8000 characters), duration 15 / 30 / 60 seconds, optional style. `POST /user/screenplay` calls a text model synchronously and charges once at the text unit price.

Default text model: this session’s pick → last remembered → admin **Growth** `ComposePlanModel` → first priced text model.

### 2. Plan

Rough shape:

```json
{
  "title": "",
  "style": "cinematic, cool grade",
  "aspect": "16:9",
  "characters": [{ "key": "c1", "name": "", "look": "wardrobe" }],
  "scenes": [{ "key": "s1", "name": "", "look": "set" }],
  "shots": [{ "no": 1, "scene": "s1", "characters": ["c1"], "prompt": "frame", "motion": "camera", "line": "dialogue", "seconds": 5 }]
}
```

Limits: ≤ 12 shots, ≤ 4 characters, ≤ 4 scenes. Save with `PUT /user/screenplay/:id`.

`POST /user/screenplay/:id/estimate` quotes credits per layer for the image / video / audio models you picked.

### 3. Build canvas and generate

`POST /user/screenplay/:id/build` creates a canvas (and a project if needed):

- text node: plan summary
- one still per character (`sp.layer=character`)
- per shot: still → video → voice if there is a line

Then run layer by layer, or let the wizard batch. Defaults come from settings `ComposeImageModel` / `ComposeVideoModel` / `ComposeAudioModel` (admin **Growth → compose**). If one gateway path is down, change those three keys — no code change.

### 4. Compose

`POST /user/canvas/:id/compose` takes succeeded video nodes (by x or `clip_order`), ffmpeg to 1280×720 / 30 fps, burns SRT, mixes BGM at −14 dB. Free users get an `EasyTV.ai` watermark (`ComposeWatermarkEnabled` and not a member).

Compose **does not spend credits**. A user may have at most 3 compose jobs queued/running; the global queue caps at 20. Jobs older than 10 minutes fail. Poll `GET /user/compose/:id`.

The film lands as an asset (`source=compose`) and can be published to `/watch/:id`.

## Typical failures

- Plan parse error: the API retries the text model once
- Image-to-video 502: some gateway channels work for T2V but not I2V. Point `ComposeVideoModel` at a model you have verified
- Gateway 429 / 503: the backend retries twice (honours `Retry-After`). Exhausted retries return “模型当前排队较多”
