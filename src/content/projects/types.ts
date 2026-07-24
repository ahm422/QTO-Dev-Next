export interface TechCategory {
  category: string;
  items: string[];
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  heroImage: { url: string; alt: string };
  chips: { label: string; value: string }[];
  about: {
    overview: string;
    scope?: string;
    client?: string;
    audience?: string;
  };
  services: string[];
  techStack: string[];
  /** Categorized stack for Technology & Development Approach section */
  techByCategory?: TechCategory[];
  team: string;
  timeline: string;
  problem: string[];
  solution: string[];
  outcomes?: string[];
  features: Array<{
    title: string;
    bullets: string[];
    benefit: string;
    image: { url: string; alt: string };
  }>;
  approach?: {
    title: string;
    steps: string[];
    challenges?: string[];
  };
  technologiesLogos?: string[];
  testimonial?: {
    quote: string;
    name: string;
    role: string;
    company: string;
    image?: string;
  };
  relatedProjects: Array<{
    slug: string;
    title: string;
    summary: string;
    thumbnail: string;
  }>;
  pdfDownloadUrl?: string;
  demoUrl?: string;
}

/** Default 6-step workflow strip for project detail IA */
export const DEFAULT_APPROACH_STEPS = [
  "Discovery",
  "Architecture",
  "UI/UX",
  "Development",
  "Testing",
  "Deployment",
] as const;
