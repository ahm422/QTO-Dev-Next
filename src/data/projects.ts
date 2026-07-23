import { Project } from "@/types/project";
import { PEXELS_TECH_IMAGES } from "@/config/pexelsImages";

/**
 * Seed projects for CMS / homepage portfolio.
 * First six align with featured-work brand cards (issue #317).
 */
export const projects: Project[] = [
  {
    id: "1",
    slug: "finflow-inc",
    title: "FinFlow Inc.",
    image: PEXELS_TECH_IMAGES[0],
    shortDescription:
      "Payment infrastructure and analytics platform for modern finance teams. Streamlined reconciliation and real-time reporting.",
    description:
      "Built payment infrastructure and analytics for FinFlow so finance teams can reconcile faster, monitor cash flow in real time, and ship reporting without spreadsheet chaos.",
    featured: true,
    category: "Fintech",
    tags: ["Fintech", "Payments", "Analytics"],
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "Tailwind CSS"],
    caseStudy: true,
  },
  {
    id: "2",
    slug: "meditrack-health",
    title: "MediTrack Health",
    image: PEXELS_TECH_IMAGES[1],
    shortDescription:
      "Patient and wellness tracking app with secure records and care coordination. Built for clinics and telehealth.",
    description:
      "Delivered a secure patient and wellness tracking platform for MediTrack, connecting clinics and telehealth teams with shared records, care plans, and coordination workflows.",
    featured: true,
    category: "Healthcare",
    tags: ["Healthcare", "HIPAA", "Mobile"],
    technologies: ["React Native", "Next.js", "Node.js", "PostgreSQL", "AWS"],
    caseStudy: true,
  },
  {
    id: "3",
    slug: "shopverse",
    title: "ShopVerse",
    image: PEXELS_TECH_IMAGES[2],
    shortDescription:
      "Headless commerce and storefront for brands scaling online. Custom checkout, inventory, and multi-channel sales.",
    description:
      "Launched a headless commerce stack for ShopVerse with custom checkout, inventory sync, and multi-channel sales so brands can scale without fighting a rigid monolith.",
    featured: true,
    category: "E-commerce",
    tags: ["E-commerce", "Headless", "Checkout"],
    technologies: ["Next.js", "Shopify Hydrogen", "Node.js", "Redis", "Stripe"],
    caseStudy: true,
  },
  {
    id: "4",
    slug: "greenchain-logistics",
    title: "GreenChain Logistics",
    image: PEXELS_TECH_IMAGES[3],
    shortDescription:
      "End-to-end supply chain visibility and route optimization. Reduces emissions and delivery times for fleet operators.",
    description:
      "Built supply-chain visibility and route optimization for GreenChain so fleet operators cut emissions, shorten delivery windows, and see every handoff in one place.",
    featured: true,
    category: "Logistics",
    tags: ["Logistics", "Fleet", "Sustainability"],
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Mapbox", "AWS"],
    caseStudy: true,
  },
  {
    id: "5",
    slug: "propwise-realty",
    title: "PropWise Realty",
    image: PEXELS_TECH_IMAGES[4],
    shortDescription:
      "Property listings, virtual tours, and deal management for agents and developers. From search to closing.",
    description:
      "Designed and developed PropWise for agents and developers—listings, virtual tours, and deal pipelines that take buyers from search to closing without tool-switching.",
    featured: true,
    category: "Real Estate",
    tags: ["Real Estate", "Listings", "CRM"],
    technologies: ["Next.js", "Tailwind CSS", "PostgreSQL", "Cloudinary", "Vercel"],
    caseStudy: true,
  },
  {
    id: "6",
    slug: "learnhub-education",
    title: "LearnHub Education",
    image: PEXELS_TECH_IMAGES[5],
    shortDescription:
      "Learning management and course platform for schools and training providers. Assessments, progress tracking, and certifications.",
    description:
      "Shipped LearnHub as an LMS for schools and training providers—courses, assessments, progress tracking, and certifications in one modern web platform.",
    featured: true,
    category: "Education",
    tags: ["Education", "LMS", "SaaS"],
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Mux", "Tailwind CSS"],
    caseStudy: true,
  },
  {
    id: "7",
    slug: "lahebo-grc-platform",
    title: "Lahebo GRC Platform",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&h=600&fit=crop",
    shortDescription:
      "Reduced compliance cycle time and improved audit readiness across distributed teams.",
    description:
      "Modernized Lahebo’s legacy compliance workflows into a unified GRC platform with real-time risk visibility, policy tracking, and audit evidence management.",
    featured: false,
    category: "Governance, Risk & Compliance",
    tags: ["GRC", "SaaS", "Compliance"],
    technologies: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Redis", "AWS"],
    caseStudy: true,
  },
];
