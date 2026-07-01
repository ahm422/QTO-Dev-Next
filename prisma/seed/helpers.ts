import { getPlatformProxy } from "wrangler";
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

let prismaInstance: PrismaClient | undefined;
let disposeProxy: (() => Promise<void>) | undefined;

/** Initialize D1-backed Prisma for seed scripts. Call once at the start of main(). */
export async function initSeedPrisma(): Promise<PrismaClient> {
  if (prismaInstance) return prismaInstance;

  const { env, dispose } = await getPlatformProxy<CloudflareEnv>({
    configPath: "./wrangler.toml",
  });
  disposeProxy = dispose;

  if (!env.DB) {
    throw new Error(
      "D1 binding (DB) not found. Run `wrangler d1 migrations apply qtodev-d1 --local` first."
    );
  }

  prismaInstance = new PrismaClient({ adapter: new PrismaD1(env.DB) });
  prisma = prismaInstance;
  return prismaInstance;
}

/** Prisma client — available after initSeedPrisma() has been awaited. */
export let prisma: PrismaClient;

export async function disconnect() {
  if (prismaInstance) {
    await prismaInstance.$disconnect();
    prismaInstance = undefined;
  }
  if (disposeProxy) {
    await disposeProxy();
    disposeProxy = undefined;
  }
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
