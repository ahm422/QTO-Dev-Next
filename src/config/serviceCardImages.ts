/**
 * Slug → optimized static card image for homepage + /services grids.
 * Prefer these over CMS/Pexels paths so cards stay media-first and performant.
 */

export type ServiceCardImage = {
  src: string;
  alt: string;
};

const FALLBACK_SLUG = "web-development";

export const SERVICE_CARD_IMAGES: Record<string, ServiceCardImage> = {
  "web-development": {
    src: "/images/optimized/web-development-1920.webp",
    alt: "Web development — code and screens on a desk",
  },
  "mobile-development": {
    src: "/images/optimized/mobile-app-developement-1920.webp",
    alt: "Mobile app development on a smartphone",
  },
  "ui-ux-design": {
    src: "/images/optimized/ui-ux-design-1920.webp",
    alt: "UI/UX design workspaces and interfaces",
  },
  "ai-machine-learning": {
    src: "/images/optimized/ai-1920.webp",
    alt: "Artificial intelligence and machine learning visuals",
  },
  "cloud-devops": {
    src: "/images/optimized/devops-1920.webp",
    alt: "Cloud infrastructure and DevOps operations",
  },
  consulting: {
    src: "/images/optimized/technical-support-1920.webp",
    alt: "Technical consulting and support collaboration",
  },
};

/** Resolve card image for a service slug; unknown slugs fall back safely. */
export function getServiceCardImage(slug: string): ServiceCardImage {
  return (
    SERVICE_CARD_IMAGES[slug] ??
    SERVICE_CARD_IMAGES[FALLBACK_SLUG] ?? {
      src: "/images/optimized/web-development-1920.webp",
      alt: "Software service",
    }
  );
}
