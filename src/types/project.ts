export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  image?: string;
  featured: boolean;
  category: string;
  tags: string[];
  technologies: string[];
  link?: string;
  caseStudy?: boolean;
}
