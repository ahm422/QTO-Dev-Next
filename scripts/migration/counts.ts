import type { PrismaClient as D1Client } from "@prisma/client";
import type { PrismaClient as PgClient } from "../../node_modules/.prisma/pg-source-client";
import { DERIVED_JOIN_CHECKS, ALL_TABLES, type TableName } from "./tables";
import { getPgPool } from "./pg-source";

export type RowCounts = Record<TableName, number>;

export type DerivedCounts = Record<string, number>;

export interface SnapshotResult {
  source: "postgres" | "d1";
  timestamp: string;
  counts: RowCounts;
  derived?: DerivedCounts;
}

const D1_COUNT_QUERIES: Record<TableName, (d1: D1Client) => Promise<number>> = {
  contacts: (d1) => d1.contact.count(),
  requirements: (d1) => d1.requirement.count(),
  services: (d1) => d1.service.count(),
  service_technology_tags: (d1) => d1.serviceTechnologyTag.count(),
  process_steps: (d1) => d1.processStep.count(),
  featured_works: (d1) => d1.featuredWork.count(),
  why_choose_us: (d1) => d1.whyChooseUs.count(),
  stats: (d1) => d1.stat.count(),
  testimonials: (d1) => d1.testimonial.count(),
  industries: (d1) => d1.industry.count(),
  engagement_models: (d1) => d1.engagementModel.count(),
  faqs: (d1) => d1.faq.count(),
  blog_posts: (d1) => d1.blogPost.count(),
  blog_post_tags: (d1) => d1.blogPostTag.count(),
  technologies: (d1) => d1.technology.count(),
  projects: (d1) => d1.project.count(),
  project_tags: (d1) => d1.projectTag.count(),
  project_tech_stack_items: (d1) => d1.projectTechStackItem.count(),
  work_values: (d1) => d1.workValue.count(),
  about_content: (d1) => d1.aboutContent.count(),
  team_members: (d1) => d1.teamMember.count(),
  jobs: (d1) => d1.job.count(),
  job_applications: (d1) => d1.jobApplication.count(),
  contact_info: (d1) => d1.contactInfo.count(),
  page_sections: (d1) => d1.pageSection.count(),
  site_config: (d1) => d1.siteConfig.count(),
  admin_users: (d1) => d1.adminUser.count(),
  refresh_tokens: (d1) => d1.refreshToken.count(),
  password_reset_tokens: (d1) => d1.passwordResetToken.count(),
  audit_logs: (d1) => d1.auditLog.count(),
};

const PG_COUNT_QUERIES: Record<TableName, (pg: PgClient) => Promise<number>> = {
  contacts: (pg) => pg.contact.count(),
  requirements: (pg) => pg.requirement.count(),
  services: (pg) => pg.service.count(),
  service_technology_tags: async () => 0, // join table — use derived check
  process_steps: (pg) => pg.processStep.count(),
  featured_works: (pg) => pg.featuredWork.count(),
  why_choose_us: (pg) => pg.whyChooseUs.count(),
  stats: (pg) => pg.stat.count(),
  testimonials: (pg) => pg.testimonial.count(),
  industries: (pg) => pg.industry.count(),
  engagement_models: (pg) => pg.engagementModel.count(),
  faqs: (pg) => pg.faq.count(),
  blog_posts: (pg) => pg.blogPost.count(),
  blog_post_tags: async () => 0,
  technologies: (pg) => pg.technology.count(),
  projects: (pg) => pg.project.count(),
  project_tags: async () => 0,
  project_tech_stack_items: async () => 0,
  work_values: (pg) => pg.workValue.count(),
  about_content: (pg) => pg.aboutContent.count(),
  team_members: (pg) => pg.teamMember.count(),
  jobs: (pg) => pg.job.count(),
  job_applications: (pg) => pg.jobApplication.count(),
  contact_info: (pg) => pg.contactInfo.count(),
  page_sections: (pg) => pg.pageSection.count(),
  site_config: (pg) => pg.siteConfig.count(),
  admin_users: (pg) => pg.adminUser.count(),
  refresh_tokens: (pg) => pg.refreshToken.count(),
  password_reset_tokens: (pg) => pg.passwordResetToken.count(),
  audit_logs: (pg) => pg.auditLog.count(),
};

export async function countD1Tables(d1: D1Client): Promise<RowCounts> {
  const counts = {} as RowCounts;
  for (const table of ALL_TABLES) {
    counts[table] = await D1_COUNT_QUERIES[table](d1);
  }
  return counts;
}

export async function countPostgresTables(pg: PgClient): Promise<RowCounts> {
  const counts = {} as RowCounts;
  for (const table of ALL_TABLES) {
    counts[table] = await PG_COUNT_QUERIES[table](pg);
  }
  return counts;
}

export async function countPostgresDerived(): Promise<DerivedCounts> {
  const pool = getPgPool();
  const derived: DerivedCounts = {};
  for (const check of DERIVED_JOIN_CHECKS) {
    const result = await pool.query<{ total: number }>(check.pgSql);
    derived[check.name] = result.rows[0]?.total ?? 0;
  }
  return derived;
}

export async function countD1Derived(d1: D1Client): Promise<DerivedCounts> {
  const derived: DerivedCounts = {};
  for (const check of DERIVED_JOIN_CHECKS) {
    derived[check.name] = await D1_COUNT_QUERIES[check.d1Table](d1);
  }
  return derived;
}
