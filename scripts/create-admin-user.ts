/**
 * Create (or update) an admin user in the admin_users table.
 *
 * Requires in .env:
 *   DATABASE_URL
 *
 * Optional:
 *   ADMIN_EMAIL    (default: admin@qtodev.local)
 *   ADMIN_PASSWORD (default: generated and printed once)
 *
 * Run: npm run admin:create-user
 */
import { Pool } from "pg";
import { hash } from "bcryptjs";
import { randomBytes } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

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

function generatePassword(): string {
  return randomBytes(16).toString("base64url");
}

async function main() {
  loadEnvFile(resolve(process.cwd(), ".env"));
  loadEnvFile(resolve(process.cwd(), ".env.local"));

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("Missing DATABASE_URL in .env");
    process.exit(1);
  }

  const email = (process.env.ADMIN_EMAIL ?? "admin@qtodev.local")
    .trim()
    .toLowerCase();
  const passwordFromEnv = process.env.ADMIN_PASSWORD?.trim();
  const password = passwordFromEnv || generatePassword();
  const generatedPassword = !passwordFromEnv;

  const passwordHash = await hash(password, 12);

  const url = new URL(databaseUrl);
  const sslMode = url.searchParams.get("sslmode");
  const usesTls =
    sslMode === "require" || sslMode === "verify-ca" || sslMode === "verify-full";
  url.searchParams.delete("sslmode");

  const pool = new Pool({
    connectionString: url.toString(),
    ...(usesTls ? { ssl: { rejectUnauthorized: false } } : {}),
  });

  try {
    await pool.query(
      `INSERT INTO admin_users (id, email, password_hash, updated_at)
       VALUES (gen_random_uuid(), $1, $2, now())
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, updated_at = now()`,
      [email, passwordHash]
    );
    console.log(`\nAdmin user upserted: ${email}`);
  } finally {
    await pool.end();
  }

  console.log("\n--- Admin login (http://localhost:3000/admin/login) ---");
  console.log("Email:   ", email);
  if (generatedPassword) {
    console.log("Password:", password);
    console.log("\nSave this password; it was generated for this run only.");
  } else {
    console.log("Password: (from ADMIN_PASSWORD in .env)");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
