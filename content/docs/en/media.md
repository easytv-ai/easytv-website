---
title: Media tools
description: ffmpeg actions on the canvas toolbar, plus ability-gated model actions.
---

Twenty-plus toolbar entries share `media_job`. Local ffmpeg actions are free and write real assets; model actions bill through priced abilities. Contract: API.md chapter 23.

The API host needs `ffmpeg` / `ffprobe` (`PATH` or settings `FFmpegPath` / `FFprobePath`). Admin **System → Media** can hide buttons and change queue caps.

## Local actions (free)

The whole group is unavailable without ffmpeg.

| action | Name | Source → output |
| --- | --- | --- |
| `crop` | Crop | video / image |
| `grid_split` | Grid split | image → N stills (1–25) |
| `montage` | Storyboard tile | N stills → one grid |
| `trim` | Trim | video / audio |
| `split` | Split | one into two |
| `remove_silence` | Remove pauses | video / audio |
| `extract_audio` / `mute_video` / `split_av` | Audio / mute / split A/V | video |
| `mix_bgm` | Mix BGM | video + audio asset |
| `extract_frame` / `extract_frames` | Still / filmstrip | video → images |
| `storyboard` | Shot breakdown | filmstrip + a text-model read |
| `compress` | Compress | video / image |

Default caps: 3 jobs queued/running per user, 20 globally (admin-tunable). Create rate limit: 30/min.

Grid split **does not crop in the browser** — OSS without CORS cannot read pixels — so one job emits N outputs.

## Model actions (paid)

Ability tags live on `model_price.abilities` (comma-separated). Empty tags fall back to name matching (`*upscale*`, `*subtitle*`, `*demucs*` …). Missing abilities show the button as disabled instead of failing on click.

Common tags: `upscale`, `remove_subtitle`, `vocal_separation`, `bgm_separation`, `matting`, `subject_remove` / `modify` / `replace`, `motion_capture`, `native_audio` (talking-head only lists video models that can speak the line), `video_reference` (omni-reference / remix).

Creating a model action also creates a generation task: insufficient credits, unpriced model or concurrency cap fail the request and skip the job.

## In-browser edit

The studio also ships FFmpeg.wasm for trim / split / concat entirely on the client. Large files and timeline compose still go through the API.
