import type { ServiceFaqSource } from "@/lib/prisma/serviceData";
import { mapContentFaqRows } from "@/lib/prisma/contentFaqs";
import {
  orderedTagValues,
  parseStringArray,
} from "@/lib/prisma/arrayFields";
import {
  webDevelopmentServiceData,
  type ServiceProjectCard,
  type WebDevelopmentServiceData,
} from "@/content/services/web-development";
import { resolveMediaUrl } from "@/config/staticImages";
import { stripHtml } from "@/lib/sanitize-html";

const fallbackHero =
  "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1600&h=1000&fit=crop";
const fallbackOverview =
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1400&h=1000&fit=crop";

/**
 * Maps a Prisma Service row onto the public detail UI shape.
 * Rich detail fields (deliverables, problemsWeSolve, processSteps,
 * approachSupportChips, packages, testimonials) stay seed/content-file
 * until a later CMS phase — spread from webDevelopmentServiceData.
 * relatedProjects come from DB (passed in); never inherit the seed list.
 */
export function mapPrismaToContentService(
  row: ServiceFaqSource,
  relatedProjects: ServiceProjectCard[] = []
): WebDevelopmentServiceData {
  const features = parseStringArray(row.features);
  const technologyTags = orderedTagValues(row.technologyTags);
  const title = row.title?.trim() || "Service";
  const shortDescription = row.shortDescription?.trim() || "";
  const description = row.description?.trim() || "";
  const lead =
    shortDescription ||
    (description ? stripHtml(description) : "") ||
    "Premium web development and design services from QTO Dev.";

  return {
    ...webDevelopmentServiceData,
    slug: row.slug,
    breadcrumbLabel: title,
    headline: title ? `${title} Services That Drive Growth` : "QTO Dev Services",
    // Prefer shortDescription for hero/meta; keep long description for overview body.
    subheadline: lead,
    heroImage: {
      url: resolveMediaUrl(row.imageUrl) ?? fallbackHero,
      alt: row.imageAlt ?? `${title} service hero`,
    },
    overviewText: description,
    overviewBenefits:
      features.length > 0 ? features : webDevelopmentServiceData.overviewBenefits,
    overviewImage: {
      url: resolveMediaUrl(row.imageUrl) ?? fallbackOverview,
      alt: row.imageAlt ?? `${row.title} overview image`,
    },
    technologies:
      technologyTags.length > 0
        ? technologyTags
        : webDevelopmentServiceData.technologies,
    relatedProjects,
    faqs: mapContentFaqRows(row.faqs),
  };
}
