/**
 * Stats & Numbers section (issue #24): stat card item.
 */

export type StatsNumbersVariant = "default" | "gold" | "dark";

export interface StatsNumbersItem {
  id: string;
  /** Card label, e.g. "Projects Delivered" */
  label: string;
  /** Display value, e.g. "+120", "98%" */
  value: string;
  description: string;
  variant: StatsNumbersVariant;
}
