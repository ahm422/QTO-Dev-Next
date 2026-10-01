# QTO Dev — Marketing Site & Admin CMS

The website for [QTO Dev](https://qtodev.com), a software development company, together with a built-in admin CMS that manages almost all of the public content.

## Features

- **Marketing site:** home, services, projects, products, blog, about, careers and contact pages, with SEO metadata, sitemap and robots rules
- **Admin CMS:** create, edit and publish services, projects, products, blog posts (rich-text editor), FAQs, team, testimonials, site settings and page sections, with media uploads to object storage
- **Lead capture:** contact and requirements forms, with rate limiting and email notifications
- **Employee HR module:** employee records, PDF export, and public QR-code verification badges
- **Auth:** custom JWT access tokens with rotating refresh tokens, role-based access, password reset, session management and an audit log
- **Chatbot (optional):** a retrieval-augmented chat assistant, run as a separate Cloudflare Worker (see [`chatbot/`](chatbot/))

## Tech stack

| Area | Technology |
|------|------------|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| UI | Tailwind CSS, Radix UI / shadcn/ui, Framer Motion, Tiptap |
| Hosting | Cloudflare Workers via [OpenNext](https://opennext.js.org/cloudflare) |
| Database | Cloudflare D1 (SQLite) through Prisma (`@prisma/adapter-d1`) |
| Media | Cloudflare R2 |
| Email | Cloudflare Email Service (`send_email` binding), React Email templates |
| Rate limiting | Upstash Redis (in-memory fallback in development) |
| Tests | Vitest |

## Project layout

```
src/
  app/          Routes: (qtodev) public site, admin/, api/, employee/
  components/   UI components (public site and admin)
  lib/          Data access, auth, CMS mappers, email, utilities
  services/     Server-side business logic
  content/      Static fallback content
  emails/       React Email templates
prisma/         Prisma schema and seed
migrations/d1/  D1 SQL migrations
scripts/        Setup, migration and admin scripts
chatbot/        Standalone chatbot service and its Cloudflare Worker
docs/           User guides for content editors
```

## Local development

Requirements: Node.js 20+ and npm.

```bash
npm install
cp .env.example .env              # Next.js dev server
cp .dev.vars.example .dev.vars    # Wrangler / Workers preview
npm run d1:setup                  # apply local D1 migrations and seed
npm run dev                       # http://localhost:3000
```

Create a local admin user:

```bash
npm run admin:create-user -- --d1=local --email=you@example.com
```

To run the app in the Workers runtime (D1 + R2 bindings, like production):

```bash
npm run preview
```

### Useful scripts

| Script | What it does |
|--------|--------------|
| `npm run dev` | Next.js dev server |
| `npm run preview` | Build and run in the local Workers runtime |
| `npm test` | Run the Vitest suite |
| `npm run lint` | ESLint |
| `npm run d1:setup` | Apply local D1 migrations and seed data |
| `npm run d1:migrate:local` | Apply local D1 migrations only |
| `npm run prisma:generate` | Regenerate the Prisma client |

### Schema changes

Edit `prisma/schema.prisma`, then generate a D1 migration and apply it locally:

```bash
npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script > migrations/d1/NNNN_description.sql
npm run d1:migrate:local
```

## Deployment

The app deploys as a Cloudflare Worker. To deploy your own copy:

1. Create a D1 database, an R2 bucket, and (optionally) a KV namespace for the chatbot.
2. Replace the placeholders in `wrangler.toml` and `chatbot/worker/wrangler.jsonc` (`YOUR_CLOUDFLARE_ACCOUNT_ID`, `YOUR_D1_DATABASE_ID`, `YOUR_KV_NAMESPACE_ID`, …), plus the site URL and email addresses under `[vars]`.
3. Set the secrets listed in `.dev.vars.example` with `wrangler secret put <NAME>`. At minimum you need `JWT_ACCESS_SECRET`, `CRON_SECRET`, `REVALIDATE_SECRET`, the `R2_*` values and the Upstash Redis credentials.
4. Apply migrations and deploy:

```bash
npm run d1:migrate:remote
npm run deploy
```

Never commit real secrets. `.env` and `.dev.vars` are git-ignored.

## Documentation

- [`docs/non-technical/`](docs/non-technical/): plain-language guides to the site and the admin dashboard
- [`chatbot/README.md`](chatbot/README.md): the chatbot service
