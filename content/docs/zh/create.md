---
title: 一句话成片
description: 输入一句话，自动出策划案、分层生成、合成带字幕的成片。
---

路径 `/create`。向导是：输入 → 策划案 → 分层生成 → 合成 → 完成。契约在 `API.md` 第 8.2 节。

![一句话成片](/images/docs/create.png)

匿名可以看第一步；点「生成策划案」才要求登录。状态按策划案 id 存在 sessionStorage，刷新或 `?screenplay=` 能接上。

## 流程

### 1. 输入

一句话（上限约 8000 字），时长 15 / 30 / 60 秒，可选风格。`POST /user/screenplay` 同步调文本模型写出策划案，按文本单价扣一次积分。

默认文本模型优先级：本次已选 → 上次记住的 → 后台 **增长** 里的 `ComposePlanModel` → 定价表里第一个文本模型。

### 2. 策划案

结构大致是：

```json
{
  "title": "",
  "style": "电影感 · 冷色调",
  "aspect": "16:9",
  "characters": [{ "key": "c1", "name": "", "look": "外貌与服装" }],
  "scenes": [{ "key": "s1", "name": "", "look": "场景" }],
  "shots": [{ "no": 1, "scene": "s1", "characters": ["c1"], "prompt": "画面", "motion": "运镜", "line": "台词", "seconds": 5 }]
}
```

校验：镜头 ≤ 12、角色 ≤ 4、场景 ≤ 4。保存走 `PUT /user/screenplay/:id`。

`POST /user/screenplay/:id/estimate` 会按你选的图像 / 视频 / 音频模型预估建画布后各层积分。

### 3. 建画布并分层生成

`POST /user/screenplay/:id/build` 新建一张画布（没有项目就顺手建）：

- 文本节点：策划案摘要
- 每个角色一张图（`sp.layer=character`）
- 每镜：分镜图 → 视频 → 有台词则配音

然后在画布上逐层点运行，或让向导批量提交。图像默认、视频默认、音频默认分别读 setting `ComposeImageModel` / `ComposeVideoModel` / `ComposeAudioModel`（运营后台 **系统 / 增长 → 成片与分成**）。某个通路在网关坏了，换这三个键即可，不必改代码。

### 4. 合成

`POST /user/canvas/:id/compose` 取已成功的视频节点（按 x 或 `clip_order`），ffmpeg 统一到 1280×720 / 30fps，烧 SRT、混 BGM（-14 dB），免费用户右下角水印 `EasyTV.ai`（`ComposeWatermarkEnabled` 且非会员）。

合成 **不扣积分**。单用户同时排队 / 合成中 ≥ 3 会先拒，全局队列 ≥ 20 再拒。超过 10 分钟标失败。轮询 `GET /user/compose/:id`。

成片进资产库 `source=compose`，可以发到社区 `/watch/:id`。

## 常见失败

- 策划案解析失败：接口会自动重试一次文本模型
- 图生视频 502：有的网关渠道文生视频正常、图生必挂。把 `ComposeVideoModel` 换成实测可用的模型
- 网关 429 / 503：后端最多再试 2 次（认 `Retry-After`）。用尽仍回「模型当前排队较多」
