import { aboutData } from "@/data/about";
import { aboutPageConfig } from "@/config/aboutPage";
import { stringifyMetadata } from "@/lib/metadata";
import { prisma } from "./helpers";

export async function seedAboutContent() {
  const erp = aboutPageConfig.erpSolutions;
  const sections = [
    {
      section: "hero",
      title: aboutData.company.name,
      subtitle: `Founded ${aboutData.company.founded}`,
      body: null,
      metadata: {
        founded: aboutData.company.founded,
        team: aboutData.company.team,
        clients: aboutData.company.clients,
        projects: aboutData.company.projects,
      },
      order: 0,
    },
    {
      section: "mission",
      title: "Our Mission",
      body: aboutData.mission,
      order: 1,
    },
    {
      section: "vision",
      title: "Our Vision",
      body: aboutData.vision,
      order: 2,
    },
    {
      section: "values",
      title: "Our Values",
      body: null,
      metadata: { values: aboutData.values },
      order: 3,
    },
    {
      section: "erp-solutions",
      title: erp.title,
      subtitle: erp.subtitle,
      body: erp.body,
      metadata: {
        modules: erp.modules,
        industries: erp.industries,
        legacyModernization: erp.legacyModernization,
      },
      order: 4,
    },
  ];

  for (const row of sections) {
    await prisma.aboutContent.upsert({
      where: { section: row.section },
      create: {
        section: row.section,
        title: row.title ?? null,
        subtitle: row.subtitle ?? null,
        body: row.body ?? null,
        metadata: stringifyMetadata(row.metadata),
        order: row.order,
      },
      update: {
        title: row.title ?? null,
        subtitle: row.subtitle ?? null,
        body: row.body ?? null,
        metadata: stringifyMetadata(row.metadata),
        order: row.order,
      },
    });
  }
}
