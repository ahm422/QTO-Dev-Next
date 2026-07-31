This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Prisma + D1 setup

1. Copy the example env files:

```bash
cp .env.example .env
cp .dev.vars.example .dev.vars
```

2. Apply local D1 migrations and seed:

```bash
npm run d1:setup
```

   This runs `wrangler d1 migrations apply qtodev-d1 --local` then `prisma db seed`. Re-running seed is idempotent (upserts by slug/section keys). **Do not auto-seed production.**

3. Generate the Prisma Client (also runs on `npm install` via `postinstall`):

```bash
npm run prisma:generate
```

4. Validate Prisma setup:

```bash
npm run prisma:validate
```

5. **Schema changes** — edit `prisma/schema.prisma`, then:

```bash
npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script > migrations/d1/NNNN_description.sql
npm run d1:migrate:local
```

   Phase 2 CMS models (18 tables): see [docs/phase2-schema.md](docs/phase2-schema.md) for seed command and verification.

6. Verify seed counts:

```bash
npm run verify:seed-counts
```

7. **Production deploy** — apply remote migrations before or at deploy:

```bash
npm run d1:migrate:remote
npm run deploy
```

8. **Admin bootstrap:**

```bash
npm run admin:create-user -- --d1=local --email=you@example.com
```

### Staging bootstrap

Populate remote staging D1 (`qtodev-d1-staging`) for end-to-end QA on `qtodev-site-staging`. **Do not run these against production `qtodev-d1`.**

```bash
# 1. Schema + CMS seed on staging D1 (local file → sync to remote)
npm run d1:setup:staging

# 2. Verify CMS row counts
npm run verify:seed-counts:staging

# 3. Create first admin (local staging file), then sync to remote
npm run admin:create-user -- \
  --d1=staging \
  --email=you@example.com \
  --password='ChooseAStrongPassword123!' \
  --role=super_admin
npm run d1:sync:staging

# 4. Confirm staging Worker secrets (JWT required for login)
npm run secrets:verify:staging

# 5. Deploy if secrets or env changed
npm run deploy:staging
```

Staging URL: `https://qtodev-site-staging.your-subdomain.workers.dev/admin/login`

Canonical infrastructure doc: [docs/d1-provisioning.md](docs/d1-provisioning.md).

## Deploy on Cloudflare Workers

This app uses [@opennextjs/cloudflare](https://opennext.js.org/cloudflare) and deploys as a **Cloudflare Worker** (not static Pages export).

### Cloudflare dashboard (Git integration)

| Setting | Value |
|--------|--------|
| Build command | `npm run cf:build` (sets `SKIP_BUILD_TIME_D1=1` so Workers Builds does not need a migrated local D1 during `generateStaticParams`) |
| Deploy command | `npx wrangler deploy` (or `npm run deploy` in CI after build) |
| Output directory | `.open-next` |
| Worker name | Must match `wrangler.toml`: **`qto-dev-next`** |

`npm run cf:build` runs OpenNext (`opennextjs-cloudflare build` → `next build`) with D1 skipped at build time; CMS routes resolve against the bound remote D1 (`qtodev-d1` / `YOUR_D1_DATABASE_ID`) at runtime. Prisma Client is generated via `postinstall` (`prisma generate`).

**Do not** set `DATABASE_URL` / Postgres for this app — runtime Prisma uses the D1 `DB` binding only.

### Environment variables

Where to set values:

| Environment | File / location |
|-------------|-----------------|
| Next.js dev (`npm run dev`) | [`.env`](.env) — copy from [`.env.example`](.env.example) |
| Wrangler preview (`npm run preview`) | [`.dev.vars`](.dev.vars) — copy from [`.dev.vars.example`](.dev.vars.example) |
| Production / Preview on Cloudflare | **Workers → Settings → Variables and Secrets** for `qto-dev-next` |

Copy from `.env.example` / `.dev.vars.example` into the Cloudflare dashboard (Production and Preview if used). Never commit real secrets.

**Server-only (never use `NEXT_PUBLIC_` prefix):** `JWT_ACCESS_SECRET`, `REVALIDATE_SECRET`, Garage/Resend keys, and other secrets below.

**Secrets** (encrypted — `wrangler secret put <NAME>` or dashboard Secrets):

| Variable | Notes |
|----------|--------|
| `JWT_ACCESS_SECRET` | JWT signing secret (`openssl rand -hex 64`) |
| `CRON_SECRET` | Bearer token for `GET /api/cron/cleanup-tokens` (`openssl rand -hex 32`) |
| `REVALIDATE_SECRET` | Bearer token for `POST /api/revalidate` (`openssl rand -hex 32`) |
| `UPSTASH_REDIS_REST_URL` | **Required in production** — in-memory rate limit is dev-only |
| `UPSTASH_REDIS_REST_TOKEN` | **Required in production** |
| `R2_S3_ENDPOINT` | S3-compatible R2 API endpoint |
| `R2_REGION` | `auto` |
| `R2_ACCESS_KEY_ID` | R2 API token access key |
| `R2_SECRET_ACCESS_KEY` | R2 API token secret |
| `R2_BUCKET_NAME` | e.g. `qtodev-media` |

**Plain variables** (Workers → Settings → Variables, or `[vars]` in `wrangler.toml`):

| Variable | Notes |
|----------|--------|
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, auth redirects |
| `R2_PUBLIC_URL` | Public CDN base URL for uploaded media |
| `EMAIL_FROM` | Sender on `qtodev.com` (e.g. `noreply@qtodev.com`; staging: `staging@qtodev.com`) |
| `EMAIL_ADMIN_TO` | Internal notification recipient |

**Bindings:**

| Binding | Notes |
|----------|--------|
| `DB` | D1 database (`qtodev-d1`) — see [docs/d1-provisioning.md](docs/d1-provisioning.md) |
| `MEDIA` | R2 bucket (`qtodev-media`) |
| `EMAIL` | Cloudflare Email Service (`[[send_email]]`) — no API key |

CLI: `wrangler secret put JWT_ACCESS_SECRET` (repeat per secret). Verify: `npm run secrets:verify`.

**Not used:** `JWT_REFRESH_SECRET` (opaque refresh tokens in D1), `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` (use `R2_*`).

**Admin CMS sign-in:** see [docs/admin-auth.md](docs/admin-auth.md) for custom JWT auth, `npm run admin:create-user`, and local smoke tests.

### Local development

**Next.js dev server** (UI only — no D1 binding):

```bash
cp .env.example .env   # fill values
npm run dev
```

**Workers runtime preview** (matches production — D1 + R2):

```bash
cp .dev.vars.example .dev.vars   # fill values
npm run d1:setup
npm run preview
```

Do **not** set `export const runtime = "edge"` on Prisma routes — [not supported by OpenNext on Cloudflare](https://opennext.js.org/cloudflare/get-started).

### Optional: ISR / revalidation cache

For `revalidatePath` and incremental caching to behave like Node hosting, enable R2 incremental cache in `open-next.config.ts` (see [OpenNext Cloudflare caching](https://opennext.js.org/cloudflare/caching)).
