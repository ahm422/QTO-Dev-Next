/**
 * Insights section copy and labels (issue #34).
 * "Latest from Our Blog" — header, two-column layout (Latest Posts, Headline Posts).
 */

export const insightsConfig = {
  /** Small uppercase label above the main title */
  subtitle: "INSIGHTS",

  /** Main section title */
  title: "Latest from Our Blog",

  /** Description below the main title */
  description:
    "Thought leadership, technical deep dives, and industry trends curated by our team.",

  /** Left column heading */
  latestPostsLabel: "Latest Posts",

  /** Right column heading */
  headlinePostsLabel: "Headline Posts",

  /** Label for "Today: DD Month YYYY" */
  todayLabel: "Today",

  /** Read More link text */
  readMoreLabel: "Read More",

  /** View All Posts button text */
  viewAllPostsLabel: "View All Posts",

  /** Default author when not using post.author (e.g. "QTO DEV Team") */
  authorLabel: "QTO DEV Team",
} as const;
