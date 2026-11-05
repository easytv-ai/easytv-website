---
title: Free canvas
description: Node kinds, wired generation, version history, read-only share, and the 2 MB cap.
---

The canvas is the studio core, at `/canvas`. `?id=` opens one; `?project_id=` creates from a project. The API stores `graph` as opaque JSON and **does not parse node semantics**. Cap: **2 MB per canvas**.

## Node kinds

| kind | Role |
| --- | --- |
| `text` | Script, prompts, reverse captions. Up to 4 reference images for vision models |
| `image` | T2I / I2I, with optional subject and style locks |
| `video` | T2V, first/last frame, video reference, talking-head (`videoMode=talking`) |
| `audio` | TTS, BGM, dialogue |
| `storyboard` | Shot group: stills tiled into a grid |
| `director` | [3D director](/docs/director) scene, written back to the same canvas |
| `panorama` | Panorama still |

Empty canvases offer start cards: story script, character turnaround, omni reference video, talking-head, BGM — or drop a [skill](/docs/community) template.

## How a run works

1. Add a node, fill the prompt, pick a model
2. Wire upstream → downstream: stills as first-frame / reference, text as image prompts
3. Hit run. The client `POST /user/task` then polls `GET /user/task/:id`
4. On success the asset is stored and the node `content` becomes a playable URL

Unpriced models fail with “模型未定价” and never create a task. Credits follow [billing](/docs/billing): reserve first, refund on fail or cancel.

Video params pass through: `ratio` / `resolution` / `duration` / `generate_audio` / `seed` / `negative_prompt`. Input roles: `first_frame`, `last_frame`, `reference`, `reference_video`, `reference_audio`.

## Versions and share

- Autosave merges into one row about every 10 minutes; Ctrl+S / Save sends `snapshot: true`
- At most 50 versions per canvas. Restore backs up the current graph first
- `PUT` must send the current `version`, or you get “画布已在其他地方修改，请刷新”
- Share: `GET/PUT /user/canvas/:id/share`, public page `/share/<token>` (old `/s/<token>` 301s). Anonymous viewers see a stripped graph; signed-in users can copy it as their project

## Media tools

Crop, filmstrip, silence removal, A/V split and similar go through [Media tools](/docs/media). Local ffmpeg actions are free; upscale, subtitle-burn removal, matting and so on bill via model abilities.

The browser can also trim / split / concat with FFmpeg.wasm. If the bucket has no CORS, use the studio media proxy and add the host to `NUXT_PUBLIC_MEDIA_HOSTS`.
