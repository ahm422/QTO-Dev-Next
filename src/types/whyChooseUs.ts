import type { AppIconName } from "@/components/ui/shared/AppIcon";

/**
 * Why Choose Us section (issue #22): benefit item for icon cards.
 */

export interface WhyChooseUsItem {
  id: string;
  title: string;
  description: string;
  label?: string;
  /** Optional icon override; falls back to index-based default in the UI */
  icon?: AppIconName;
}
