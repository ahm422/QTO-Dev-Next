/**
 * Portfolio section (issue #18): case card data for the homepage Portfolio grid.
 */

export type PortfolioGradientKey =
  | "blue-purple"
  | "grey"
  | "dark"
  | "orange"
  | "green"
  | "red";

export interface PortfolioCase {
  caseNumber: string;
  companyName: string;
  industry: string;
  initial: string;
  gradient: PortfolioGradientKey;
  slug?: string;
  /** Image URL for card (e.g. from PEXELS_TECH_IMAGES). When set, card shows image instead of gradient+initial. */
  image?: string;
  /** Alt text for the card image (accessibility). */
  imageAlt?: string;
}
