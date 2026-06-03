import { BlogPost } from '@/types/blog';
import { findAllPublishedBlogPosts, findBlogPostBySlug } from '@/lib/cms/blog';

async function getSortedPosts(): Promise<BlogPost[]> {
  const posts = await findAllPublishedBlogPosts();
  return [...posts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/**
 * Get a blog post by slug
 */
export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  return findBlogPostBySlug(slug);
}

/**
 * Get related blog posts by category
 */
export async function getRelatedBlogPosts(
  category: string,
  excludeSlug: string,
  limit: number = 3
): Promise<BlogPost[]> {
  const blogPosts = await getSortedPosts();
  return blogPosts
    .filter((p) => p.category === category && p.slug !== excludeSlug)
    .slice(0, limit);
}

/**
 * Get all blog posts sorted by date
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return getSortedPosts();
}

/**
 * Get latest blog posts (first N by date, for Insights "Latest Posts")
 */
export async function getLatestBlogPosts(limit: number): Promise<BlogPost[]> {
  const sorted = await getSortedPosts();
  return sorted.slice(0, limit);
}

/**
 * Get headline blog posts (next N after latest, for Insights "Headline Posts")
 */
export async function getHeadlineBlogPosts(
  limit: number,
  skipCount: number = 2
): Promise<BlogPost[]> {
  const sorted = await getSortedPosts();
  return sorted.slice(skipCount, skipCount + limit);
}

/**
 * Search blog posts by query
 */
export async function searchBlogPosts(query: string): Promise<BlogPost[]> {
  const lowerQuery = query.toLowerCase();
  const blogPosts = await getSortedPosts();
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
  const blogPosts = await getSortedPosts();
  return blogPosts.filter((p) => p.featured).slice(0, limit);
}

/**
 * Get blog posts by category
 */
export async function getBlogPostsByCategory(
  category: string,
  limit?: number
): Promise<BlogPost[]> {
  let results = (await getSortedPosts()).filter((p) => p.category === category);
  if (limit) {
    results = results.slice(0, limit);
  }
  return results;
}

/**
 * Get all unique categories
 */
export async function getAllCategories(): Promise<string[]> {
  const blogPosts = await getSortedPosts();
  const categories = new Set(blogPosts.map((p) => p.category));
  return Array.from(categories).sort();
}

/**
 * Get all unique tags
 */
export async function getAllTags(): Promise<string[]> {
  const blogPosts = await getSortedPosts();
  const tags = new Set<string>();
  blogPosts.forEach((p) => p.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}
