/**
 * Hero section copy and media config (issue #58).
 * Edit here to change background headline, LCD text lines, and media sources.
 */

import { PEXELS_TECH_IMAGES } from "./pexelsImages";

export const heroConfig = {
  /**
   * Large decorative background headlines (wide hero typography).
   * The first entry is also used as a sensible default in places that expect a single string.
   */
  backgroundHeadlines: [
    "SITES THAT MOVE",
    "MODERN WEB, REAL IMPACT",
    "ENGINEERED FOR GROWTH",
  ] as const,

  /** Backwards-compatible single background headline (first of the list). */
  backgroundHeadline: "SITES THAT MOVE",

  /** Primary foreground copy; optional word to highlight in primary color */
  heading: "Engineering Smart Digital Solutions for Growing Businesses",
  headingHighlight: "Smart Digital Solutions",
  subtext:
    "We design and develop high-performance web applications, ERP systems, and business automation platforms that help companies scale efficiently and operate smarter.",
  ctaPrimary: "Request a Free Consultation",
  ctaPrimaryHref: "/contact",
  ctaSecondary: "View Services",
  ctaSecondaryHref: "/services",

  /**
   * LCD screen: rotating text lines (cycle through these).
   * Use short, punchy lines that describe services and outcomes.
   */
  lcdTextLines: [
    "SITES THAT ACTUALLY MOVE",
    "REACT & NEXT.JS ENGINEERING",
    "MOTION MEETS PERFORMANCE",
    "FROM IDEA TO LAUNCH",
  ],

  /**
   * Hero-specific images (Pexels). Used for LCD background and strips/collages around the LCD.
   * Sourced from shared Pexels tech imagery (issue #60).
   */
  heroImages: [
    PEXELS_TECH_IMAGES[0],
    PEXELS_TECH_IMAGES[1],
    PEXELS_TECH_IMAGES[2],
    PEXELS_TECH_IMAGES[3],
    PEXELS_TECH_IMAGES[4],
  ] as const,
} as const;
