---
title: License
description: When to use AGPL-3.0 versus the commercial license, and which repos ship commercial terms.
---

The product repositories are **AGPL-3.0 + commercial** dual-licensed:

| Repo | License |
| --- | --- |
| easytv-api / web / manage / partner | AGPL-3.0, plus a commercial template |
| easytv-website | AGPL-3.0 only (marketing site, not sold) |

## When AGPL is enough

Study, modify and self-host, and follow AGPL (publish corresponding source if you offer a modified version as a network service). **AGPL allows commercial use**; it is copyleft for network use.

## When you need a commercial license

A closed-source product, or a hosted / white-label modified version without those source obligations. `COMMERCIAL-LICENSE.md` in each product repo is a template; it applies after you sign an Order.

Email [leida@easyapi.com](mailto:leida@easyapi.com) with `[LICENSE] easytv-api` (or the repo you need) in the subject.

## Third parties

- The director stage is a port of [open-director](https://github.com/x1n9/open-director) (MIT)
- User / payment / object-storage structure in the API follows [New API](https://github.com/QuantumNous/new-api) / [One API](https://github.com/songquanpeng/one-api) (AGPL-3.0). **A commercial license does not relicense those parts**
- npm / Go dependencies keep their own licenses
