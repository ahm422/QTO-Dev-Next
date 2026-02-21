import { laheboProject } from "./example";
import { Project } from "./types";
import { projects as legacyProjects } from "@/data/projects";

const mappedLegacyProjects: Project[] = legacyProjects.map((item) => ({
  slug: item.slug,
  title: item.title,
  subtitle: item.shortDescription,
  heroImage: {
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&h=900&fit=crop",
    alt: `${item.title} hero image`,
  },
  chips: [
    { label: "Industry", value: item.category },
    { label: "Type", value: "Digital Product" },
    { label: "Duration", value: "3–6 Months" },
    { label: "Delivery", value: "Agile Sprint Team" },
  ],
  about: {
    overview: item.description,
    scope: "Product strategy, design, development, QA, and launch support.",
    client: "Confidential Client",
    audience: "Business stakeholders and end users",
  },
  services: ["Product Discovery", "UI/UX Design", "Full-Stack Development", "QA"],
  techStack: item.technologies,
  team: "PM + Designer + Engineers + QA",
  timeline: "12–24 Weeks",
  problem: [
    "Legacy workflows slowed down operations and increased delivery risk.",
    "User experience inconsistencies reduced engagement and completion rates.",
    "Reporting and visibility were fragmented across teams.",
  ],
  solution: [
    "Restructured the core user journey around measurable business goals.",
    "Implemented scalable frontend and backend architecture with strong QA.",
    "Improved usability with responsive UI and clearer conversion paths.",
    "Added operational dashboards for better decision-making.",
  ],
  outcomes: [
    "Improved platform performance and consistency across devices.",
    "Faster delivery cycles with better collaboration between teams.",
    "Higher user satisfaction and stronger product adoption.",
  ],
  features: [
    {
      title: "Role-based Dashboard",
      bullets: [
        "Personalized views for each stakeholder role",
        "Action-oriented task summaries",
        "Real-time status indicators",
      ],
      benefit: "Teams focus on what matters most without information overload.",
      image: {
        url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=800&fit=crop",
        alt: `${item.title} dashboard view`,
      },
    },
    {
      title: "Workflow Automation",
      bullets: [
        "Automated notifications for key events",
        "Streamlined approvals and handoffs",
        "Clear audit trail of key actions",
      ],
      benefit: "Reduced manual work and fewer process bottlenecks.",
      image: {
        url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=800&fit=crop",
        alt: `${item.title} workflow automation interface`,
      },
    },
    {
      title: "Analytics & Reporting",
      bullets: [
        "Centralized KPI tracking",
        "Exportable reports for stakeholders",
        "Trend analysis over time",
      ],
      benefit: "Leadership gets faster insights to make confident decisions.",
      image: {
        url: "https://images.unsplash.com/photo-1551281044-8b9a20f1d4d8?w=1200&h=800&fit=crop",
        alt: `${item.title} analytics and reporting screen`,
      },
    },
  ],
  approach: {
    title: "How We Built It",
    steps: [
      "Discovery and requirements alignment with stakeholders.",
      "UX validation and rapid iteration on core flows.",
      "Sprint-based implementation with continuous QA.",
      "Launch, monitoring, and optimization.",
    ],
  },
  technologiesLogos: item.technologies,
  testimonial: {
    quote: "The project delivered measurable improvements in speed, reliability, and user satisfaction.",
    name: "Project Sponsor",
    role: "Product Lead",
    company: "Client Organization",
  },
  relatedProjects: legacyProjects
    .filter((related) => related.slug !== item.slug)
    .slice(0, 3)
    .map((related) => ({
      slug: related.slug,
      title: related.title,
      summary: related.shortDescription,
      thumbnail: "https://images.unsplash.com/photo-1516534775068-bb57e5ab928e?w=900&h=600&fit=crop",
    })),
  demoUrl: "/contact?intent=request-demo",
}));

const projects: Project[] = [laheboProject, ...mappedLegacyProjects];

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return projects.find((project) => project.slug === slug) ?? null;
}

export async function getAllProjects(): Promise<Project[]> {
  return projects;
}
