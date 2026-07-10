/**
 * Migrate legacy Lucide PascalCase icon values to AppIcon kebab-case keys.
 *
 * Usage:
 *   npx tsx scripts/migrate-lucide-icons-to-app-icon.ts --dry-run
 *   npx tsx scripts/migrate-lucide-icons-to-app-icon.ts --d1=staging --apply
 *   npx tsx scripts/migrate-lucide-icons-to-app-icon.ts --d1=remote --apply
 */
import "dotenv/config";
import { parseCliD1Target } from "./migration/cli";
import { disconnect, initSeedPrisma, prisma } from "../prisma/seed/helpers";
import { LUCIDE_TO_APP_ICON } from "../src/lib/icons/iconMap";

function hasFlag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

async function main() {
  const dryRun = !hasFlag("apply");
  const target = parseCliD1Target("local");
  await initSeedPrisma(target);

  console.log(
    `Icon migration (${target} D1) — ${dryRun ? "DRY RUN" : "APPLY"}\n`
  );

  let changeCount = 0;

  const services = await prisma.service.findMany({
    select: { id: true, slug: true, icon: true },
  });

  for (const row of services) {
    const newIcon = LUCIDE_TO_APP_ICON[row.icon];
    if (!newIcon || newIcon === row.icon) continue;

    console.log({
      table: "services",
      id: row.id,
      slug: row.slug,
      oldIcon: row.icon,
      newIcon,
    });
    changeCount++;

    if (!dryRun) {
      await prisma.service.update({
        where: { id: row.id },
        data: { icon: newIcon },
      });
    }
  }

  const processSteps = await prisma.processStep.findMany({
    select: { id: true, title: true, icon: true },
  });

  for (const row of processSteps) {
    const newIcon = LUCIDE_TO_APP_ICON[row.icon];
    if (!newIcon || newIcon === row.icon) continue;

    console.log({
      table: "process_steps",
      id: row.id,
      title: row.title,
      oldIcon: row.icon,
      newIcon,
    });
    changeCount++;

    if (!dryRun) {
      await prisma.processStep.update({
        where: { id: row.id },
        data: { icon: newIcon },
      });
    }
  }

  console.log(
    `\n${changeCount} row(s) ${dryRun ? "would be updated" : "updated"}.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => disconnect());
