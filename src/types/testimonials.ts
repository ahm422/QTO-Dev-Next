/**
 * Testimonials section (issue #26): testimonial item data.
 */

export type TestimonialMediaType = "none" | "image" | "video";

export interface TestimonialItem {
  id: string;
  /** Testimonial quote text */
  quote: string;
  /** Author display name */
  authorName: string;
  /** Job title, e.g. "CTO" */
  authorTitle: string;
  /** Company name */
  company: string;
  /** Optional avatar image URL (e.g. from public/images/) */
  avatar?: string;
  /** CMS media type */
  mediaType?: TestimonialMediaType;
  /** Public Garage/CDN URL for image or video */
  mediaUrl?: string;
  /** Alt text for images; optional poster URL for video if http(s) image */
  mediaAlt?: string;
}
