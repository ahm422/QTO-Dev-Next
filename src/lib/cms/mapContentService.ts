import type { ServiceWithTags } from "@/lib/prisma/serviceData";
import {
  orderedTagValues,
  parseStringArray,
} from "@/lib/prisma/arrayFields";
import {
  webDevelopmentServiceData,
  type WebDevelopmentServiceData,
} from "@/content/services/web-development";

const fallbackHero =
  "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1600&h=1000&fit=crop";
const fallbackOverview =
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1400&h=1000&fit=crop";
const fallbackProject =
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=800&fit=crop";

export function mapPrismaToContentService(row: ServiceWithTags): WebDevelopmentServiceData {
  const features = parseStringArray(row.features);
  const technologyTags = orderedTagValues(row.technologyTags);
  return {
    ...webDevelopmentServiceData,
    slug: row.slug,
    breadcrumbLabel: row.title,
    headline: `${row.title} Services That Drive Growth`,
    subheadline: row.description,
    heroImage: {
      url: row.imageUrl ?? fallbackHero,
      alt: row.imageAlt ?? `${row.title} service hero`,
    },
    overviewText:
      row.shortDescription ||
      "We bring strategic product thinking and high-quality engineering to deliver outcomes your business can measure. Our process is transparent, collaborative, and focused on speed without sacrificing reliability.",
    overviewBenefits: features,
    overviewImage: {
      url: row.imageUrl ?? fallbackOverview,
      alt: row.imageAlt ?? `${row.title} overview image`,
    },
    technologies:
      technologyTags.length > 0
        ? technologyTags
        : webDevelopmentServiceData.technologies,
    relatedProjects: [
      {
        slug: "saas-dashboard",
        name: "SaaS Analytics Dashboard",
        outcome: "Built actionable dashboards for faster decisions.",
        thumbnail: fallbackProject,
      },
    ],
  };
}
