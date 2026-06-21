/**
 * Bootstrap script — create (or update) an admin user in the admin_users table.
 * Use this ONLY for initial setup or recovery. Day-to-day user management lives at
 * /admin/users in the dashboard.
 *
 * Usage:
 *   npm run admin:create-user                                          # interactive prompts
 *   npm run admin:create-user -- --email=you@example.com              # prompts for password only
 *   npm run admin:create-user -- --email=you@example.com --password=MyPass123!
 *   npm run admin:create-user -- --email=you@example.com --role=admin  # defaults to super_admin
 *
 * Valid roles: super_admin (default), admin, editor
 *
 * Requires DATABASE_URL in .env or .env.local.
 */
import { Pool } from "pg";
import { hash } from "bcryptjs";
import { createInterface } from "node:readline";
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

function parseArg(name: string): string | undefined {
  const flag = `--${name}=`;
  const arg = process.argv.find((a) => a.startsWith(flag));
  return arg ? arg.slice(flag.length).trim() : undefined;
}

function prompt(question: string, hidden = false): Promise<string> {
  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    if (hidden) {
      // Write question manually; suppress echoed input
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
          resolve(input);
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
        resolve(answer.trim());
      });
    }
  });
}

async function main() {
  loadEnvFile(resolve(process.cwd(), ".env"));
  loadEnvFile(resolve(process.cwd(), ".env.local"));

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("ERROR: DATABASE_URL not set in .env or .env.local");
    process.exit(1);
  }

  // Resolve email: CLI arg > interactive prompt (no env var fallback)
  let email = parseArg("email");
  if (!email) {
    email = await prompt("Email: ");
  }
  email = email.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    console.error("ERROR: Invalid email address.");
    process.exit(1);
  }

  // Resolve role: CLI arg > default super_admin
  const VALID_ROLES = ["super_admin", "admin", "editor"] as const;
  type ValidRole = (typeof VALID_ROLES)[number];
  const roleArg = parseArg("role") as ValidRole | undefined;
  const role: ValidRole = roleArg && VALID_ROLES.includes(roleArg) ? roleArg : "super_admin";
  if (roleArg && !VALID_ROLES.includes(roleArg)) {
    console.error(`ERROR: Invalid role "${roleArg}". Valid roles: ${VALID_ROLES.join(", ")}`);
    process.exit(1);
  }

  // Resolve password: CLI arg > interactive prompt (no env var fallback)
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
    const result = await pool.query(
      `INSERT INTO admin_users (id, email, password_hash, role, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, now())
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role, updated_at = now()
       RETURNING (xmax = 0) AS inserted`,
      [email, passwordHash, role]
    );
    const inserted = result.rows[0]?.inserted;
    console.log(`\n${inserted ? "Created" : "Updated"} admin user: ${email} (role: ${role})`);
    console.log("You can now sign in at http://localhost:3000/admin/login");
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
