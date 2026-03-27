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
   - With Prisma 7 config, run CLI commands by temporarily overriding `DATABASE_URL` with `DIRECT_URL`.
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
DATABASE_URL="$DIRECT_URL" npm run prisma:validate
```

5. Create/apply migrations after adding models to `prisma/schema.prisma`:

```bash
npm run prisma:migrate:dev -- --name init
```

6. Optional connectivity smoke test:

```bash
DATABASE_URL="$DIRECT_URL" npx prisma db pull
```
