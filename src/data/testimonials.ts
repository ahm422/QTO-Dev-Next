import type { TestimonialItem } from "@/types/testimonials";
import { PEXELS_TECH_IMAGES } from "@/config/pexelsImages";

/**
 * Testimonial items for the homepage (issue #26).
 * Uses Pexels tech imagery from public/images/ (issue #60).
 */
export const testimonialsItems: TestimonialItem[] = [
  {
    id: "sarah-chan-netflow",
    quote:
      "QTO Dev delivered a robust fintech platform that exceeded our expectations. Their team's technical depth and commitment to quality helped us launch on time and scale with confidence.",
    authorName: "Sarah Chan",
    authorTitle: "CTO",
    company: "NetFlow Inc.",
    mediaType: "image",
    mediaUrl: PEXELS_TECH_IMAGES[4],
  },
  {
    id: "marcus-reid-techflow",
    quote:
      "From discovery to deployment, the process was transparent and professional. We now have a scalable solution that our users love.",
    authorName: "Marcus Reid",
    authorTitle: "Product Director",
    company: "TechFlow",
    mediaType: "image",
    mediaUrl: PEXELS_TECH_IMAGES[5],
  },
];
