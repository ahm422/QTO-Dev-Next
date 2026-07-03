/**
 * Upsert admin user directly on remote Cloudflare D1 (bypasses local .wrangler file).
 *
 * Usage:
 *   ADMIN_PASSWORD='your-password' npx tsx scripts/upsert-remote-admin.ts staging admin@example.com
 *   ADMIN_PASSWORD='your-password' npx tsx scripts/upsert-remote-admin.ts production you@example.com
 */
import { hash } from "bcryptjs";
import { randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";

type DbTarget = "staging" | "production";

const DB: Record<DbTarget, { name: string; envFlag: string[] }> = {
  staging: { name: "qtodev-d1-staging", envFlag: ["--env", "staging"] },
  production: { name: "qtodev-d1", envFlag: [] },
};

async function main() {
  const target = (process.argv[2] ?? "staging") as DbTarget;
  const email = (process.argv[3] ?? "admin@example.com").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!DB[target]) {
    console.error(`Unknown target "${target}". Use: staging | production`);
    process.exit(1);
  }
  if (!email.includes("@")) {
    console.error("Invalid email.");
    process.exit(1);
  }
  if (!password || password.length < 8) {
    console.error("Set ADMIN_PASSWORD (min 8 chars) in the environment.");
    process.exit(1);
  }

  const passwordHash = (await hash(password, 12)).replace(/'/g, "''");
  const id = randomUUID();

  const sql = `
INSERT INTO admin_users (id, email, password_hash, role, is_active, failed_login_count, password_changed_at, created_at, updated_at)
VALUES ('${id}', '${email}', '${passwordHash}', 'super_admin', 1, 0, datetime('now'), datetime('now'), datetime('now'))
ON CONFLICT(email) DO UPDATE SET
  password_hash = excluded.password_hash,
  role = 'super_admin',
  is_active = 1,
  failed_login_count = 0,
  locked_until = NULL,
  updated_at = datetime('now');
`.trim();

  const { name, envFlag } = DB[target];
  console.log(`Upserting super_admin on remote ${name}…`);

  execFileSync(
    "npx",
    ["wrangler", "d1", "execute", name, "--remote", ...envFlag, "--command", sql],
    { stdio: "inherit", cwd: process.cwd() }
  );

  const loginUrl =
    target === "staging"
      ? "https://qtodev-site-staging.your-subdomain.workers.dev/admin/login"
      : "https://qtodev-site.your-subdomain.workers.dev/admin/login";

  console.log(`\nDone. Email: ${email}`);
  console.log(`Sign in: ${loginUrl}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
