---
title: 媒體工具
description: 裁切、抽幀、去停頓等本機 ffmpeg 動作，以及超解析度、去字幕等走生成任務的模型動作。
---

需要 [驗證](/docs/api-auth)。建立限流 30 次/分鐘。

`engine=local` 免費，伺服器沒裝 ffmpeg 時不可用。`engine=model` 同步提交生成任務，積分不足 / 未定價時建立介面直接報錯且不建立作業。
