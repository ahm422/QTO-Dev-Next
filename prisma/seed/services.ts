import { services } from "@/data/services";
import { webDevelopmentServiceData } from "@/content/services/web-development";
import { prisma } from "./helpers";

export async function seedServices() {
  for (let i = 0; i < services.length; i++) {
    const s = services[i];
    let description = s.description;
    let features = s.features;
    let shortDescription = s.shortDescription;

    if (s.slug === webDevelopmentServiceData.slug) {
      description = webDevelopmentServiceData.overviewText;
      features = webDevelopmentServiceData.overviewBenefits;
      shortDescription = webDevelopmentServiceData.subheadline;
    }

    await prisma.service.upsert({
      where: { slug: s.slug },
      create: {
        slug: s.slug,
        title: s.title,
        shortDescription,
        description,
        icon: s.icon,
        features,
        technologyTags: s.technologyTags ?? [],
        imageUrl: s.image ?? null,
        imageAlt: s.imageAlt ?? null,
        order: i,
        isPublished: true,
      },
      update: {
        title: s.title,
        shortDescription,
        description,
        icon: s.icon,
        features,
        technologyTags: s.technologyTags ?? [],
        imageUrl: s.image ?? null,
        imageAlt: s.imageAlt ?? null,
        order: i,
        isPublished: true,
      },
    });
  }
}
