/**
 * Industries We Serve section (issue #28): industry item data.
 */

export type IndustryIconKey =
  | "building"
  | "heart"
  | "cart"
  | "plane"
  | "monitor"
  | "rocket"
  | "globe"
  | "chart";

export interface IndustryItem {
  id: string;
  title: string;
  /** Display label e.g. "01." */
  number: string;
  /** Short description; UI prefixes with "— " */
  description: string;
  icon: IndustryIconKey;
}
