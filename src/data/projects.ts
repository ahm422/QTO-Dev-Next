import { Project } from "@/types/project";

export const projects: Project[] = [
  {
    id: "1",
    slug: "ecommerce-platform",
    title: "E-commerce Platform Redesign",
    shortDescription:
      "High-performance e-commerce web platform redesign that improved conversion rates and checkout speed.",
    description:
      "Redesigned and replatformed a major e-commerce experience into a modern web application, improving site performance, checkout flow, and overall conversion rates while keeping operations stable during migration.",
    featured: true,
    category: "E-commerce",
    tags: ["React", "Node.js", "MongoDB"],
    technologies: ["Next.js", "Tailwind CSS", "PostgreSQL", "Stripe"],
    caseStudy: true,
  },
  {
    id: "2",
    slug: "saas-dashboard",
    title: "SaaS Analytics Dashboard",
    shortDescription:
      "Real-time SaaS analytics web app giving small businesses actionable visibility into key metrics.",
    description:
      "Delivered a SaaS analytics dashboard that aggregates data from multiple sources into a real-time web application, helping small businesses monitor KPIs, spot trends, and make faster, data-informed decisions.",
    featured: true,
    category: "SaaS",
    tags: ["React", "TypeScript", "Analytics"],
    technologies: ["Next.js", "Chart.js", "Firebase", "Vercel"],
    caseStudy: true,
  },
  {
    id: "3",
    slug: "mobile-fitness-app",
    title: "Fitness Tracking Mobile App",
    shortDescription:
      "Cross-platform mobile app that automates workout, nutrition, and progress tracking for users.",
    description:
      "Built a React Native fitness application that syncs with Apple HealthKit and Google Fit, helping users automatically track workouts, nutrition, and long-term progress across devices.",
    featured: false,
    category: "Mobile",
    tags: ["React Native", "Redux", "Health"],
    technologies: ["React Native", "Firebase", "Apple HealthKit", "Google Fit"],
    caseStudy: false,
  },
  {
    id: "4",
    slug: "startup-website",
    title: "Tech Startup Website",
    shortDescription:
      "High-conversion marketing website for a tech startup focused on lead generation and brand credibility.",
    description:
      "Designed and developed a high-performance marketing site for a tech startup, pairing modern visuals with optimized landing pages and analytics to increase qualified leads and support fundraising efforts.",
    featured: true,
    category: "Web",
    tags: ["Marketing", "Conversion", "SEO"],
    technologies: ["Next.js", "Tailwind CSS", "Framer Motion", "Vercel"],
    caseStudy: false,
  },
];
