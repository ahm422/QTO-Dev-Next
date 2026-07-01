/**
 * Bootstrap script — create (or update) an admin user in the admin_users table.
 * Use this ONLY for initial setup or recovery. Day-to-day user management lives at
 * /admin/users in the dashboard.
 *
 * Usage:
 *   npm run admin:create-user -- --d1=local --email=you@example.com --password=MyPass123!
 *   npm run admin:create-user -- --d1=staging --email=you@example.com
 *   npm run admin:create-user -- --email=you@example.com              # Postgres if DATABASE_URL set
 *
 * Valid roles: super_admin (default), admin, editor
 *
 * D1 targets use wrangler bindings (--d1=local|staging|remote).
 * Postgres fallback requires DATABASE_URL in .env or .env.local.
 */
import { Pool } from "pg";
import { hash } from "bcryptjs";
import { createInterface } from "node:readline";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import {
  disconnectD1Target,
  initD1Target,
} from "./migration/d1-target";
import type { D1Target } from "./migration/cli";

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

function parseArg(name: string): string | undefined {
  const flag = `--${name}=`;
  const arg = process.argv.find((a) => a.startsWith(flag));
  return arg ? arg.slice(flag.length).trim() : undefined;
}

function prompt(question: string, hidden = false): Promise<string> {
  return new Promise((resolvePrompt) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    if (hidden) {
      process.stdout.write(question);
      process.stdin.setRawMode?.(true);
      let input = "";
      process.stdin.resume();
      process.stdin.setEncoding("utf8");

      const onData = (ch: string) => {
        if (ch === "\n" || ch === "\r" || ch === "") {
          process.stdin.setRawMode?.(false);
          process.stdin.pause();
          process.stdin.removeListener("data", onData);
          process.stdout.write("\n");
          rl.close();
          resolvePrompt(input);
        } else if (ch === "") {
          process.exit();
        } else if (ch === "" || ch === "\b") {
          if (input.length > 0) input = input.slice(0, -1);
        } else {
          input += ch;
        }
      };
      process.stdin.on("data", onData);
    } else {
      rl.question(question, (answer) => {
        rl.close();
        resolvePrompt(answer.trim());
      });
    }
  });
}

const VALID_ROLES = ["super_admin", "admin", "editor"] as const;
type ValidRole = (typeof VALID_ROLES)[number];

async function resolveCredentials(): Promise<{
  email: string;
  password: string;
  role: ValidRole;
}> {
  let email = parseArg("email");
  if (!email) {
    email = await prompt("Email: ");
  }
  email = email.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    console.error("ERROR: Invalid email address.");
    process.exit(1);
  }

  const roleArg = parseArg("role") as ValidRole | undefined;
  const role: ValidRole = roleArg && VALID_ROLES.includes(roleArg) ? roleArg : "super_admin";
  if (roleArg && !VALID_ROLES.includes(roleArg)) {
    console.error(`ERROR: Invalid role "${roleArg}". Valid roles: ${VALID_ROLES.join(", ")}`);
    process.exit(1);
  }

  let password = parseArg("password");
  if (!password) {
    password = await prompt("Password: ", true);
    const confirm = await prompt("Confirm password: ", true);
    if (password !== confirm) {
      console.error("ERROR: Passwords do not match.");
      process.exit(1);
    }
  }
  if (!password || password.length < 8) {
    console.error("ERROR: Password must be at least 8 characters.");
    process.exit(1);
  }

  return { email, password, role };
}

async function upsertAdminUserD1(
  target: D1Target,
  email: string,
  passwordHash: string,
  role: ValidRole
): Promise<boolean> {
  const prisma = await initD1Target(target);
  const existing = await prisma.adminUser.findUnique({ where: { email } });

  if (existing) {
    await prisma.adminUser.update({
      where: { email },
      data: { passwordHash, role },
    });
    return false;
  }

  await prisma.adminUser.create({
    data: { email, passwordHash, role },
  });
  return true;
}

async function upsertAdminUserPostgres(
  email: string,
  passwordHash: string,
  role: ValidRole
): Promise<boolean> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error(
      "ERROR: Provide --d1=local|staging|remote or set DATABASE_URL for Postgres fallback."
    );
    process.exit(1);
  }

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
    const result = await pool.query(
      `INSERT INTO admin_users (id, email, password_hash, role, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, now())
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role, updated_at = now()
       RETURNING (xmax = 0) AS inserted`,
      [email, passwordHash, role]
    );
    return Boolean(result.rows[0]?.inserted);
  } finally {
    await pool.end();
  }
}

async function main() {
  loadEnvFile(resolve(process.cwd(), ".env"));
  loadEnvFile(resolve(process.cwd(), ".env.local"));

  const d1Arg = parseArg("d1") as D1Target | undefined;
  if (d1Arg && !["local", "staging", "remote"].includes(d1Arg)) {
    console.error(`ERROR: Invalid --d1 value "${d1Arg}". Use local, staging, or remote.`);
    process.exit(1);
  }

  const { email, password, role } = await resolveCredentials();
  const passwordHash = await hash(password, 12);

  const inserted = d1Arg
    ? await upsertAdminUserD1(d1Arg, email, passwordHash, role)
    : await upsertAdminUserPostgres(email, passwordHash, role);

  console.log(`\n${inserted ? "Created" : "Updated"} admin user: ${email} (role: ${role})`);
  if (d1Arg) {
    console.log(`Target: D1 (${d1Arg})`);
  }
  console.log("You can now sign in at /admin/login");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => disconnectD1Target());
