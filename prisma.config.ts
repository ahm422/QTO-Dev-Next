import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma CLI (validate, generate) does not require a live DB connection.
// Schema changes are applied via migrations/d1/ + wrangler d1 migrations apply.
// Optional PRISMA_SQLITE_URL for introspection (prisma db pull) against local D1 SQLite.
const datasourceUrl =
  process.env.PRISMA_SQLITE_URL ?? "file:./.wrangler/local-d1.sqlite";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "migrations/d1",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: datasourceUrl,
  },
});
