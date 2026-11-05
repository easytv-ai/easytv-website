---
title: 项目介绍
description: 四个产品仓库各自做什么、默认端口，以及官网不在创作链路上。
---

EasyTV 拆成四个可独立部署的仓库，共用一份 [接口契约](/docs/api)。改接口先改 `easytv-api/API.md`，再改三个前端。

![创作台](/images/docs/studio.png)

## 仓库

| 仓库 | 做什么 | 默认端口 | 文档 |
| --- | --- | --- | --- |
| [easytv-api](https://github.com/easytv-ai/easytv-api) | Go 后端：鉴权、画布、任务、计费、存储、网关适配 | 8383 | [API 参考](/docs/api) |
| [easytv-web](https://github.com/easytv-ai/easytv-web) | 创作台：画布、一句话成片、导演台、社区 | 3005 | [创作台](/docs/studio) |
| [easytv-manage](https://github.com/easytv-ai/easytv-manage) | 运营后台：用户、审核、定价、网关、增长 | 3006 | [运营后台](/docs/admin) |
| [easytv-partner](https://github.com/easytv-ai/easytv-partner) | 渠道伙伴自助后台：返佣、提现、物料 | 3010 | [渠道后台](/docs/partner) |

官网 [easytv-website](https://github.com/easytv-ai/easytv-website) 只做介绍和这份文档，不参与生成。

## 谁调谁

```
easytv-web      ──┐
easytv-manage   ──┼──▶  easytv-api  ── MySQL / Redis / 对象存储
easytv-partner  ──┘         │
                            ▼
                    New API 兼容网关
```

三端都用 `Authorization: Bearer` + `EasyTV-User`。运营后台再加 `role ≥ 10`。模型请求不直连厂商，一律走你配置的网关。

## 本地怎么开

四个仓库都在本机时，按端口打开即可。Docker Compose `--profile full` 会拉起 API、创作台和运营后台；渠道后台要单独 `pnpm dev`。步骤见 [快速开始](/docs/quickstart) 和 [源码运行](/docs/install-source)。
