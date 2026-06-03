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

   For Supabase (recommended for this project), use the Transaction Pooler URI:

   ```env
   DATABASE_URL="postgresql://postgres.<project-ref>:<db-password>@aws-<region>.pooler.supabase.com:6543/postgres?sslmode=require"
   ```

   Notes:
   - Use your Supabase **Database Password** (not your Supabase account password).
   - URL-encode password special characters (for example `@` -> `%40`, `&` -> `%26`).
   - Keep `sslmode=require`.

   Prisma CLI note (important):
   - For migrations/introspection, set `DIRECT_URL` to Supabase **direct** connection (port 5432).
   - If the direct host is unreachable from your network, use Supabase **Session pooler** on port `5432` as `DIRECT_URL`.
   - Example:

   ```env
   DIRECT_URL="postgresql://postgres:<db-password>@db.<project-ref>.supabase.co:5432/postgres?sslmode=require"
   ```

   Session pooler fallback:

   ```env
   DIRECT_URL="postgresql://postgres.<project-ref>:<db-password>@aws-<region>.pooler.supabase.com:5432/postgres?sslmode=require"
   ```

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

   Re-running `npx prisma db seed` is idempotent (upserts by slug/section keys). Marketing pages still read `src/data/*` until the public read layer is wired. Do not auto-seed production.

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

**Server-only (never use `NEXT_PUBLIC_` prefix):** `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_SECRET`, and other secrets below.

| Variable | Cloudflare type | Notes |
|----------|-----------------|--------|
| `DATABASE_URL` | Secret | Supabase transaction pooler (port `6543`), `sslmode=require` |
| `DIRECT_URL` | Secret | Optional at runtime; needed for `prisma migrate` from CI |
| `NEXT_PUBLIC_SUPABASE_URL` | Plain | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Plain | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret | Server-only |
| `ADMIN_SECRET` | Secret | Admin API / middleware (Phase 2+) |
| `GARAGE_ENDPOINT` | Secret | S3-compatible endpoint |
| `GARAGE_ACCESS_KEY_ID` | Secret | |
| `GARAGE_SECRET_ACCESS_KEY` | Secret | |
| `GARAGE_BUCKET_NAME` | Secret | e.g. `qtodev-media` |
| `GARAGE_PUBLIC_URL` | Plain | Public CDN base URL |
| `RESEND_API_KEY` | Secret | |
| `RESEND_FROM_EMAIL` | Plain or Secret | |
| `RESEND_TO_EMAIL` | Plain or Secret | |
| `NEXT_PUBLIC_SITE_URL` | Plain | |
| `REVALIDATE_SECRET` | Secret | Bearer token for `POST /api/revalidate` |
| `PGSSL_REJECT_UNAUTHORIZED` | Plain | Optional; local TLS workaround |
| `UPSTASH_REDIS_REST_URL` | Secret | Optional; rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Secret | Optional; rate limiting |

CLI alternative for secrets: `wrangler secret put SUPABASE_SERVICE_ROLE_KEY` (repeat per secret).

**Admin CMS sign-in:** see [docs/admin-auth.md](docs/admin-auth.md) for Supabase Auth setup, creating the first admin user (`user_metadata.role: "admin"`), and local smoke tests.

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

### Prisma on Workers

`/api/contact` and `/api/requirements` use Prisma + `pg` on Workers with `nodejs_compat`. If writes fail in production, enable [Prisma Accelerate](https://www.prisma.io/data-platform/accelerate) or migrate those routes to the Supabase JS client. Do **not** set `export const runtime = "edge"` — it is [not supported by OpenNext on Cloudflare](https://opennext.js.org/cloudflare/get-started).

### Optional: ISR / revalidation cache

For `revalidatePath` and incremental caching to behave like Node hosting, enable R2 incremental cache in `open-next.config.ts` (see [OpenNext Cloudflare caching](https://opennext.js.org/cloudflare/caching)).
