import type { FeaturedWorkItem } from "@/types/featuredWork";
import { PEXELS_TECH_IMAGES } from "@/config/pexelsImages";

/** Pexels tech imagery for featured work (issue #60). */
const SECTION_IMAGES = [
  PEXELS_TECH_IMAGES[0],
  PEXELS_TECH_IMAGES[1],
  PEXELS_TECH_IMAGES[2],
  PEXELS_TECH_IMAGES[3],
  PEXELS_TECH_IMAGES[4],
  PEXELS_TECH_IMAGES[5],
] as const;

/**
 * Featured work items for the homepage project showcase (issue #20).
 * Uses images from public/images/ for consistent design.
 */
export const featuredWorkItems: FeaturedWorkItem[] = [
  {
    id: "1",
    caseNumber: "01",
    title: "FinFlow Inc.",
    category: "FINTECH",
    description:
      "Payment infrastructure and analytics platform for modern finance teams. Streamlined reconciliation and real-time reporting.",
    slug: "finflow-inc",
    image: SECTION_IMAGES[0],
    order: 1,
  },
  {
    id: "2",
    caseNumber: "02",
    title: "MediTrack Health",
    category: "HEALTHCARE",
    description:
      "Patient and wellness tracking app with secure records and care coordination. Built for clinics and telehealth.",
    slug: "meditrack-health",
    image: SECTION_IMAGES[1],
    order: 2,
  },
  {
    id: "3",
    caseNumber: "03",
    title: "ShopVerse",
    category: "E-COMMERCE",
    description:
      "Headless commerce and storefront for brands scaling online. Custom checkout, inventory, and multi-channel sales.",
    slug: "shopverse",
    image: SECTION_IMAGES[2],
    order: 3,
  },
  {
    id: "4",
    caseNumber: "04",
    title: "GreenChain Logistics",
    category: "LOGISTICS",
    description:
      "End-to-end supply chain visibility and route optimization. Reduces emissions and delivery times for fleet operators.",
    slug: "greenchain-logistics",
    image: SECTION_IMAGES[3],
    order: 4,
  },
  {
    id: "5",
    caseNumber: "05",
    title: "PropWise Realty",
    category: "REAL ESTATE",
    description:
      "Property listings, virtual tours, and deal management for agents and developers. From search to closing.",
    slug: "propwise-realty",
    image: SECTION_IMAGES[4],
    order: 5,
  },
  {
    id: "6",
    caseNumber: "06",
    title: "LearnHub Education",
    category: "EDUCATION",
    description:
      "Learning management and course platform for schools and training providers. Assessments, progress tracking, and certifications.",
    slug: "learnhub-education",
    image: SECTION_IMAGES[5],
    order: 6,
  },
];
