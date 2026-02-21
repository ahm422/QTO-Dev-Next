import { BlogPost } from '@/types/blog';
import { blogPosts } from '@/data/blog';

/**
 * Get a blog post by slug
 */
export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const post = blogPosts.find((p) => p.slug === slug);
  return post || null;
}

/**
 * Get related blog posts by category
 */
export async function getRelatedBlogPosts(
  category: string,
  excludeSlug: string,
  limit: number = 3
): Promise<BlogPost[]> {
  return blogPosts
    .filter((p) => p.category === category && p.slug !== excludeSlug)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, limit);
}

/**
 * Get all blog posts sorted by date
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return blogPosts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/**
 * Search blog posts by query
 */
export async function searchBlogPosts(query: string): Promise<BlogPost[]> {
  const lowerQuery = query.toLowerCase();
  return blogPosts.filter(
    (p) =>
      p.title.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get featured blog posts
 */
export async function getFeaturedBlogPosts(limit: number = 3): Promise<BlogPost[]> {
  return blogPosts
    .filter((p) => p.featured)
    .slice(0, limit);
}

/**
 * Get blog posts by category
 */
export async function getBlogPostsByCategory(
  category: string,
  limit?: number
): Promise<BlogPost[]> {
  let results = blogPosts.filter((p) => p.category === category);
  if (limit) {
    results = results.slice(0, limit);
  }
  return results;
}

/**
 * Get all unique categories
 */
export async function getAllCategories(): Promise<string[]> {
  const categories = new Set(blogPosts.map((p) => p.category));
  return Array.from(categories).sort();
}

/**
 * Get all unique tags
 */
export async function getAllTags(): Promise<string[]> {
  const tags = new Set<string>();
  blogPosts.forEach((p) => p.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}
