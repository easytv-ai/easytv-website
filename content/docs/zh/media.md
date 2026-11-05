---
title: 媒体工具
description: 画布工具条上的 ffmpeg 动作和按能力位计费的模型动作。
---

画布工具条上 20+ 个入口统一走 `media_job`。本地 ffmpeg 动作免费、真产物；模型动作按「能力位」接已定价模型。契约在 `API.md` 第 23 章。

服务器要能跑 `ffmpeg` / `ffprobe`（`PATH` 或 setting `FFmpegPath` / `FFprobePath`）。后台 **系统 → 媒体工具** 可关某一类按钮、调队列上限。

## 本地动作（免费）

没装 ffmpeg 时整组不可用。

| action | 名称 | 源 → 产物 |
| --- | --- | --- |
| `crop` | 画面裁切 | 视频 / 图 → 同源 |
| `grid_split` | 宫格切分 | 图 → 图 ×N（1–25） |
| `montage` | 分镜组拼接 | 图 ×N → 一张宫格 |
| `trim` | 片段截取 | 视频 / 音频 |
| `split` | 分割 | 一切为二 |
| `remove_silence` | 去停顿 | 视频 / 音频 |
| `extract_audio` / `mute_video` / `split_av` | 音轨 / 无声 / 分离 | 视频 |
| `mix_bgm` | 混入配乐 | 视频 + 音频资产 |
| `extract_frame` / `extract_frames` | 取帧 / 抽帧 | 视频 → 图 |
| `storyboard` | 逐帧拉片 | 抽帧 + 文本模型解读 |
| `compress` | 压缩 | 视频 / 图 |

单用户同时排队 / 处理中默认最多 3 个，全局默认 20（后台可改）。创建限流 30 次/分钟。

宫格切分 **不在浏览器里裁**：OSS 没 CORS 时读不到像素，所以一次作业出 N 个产物。

## 模型动作（计费）

能力标签写在 `model_price.abilities`（逗号分隔）。没打标签时按模型名推断（`*upscale*`、`*subtitle*`、`*demucs*` …）。没配到对应能力的按钮会显示不可用，而不是点下去才报错。

常见能力位：`upscale`、`remove_subtitle`、`vocal_separation`、`bgm_separation`、`matting`、`subject_remove` / `modify` / `replace`、`motion_capture`、`native_audio`（口播只列能按台词出声的视频模型）、`video_reference`（全能参考 / 爆款复刻）。

创建模型动作时会同步提交生成任务：积分不足、未定价、并发满，接口直接失败且不落作业。

## 浏览器内剪辑

创作台还内置 FFmpeg.wasm，裁剪 / 拆分 / 拼接可以完全在本地做。大文件或要进时间线合成时仍走服务端。
