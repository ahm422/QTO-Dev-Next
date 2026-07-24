export interface ProcessStep {
  title: string;
  deliverables: string[];
}

export interface ServicePackage {
  name: "Starter" | "Growth" | "Enterprise";
  price: string;
  timeline: string;
  features: string[];
  idealFor: string;
  isPopular?: boolean;
}

export interface ServiceProjectCard {
  slug: string;
  name: string;
  outcome: string;
  thumbnail: string;
}

export interface ServiceTestimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  photo: string;
}

export interface WebDevelopmentServiceData {
  slug: string;
  breadcrumbLabel: string;
  headline: string;
  subheadline: string;
  proofChips: string[];
  heroImage: { url: string; alt: string };
  overviewText: string;
  overviewBenefits: string[];
  overviewImage: { url: string; alt: string };
  processSteps: ProcessStep[];
  technologies: string[];
  relatedProjects: ServiceProjectCard[];
  packages: ServicePackage[];
  testimonials: ServiceTestimonial[];
}

export const webDevelopmentServiceData: WebDevelopmentServiceData = {
  slug: "web-development",
  breadcrumbLabel: "Web Development",
  headline: "Custom Web Development That Drives Revenue",
  subheadline:
    "We build fast, scalable, conversion-focused web applications that help ambitious companies grow 3–10× faster.",
  proofChips: [
    "SaaS",
    "E-commerce",
    "Enterprise",
    "6–18 months projects",
    "100% In-house team",
    "Since 2018",
  ],
  heroImage: {
    url: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1600&h=1000&fit=crop",
    alt: "Web app mockups across desktop, tablet, and mobile",
  },
  overviewText:
    "Great web products are not built by chance. They are built through disciplined strategy, clear communication, and technical execution that supports business goals. Our team partners with founders, product teams, and operations leaders to translate vision into measurable outcomes—higher conversion rates, faster release cycles, and systems that scale with confidence. We combine product thinking with engineering rigor to avoid bloated roadmaps, expensive rewrites, and delivery bottlenecks. Every engagement starts by understanding your growth model, user journey, and technical constraints, then we architect solutions that balance speed and quality. From modern frontend experiences to secure backend systems, we build with performance, accessibility, and long-term maintainability in mind. The result is a digital product that does not just look polished but consistently drives pipeline, retention, and revenue.",
  overviewBenefits: [
    "Senior engineers and product-minded delivery from day one",
    "Scalable architecture designed for growth and maintainability",
    "Transparent sprint planning and weekly stakeholder updates",
    "Conversion-focused UX patterns backed by analytics",
    "Performance and accessibility standards embedded by default",
    "Security-first implementation and deployment workflows",
  ],
  overviewImage: {
    url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1400&h=1000&fit=crop",
    alt: "Team planning modern web development roadmap",
  },
  processSteps: [
    {
      title: "Discovery & Strategy",
      deliverables: [
        "Stakeholder workshops and requirements mapping",
        "Business goals and KPI alignment",
        "Scope boundaries and risk register",
        "Delivery roadmap with milestones",
      ],
    },
    {
      title: "UI/UX Design",
      deliverables: [
        "Information architecture and user flows",
        "Low/high fidelity wireframes",
        "Design system foundations",
        "Interactive prototype validation",
      ],
    },
    {
      title: "Architecture & Tech Decisions",
      deliverables: [
        "Frontend/backend architecture blueprint",
        "Data model and API contract design",
        "Infrastructure and CI/CD decisions",
        "Security and observability baseline",
      ],
    },
    {
      title: "Agile Development",
      deliverables: [
        "Two-week sprint execution",
        "Feature delivery with code reviews",
        "Frequent demos and feedback loops",
        "Continuous integration and deployment",
      ],
    },
    {
      title: "QA & Optimization",
      deliverables: [
        "Functional and regression testing",
        "Performance and accessibility checks",
        "Cross-browser and device coverage",
        "Bug triage and release hardening",
      ],
    },
    {
      title: "Launch & Growth Support",
      deliverables: [
        "Production release and monitoring",
        "Analytics instrumentation",
        "Post-launch optimization backlog",
        "Long-term support and iteration plan",
      ],
    },
  ],
  technologies: [
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "Tailwind CSS",
    "AWS",
    "Vercel",
    "PostgreSQL",
    "MongoDB",
    "Docker",
    "Prisma",
    "Redis",
    "GraphQL",
    "Stripe",
  ],
  relatedProjects: [
    {
      slug: "lahebo-grc-platform",
      name: "Lahebo GRC Platform",
      outcome: "Reduced audit preparation time by 45% with role-based workflows.",
      thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=800&fit=crop",
    },
    {
      slug: "finflow-inc",
      name: "FinFlow Inc.",
      outcome: "Unified payment reconciliation and real-time finance reporting.",
      thumbnail: "/images/pexels-thisisengineering-3861958.jpg",
    },
    {
      slug: "shopverse",
      name: "ShopVerse",
      outcome: "Improved conversion with headless checkout architecture.",
      thumbnail: "/images/pexels-thisisengineering-3861967.jpg",
    },
    {
      slug: "propwise-realty",
      name: "PropWise Realty",
      outcome: "Unified listings, tours, and deal pipelines for agents.",
      thumbnail: "/images/pexels-olia-danilevich-4974912.jpg",
    },
  ],
  packages: [
    {
      name: "Starter",
      price: "$12k–$30k",
      timeline: "6–10 weeks",
      features: [
        "MVP planning and core feature delivery",
        "Responsive frontend and backend APIs",
        "Basic analytics and deployment setup",
        "QA coverage for critical flows",
      ],
      idealFor: "Startups validating product-market fit quickly.",
    },
    {
      name: "Growth",
      price: "$35k–$80k",
      timeline: "3–5 months",
      features: [
        "Advanced role-based workflows",
        "Scalable architecture and CI/CD",
        "Performance and SEO optimization",
        "Integrated analytics and experimentation",
      ],
      idealFor: "Growing SaaS and e-commerce teams scaling product capabilities.",
      isPopular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      timeline: "6+ months",
      features: [
        "Complex systems and multi-team workflows",
        "Security, compliance, and observability layers",
        "Dedicated cross-functional pod",
        "Long-term roadmap and optimization support",
      ],
      idealFor: "Enterprises modernizing mission-critical digital platforms.",
    },
  ],
  testimonials: [
    {
      name: "M. Aslam",
      role: "Head of Product",
      company: "FinEdge",
      quote:
        "Their team balanced speed and quality perfectly. We launched with confidence and saw immediate uplift in conversion.",
      photo: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=300&h=300&fit=crop",
    },
    {
      name: "Sara Khan",
      role: "COO",
      company: "ScaleGrid",
      quote:
        "Clear communication, no surprises, and a very strong engineering culture. They feel like an extension of our internal team.",
      photo: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=300&h=300&fit=crop",
    },
    {
      name: "D. Roberts",
      role: "Founder",
      company: "CommercePilot",
      quote:
        "From architecture to UX, every decision was tied to business outcomes. The quality of execution was exceptional.",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop",
    },
    {
      name: "Nadia Iqbal",
      role: "VP Operations",
      company: "CoreWorks",
      quote:
        "They helped us replace technical debt with a stable, future-ready platform and dramatically improved our delivery velocity.",
      photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&h=300&fit=crop",
    },
  ],
};