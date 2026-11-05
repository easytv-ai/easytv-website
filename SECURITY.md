# Security Policy

We take the security of EasyTV seriously. Thank you for helping keep the
project and its users safe.

## Supported Versions

EasyTV is pre-1.0. Only the latest commit on the default branch of each
repository receives security fixes.

| Version | Supported |
| ------- | --------- |
| default branch (`main`) | ✅ |
| older commits / forks | ❌ |

## Reporting a Vulnerability

**Please do not open a public issue for security problems.**

Use GitHub's private vulnerability reporting instead:

1. Open the repository on GitHub.
2. Go to **Security → Advisories → Report a vulnerability**.
3. Describe the issue, affected component, reproduction steps and impact.

You will get an acknowledgement within **3 business days** and a status update
at least every **7 days** until the report is resolved.

If you cannot use GitHub, email the maintainers at **leida@easyapi.com** with
`[SECURITY] easytv-website` in the subject line.

## What to Include

- The repository and commit / version you tested
- A minimal proof of concept or reproduction steps
- The impact you believe the issue has (XSS, open redirect, data exposure, …)
- Any suggested mitigation

## Disclosure Process

1. We confirm the report and assess severity (CVSS v3.1).
2. We develop and test a fix on a private branch.
3. We publish the fix, a GitHub Security Advisory and a `CHANGELOG.md` entry.
4. We credit the reporter unless they prefer to stay anonymous.

We ask reporters to give us up to **90 days** before public disclosure.

## Scope

This repository is the static project website (Nuxt generate + Cloudflare).

In scope:

- Pages, assets and client-side scripts in this repository
- The production site built from this repository (`easytv.ai`)
- CI workflows and the Wrangler deploy configuration it ships

Out of scope:

- The creator studio ([easytv-web](https://github.com/easytv-ai/easytv-web))
  and the hosted app at `www.easytv.ai`
- The API ([easytv-api](https://github.com/easytv-ai/easytv-api)) and admin
  console ([easytv-manage](https://github.com/easytv-ai/easytv-manage)) — report
  those in their own repositories
- Social engineering and denial of service against third-party infrastructure

## Security Notes for Deployers

- Never commit `.env` files. Only `.env.example` belongs in git.
- `NUXT_PUBLIC_*` values are baked into the static build and visible to every
  visitor. Do not put secrets there.
- Keep dependencies up to date; Dependabot is enabled on this repository.
