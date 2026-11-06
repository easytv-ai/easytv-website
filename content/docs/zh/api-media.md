---
title: 媒体工具
description: 裁切、抽帧、去停顿等本地 ffmpeg 动作，以及超分、去字幕等走生成任务的模型动作。
---

需要 [鉴权](/docs/api-auth)。创建限流 30 次/分钟。

`engine=local` 免费，服务器没装 ffmpeg 时不可用。`engine=model` 同步提交生成任务，积分不足 / 未定价时创建接口直接报错且不落作业。
