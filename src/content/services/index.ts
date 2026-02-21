import { services } from "@/data/services";
import { webDevelopmentServiceData, WebDevelopmentServiceData } from "./web-development";

const fallbackHero =
  "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1600&h=1000&fit=crop";
const fallbackOverview =
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1400&h=1000&fit=crop";
const fallbackProject =
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=800&fit=crop";

function createGenericServiceData(slug: string): WebDevelopmentServiceData | null {
  const found = services.find((service) => service.slug === slug);
  if (!found) return null;

  return {
    ...webDevelopmentServiceData,
    slug: found.slug,
    breadcrumbLabel: found.title,
    headline: `${found.title} Services That Drive Growth`,
    subheadline: found.description,
    heroImage: { url: fallbackHero, alt: `${found.title} service hero` },
    overviewText:
      "We bring strategic product thinking and high-quality engineering to deliver outcomes your business can measure. Our process is transparent, collaborative, and focused on speed without sacrificing reliability.",
    overviewBenefits: found.features,
    overviewImage: { url: fallbackOverview, alt: `${found.title} overview image` },
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

export async function getServiceBySlug(
  slug: string
): Promise<WebDevelopmentServiceData | null> {
  if (slug === webDevelopmentServiceData.slug) {
    return webDevelopmentServiceData;
  }
  return createGenericServiceData(slug);
}
