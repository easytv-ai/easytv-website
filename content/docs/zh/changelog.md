---
title: 更新日志
description: 文档站和四个产品仓库最近在补什么。完整记录在各仓库 CHANGELOG.md。
---

这里只记文档站能看见的变化。产品仓库各自维护 `CHANGELOG.md`。

## 文档站 easytv-website

- 中英文档站 `/docs`、`/en/docs`：开始、安装、使用指南、API 参考、参考分开
- 主题跟首页同一套，不再进文档就强制暗色
- 架构图标签不再和 API / 网关方块叠在一起
- pnpm、AGPL-3.0、贡献与安全说明

## 创作台 easytv-web

- Docker 镜像与运行时 `NUXT_PUBLIC_*`
- 双许可：AGPL-3.0 + 商业授权模板
- 媒体代理白名单改从运行时配置读

## 后端 easytv-api

- 契约仍以仓库里的 `API.md` 为准（目前写到第 38 章）
- 生成只走 EasyAPI / New API 兼容网关，不直连厂商
- 积分按 `model_price` 预扣，失败或取消退回

未发布项以各仓库 `CHANGELOG.md` 的 `[Unreleased]` 为准。
