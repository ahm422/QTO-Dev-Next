import type { ContentFaq } from "@/types/faq";

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
  faqs: ContentFaq[];
  image?: string;
  coverImage?: {
    url: string;
    alt: string;
  };
  readingTime: number;
}
