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
    slug: "finflow-inc",
    image: SECTION_IMAGES[0],
    order: 1,
  },
  {
    id: "2",
    caseNumber: "02",
    title: "MediTrack Health",
    category: "HEALTHCARE",
    slug: "meditrack-health",
    image: SECTION_IMAGES[1],
    order: 2,
  },
  {
    id: "3",
    caseNumber: "03",
    title: "ShopVerse",
    category: "E-COMMERCE",
    slug: "shopverse",
    image: SECTION_IMAGES[2],
    order: 3,
  },
  {
    id: "4",
    caseNumber: "04",
    title: "GreenChain Logistics",
    category: "LOGISTICS",
    slug: "greenchain-logistics",
    image: SECTION_IMAGES[3],
    order: 4,
  },
  {
    id: "5",
    caseNumber: "05",
    title: "PropWise Realty",
    category: "REAL ESTATE",
    slug: "propwise-realty",
    image: SECTION_IMAGES[4],
    order: 5,
  },
  {
    id: "6",
    caseNumber: "06",
    title: "LearnHub Education",
    category: "EDUCATION",
    slug: "learnhub-education",
    image: SECTION_IMAGES[5],
    order: 6,
  },
];
