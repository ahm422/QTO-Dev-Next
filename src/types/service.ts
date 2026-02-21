export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  icon: string;
  features: string[];
  relatedProjects?: string[];
}
