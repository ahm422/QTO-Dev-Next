import { services } from "@/data/services";
import { webDevelopmentServiceData } from "@/content/services/web-development";
import {
  createOrderedChildren,
  replaceOrderedChildren,
  stringifyStringArray,
} from "@/lib/prisma/arrayFields";
import { prisma } from "./helpers";

export async function seedServices() {
  for (let i = 0; i < services.length; i++) {
    const s = services[i];
    let description = s.description;
    let features = s.features;
    let shortDescription = s.shortDescription;

    // Preserve long-form detail fields for web-development (mapped onto overview
    // in mapContentService). Grid cards still cap features/copy in ServiceCard.
    if (s.slug === webDevelopmentServiceData.slug) {
      description = webDevelopmentServiceData.overviewText;
      features = webDevelopmentServiceData.overviewBenefits;
      shortDescription = webDevelopmentServiceData.subheadline;
    }

    const tags = s.technologyTags ?? [];
    const featuresJson = stringifyStringArray(features);

    await prisma.service.upsert({
      where: { slug: s.slug },
      create: {
        slug: s.slug,
        title: s.title,
        shortDescription,
        description,
        icon: s.icon,
        features: featuresJson,
        technologyTags: createOrderedChildren(tags),
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
        features: featuresJson,
        technologyTags: replaceOrderedChildren(tags),
        imageUrl: s.image ?? null,
        imageAlt: s.imageAlt ?? null,
        order: i,
        isPublished: true,
      },
    });
  }
}
