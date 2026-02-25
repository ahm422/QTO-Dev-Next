/**
 * Engagement Models section (issue #30): one engagement model card.
 */

export interface EngagementModel {
  /** Option label (e.g. "OPTION 1") */
  optionNumber: string;
  title: string;
  description: string;
  /** Checkmarked feature list */
  features: string[];
  /** When true, show "MOST POPULAR" badge */
  isPopular: boolean;
  /** CTA link for "Get Started" (e.g. /contact?model=...) */
  getStartedHref: string;
}
