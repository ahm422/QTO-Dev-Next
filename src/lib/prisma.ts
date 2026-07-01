import { cache } from "react";
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getD1Session } from "@/lib/d1/session";

const getPrismaClient = cache(async (): Promise<PrismaClient> => {
  const session = await getD1Session();
  return new PrismaClient({
    adapter: new PrismaD1(session),
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
});

function createPrismaProxy(): PrismaClient {
  return new Proxy({} as PrismaClient, {
    get(_target, prop: string | symbol) {
      if (typeof prop === "symbol") return undefined;

      if (prop.startsWith("$") || prop === "then") {
        return (...args: unknown[]) =>
          getPrismaClient().then((client) => {
            const value = client[prop as keyof PrismaClient];
            if (typeof value === "function") {
              return (value as (...a: unknown[]) => unknown).call(client, ...args);
            }
            return value;
          });
      }

      return new Proxy({} as object, {
        get(_modelTarget, method: string | symbol) {
          if (typeof method === "symbol") return undefined;
          return (...args: unknown[]) =>
            getPrismaClient().then((client) => {
              const model = client[prop as keyof PrismaClient] as Record<
                string,
                (...a: unknown[]) => unknown
              >;
              const fn = model[method];
              if (typeof fn === "function") {
                return fn.call(model, ...args);
              }
              return fn;
            });
        },
      });
    },
  });
}

/** Per-request Prisma client backed by a D1 session (not a global singleton). */
export const prisma = createPrismaProxy();

/** For SSG/build paths: await Cloudflare context before using prisma. */
export async function getPrismaAsync(): Promise<PrismaClient> {
  await getCloudflareContext({ async: true });
  return getPrismaClient();
}
