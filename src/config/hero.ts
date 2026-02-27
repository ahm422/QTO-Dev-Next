/**
 * Hero section copy and media config (issue #58).
 * Edit here to change background headline, LCD text lines, and media sources.
 */

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
  heading: "Beautiful Web Solutions for Modern Business",
  headingHighlight: "Beautiful",
  subtext:
    "We craft expressive, performant web experiences that turn attention into action.",
  ctaPrimary: "Get Started",
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
   * LCD screen: hero videos (Pexels assets). Paths are relative to /public.
   * Rotate between these to keep the hero feeling alive.
   */
  lcdVideos: [
    "/videos/hero/3130284-uhd_3840_2160_30fps.mp4",
    "/videos/hero/5473797-uhd_4096_2160_25fps.mp4",
    "/videos/hero/6804109-uhd_4096_2160_25fps.mp4",
    "/videos/hero/6963743-hd_1920_1080_25fps.mp4",
  ] as const,

  /**
   * Hero-specific images (Pexels). Used for subtle strips/collages around the LCD.
   * Paths are relative to /public.
   */
  heroImages: [
    "/images/pexels-thisisengineering-3861958.jpg",
    "/images/pexels-thisisengineering-3861964.jpg",
    "/images/pexels-thisisengineering-3861967.jpg",
    "/images/pexels-kevin-ku-92347-577585.jpg",
    "/images/pexels-olia-danilevich-4974912.jpg",
  ] as const,
} as const;
