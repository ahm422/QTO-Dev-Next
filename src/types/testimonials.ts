/**
 * Testimonials section (issue #26): testimonial item data.
 */

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
  /** Optional video URL for play button / modal */
  videoUrl?: string;
  /** Optional thumbnail for right-column media block */
  thumbnailUrl?: string;
}
