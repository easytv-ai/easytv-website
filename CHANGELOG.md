# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `SUPPORT.md`, release-notes categories (`.github/release.yml`), label sync, stale bot, Conventional Commits PR-title check and OpenSSF Scorecard workflow.
- Open-source governance: AGPL-3.0 license, contributing guide, code of
  conduct, security policy, issue and pull request templates, Dependabot and
  GitHub Actions CI.

### Fixed

- `pnpm typecheck` is clean again (`htmlAttrs` typing, Node types, removed the obsolete i18n `lazy` option) and now runs in CI.
- Architecture diagram: edge labels no longer overlap the API and gateway boxes.

### Changed

- Switched to pnpm (`pnpm-lock.yaml`), matching the other EasyTV repositories.
- README rewritten (English + 简体中文).
- Security policy, contributing guide and issue / PR templates now describe this
  static website (no Docker, database or test runner). Required Node.js is 22.21+.

[Unreleased]: https://github.com/easytv-ai/easytv-website/commits/main
