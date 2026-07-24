/**
 * Shared blog category presets for admin UX and News section matching.
 * News on /blogs uses exact string equality with blogsPageConfig.news.category.
 */

export const BLOG_NEWS_CATEGORY = "Company News" as const;

/** Suggested categories in admin (datalist). Free-text custom values still allowed. */
export const BLOG_CATEGORY_PRESETS = [
  BLOG_NEWS_CATEGORY,
  "Web Development",
  "Performance",
  "React",
  "CSS",
] as const;
