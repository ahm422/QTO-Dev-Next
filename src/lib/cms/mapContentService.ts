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

/**
 * Maps a Prisma Service row onto the public detail UI shape.
 * Rich detail fields (deliverables, problemsWeSolve, processSteps,
 * approachSupportChips, packages, relatedProjects) stay seed/content-file
 * until a later CMS phase — spread from webDevelopmentServiceData.
 */
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
    overviewBenefits:
      features.length > 0 ? features : webDevelopmentServiceData.overviewBenefits,
    overviewImage: {
      url: row.imageUrl ?? fallbackOverview,
      alt: row.imageAlt ?? `${row.title} overview image`,
    },
    technologies:
      technologyTags.length > 0
        ? technologyTags
        : webDevelopmentServiceData.technologies,
    // Keep enriched seed relatedProjects (do not replace with thin stubs)
  };
}
