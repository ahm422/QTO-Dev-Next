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

## Prisma Setup

1. Copy the example env file and update your database connection:

```bash
cp .env.example .env
```

2. Set `DATABASE_URL` in `.env` to your PostgreSQL connection string.

   **Local dev** (Docker Compose — `npm run db:up`):

   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/qtodev"
   DIRECT_URL="postgresql://postgres:postgres@localhost:5432/qtodev"
   ```

   **Self-hosted production:** use your server's connection string in CI/local `.env` for Prisma migrations only. The deployed Worker uses [Cloudflare Hyperdrive](#postgresql-on-workers-hyperdrive) (not `DATABASE_URL`).

3. Generate the Prisma Client:

```bash
npm run prisma:generate
```

4. Validate Prisma setup:

```bash
npm run prisma:validate
```

5. Create/apply migrations after adding models to `prisma/schema.prisma`:

```bash
npm run prisma:migrate:dev -- --name init
```

   Phase 2 CMS models (18 tables): see [docs/phase2-schema.md](docs/phase2-schema.md) for migration name, seed command, and dev-only `npx prisma db seed`.

   **Phase 3 (dev/staging):** apply migration `20260602163327_add_cms_content_models`, then populate CMS tables from static data:

   ```bash
   npm run prisma:migrate:dev -- --name add_cms_content_models
   npx prisma db seed
   npx tsx scripts/verify-seed-counts.ts
   ```

   Re-running `npx prisma db seed` is idempotent (upserts by slug/section keys). **Phase 7:** public marketing routes read CMS content via Prisma in Server Components (`src/lib/cms/*`), with ISR (`revalidate = 3600` on `(qtodev)` layout) and `revalidatePath` on admin writes. `src/data/*` remains for seed scripts only. Do not auto-seed production.

6. Optional connectivity smoke test:

```bash
npx prisma db pull
```

## Deploy on Cloudflare Workers

This app uses [@opennextjs/cloudflare](https://opennext.js.org/cloudflare) and deploys as a **Cloudflare Worker** (not static Pages export).

### Cloudflare dashboard (Git integration)

| Setting | Value |
|--------|--------|
| Build command | `npx opennextjs-cloudflare build` or `npm run cf:build` |
| Deploy command | `npx wrangler deploy` (or `npm run deploy` in CI after build) |
| Output directory | `.open-next` |

`opennextjs-cloudflare build` runs `next build` internally. Prisma Client is generated via `postinstall` (`prisma generate`); run `npm install` before the first Cloudflare build if the client is missing.

### Environment variables

Where to set values:

| Environment | File / location |
|-------------|-----------------|
| Next.js dev (`npm run dev`) | [`.env`](.env) — copy from [`.env.example`](.env.example) |
| Wrangler preview (`npm run preview`) | [`.dev.vars`](.dev.vars) — copy from [`.dev.vars.example`](.dev.vars.example) |
| Production / Preview on Cloudflare | **Workers → Settings → Variables and Secrets** for `qtodev-site` |

Copy from `.env.example` / `.dev.vars.example` into the Cloudflare dashboard (Production and Preview if used). Never commit real secrets.

**Server-only (never use `NEXT_PUBLIC_` prefix):** `JWT_ACCESS_SECRET`, `REVALIDATE_SECRET`, Garage/Resend keys, and other secrets below.

**Secrets** (encrypted — `wrangler secret put <NAME>` or dashboard Secrets):

| Variable | Notes |
|----------|--------|
| `DATABASE_URL` | **Preview fallback only** — when Hyperdrive binding is unavailable. Remove from Workers after Hyperdrive is verified in prod. |
| `JWT_ACCESS_SECRET` | JWT signing secret (`openssl rand -hex 64`) |
| `CRON_SECRET` | Bearer token for `GET /api/cron/cleanup-tokens` (`openssl rand -hex 32`) |
| `REVALIDATE_SECRET` | Bearer token for `POST /api/revalidate` (`openssl rand -hex 32`) |
| `RESEND_API_KEY` | Resend transactional email |
| `UPSTASH_REDIS_REST_URL` | **Required in production** — in-memory rate limit is dev-only |
| `UPSTASH_REDIS_REST_TOKEN` | **Required in production** |
| `GARAGE_ENDPOINT` | S3-compatible endpoint |
| `GARAGE_REGION` | e.g. `garage` |
| `GARAGE_ACCESS_KEY_ID` | |
| `GARAGE_SECRET_ACCESS_KEY` | |
| `GARAGE_BUCKET_NAME` | e.g. `qto-dev` |

**Plain variables** (Workers → Settings → Variables, or `[vars]` in `wrangler.toml`):

| Variable | Notes |
|----------|--------|
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, auth redirects |
| `GARAGE_PUBLIC_URL` | Public CDN base URL |
| `RESEND_FROM_EMAIL` | Verified domain sender |
| `RESEND_TO_EMAIL` | Internal notification recipient |
| `PGSSL_REJECT_UNAUTHORIZED` | `true` in production; `false` locally |

**Bindings / local-only:**

| Variable | Notes |
|----------|--------|
| `HYPERDRIVE` | Production DB access via [`wrangler.toml`](wrangler.toml) — create with [`scripts/create-hyperdrive.sh`](scripts/create-hyperdrive.sh) |
| `DB` | D1 database (`qtodev-d1`) — provisioned; app uses in Phase 3+ ([docs/d1-provisioning.md](docs/d1-provisioning.md)) |
| `MEDIA` | R2 bucket (`qtodev-media`) — provisioned; app uses in Phase 3+ |
| `DIRECT_URL` | Local/CI only — `prisma migrate` and seed scripts |

CLI: `wrangler secret put JWT_ACCESS_SECRET` (repeat per secret). Verify: `npm run secrets:verify`.

**Not used:** `JWT_REFRESH_SECRET` (opaque refresh tokens in Postgres), `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` (use `GARAGE_*`).

**Admin CMS sign-in:** see [docs/admin-auth.md](docs/admin-auth.md) for custom JWT auth, `npm run admin:create-user`, and local smoke tests.

### Local development

**Next.js dev server** (default):

```bash
cp .env.example .env   # fill values
npm run dev
```

**Workers runtime preview** (matches production runtime):

```bash
cp .dev.vars.example .dev.vars   # fill values
npm run preview
```

### PostgreSQL on Workers (Hyperdrive)

Cloudflare Workers cannot open raw TCP connections to PostgreSQL. Production uses **Hyperdrive** (`HYPERDRIVE` binding in [`wrangler.toml`](wrangler.toml)); [`src/lib/prisma.ts`](src/lib/prisma.ts) reads `ctx.env.HYPERDRIVE.connectionString` on Workers and falls back to `DATABASE_URL` for `npm run dev` / preview.

**One-time setup** (PostgreSQL origin must be **publicly reachable** — not `localhost` or `192.168.x.x`):

```bash
export DB_PASSWORD='your-postgres-password'
./scripts/create-hyperdrive.sh \
  --host db.your-domain.com \
  --port 5432 \
  --user postgres \
  --database qtodev
npm run cf-typegen
```

Or pass a full URL: `export HYPERDRIVE_ORIGIN_URL='postgresql://...'` then `./scripts/create-hyperdrive.sh`.

After Hyperdrive is verified in production, remove `DATABASE_URL` from Workers → Variables and Secrets. Keep `DATABASE_URL` / `DIRECT_URL` in `.env` for local dev and Prisma CLI.

Do **not** set `export const runtime = "edge"` on Prisma routes — [not supported by OpenNext on Cloudflare](https://opennext.js.org/cloudflare/get-started).

### D1 + R2 (migration in progress)

D1 (`DB`) and R2 (`MEDIA`) bindings are provisioned in [`wrangler.toml`](wrangler.toml) for the Postgres → D1 migration. **Production still reads/writes via Hyperdrive** until cutover (Phase 7). Provisioning commands, migration apply, and verification: [docs/d1-provisioning.md](docs/d1-provisioning.md).

### Optional: ISR / revalidation cache

For `revalidatePath` and incremental caching to behave like Node hosting, enable R2 incremental cache in `open-next.config.ts` (see [OpenNext Cloudflare caching](https://opennext.js.org/cloudflare/caching)).
