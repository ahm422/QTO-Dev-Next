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
}
