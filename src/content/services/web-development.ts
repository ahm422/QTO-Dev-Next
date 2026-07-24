import type { AppIconName } from "@/components/ui/shared/AppIcon";

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

export interface ServiceContentCard {
  title: string;
  description: string;
  icon?: AppIconName;
}

export interface ServiceProjectCard {
  slug: string;
  name: string;
  thumbnail: string;
  challenge: string;
  solution: string;
  tech: string[];
  result: string;
  /** @deprecated Prefer `result` for detail-page cards */
  outcome?: string;
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
  /** Legacy overview prose — retained for mapper/CMS back-compat; not shown on detail IA */
  overviewText: string;
  overviewBenefits: string[];
  overviewImage: { url: string; alt: string };
  deliverables: ServiceContentCard[];
  problemsWeSolve: ServiceContentCard[];
  processSteps: ProcessStep[];
  approachSupportChips: string[];
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
    "Great web products are not built by chance. They are built through disciplined strategy, clear communication, and technical execution that supports business goals.",
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
  deliverables: [
    {
      title: "Custom Web Applications",
      description:
        "Bespoke apps tailored to your workflows, users, and growth model—not off-the-shelf templates.",
      icon: "laptop-code",
    },
    {
      title: "SaaS & MVPs",
      description:
        "Launch-ready SaaS products and MVPs with clear architecture so you can iterate without rewrites.",
      icon: "rocket",
    },
    {
      title: "Dashboards & Analytics",
      description:
        "Operational and executive dashboards that turn data into decisions with role-based views.",
      icon: "chart-line",
    },
    {
      title: "E-commerce Platforms",
      description:
        "Headless and custom commerce experiences optimized for conversion, inventory, and peak load.",
      icon: "cart-shopping",
    },
    {
      title: "CRM & ERP Systems",
      description:
        "Internal platforms that replace spreadsheets with reliable pipelines, permissions, and reporting.",
      icon: "building",
    },
    {
      title: "Integrations & Maintenance",
      description:
        "API integrations, ongoing support, and performance hardening so your product stays production-ready.",
      icon: "gear",
    },
  ],
  problemsWeSolve: [
    {
      title: "Manual, error-prone processes",
      description:
        "Teams lose hours to spreadsheets and handoffs. We digitize workflows with ownership and audit trails.",
      icon: "list",
    },
    {
      title: "Outdated or brittle applications",
      description:
        "Legacy stacks slow shipping and scare talent. We modernize without a risky big-bang rewrite.",
      icon: "server",
    },
    {
      title: "Poor performance & UX",
      description:
        "Slow pages and confusing flows kill conversion. We rebuild critical paths for speed and clarity.",
      icon: "bolt",
    },
    {
      title: "Disconnected systems",
      description:
        "Data silos block decisions. We connect tools with clean APIs and a single source of truth.",
      icon: "share-nodes",
    },
    {
      title: "Scalability bottlenecks",
      description:
        "Traffic and team growth break fragile setups. We design for load, observability, and safe releases.",
      icon: "arrow-trending-up",
    },
    {
      title: "Unclear product direction",
      description:
        "Vague roadmaps waste budget. We align requirements, architecture, and delivery milestones early.",
      icon: "compass",
    },
  ],
  processSteps: [
    {
      title: "Requirements & Architecture",
      deliverables: [
        "Stakeholder workshops and requirements mapping",
        "Business goals and KPI alignment",
        "Architecture blueprint and tech decisions",
        "Delivery roadmap with milestones",
      ],
    },
    {
      title: "UI Development",
      deliverables: [
        "Information architecture and user flows",
        "Design system foundations",
        "Responsive UI implementation",
        "Interactive validation with stakeholders",
      ],
    },
    {
      title: "Backend & Integrations",
      deliverables: [
        "API contracts and data model",
        "Core business logic and auth",
        "Third-party and internal integrations",
        "CI/CD and environment setup",
      ],
    },
    {
      title: "Testing",
      deliverables: [
        "Functional and regression coverage",
        "Performance and accessibility checks",
        "Cross-browser and device QA",
        "Release hardening and bug triage",
      ],
    },
    {
      title: "Launch & Support",
      deliverables: [
        "Production release and monitoring",
        "Analytics instrumentation",
        "Post-launch optimization backlog",
        "Ongoing support and iteration plan",
      ],
    },
  ],
  approachSupportChips: [
    "Project communication",
    "QA",
    "Security",
    "Deployment",
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
      thumbnail:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=800&fit=crop",
      challenge:
        "Manual spreadsheet-driven compliance slowed audits and hid risk across teams.",
      solution:
        "Role-based GRC platform with automated evidence workflows and real-time dashboards.",
      tech: ["Next.js", "TypeScript", "PostgreSQL", "AWS"],
      result: "45% faster audit preparation with clearer executive visibility.",
      outcome: "Reduced audit preparation time by 45% with role-based workflows.",
    },
    {
      slug: "finflow-inc",
      name: "FinFlow Inc.",
      thumbnail: "/images/pexels-thisisengineering-3861958.jpg",
      challenge:
        "Payment reconciliation lived in spreadsheets across banks and processors.",
      solution:
        "Unified payment infrastructure with exception queues and scheduled finance reports.",
      tech: ["Next.js", "PostgreSQL", "Stripe", "TypeScript"],
      result: "Faster daily reconciliation and real-time exception visibility.",
      outcome: "Unified payment reconciliation and real-time finance reporting.",
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
