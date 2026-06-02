import { servicesPageConfig } from "@/config/servicesPage";
import { getTechIconKey } from "./data/techIconKeys";
import { prisma, slugify } from "./helpers";

export async function seedTechnologies() {
  const names = servicesPageConfig.technologiesWeMaster.technologies;
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const slug = slugify(name);
    await prisma.technology.upsert({
      where: { slug },
      create: {
        name,
        slug,
        iconKey: getTechIconKey(name),
        order: i,
        isPublished: true,
      },
      update: {
        name,
        iconKey: getTechIconKey(name),
        order: i,
        isPublished: true,
      },
    });
  }
}
