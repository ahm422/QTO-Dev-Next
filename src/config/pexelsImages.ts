/**
 * Shared Pexels tech imagery (issue #60), hosted on R2 (issue #370).
 * Single source of truth for tech-focused fallback images.
 * Used by hero, About Company, blog, testimonials, and featured work.
 */

import { staticImageUrl } from "@/config/staticImages";

export const PEXELS_TECH_IMAGES = [
  staticImageUrl("/images/pexels-thisisengineering-3861958.jpg"),
  staticImageUrl("/images/pexels-thisisengineering-3861964.jpg"),
  staticImageUrl("/images/pexels-thisisengineering-3861967.jpg"),
  staticImageUrl("/images/pexels-kevin-ku-92347-577585.jpg"),
  staticImageUrl("/images/pexels-olia-danilevich-4974912.jpg"),
  staticImageUrl("/images/pexels-djordje-petrovic-590080-2102416.jpg"),
  staticImageUrl("/images/pexels-fotios-photos-16129728.jpg"),
  staticImageUrl("/images/pexels-mikhail-nilov-7988079.jpg"),
  staticImageUrl("/images/pexels-pixabay-256219.jpg"),
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
