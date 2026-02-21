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