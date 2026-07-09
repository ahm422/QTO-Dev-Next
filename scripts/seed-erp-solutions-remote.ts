/**
 * Upsert only the erp-solutions about_content row (production-safe, section-scoped).
 *
 * Usage:
 *   npm run db:seed:erp-solutions:remote
 *   npx tsx scripts/seed-erp-solutions-remote.ts -- --d1=remote --confirm-production
 */
import { parseCliD1Target } from "./migration/cli";
import { disconnect, initSeedPrisma } from "../prisma/seed/helpers";
import { seedErpSolutionsContent } from "../prisma/seed/aboutContent";

function hasFlag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

async function main() {
  const target = parseCliD1Target("local");

  if (target === "remote" && !hasFlag("confirm-production")) {
    console.error(
      "Refusing to write production D1 without --confirm-production. " +
        "This script upserts only about_content.section = erp-solutions."
    );
    process.exit(1);
  }

  await initSeedPrisma(target);
  console.log(`Upserting erp-solutions about_content into ${target} D1…`);
  await seedErpSolutionsContent();
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => disconnect());
