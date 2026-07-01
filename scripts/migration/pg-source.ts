import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../node_modules/.prisma/pg-source-client";
import { requireDatabaseUrl } from "./env";

let pgClient: PrismaClient | undefined;
let pool: Pool | undefined;

function buildPool(connectionString: string): Pool {
  const url = new URL(connectionString);
  const sslMode = url.searchParams.get("sslmode");
  const usesTls =
    sslMode === "require" || sslMode === "verify-ca" || sslMode === "verify-full";
  url.searchParams.delete("sslmode");

  return new Pool({
    connectionString: url.toString(),
    ...(usesTls ? { ssl: { rejectUnauthorized: false } } : {}),
  });
}

export async function initPgSource(): Promise<PrismaClient> {
  if (pgClient) return pgClient;

  const connectionString = requireDatabaseUrl();
  pool = buildPool(connectionString);
  const adapter = new PrismaPg(pool);
  pgClient = new PrismaClient({ adapter });
  return pgClient;
}

export async function disconnectPgSource() {
  if (pgClient) {
    await pgClient.$disconnect();
    pgClient = undefined;
  }
  if (pool) {
    await pool.end();
    pool = undefined;
  }
}

export function getPgPool(): Pool {
  if (!pool) {
    throw new Error("Postgres pool not initialized. Call initPgSource() first.");
  }
  return pool;
}
