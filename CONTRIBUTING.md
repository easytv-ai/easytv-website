# Contributing to EasyTV Website

Thanks for your interest in EasyTV! This document explains how to propose
changes to `easytv-website`. It applies to code, documentation, translations and
design assets alike.

> 中文读者：欢迎用中文提 Issue 和 PR。本指南的要求同样适用。

## Table of Contents

- [Ground Rules](#ground-rules)
- [Ways to Contribute](#ways-to-contribute)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Commit Messages](#commit-messages)
- [Pull Requests](#pull-requests)
- [Reporting Bugs](#reporting-bugs)
- [Proposing Features](#proposing-features)
- [Translations](#translations)
- [License](#license)

## Ground Rules

- Be kind. We follow the [Code of Conduct](CODE_OF_CONDUCT.md).
- Open an issue or discussion before starting large changes so we can agree on
  the direction and avoid duplicate work.
- Keep pull requests focused. One logical change per PR.
- Never commit secrets, credentials or production configuration. Only
  `.env.example` belongs in git.
- Security issues go through [SECURITY.md](SECURITY.md), not the issue tracker.

## Ways to Contribute

- Report bugs and request features through the issue templates.
- Improve documentation and translations.
- Fix a `good first issue` or `help wanted` ticket.
- Review open pull requests.
- Share what you built with EasyTV in Discussions.

## Development Setup

Requirements: Node.js 22.21+ and [pnpm](https://pnpm.io) 10+ (`corepack enable`
installs the version pinned in `package.json`). Use pnpm, not npm or cnpm.

```bash
git clone https://github.com/easytv-ai/easytv-website.git
cd easytv-website
pnpm install
pnpm dev            # http://localhost:3000
```

Local checks (CI runs exactly these):

```bash
pnpm typecheck      # vue-tsc
pnpm generate       # static build into .output/public
```

Marketing copy lives in `i18n/locales/{zh,en}.json`. Docs articles live in
`content/docs/zh/` and `content/docs/en/` as Markdown with a `title` /
`description` frontmatter. Keep both languages in the same pull request.


## Making Changes

1. Fork the repository and create a branch from `main`:
   `git checkout -b feat/short-description`
2. Make your change, including documentation or locale updates.
3. Run the local checks listed above. CI runs the same commands.
4. Push to your fork and open a pull request against `main`.

Core maintainers may push directly to `main`; everyone else uses pull
requests.

## Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <short summary>

<optional body: what and why, not how>
```

Common types: `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `build`,
`ci`, `chore`. Both English and Chinese summaries are welcome. Reference
issues in the body or footer (`Closes #123`).

## Pull Requests

- Fill in the pull request template. Describe **what** changed and **why**.
- Make sure CI is green. Fix `pnpm typecheck` and `pnpm generate` failures
  before requesting a review.
- Update `CHANGELOG.md` under **Unreleased** for user-visible changes.
- Keep the PR rebased on the latest `main`; we squash-merge.
- A maintainer will review within a week. Please respond to review comments or
  mark the PR as draft if you need more time.

## Reporting Bugs

Use the **Bug report** issue template. Include:

- The commit / version you are running and how you deployed it
- Exact steps to reproduce, expected and actual behavior
- Logs, screenshots or network traces with secrets removed

## Proposing Features

Use the **Feature request** template. Explain the problem you are solving, who
benefits, and any alternatives you considered. Small, well-scoped proposals are
much more likely to land.

## Translations

The site is bilingual (Simplified Chinese default, English under `/en`). Every
key must exist in both `i18n/locales/zh.json` and `i18n/locales/en.json`.
Additional languages are welcome: add a locale file, register it in
`nuxt.config.ts` and open a pull request.


## License

By contributing you agree that your contributions will be licensed under the
[GNU Affero General Public License v3.0](LICENSE), the same license that
covers the project. You confirm that you have the right to submit the work
under that license (see the
[Developer Certificate of Origin](https://developercertificate.org/)).
