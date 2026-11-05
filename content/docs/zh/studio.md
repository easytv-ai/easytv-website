---
title: 创作台
description: easytv-web 能做什么、常用路由，以及如何指向你的后端。
---

创作台是创作者用的前端，仓库 [easytv-web](https://github.com/easytv-ai/easytv-web)。分功能的说明见 [画布](/docs/canvas)、[一句话成片](/docs/create)、[导演台](/docs/director)、[社区](/docs/community)、[登录与团队](/docs/team)。

![创作台首页与精选成片](/images/docs/studio.png)

## 能做什么

- **自由画布**：文本、图片、视频、音频、分镜组节点连线即跑，带版本历史和只读分享
- **一句话成片**：自动策划案、角色与场景、分镜与配音，再逐镜精修
- **3D 导演台**：浏览器里摆站位、定机位，镜头描述写回画布
- **浏览器内剪辑**：FFmpeg.wasm 本地裁剪、拆分、拼接
- **社区**：探索、关注、榜单、评论、公开播放页
- **技能与提示词**：可复用工作流模板
- **七语种**：简体 / 繁体 / 英 / 法 / 日 / 俄 / 越

## 常用路由

| 路径 | 说明 |
| --- | --- |
| `/agent` | 首页（`/` 会 301 到这里） |
| `/explore` `/studio` `/following` `/rank` | 作品流、推荐、关注、榜单 |
| `/create` | 一句话成片：输入 → 策划案 → 分层生成 → 合成 |
| `/canvas` | 自由画布。`?id=` 打开已有，`?project_id=` 从项目新建 |
| `/canvas/director` | 3D 导演台，场景写回同一张画布 |
| `/share/:token` | 画布只读分享 |
| `/projects` `/assets` `/subjects` `/prompts` | 项目与素材库 |
| `/skills` | 技能广场 |
| `/watch/:id` | 成片播放 |
| `/pricing` | 套餐 |
| `/settings` | 账号、团队、订单、发票、邀请 |
| `/legal/*` | 协议、隐私、AI 规范（示例文案，上线前请自行审阅） |

## 部署

Cloudflare Workers 预设：

```bash
cp .env.example .env.production
pnpm deploy
```

Node 主机：`NITRO_PRESET=node-server pnpm build`，再 `node .output/server/index.mjs`。

Docker：

```bash
docker run -d -p 3005:3005 \
  -e NUXT_PUBLIC_API_BASE_URL=https://api.example.com \
  -e NUXT_PUBLIC_SITE_URL=https://studio.example.com \
  ghcr.io/easytv-ai/easytv-web:latest
```
