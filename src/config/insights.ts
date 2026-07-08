/**
 * Insights section copy and labels (issue #34, #279).
 * Single featured blog card on the homepage.
 */

export const insightsConfig = {
  /** Small uppercase label above the main title */
  subtitle: "INSIGHTS",

  /** Main section title */
  title: "Latest from Our Blog",

  /** Description below the main title */
  description:
    "Thought leadership, technical deep dives, and industry trends curated by our team.",

  /** In-card link text for the featured article */
  readMoreLabel: "Read More",

  /** Browse-all CTA button text (links to /blogs) */
  readMoreCtaLabel: "Read More",

  /** View All Posts button text (legacy alias; prefer readMoreCtaLabel) */
  viewAllPostsLabel: "View All Posts",

  /** Default author when not using post.author (e.g. "QTO DEV Team") */
  authorLabel: "QTO DEV Team",

  /** Empty state when no published posts exist */
  emptyStateMessage: "No blog posts published yet. Check back soon.",
} as const;
