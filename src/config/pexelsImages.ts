/**
 * Shared Pexels tech imagery (issue #60).
 * Single source of truth for tech-focused images under public/images/.
 * Used by hero, About Company, blog, testimonials, and featured work.
 */

export const PEXELS_TECH_IMAGES = [
  "/images/pexels-thisisengineering-3861958.jpg",
  "/images/pexels-thisisengineering-3861964.jpg",
  "/images/pexels-thisisengineering-3861967.jpg",
  "/images/pexels-kevin-ku-92347-577585.jpg",
  "/images/pexels-olia-danilevich-4974912.jpg",
  "/images/pexels-djordje-petrovic-590080-2102416.jpg",
  "/images/pexels-fotios-photos-16129728.jpg",
  "/images/pexels-mikhail-nilov-7988079.jpg",
  "/images/pexels-pixabay-256219.jpg",
] as const;

/** Tech-focused alt text suggestions for reuse (e.g. About Company, blog covers). */
export const PEXELS_ALT_TECH = [
  "Software development team collaboration",
  "Product design and code review",
  "Developer workspace with multiple monitors",
  "Code and technology focus",
  "Team working on digital product",
  "Tech team collaboration",
  "Software engineering workspace",
  "Development and design collaboration",
  "Modern tech workspace",
] as const;
