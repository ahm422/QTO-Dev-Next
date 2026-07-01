import type { ProjectWithRelations } from "@/lib/prisma/projectData";
import { orderedTagValues, parseStringArray } from "@/lib/prisma/arrayFields";
import type { Project } from "@/content/projects/types";

const defaultHero = {
  url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&h=900&fit=crop",
  alt: "Project hero image",
};

const defaultFeatureImage = {
  url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=800&fit=crop",
  alt: "Project feature",
};

export function mapPrismaToContentProject(
  item: ProjectWithRelations,
  all: ProjectWithRelations[]
): Project {
  const tags = orderedTagValues(item.tags);
  const techStack = orderedTagValues(item.techStack);
  const results = parseStringArray(item.results);

  const heroUrl = item.coverImageUrl ?? defaultHero.url;
  const related = all
    .filter((p) => p.slug !== item.slug)
    .slice(0, 3)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      summary: p.excerpt,
      thumbnail: p.coverImageUrl ?? defaultHero.url,
    }));

  return {
    slug: item.slug,
    title: item.title,
    subtitle: item.excerpt,
    heroImage: { url: heroUrl, alt: item.title },
    chips: [
      { label: "Industry", value: item.category },
      { label: "Client", value: item.client ?? "Confidential Client" },
      { label: "Delivery", value: "Agile Sprint Team" },
    ],
    about: {
      overview: item.description,
      scope: "Product strategy, design, development, QA, and launch support.",
      client: item.client ?? "Confidential Client",
    },
    services: ["Product Discovery", "UI/UX Design", "Full-Stack Development", "QA"],
    techStack,
    team: "PM + Designer + Engineers + QA",
    timeline: "12–24 Weeks",
    problem: item.challenge
      ? [item.challenge]
      : ["Legacy workflows slowed operations and increased delivery risk."],
    solution: item.solution
      ? [item.solution]
      : ["Implemented scalable architecture with strong QA and clearer user flows."],
    outcomes:
      results.length > 0
        ? results
        : ["Improved performance and stronger product adoption."],
    features: [
      {
        title: "Core Platform",
        bullets: tags.slice(0, 3).length
          ? tags.slice(0, 3)
          : ["Role-based access", "Workflow automation", "Reporting"],
        benefit: item.excerpt,
        image: { url: heroUrl, alt: item.title },
      },
      {
        title: "Integrations",
        bullets: ["API-first design", "Secure data handling", "Operational dashboards"],
        benefit: "Teams collaborate with less manual overhead.",
        image: defaultFeatureImage,
      },
      {
        title: "Outcomes",
        bullets: results.slice(0, 3).length
          ? results.slice(0, 3)
          : ["Faster delivery cycles", "Higher user satisfaction"],
        benefit: "Measurable business impact after launch.",
        image: defaultFeatureImage,
      },
    ],
    approach: {
      title: "How We Built It",
      steps: [
        "Discovery and requirements alignment.",
        "UX validation and iteration.",
        "Sprint-based implementation with QA.",
        "Launch and optimization.",
      ],
    },
    technologiesLogos: techStack,
    relatedProjects: related,
    demoUrl: item.liveUrl ?? "/contact?intent=request-demo",
  };
}
