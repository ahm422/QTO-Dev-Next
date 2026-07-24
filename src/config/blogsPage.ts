/**
 * Blog listing page copy and section-level strings (issue #46).
 * CMS: blogs.page — edit in admin → Pages
 */

import { BLOG_NEWS_CATEGORY } from "@/config/blogCategories";

export const blogsPageConfig = {
  hero: {
    badge: "Blog",
    heading: "Ideas from the build floor",
    subhead:
      "Practical notes on development, performance, and product.",
    breadcrumbLabel: "Blog",
  },
  featured: {
    subtitle: "FEATURED",
    title: "Featured Articles",
    titleHighlight: "Featured",
    description:
      "Hand-picked reads on development, performance, and modern web.",
  },
  news: {
    subtitle: "NEWS",
    title: "Company News",
    titleHighlight: "News",
    description:
      "Updates from the QTO DEV team — launches, milestones, and announcements.",
    category: BLOG_NEWS_CATEGORY,
    limit: 3,
  },
  grid: {
    subtitle: "ALL POSTS",
    title: "Articles & Insights",
    titleHighlight: "Insights",
    description:
      "Browse all our posts on web development, React, performance, and more.",
  },
  filter: {
    allLabel: "All",
    searchPlaceholder: "Search articles...",
    activeTagLabel: "Tag",
    clearFiltersLabel: "Clear filters",
  },
  pagination: {
    pageSize: 9,
    prevLabel: "Previous",
    nextLabel: "Next",
    pageLabel: "Page",
    ofLabel: "of",
  },
  sidebar: {
    categoriesTitle: "Categories",
    postsTitle: "Popular Posts",
    postsLimit: 5,
    newsletterTitle: "Stay Updated",
  },
  readMoreLabel: "Read More",
  authorLabel: "QTO DEV Team",
  cta: {
    title: "Ready to Build Your Next Project?",
    description: "Turn ideas from our articles into real-world solutions with a team that ships high-performance software.",
    primaryButtonText: "Request a Free Consultation",
    primaryButtonHref: "/contact",
  },
} as const;

export type BlogsPageConfigType = typeof blogsPageConfig;

function resolvePageSize(rawPageSize: unknown): number {
  const n = Number(rawPageSize);
  return Number.isFinite(n) && n > 0 ? n : blogsPageConfig.pagination.pageSize;
}

function resolvePostsLimit(rawLimit: unknown): number {
  const n = Number(rawLimit);
  return Number.isFinite(n) && n > 0 ? n : blogsPageConfig.sidebar.postsLimit;
}

/** Deep-merge CMS JSON over defaults; guards invalid pagination.pageSize. */
export function mergeBlogsPageConfig(
  cms: Partial<BlogsPageConfigType> | null | undefined
): BlogsPageConfigType {
  if (!cms) return blogsPageConfig;

  const pageSize = resolvePageSize(cms.pagination?.pageSize);
  const postsLimit = resolvePostsLimit(cms.sidebar?.postsLimit);

  return {
    ...blogsPageConfig,
    ...cms,
    hero: { ...blogsPageConfig.hero, ...cms.hero },
    featured: { ...blogsPageConfig.featured, ...cms.featured },
    news: { ...blogsPageConfig.news, ...cms.news },
    grid: { ...blogsPageConfig.grid, ...cms.grid },
    filter: { ...blogsPageConfig.filter, ...cms.filter },
    pagination: { ...blogsPageConfig.pagination, ...cms.pagination, pageSize },
    sidebar: { ...blogsPageConfig.sidebar, ...cms.sidebar, postsLimit },
    cta: { ...blogsPageConfig.cta, ...cms.cta },
  };
}
