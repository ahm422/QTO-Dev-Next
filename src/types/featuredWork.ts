/**
 * Featured Work section (issue #20): item data for the homepage project showcase.
 */

export interface FeaturedWorkItem {
  id: string;
  caseNumber: string;
  title: string;
  category: string;
  /** Short description for the Featured Work section (issue #73). */
  description?: string;
  slug: string;
  image: string;
  order?: number;
}
