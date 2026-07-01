import { getPlatformProxy } from "wrangler";
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import type { D1Target } from "./cli";

let d1Client: PrismaClient | undefined;
let disposeProxy: (() => Promise<void>) | undefined;
let currentTarget: D1Target | undefined;

function proxyOptions(target: D1Target) {
  switch (target) {
    case "local":
      return { configPath: "./wrangler.toml", remoteBindings: false as const };
    case "staging":
      return {
        configPath: "./wrangler.toml",
        environment: "staging",
        remoteBindings: true as const,
      };
    case "remote":
      return { configPath: "./wrangler.toml", remoteBindings: true as const };
  }
}

export async function initD1Target(target: D1Target): Promise<PrismaClient> {
  if (d1Client && currentTarget === target) return d1Client;

  if (d1Client) {
    await disconnectD1Target();
  }

  const { env, dispose } = await getPlatformProxy<CloudflareEnv>(proxyOptions(target));
  disposeProxy = dispose;
  currentTarget = target;

  if (!env.DB) {
    throw new Error(
      `D1 binding (DB) not found for target "${target}". ` +
        (target === "staging"
          ? "Ensure [env.staging] has [[d1_databases]] and run migrations."
          : "Run wrangler d1 migrations apply qtodev-d1 --local (or --remote).")
    );
  }

  d1Client = new PrismaClient({ adapter: new PrismaD1(env.DB) });
  return d1Client;
}

export async function disconnectD1Target() {
  if (d1Client) {
    await d1Client.$disconnect();
    d1Client = undefined;
    currentTarget = undefined;
  }
  if (disposeProxy) {
    await disposeProxy();
    disposeProxy = undefined;
  }
}
