---
title: 介绍
description: EasyTV 是什么、四个仓库怎么分工、适合谁来部署。
---

EasyTV 是开源、可自托管的 AI 短剧创作平台。创作者在浏览器里把一句话变成成片：节点画布承载剧本、分镜、图像、视频与音频；3D 导演台负责走位与机位；一句话成片流水线自动策划、生成、合成。计费、模型定价、支付和运营后台都内置。

可以把它理解成**短剧创作领域的 New API**：模型仍然走你自己的 [New API](https://github.com/QuantumNous/new-api) 兼容网关，EasyTV 负责创作工作流和运营。

## 四个仓库

| 仓库 | 做什么 | 默认端口 |
| --- | --- | --- |
| [easytv-api](https://github.com/easytv-ai/easytv-api) | Go 后端：鉴权、画布、智能体、合成、计费、存储 | 8383 |
| [easytv-web](https://github.com/easytv-ai/easytv-web) | 创作台：画布、一句话成片、导演台、社区 | 3005 |
| [easytv-manage](https://github.com/easytv-ai/easytv-manage) | 运营后台：用户、审核、定价、网关、增长 | 3006 |
| [easytv-partner](https://github.com/easytv-ai/easytv-partner) | 渠道伙伴自助后台：返佣、提现、推广物料 | 3010 |

官网（本站）在 [easytv-website](https://github.com/easytv-ai/easytv-website)，不参与创作链路。界面见 [开始使用](/docs)。

## 适合谁

- 要自建短剧 / 短视频 AI 工作台，并且自己掌握模型和数据
- 已经有（或准备搭）New API / One API 一类网关
- 需要积分计费、会员、支付、审核后台，而不是只调几个生成接口

## 创作者侧能力

- [自由画布](/docs/canvas)：文本 / 图像 / 视频 / 音频 / 分镜 / 导演台节点
- [一句话成片](/docs/create)：策划案 → 分层生成 → 合成
- [3D 导演台](/docs/director)：站位与机位写回画布
- [媒体工具](/docs/media)：ffmpeg 裁切抽帧，以及按能力位的超分 / 去字幕
- [社区与技能](/docs/community)：公开成片、技能分成
- [登录与团队](/docs/team)：邮箱 / 短信 / 微信，个人与团队空间

## 运营侧能力

- [运营后台](/docs/admin)：用户、审核、定价、支付、增长
- [对接网关](/docs/gateway) 与 [计费](/docs/billing)
- [渠道后台](/docs/partner)：返佣、提现、推广物料
- [对象存储](/docs/storage) 与 [生产部署](/docs/deploy)

## 不做什么

EasyTV **不是**模型网关。文本、图像、视频、音频请求都转发到你配置的 OpenAI 兼容网关。没有网关时，创作台可以打开，但生成跑不起来。

## 下一步

跟着 [快速开始](/docs/quickstart) 从 Docker 跑到第一条成片。想改代码走 [源码运行](/docs/install-source)。
