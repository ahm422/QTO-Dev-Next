/**
 * Bootstrap script — create (or update) an admin user in the admin_users table.
 * Use this ONLY for initial setup or recovery. Day-to-day user management lives at
 * /admin/users in the dashboard.
 *
 * Usage:
 *   npm run admin:create-user -- --d1=local --email=you@example.com --password=MyPass123!
 *   npm run admin:create-user -- --d1=staging --email=you@example.com
 *   npm run admin:create-user -- --d1=remote --email=you@example.com
 *
 * Valid roles: super_admin (default), admin, editor, hr
 *
 * Requires --d1=local|staging|remote (wrangler D1 bindings).
 */
import { hash } from "bcryptjs";
import { createInterface } from "node:readline";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import {
  disconnectD1Target,
  initD1Target,
} from "./migration/d1-target";
import type { D1Target } from "./migration/cli";
import { ADMIN_ROLES, type AdminRole } from "../src/lib/auth/roles";

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

// Reused from src/lib/auth/roles.ts so this bootstrap script can't drift
// from the app's actual role set (it did — "hr" was missing here until
// this fix, see #414).
const VALID_ROLES = ADMIN_ROLES;
type ValidRole = AdminRole;

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

async function main() {
  loadEnvFile(resolve(process.cwd(), ".env"));
  loadEnvFile(resolve(process.cwd(), ".env.local"));

  const d1Arg = parseArg("d1") as D1Target | undefined;
  if (!d1Arg || !["local", "staging", "remote"].includes(d1Arg)) {
    console.error("ERROR: --d1=local|staging|remote is required.");
    process.exit(1);
  }

  const { email, password, role } = await resolveCredentials();
  const passwordHash = await hash(password, 12);

  const inserted = await upsertAdminUserD1(d1Arg, email, passwordHash, role);

  console.log(`\n${inserted ? "Created" : "Updated"} admin user: ${email} (role: ${role})`);
  console.log(`Target: D1 (${d1Arg})`);
  console.log("You can now sign in at /admin/login");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => disconnectD1Target());
