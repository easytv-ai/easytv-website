<div align="center">

# EasyTV Website

**Project website for [EasyTV](https://easytv.ai) — the open-source AI short-drama studio.**

[![CI](https://github.com/easytv-ai/easytv-website/actions/workflows/ci.yml/badge.svg)](https://github.com/easytv-ai/easytv-website/actions/workflows/ci.yml)
[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](LICENSE)
[![Nuxt 4](https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt.js&logoColor=white)](https://nuxt.com)

[English](README.md) · [简体中文](README.zh-CN.md) · [easytv.ai](https://easytv.ai)

</div>

A static, bilingual (中文 / English) landing page that explains what EasyTV is,
shows the pipeline and showcase, and links to the repositories. Built with
Nuxt 4, Tailwind CSS 4 and `@nuxtjs/i18n`, deployed to Cloudflare.

## Development

Requires Node.js 22.21+ and [pnpm](https://pnpm.io) 10+ (`corepack enable`).

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

```bash
pnpm typecheck      # vue-tsc
pnpm generate       # static output in .output/public
pnpm deploy         # generate + wrangler deploy
```

## Configuration

| Variable | Default | Description |
| --- | --- | --- |
| `NUXT_PUBLIC_SITE_URL` | `https://easytv.ai` | Canonical URL, Open Graph, sitemap |
| `NUXT_PUBLIC_DEMO_URL` | `https://www.easytv.ai` | "Live demo" link target |

The GitHub organisation link is set in `nuxt.config.ts` (`githubOrg`).

## Editing content

All copy lives in `i18n/locales/zh.json` and `i18n/locales/en.json`; components
only read from those files. Add every key to both locales. Showcase images are
in `public/images/showcase/`.

```
app/pages/index.vue        home page, assembled from sections
app/components/Site*.vue   one component per section
app/composables/useSite.ts repository links and theme toggle
i18n/locales/              copy
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md) and
[CHANGELOG.md](CHANGELOG.md). Translations into additional languages are
especially welcome.

## Related Projects

| Repository | Description |
| --- | --- |
| [easytv-api](https://github.com/easytv-ai/easytv-api) | Go backend |
| [easytv-web](https://github.com/easytv-ai/easytv-web) | Creator studio |
| [easytv-manage](https://github.com/easytv-ai/easytv-manage) | Admin console |

## License

[GNU Affero General Public License v3.0](LICENSE).
