export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  icon: string;
  features: string[];
  relatedProjects?: string[];
  /** Two columns of bullets for detail panel (left column, right column) */
  bulletColumns?: [string[], string[]];
  /** Technology tags shown as pills in detail panel */
  technologyTags?: string[];
  /** Override for "Learn more" link; defaults to /services/{slug} */
  learnMoreHref?: string;
}
