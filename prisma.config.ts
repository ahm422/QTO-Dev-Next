import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Prisma CLI (migrations/status) must use a non-transaction-pooler connection.
    // In this environment the true direct host (db.<ref>.supabase.co:5432) is not reachable,
    // so DIRECT_URL should point to the *session pooler* (5432).
    url: env("DIRECT_URL"),
  },
});
