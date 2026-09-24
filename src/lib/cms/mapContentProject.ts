import type { ProjectWithRelations } from "@/lib/prisma/projectData";
import { orderedTagValues, parseStringArray } from "@/lib/prisma/arrayFields";
import type { Project } from "@/content/projects/types";
import { DEFAULT_APPROACH_STEPS } from "@/content/projects/types";
import { stripHtml } from "@/lib/sanitize-html";

const defaultHero = {
  url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&h=900&fit=crop",
  alt: "Project hero image",
};

const defaultFeatureImage = {
  url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=800&fit=crop",
  alt: "Project feature",
};

const DEFAULT_SERVICES = [
  "Product Discovery",
  "UI/UX Design",
  "Full-Stack Development",
  "QA",
];

function categorizeTech(techStack: string[]): Project["techByCategory"] {
  if (techStack.length === 0) {
    return [{ category: "Technologies", items: ["Modern web stack"] }];
  }
  return [{ category: "Technologies", items: techStack }];
}

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

  const featureBullets =
    tags.slice(0, 3).length > 0
      ? tags.slice(0, 3)
      : ["Role-based access", "Workflow automation", "Reporting"];

  const outcomeBullets =
    results.slice(0, 3).length > 0
      ? results.slice(0, 3)
      : ["Faster delivery cycles", "Higher user satisfaction", "Stronger product adoption"];

  const title = item.title?.trim() || "Project case study";
  const subtitle =
    item.excerpt?.trim() ||
    (item.description?.trim() ? stripHtml(item.description) : "") ||
    "A product engagement focused on measurable outcomes and clear delivery.";

  return {
    slug: item.slug,
    title,
    subtitle,
    heroImage: { url: heroUrl, alt: item.title },
    chips: [
      { label: "Industry", value: item.category || "Technology" },
      { label: "Client", value: item.client ?? "Confidential Client" },
      { label: "Delivery", value: "Agile Sprint Team" },
    ],
    about: {
      overview:
        item.description ||
        "A product engagement focused on measurable outcomes, clear delivery, and long-term maintainability.",
      scope: "Product strategy, design, development, QA, and launch support.",
      client: item.client ?? "Confidential Client",
      audience: "Product, operations, and business stakeholders",
    },
    services: DEFAULT_SERVICES,
    techStack: techStack.length > 0 ? techStack : ["Next.js", "TypeScript", "Node.js"],
    techByCategory: categorizeTech(
      techStack.length > 0 ? techStack : ["Next.js", "TypeScript", "Node.js"]
    ),
    team: "PM + Designer + Engineers + QA",
    timeline: "12–24 Weeks",
    problem: item.challenge
      ? [item.challenge]
      : ["Legacy workflows slowed operations and increased delivery risk."],
    solution: item.solution ? [item.solution] : [],
    outcomes:
      results.length > 0
        ? results
        : ["Improved performance and stronger product adoption."],
    features: [
      {
        title: "Core Platform",
        bullets: featureBullets,
        benefit: item.excerpt || "Teams get a reliable foundation for daily work.",
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
        bullets: outcomeBullets,
        benefit: "Measurable business impact after launch.",
        image: defaultFeatureImage,
      },
      {
        title: "Delivery Quality",
        bullets: ["Automated tests for critical paths", "CI/CD release pipeline", "Observability baselines"],
        benefit: "Ship confidently with fewer production surprises.",
        image: defaultFeatureImage,
      },
    ],
    approach: {
      title: "Technology & Development Approach",
      steps: [...DEFAULT_APPROACH_STEPS],
    },
    technologiesLogos: techStack.length > 0 ? techStack : ["Next.js", "TypeScript", "Node.js"],
    relatedProjects: related,
    demoUrl: item.liveUrl ?? "/contact?intent=request-demo",
  };
}
