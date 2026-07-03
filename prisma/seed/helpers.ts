/** Seed writes must use primary — never replica routing via Sessions API. */
import { PrismaClient } from "@prisma/client";
import {
  disconnectD1Target,
  initD1Target,
} from "../../scripts/migration/d1-target";
import { parseCliD1Target, type D1Target } from "../../scripts/migration/cli";

/** Prisma client — available after initSeedPrisma() has been awaited. */
export let prisma: PrismaClient;

/** Resolve --d1=local|staging|remote from CLI (default: local). */
export function resolveSeedD1Target(explicitTarget?: D1Target): D1Target {
  return explicitTarget ?? parseCliD1Target("local");
}

/** Initialize D1-backed Prisma for seed scripts. Call once at the start of main(). */
export async function initSeedPrisma(explicitTarget?: D1Target): Promise<PrismaClient> {
  const target = resolveSeedD1Target(explicitTarget);
  const client = await initD1Target(target);
  prisma = client;
  return client;
}

export async function disconnect() {
  await disconnectD1Target();
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
