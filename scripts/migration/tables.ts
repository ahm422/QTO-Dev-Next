/** All 30 D1 tables in snake_case (DB table names). */
export const ALL_TABLES = [
  "contacts",
  "requirements",
  "services",
  "service_technology_tags",
  "process_steps",
  "featured_works",
  "why_choose_us",
  "stats",
  "testimonials",
  "industries",
  "engagement_models",
  "faqs",
  "blog_posts",
  "blog_post_tags",
  "technologies",
  "projects",
  "project_tags",
  "project_tech_stack_items",
  "work_values",
  "about_content",
  "team_members",
  "jobs",
  "job_applications",
  "contact_info",
  "page_sections",
  "site_config",
  "admin_users",
  "refresh_tokens",
  "password_reset_tokens",
  "audit_logs",
] as const;

export type TableName = (typeof ALL_TABLES)[number];

/** Parent tables whose row counts should match Phase 0 snapshot exactly. */
export const PARENT_TABLES: TableName[] = [
  "contacts",
  "requirements",
  "services",
  "process_steps",
  "featured_works",
  "why_choose_us",
  "stats",
  "testimonials",
  "industries",
  "engagement_models",
  "faqs",
  "blog_posts",
  "technologies",
  "projects",
  "work_values",
  "about_content",
  "team_members",
  "jobs",
  "job_applications",
  "contact_info",
  "page_sections",
  "site_config",
  "admin_users",
  "refresh_tokens",
  "password_reset_tokens",
  "audit_logs",
];

/** FK-safe migration order (parent before children). */
export const MIGRATION_ORDER: TableName[] = [
  "process_steps",
  "featured_works",
  "why_choose_us",
  "stats",
  "testimonials",
  "industries",
  "engagement_models",
  "faqs",
  "technologies",
  "work_values",
  "about_content",
  "team_members",
  "contact_info",
  "site_config",
  "page_sections",
  "services",
  "service_technology_tags",
  "blog_posts",
  "blog_post_tags",
  "projects",
  "project_tags",
  "project_tech_stack_items",
  "jobs",
  "job_applications",
  "contacts",
  "requirements",
  "admin_users",
  "refresh_tokens",
  "password_reset_tokens",
  "audit_logs",
];

/** Reverse order for wipe (children first). */
export const WIPE_ORDER: TableName[] = [...MIGRATION_ORDER].reverse();

/** Derived join-table checks: Postgres array sum vs D1 join row count. */
export const DERIVED_JOIN_CHECKS = [
  {
    name: "service_technology_tags",
    pgSql: `SELECT COALESCE(SUM(cardinality(technology_tags)), 0)::int AS total FROM services`,
    d1Table: "service_technology_tags" as TableName,
  },
  {
    name: "blog_post_tags",
    pgSql: `SELECT COALESCE(SUM(cardinality(tags)), 0)::int AS total FROM blog_posts`,
    d1Table: "blog_post_tags" as TableName,
  },
  {
    name: "project_tags",
    pgSql: `SELECT COALESCE(SUM(cardinality(tags)), 0)::int AS total FROM projects`,
    d1Table: "project_tags" as TableName,
  },
  {
    name: "project_tech_stack_items",
    pgSql: `SELECT COALESCE(SUM(cardinality(tech_stack)), 0)::int AS total FROM projects`,
    d1Table: "project_tech_stack_items" as TableName,
  },
] as const;

export interface TableStats {
  read: number;
  written: number;
  children: number;
  errors: number;
}

export function emptyStats(): TableStats {
  return { read: 0, written: 0, children: 0, errors: 0 };
}
