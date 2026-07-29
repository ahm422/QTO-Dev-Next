/**
 * Shared blog category presets for admin UX and News section matching.
 * News on /blogs uses exact string equality with blogsPageConfig.news.category.
 */

export const BLOG_NEWS_CATEGORY = "Company News" as const;

/** Suggested categories in admin. Free-text custom values still allowed. */
export const BLOG_CATEGORY_PRESETS = [
  BLOG_NEWS_CATEGORY,
  "Web Development",
  "Performance",
  "React",
  "CSS",
] as const;

/** Trim whitespace and map case-insensitive matches onto canonical presets. */
export function normalizeBlogCategory(raw: string): string {
  const trimmed = raw.trim();
  const match = BLOG_CATEGORY_PRESETS.find(
    (p) => p.toLowerCase() === trimmed.toLowerCase()
  );
  return match ?? trimmed;
}
