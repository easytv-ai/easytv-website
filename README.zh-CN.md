<div align="center">

# EasyTV Website

**[EasyTV](https://easytv.ai) 项目官网 —— 开源的 AI 短剧创作平台。**

[![CI](https://github.com/easytv-ai/easytv-website/actions/workflows/ci.yml/badge.svg)](https://github.com/easytv-ai/easytv-website/actions/workflows/ci.yml)
[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](LICENSE)
[![Nuxt 4](https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt.js&logoColor=white)](https://nuxt.com)

[English](README.md) · [简体中文](README.zh-CN.md) · [easytv.ai](https://easytv.ai)

</div>

一个静态的中英双语介绍页，外加 `/docs` 文档站：安装、四个产品仓库、网关对接与接口约定。基于 Nuxt 4、Tailwind CSS 4 与 `@nuxtjs/i18n`，部署在 Cloudflare。

## 开发

需要 Node.js 22.21+ 与 [pnpm](https://pnpm.io) 10+（`corepack enable`）。

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

```bash
pnpm typecheck      # vue-tsc
pnpm generate       # 静态产物在 .output/public
pnpm deploy         # generate + wrangler deploy
```

## 配置

| 变量 | 默认 | 说明 |
| --- | --- | --- |
| `NUXT_PUBLIC_SITE_URL` | `https://easytv.ai` | canonical、Open Graph、sitemap |
| `NUXT_PUBLIC_DEMO_URL` | `https://www.easytv.ai` | 「在线演示」链接 |

GitHub 组织地址在 `nuxt.config.ts`（`githubOrg`）。

## 改文案

介绍页文案在 `i18n/locales/zh.json` 与 `i18n/locales/en.json`。文档正文是 `content/docs/{zh,en}/` 下的 Markdown。UI 文案两种语言都要有，两套文档目录保持同步。

```
app/pages/index.vue        首页，按区块拼装
app/pages/docs/            文档首页与文章
app/components/Site*.vue   落地页区块
app/components/docs/       文档外壳
content/docs/              Markdown（中 / 英）
app/composables/useSite.ts 仓库链接与主题切换
i18n/locales/              落地页与文档界面文案
```

## 参与贡献

见 [CONTRIBUTING.md](CONTRIBUTING.md)、[SECURITY.md](SECURITY.md) 与 [CHANGELOG.md](CHANGELOG.md)。特别欢迎补充更多语言。

## 相关项目

| 仓库 | 说明 |
| --- | --- |
| [easytv-api](https://github.com/easytv-ai/easytv-api) | Go 后端 |
| [easytv-web](https://github.com/easytv-ai/easytv-web) | 创作台 |
| [easytv-manage](https://github.com/easytv-ai/easytv-manage) | 运营后台 |
| [easytv-partner](https://github.com/easytv-ai/easytv-partner) | 渠道后台 |

## 开源协议

[GNU Affero General Public License v3.0](LICENSE)。
