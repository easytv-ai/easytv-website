---
title: 媒體工具
description: 畫布工具列上的 ffmpeg 動作和依能力位計費的模型動作。
---

畫布工具列上 20+ 個入口統一走 `media_job`。本機 ffmpeg 動作免費、產出真實檔案；模型動作依「能力位」接已定價模型。契約在 `API.md` 第 23 章。

伺服器要能執行 `ffmpeg` / `ffprobe`（`PATH` 或 setting `FFmpegPath` / `FFprobePath`）。後台 **系統 → 媒體工具** 可關閉某一類按鈕、調整佇列上限。

## 本機動作（免費）

沒裝 ffmpeg 時整組不可用。

| action | 名稱 | 來源 → 產物 |
| --- | --- | --- |
| `crop` | 畫面裁切 | 影片 / 圖 → 同來源類型 |
| `grid_split` | 宮格切分 | 圖 → 圖 ×N（1–25） |
| `montage` | 分鏡組拼接 | 圖 ×N → 一張宮格 |
| `trim` | 片段擷取 | 影片 / 音訊 |
| `split` | 分割 | 一切為二 |
| `remove_silence` | 去停頓 | 影片 / 音訊 |
| `extract_audio` / `mute_video` / `split_av` | 音軌 / 無聲 / 分離 | 影片 |
| `mix_bgm` | 混入配樂 | 影片 + 音訊資產 |
| `extract_frame` / `extract_frames` | 取幀 / 抽幀 | 影片 → 圖 |
| `storyboard` | 逐幀拉片 | 抽幀 + 文字模型解讀 |
| `compress` | 壓縮 | 影片 / 圖 |

單一使用者同時排隊 / 處理中預設最多 3 個，全域預設 20（後台可改）。建立限流 30 次/分鐘。

宮格切分 **不在瀏覽器裡裁**：OSS 沒有 CORS 時讀不到像素，所以一次作業產出 N 個產物。

## 模型動作（計費）

能力標籤寫在 `model_price.abilities`（逗號分隔）。沒打標籤時依模型名稱推斷（`*upscale*`、`*subtitle*`、`*demucs*` …）。沒有對應能力的按鈕會顯示不可用，而不是點下去才報錯。

常見能力位：`upscale`、`remove_subtitle`、`vocal_separation`、`bgm_separation`、`matting`、`subject_remove` / `modify` / `replace`、`motion_capture`、`native_audio`（口播只列出能依台詞出聲的影片模型）、`video_reference`（全能參考 / 爆款復刻）。

建立模型動作時會同步提交生成任務：積分不足、未定價、並行已滿，介面直接失敗且不建立作業。

## 瀏覽器內剪輯

創作台還內建 FFmpeg.wasm，裁剪 / 拆分 / 拼接可以完全在本機做。大檔案或要進時間軸合成時仍走伺服器端。
