/**
 * Diagnosis script for issue #309 — audits legacy empty inbox rows and seeds test data.
 * Run: npx tsx scripts/diagnose-inbox-legacy.ts
 * Optional: npx tsx scripts/diagnose-inbox-legacy.ts --seed-legacy
 */
import { initSeedPrisma, disconnect } from "../prisma/seed/helpers";
import { stringifyMetadata } from "../src/lib/metadata";

const seedLegacy = process.argv.includes("--seed-legacy");

async function countEmpty(
  prisma: Awaited<ReturnType<typeof initSeedPrisma>>,
  table: "contacts" | "requirements",
  column: "name" | "subject"
) {
  const rows = await prisma.$queryRawUnsafe<{ count: number }[]>(
    `SELECT COUNT(*) as count FROM ${table} WHERE TRIM(${column}) = '' OR ${column} IS NULL`
  );
  return Number(rows[0]?.count ?? 0);
}

async function main() {
  const prisma = await initSeedPrisma("local");

  console.log("=== Inbox legacy diagnosis (local D1) ===\n");

  const emptyContactNames = await countEmpty(prisma, "contacts", "name");
  const emptyContactSubjects = await countEmpty(prisma, "contacts", "subject");
  const emptyRequirementNames = await countEmpty(prisma, "requirements", "name");

  console.log(`Empty contact names:    ${emptyContactNames}`);
  console.log(`Empty contact subjects: ${emptyContactSubjects}`);
  console.log(`Empty requirement names: ${emptyRequirementNames}`);

  const contactsWithMetaName = await prisma.$queryRawUnsafe<
    { id: string; name: string; metadata: string | null }[]
  >(
    `SELECT id, name, metadata FROM contacts
     WHERE (TRIM(name) = '' OR name IS NULL) AND metadata IS NOT NULL AND metadata != ''`
  );
  const requirementsWithMetaName = await prisma.$queryRawUnsafe<
    { id: string; name: string; metadata: string | null }[]
  >(
    `SELECT id, name, metadata FROM requirements
     WHERE (TRIM(name) = '' OR name IS NULL) AND metadata IS NOT NULL AND metadata != ''`
  );

  console.log(`\nContacts with empty name but metadata: ${contactsWithMetaName.length}`);
  console.log(`Requirements with empty name but metadata: ${requirementsWithMetaName.length}`);

  if (seedLegacy) {
    console.log("\n--- Seeding legacy + fresh test rows ---");

    await prisma.contact.create({
      data: {
        name: "",
        email: "legacy-contact@test.local",
        subject: "",
        message: "Legacy row with name/subject in metadata only.",
        metadata: stringifyMetadata({ name: "Legacy Contact Name" }),
      },
    });

    await prisma.requirement.create({
      data: {
        intent: "requirements",
        name: "",
        email: "legacy-requirement@test.local",
        message: "Legacy requirement with name in metadata.",
        metadata: stringifyMetadata({
          name: "Legacy Requirement Name",
          phone: "+1 555-0100",
          companyLocation: "Austin, TX",
        }),
      },
    });

    await prisma.contact.create({
      data: {
        name: "Issue 309 Test Contact",
        email: "issue309-contact@test.local",
        subject: "Admin Inbox Test Subject",
        message: "Fresh test contact submission for issue #309.",
        source: "diagnosis-script",
      },
    });

    await prisma.requirement.create({
      data: {
        intent: "qtodev-client-questionnaire",
        name: "Issue 309 Test Requirement",
        email: "issue309-requirement@test.local",
        message: "Fresh test requirement for issue #309.",
        company: "QTO Test Co",
        budgetRange: "$10k–$25k",
        metadata: stringifyMetadata({
          phone: "+1 555-0199",
          companyLocation: "Remote",
          questionnaire: {
            servicesInterested: ["website-design-development", "logo-design"],
            existingWebsite: "no",
            hasDomainHosting: "yes",
            pagesWanted: ["home", "about", "contact"],
            contentReady: "need-help",
            hasLogo: "no",
            brandingMaterials: [],
            companyDescription: "Test company for admin inbox diagnosis.",
          },
          questionnaireVersion: 1,
        }),
      },
    });

    console.log("Seeded legacy + fresh test rows.");
  }

  const recentContacts = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { name: true, email: true, subject: true, metadata: true },
  });
  const recentRequirements = await prisma.requirement.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { name: true, email: true, intent: true, metadata: true },
  });

  console.log("\n--- Recent contacts (top 5) ---");
  console.table(recentContacts);
  console.log("\n--- Recent requirements (top 5) ---");
  console.table(recentRequirements);

  console.log("\n=== PR notes template ===");
  console.log(`- Empty contact names (local): ${emptyContactNames}`);
  console.log(`- Empty contact subjects (local): ${emptyContactSubjects}`);
  console.log(`- Empty requirement names (local): ${emptyRequirementNames}`);
  console.log(
    `- Recoverable metadata.name contacts: ${contactsWithMetaName.length}`
  );
  console.log(
    `- Recoverable metadata.name requirements: ${requirementsWithMetaName.length}`
  );
  console.log("- New test rows: run with --seed-legacy to create sample data");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => disconnect());
