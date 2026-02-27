import { laheboProject } from "./example";
import { Project } from "./types";
import { projects as legacyProjects } from "@/data/projects";

const heroImages: Record<string, { url: string; alt: string }> = {
  "ecommerce-platform": {
    url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&h=900&fit=crop",
    alt: "E-commerce platform dashboard with product analytics and order management",
  },
  "saas-dashboard": {
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=900&fit=crop",
    alt: "SaaS analytics dashboard showing real-time metrics and data visualizations",
  },
  "mobile-fitness-app": {
    url: "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=1600&h=900&fit=crop",
    alt: "Fitness tracking mobile app displayed on smartphone with workout data",
  },
  "startup-website": {
    url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&h=900&fit=crop",
    alt: "Modern tech startup website development workspace with clean code",
  },
};

const featureImages: Record<string, Array<{ url: string; alt: string }>> = {
  "ecommerce-platform": [
    { url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=800&fit=crop", alt: "E-commerce product catalog with filtering and search interface" },
    { url: "https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=1200&h=800&fit=crop", alt: "Shopping cart and checkout flow optimization screen" },
    { url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop", alt: "Revenue analytics and conversion tracking dashboard" },
  ],
  "saas-dashboard": [
    { url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop", alt: "Real-time analytics dashboard with interactive charts" },
    { url: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&h=800&fit=crop", alt: "Automated workflow builder with drag-and-drop interface" },
    { url: "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=1200&h=800&fit=crop", alt: "Data reporting and export interface with trend analysis" },
  ],
  "mobile-fitness-app": [
    { url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop", alt: "Fitness dashboard showing workout progress and goals" },
    { url: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1200&h=800&fit=crop", alt: "Exercise tracking with real-time activity monitoring" },
    { url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&h=800&fit=crop", alt: "Nutrition tracking and meal planning interface" },
  ],
  "startup-website": [
    { url: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&h=800&fit=crop", alt: "Responsive website design across multiple devices" },
    { url: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=1200&h=800&fit=crop", alt: "Landing page with conversion optimization elements" },
    { url: "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?w=1200&h=800&fit=crop", alt: "Performance dashboard with SEO metrics and analytics" },
  ],
};

const thumbnailImages: Record<string, string> = {
  "ecommerce-platform": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&h=600&fit=crop",
  "saas-dashboard": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=600&fit=crop",
  "mobile-fitness-app": "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=900&h=600&fit=crop",
  "startup-website": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&h=600&fit=crop",
};

const defaultHero = {
  url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&h=900&fit=crop",
  alt: "Project hero image",
};

const mappedLegacyProjects: Project[] = legacyProjects.map((item) => ({
  slug: item.slug,
  title: item.title,
  subtitle: item.shortDescription,
  heroImage: heroImages[item.slug] ?? defaultHero,
  chips: [
    { label: "Industry", value: item.category },
    { label: "Type", value: "Digital Product" },
    { label: "Duration", value: "3\u20136 Months" },
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
  timeline: "12\u201324 Weeks",
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
      image: featureImages[item.slug]?.[0] ?? {
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
      image: featureImages[item.slug]?.[1] ?? {
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
      image: featureImages[item.slug]?.[2] ?? {
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
      thumbnail: thumbnailImages[related.slug] ?? "https://images.unsplash.com/photo-1516534775068-bb57e5ab928e?w=900&h=600&fit=crop",
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
