---
title: 自由画布
description: 节点种类、连线生成、版本历史、只读分享，以及画布上限。
---

画布是创作台的核心，路径 `/canvas`。`?id=` 打开已有画布，`?project_id=` 从项目新建。后端把 `graph` 当 JSON 原样存，**不解析节点语义**；上限 **2 MB / 张**。

## 节点种类

| kind | 做什么 |
| --- | --- |
| `text` | 剧本、提示词、反推描述。可带最多 4 张参考图发给能看图的文本模型 |
| `image` | 文生图 / 图生图，可锁主体、风格 |
| `video` | 文生视频、首尾帧、参考视频、口播（`videoMode=talking`） |
| `audio` | TTS、BGM、对白 |
| `storyboard` | 分镜组：多张图排成宫格 |
| `director` | [3D 导演台](/docs/director) 场景，写回同一张画布 |
| `panorama` | 全景图 |

空画布上有起步卡：故事脚本、角色三视图、全能参考视频、口播、配乐；也可以从 [技能](/docs/community) 落一套模板。

## 怎么跑

1. 从左侧或空白处加点，填提示词、选模型
2. 把上游节点拖到下游：图片给视频当首帧 / 参考，文本给图像当提示词
3. 点节点上的运行。前端 `POST /user/task`，然后轮询 `GET /user/task/:id`
4. 成功后产物写进 `asset`，节点 `content` 换成可播地址

没有定价的模型会直接报「模型未定价」，不会落任务。积分按 [计费](/docs/billing) 先预扣，失败或取消后退回。

视频参数透传给网关：`ratio` / `resolution` / `duration` / `generate_audio` / `seed` / `negative_prompt`。素材角色：`first_frame`、`last_frame`、`reference`、`reference_video`、`reference_audio`。

## 版本与分享

- 自动保存大约 10 分钟合并一条；Ctrl+S / 保存按钮带 `snapshot: true` 单独记一条
- 每张画布最多 50 个版本。历史里可回滚（回滚前会再备份当前稿）
- `PUT` 必须带当前 `version`，否则返回「画布已在其他地方修改，请刷新」
- 分享：`GET/PUT /user/canvas/:id/share`，公开页 `/share/<token>`（旧 `/s/<token>` 会 301）。匿名可看去敏后的 graph，登录用户可「复制为我的项目」

## 媒体工具

画布工具条上的裁切、抽帧、去停顿、音画分离等走 [媒体工具](/docs/media)。本地 ffmpeg 动作免费；超分、去字幕、抠像等按模型能力位计费。

浏览器里也可以用 FFmpeg.wasm 做裁剪 / 拆分 / 拼接，不经服务端。对象存储没配 CORS 时改走创作台的媒体代理，并把桶域名加到 `NUXT_PUBLIC_MEDIA_HOSTS`。
