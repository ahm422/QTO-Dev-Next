import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaPgPool?: Pool;
};

const cloudflareContextSymbol = Symbol.for("__cloudflare-context__");

function getHyperdriveConnectionString(): string | undefined {
  const ctx = (globalThis as Record<symbol, unknown>)[cloudflareContextSymbol] as
    | { env?: CloudflareEnv }
    | undefined;
  if (!ctx?.env?.HYPERDRIVE) return undefined;
  try {
    return ctx.env.HYPERDRIVE.connectionString;
  } catch {
    return undefined;
  }
}

function getConnectionString(): string {
  const hyperdriveUrl = getHyperdriveConnectionString();
  if (hyperdriveUrl) return hyperdriveUrl;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not set");

  const url = new URL(databaseUrl);
  const sslMode = url.searchParams.get("sslmode");
  const usesTls = sslMode === "require" || sslMode === "verify-ca" || sslMode === "verify-full";
  const rejectUnauthorized = process.env.PGSSL_REJECT_UNAUTHORIZED === "true";
  if (!usesTls || rejectUnauthorized) return databaseUrl;

  url.searchParams.set("sslmode", "no-verify");
  return url.toString();
}

const pool =
  globalForPrisma.prismaPgPool ??
  new Pool({ connectionString: getConnectionString() });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg(pool),
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaPgPool = pool;
}
