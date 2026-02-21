export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  excerpt?: string;
  content: string;
  author: string;
  authorImage?: string;
  publishedAt: string;
  updatedAt: string;
  featured: boolean;
  category: string;
  tags: string[];
  image?: string;
  coverImage?: {
    url: string;
    alt: string;
  };
  readingTime: number;
}
