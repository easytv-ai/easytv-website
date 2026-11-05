---
title: Changelog
description: What the docs site and the four product repos added recently. Full notes live in each CHANGELOG.md.
---

This page is the docs-visible slice. Each product repo keeps its own `CHANGELOG.md`.

## Docs site easytv-website

- Bilingual docs at `/docs` and `/en/docs`: Start, Install, Guides, API reference, Reference
- Theme follows the homepage; docs no longer force dark
- Architecture labels no longer overlap the API / gateway boxes
- pnpm, AGPL-3.0, contributing and security notes

## Studio easytv-web

- Docker image and runtime `NUXT_PUBLIC_*`
- Dual license: AGPL-3.0 plus a commercial template
- Media-proxy allow-list now comes from runtime config

## API easytv-api

- Contract is still `API.md` in that repo (through chapter 38)
- Generation only talks to an EasyAPI / New API compatible gateway
- Credits reserved from `model_price`, refunded on fail or cancel

Unreleased work is the `[Unreleased]` section of each repo changelog.
