import "dotenv/config";
import { defineConfig } from "prisma/config";

// Used by Prisma CLI (migrate, db pull, etc.). `prisma generate` does not connect to the DB,
// but the config file is still loaded — so avoid hard-failing when DIRECT_URL is unset (e.g. CI).
const datasourceUrl =
  process.env.DIRECT_URL ??
  process.env.DATABASE_URL ??
  "postgresql://localhost:5432/postgres";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Prisma CLI (migrations/status) uses DIRECT_URL or DATABASE_URL from .env — not Hyperdrive.
    url: datasourceUrl,
  },
});
