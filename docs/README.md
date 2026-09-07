# QTO Dev — Documentation

This folder holds all project documentation, split into two tracks.

| Folder | Audience | Contents |
|--------|----------|----------|
| [`technical/`](./technical/) | Developers who will maintain or extend the codebase | Architecture, project structure, database schema/ERD, API reference, auth, environment variables, third-party services, deployment, local setup, known issues & tech debt |
| [`non-technical/`](./non-technical/) | The client and their staff | Plain-language product overview, screen-by-screen site walkthrough, admin dashboard user guide, step-by-step common tasks, glossary |
| [`technical/archive/`](./technical/archive/) | Historical reference only | Point-in-time migration plans and phase checklists from the build. Kept for context; **not** maintained. |

## Project at a glance

- **What it is:** the QTO Dev marketing website (`qtodev.com`) plus a built-in admin CMS that controls almost every piece of content on the public site, an Employee HR / digital-badge module, and lead-capture forms.
- **Stack:** Next.js 16 (App Router, React 19) deployed to **Cloudflare Workers** via OpenNext. Data in **Cloudflare D1** (SQLite) through Prisma. Media in **Cloudflare R2**. Transactional email through **Cloudflare Email Service**.
- **Repo:** `ahm422/QTO-Dev-Next` (Gitea at `github.com`, mirrored to GitHub).
- **Environments:** production Worker `qto-dev-next` (`qtodev.com`) and staging Worker `qtodev-site-staging`.

## Where to start

- **New developer:** [`technical/09-local-development.md`](./technical/09-local-development.md) → [`technical/01-architecture.md`](./technical/01-architecture.md).
- **Deploying / infra owner:** [`technical/08-deployment.md`](./technical/08-deployment.md) and [`technical/07-third-party-services.md`](./technical/07-third-party-services.md).
- **Client / content editor:** [`non-technical/01-product-overview.md`](./non-technical/01-product-overview.md) → [`non-technical/03-admin-dashboard-guide.md`](./non-technical/03-admin-dashboard-guide.md).
