import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

function getPoolConnectionString() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return databaseUrl;

  const rejectUnauthorized = process.env.PGSSL_REJECT_UNAUTHORIZED === "true";
  const url = new URL(databaseUrl);
  const sslMode = url.searchParams.get("sslmode");
  const usesTls =
    sslMode === "require" || sslMode === "verify-ca" || sslMode === "verify-full";

  if (!usesTls || rejectUnauthorized) return databaseUrl;

  url.searchParams.set("sslmode", "no-verify");
  return url.toString();
}

const pool = new Pool({ connectionString: getPoolConnectionString() });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });

export async function disconnect() {
  await prisma.$disconnect();
  await pool.end();
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function upsertBy<T extends { id: string }>(
  find: () => Promise<T | null>,
  create: () => Promise<T>,
  update: (existing: T) => Promise<T>
): Promise<T> {
  const existing = await find();
  if (existing) return update(existing);
  return create();
}
