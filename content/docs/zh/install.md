---
title: 安装部署
description: 部署 EasyTV 需要哪些依赖，Docker 和源码两条路怎么选。
---

整套最少包括 **API + MySQL + 一个 New API 兼容网关**。创作台、运营后台可以稍后加；没有它们也能先把 `/healthz` 跑通。

## 你需要准备

| 组件 | 说明 |
| --- | --- |
| MySQL 8.x | 必填。首次启动 AutoMigrate 建表 |
| Redis | 推荐。不填则限流和验证码走内存 |
| ffmpeg / ffprobe | 合成、抽帧、音画分离 |
| New API 兼容网关 | 文本 / 图像 / 视频 / 音频模型入口 |
| Node.js 22.21+ 与 pnpm 10+ | 只在源码跑前端时需要 |

## 怎么选

| 方式 | 适合 |
| --- | --- |
| [Docker Compose](/docs/install-docker) | 推荐。一条命令起 API，可选 `full` 把创作台和后台一起拉起来 |
| [源码运行](/docs/install-source) | 改后端或前端时用 |
| 二进制 + systemd | 生产机不想装 Docker 时，从 GitHub Releases 下 Linux 包 |

## 端口

| 服务 | 端口 |
| --- | --- |
| easytv-api | 8383 |
| easytv-web | 3005 |
| easytv-manage | 3006 |
| easytv-partner | 3010 |

浏览器不是从本机访问容器时，在 `.env` 里设置 `PUBLIC_API_URL` 和 `PUBLIC_STUDIO_URL` 为浏览器实际打开的地址。
