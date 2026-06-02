import { disconnect, prisma } from "../prisma/seed/helpers";

async function main() {
  const contact = await prisma.contact.create({
    data: {
      name: "Phase 2 Smoke",
      email: "phase2-smoke@test.local",
      subject: "smoke",
      message: "Contact model still writable after CMS migration.",
    },
  });

  const requirement = await prisma.requirement.create({
    data: {
      intent: "project",
      name: "Phase 2 Smoke",
      email: "phase2-smoke@test.local",
      message: "Requirement model still writable after CMS migration.",
    },
  });

  await prisma.contact.delete({ where: { id: contact.id } });
  await prisma.requirement.delete({ where: { id: requirement.id } });

  console.log("Contact and Requirement create/delete OK.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => disconnect());
