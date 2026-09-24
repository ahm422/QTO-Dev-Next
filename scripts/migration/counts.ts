import type { PrismaClient as D1Client } from "@prisma/client";
import { DERIVED_JOIN_CHECKS, ALL_TABLES, type TableName } from "./tables";

export type RowCounts = Record<TableName, number>;

export type DerivedCounts = Record<string, number>;

export interface SnapshotResult {
  source: "d1";
  timestamp: string;
  counts: RowCounts;
  derived?: DerivedCounts;
}

const D1_COUNT_QUERIES: Record<TableName, (d1: D1Client) => Promise<number>> = {
  contacts: (d1) => d1.contact.count(),
  requirements: (d1) => d1.requirement.count(),
  services: (d1) => d1.service.count(),
  service_technology_tags: (d1) => d1.serviceTechnologyTag.count(),
  service_faqs: (d1) => d1.serviceFaq.count(),
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
  blog_post_faqs: (d1) => d1.blogPostFaq.count(),
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

export async function countD1Tables(d1: D1Client): Promise<RowCounts> {
  const counts = {} as RowCounts;
  for (const table of ALL_TABLES) {
    counts[table] = await D1_COUNT_QUERIES[table](d1);
  }
  return counts;
}

export async function countD1Derived(d1: D1Client): Promise<DerivedCounts> {
  const derived: DerivedCounts = {};
  for (const check of DERIVED_JOIN_CHECKS) {
    derived[check.name] = await D1_COUNT_QUERIES[check.d1Table](d1);
  }
  return derived;
}
