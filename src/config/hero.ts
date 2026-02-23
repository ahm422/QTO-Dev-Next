/**
 * Hero section copy and media config (issue #5).
 * Edit here to change background headline, LCD text lines, and video sources.
 */

export const heroConfig = {
  /** Large decorative background headline (Img2 style) */
  backgroundHeadline: "SITES THAT MOVE",

  /** Primary foreground copy */
  heading: "Beautiful Web Solutions for Modern Business",
  subtext:
    "We build fast, scalable, and beautiful web applications that drive growth",
  ctaPrimary: "Get Started",
  ctaSecondary: "Learn More",

  /** LCD screen: rotating text lines (cycle through these) */
  lcdTextLines: [
    "THE BEST STORIES / DESERVE TO BE TOLD",
    "QTO DEV",
    "CHASING THE ELEMENTS",
    "SINCE 2020",
  ],

  /** LCD screen: video sources (optional; use empty array for text-only). Paths relative to public. */
  lcdVideos: ["/videos/hero/hero-loop.mp4"] as const,
} as const;
