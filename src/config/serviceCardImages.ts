/**
 * Slug → optimized service card image (R2-hosted, issue #370).
 * Prefer these over CMS/Pexels paths so cards stay media-first and performant.
 */

import { staticImageUrl } from "@/config/staticImages";

export type ServiceCardImage = {
  src: string;
  alt: string;
};

const FALLBACK_SLUG = "web-development";

export const SERVICE_CARD_IMAGES: Record<string, ServiceCardImage> = {
  "web-development": {
    src: staticImageUrl("/images/optimized/web-development-1920.webp"),
    alt: "Web development — code and screens on a desk",
  },
  "mobile-development": {
    src: staticImageUrl("/images/optimized/mobile-app-developement-1920.webp"),
    alt: "Mobile app development on a smartphone",
  },
  "ui-ux-design": {
    src: staticImageUrl("/images/optimized/ui-ux-design-1920.webp"),
    alt: "UI/UX design workspaces and interfaces",
  },
  "ai-machine-learning": {
    src: staticImageUrl("/images/optimized/ai-1920.webp"),
    alt: "Artificial intelligence and machine learning visuals",
  },
  "cloud-devops": {
    src: staticImageUrl("/images/optimized/devops-1920.webp"),
    alt: "Cloud infrastructure and DevOps operations",
  },
  consulting: {
    src: staticImageUrl("/images/optimized/technical-support-1920.webp"),
    alt: "Technical consulting and support collaboration",
  },
};

/** Resolve card image for a service slug; unknown slugs fall back safely. */
export function getServiceCardImage(slug: string): ServiceCardImage {
  return (
    SERVICE_CARD_IMAGES[slug] ??
    SERVICE_CARD_IMAGES[FALLBACK_SLUG] ?? {
      src: staticImageUrl("/images/optimized/web-development-1920.webp"),
      alt: "Software service",
    }
  );
}
