import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const ENV_FILES = [".env", ".env.local", ".env.migrate"];

function loadEnvFile(path: string) {
  if (!existsSync(path)) return;
  const content = readFileSync(path, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

/** Load .env, .env.local, and .env.migrate from project root. */
export function loadMigrationEnv() {
  const root = process.cwd();
  for (const file of ENV_FILES) {
    loadEnvFile(resolve(root, file));
  }
}

export function requireDatabaseUrl(): string {
  const url = process.env.DATABASE_URL ?? process.env.DIRECT_URL;
  if (!url) {
    throw new Error("DATABASE_URL or DIRECT_URL is required in .env or .env.migrate");
  }
  return url;
}

export function requireGarageEnv() {
  const keys = [
    "GARAGE_ENDPOINT",
    "GARAGE_ACCESS_KEY_ID",
    "GARAGE_SECRET_ACCESS_KEY",
    "GARAGE_BUCKET_NAME",
    "GARAGE_PUBLIC_URL",
  ] as const;
  for (const key of keys) {
    if (!process.env[key]) {
      throw new Error(`${key} is required for media migration`);
    }
  }
  return {
    endpoint: process.env.GARAGE_ENDPOINT!,
    region: process.env.GARAGE_REGION ?? "garage",
    accessKeyId: process.env.GARAGE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.GARAGE_SECRET_ACCESS_KEY!,
    bucket: process.env.GARAGE_BUCKET_NAME!,
    publicUrl: process.env.GARAGE_PUBLIC_URL!.replace(/\/$/, ""),
  };
}

export function requireR2Env() {
  const keys = ["R2_S3_ENDPOINT", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_PUBLIC_URL"] as const;
  for (const key of keys) {
    if (!process.env[key]) {
      throw new Error(`${key} is required for media migration`);
    }
  }
  return {
    endpoint: process.env.R2_S3_ENDPOINT!,
    region: process.env.R2_REGION ?? "auto",
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    bucket: process.env.R2_BUCKET_NAME ?? "qtodev-media",
    publicUrl: process.env.R2_PUBLIC_URL!.replace(/\/$/, ""),
  };
}
