import type { PrismaClient as D1Client } from "@prisma/client";
import type { PrismaClient as PgClient } from "../../node_modules/.prisma/pg-source-client";
import type { TableName, TableStats } from "./tables";
import {
  stringifyMetadata,
  stringifyStringArray,
  arrayToJoinRows,
} from "./transforms";

const BATCH_SIZE = 100;

function batch<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

async function migrateSimple<T extends { id: string }>(
  read: () => Promise<T[]>,
  map: (row: T) => Record<string, unknown>,
  write: (rows: Record<string, unknown>[]) => Promise<{ count: number }>,
  dryRun: boolean
): Promise<TableStats> {
  const rows = await read();
  const stats = { read: rows.length, written: 0, children: 0, errors: 0 };
  if (dryRun || rows.length === 0) return stats;

  const mapped = rows.map(map);
  for (const chunk of batch(mapped, BATCH_SIZE)) {
    const result = await write(chunk);
    stats.written += result.count;
  }
  return stats;
}

// ─── Leaf CMS tables ─────────────────────────────────────────────────────────

async function migrateProcessSteps(pg: PgClient, d1: D1Client, dryRun: boolean): Promise<TableStats> {
  return migrateSimple(
    () => pg.processStep.findMany(),
    (r) => ({ ...r }),
    (rows) => d1.processStep.createMany({ data: rows as never[] }),
    dryRun
  );
}

async function migrateFeaturedWorks(pg: PgClient, d1: D1Client, dryRun: boolean): Promise<TableStats> {
  return migrateSimple(
    () => pg.featuredWork.findMany(),
    (r) => ({ ...r, tags: stringifyStringArray(r.tags) }),
    (rows) => d1.featuredWork.createMany({ data: rows as never[], }),
    dryRun
  );
}

async function migrateWhyChooseUs(pg: PgClient, d1: D1Client, dryRun: boolean): Promise<TableStats> {
  return migrateSimple(
    () => pg.whyChooseUs.findMany(),
    (r) => ({ ...r }),
    (rows) => d1.whyChooseUs.createMany({ data: rows as never[], }),
    dryRun
  );
}

async function migrateStats(pg: PgClient, d1: D1Client, dryRun: boolean): Promise<TableStats> {
  return migrateSimple(
    () => pg.stat.findMany(),
    (r) => ({ ...r }),
    (rows) => d1.stat.createMany({ data: rows as never[], }),
    dryRun
  );
}

async function migrateTestimonials(pg: PgClient, d1: D1Client, dryRun: boolean): Promise<TableStats> {
  return migrateSimple(
    () => pg.testimonial.findMany(),
    (r) => ({ ...r }),
    (rows) => d1.testimonial.createMany({ data: rows as never[], }),
    dryRun
  );
}

async function migrateIndustries(pg: PgClient, d1: D1Client, dryRun: boolean): Promise<TableStats> {
  return migrateSimple(
    () => pg.industry.findMany(),
    (r) => ({ ...r, bulletPoints: stringifyStringArray(r.bulletPoints) }),
    (rows) => d1.industry.createMany({ data: rows as never[], }),
    dryRun
  );
}

async function migrateEngagementModels(pg: PgClient, d1: D1Client, dryRun: boolean): Promise<TableStats> {
  return migrateSimple(
    () => pg.engagementModel.findMany(),
    (r) => ({ ...r, features: stringifyStringArray(r.features) }),
    (rows) => d1.engagementModel.createMany({ data: rows as never[], }),
    dryRun
  );
}

async function migrateFaqs(pg: PgClient, d1: D1Client, dryRun: boolean): Promise<TableStats> {
  return migrateSimple(
    () => pg.faq.findMany(),
    (r) => ({ ...r }),
    (rows) => d1.faq.createMany({ data: rows as never[], }),
    dryRun
  );
}

async function migrateTechnologies(pg: PgClient, d1: D1Client, dryRun: boolean): Promise<TableStats> {
  return migrateSimple(
    () => pg.technology.findMany(),
    (r) => ({ ...r }),
    (rows) => d1.technology.createMany({ data: rows as never[], }),
    dryRun
  );
}

async function migrateWorkValues(pg: PgClient, d1: D1Client, dryRun: boolean): Promise<TableStats> {
  return migrateSimple(
    () => pg.workValue.findMany(),
    (r) => ({ ...r }),
    (rows) => d1.workValue.createMany({ data: rows as never[], }),
    dryRun
  );
}

async function migrateAboutContent(pg: PgClient, d1: D1Client, dryRun: boolean): Promise<TableStats> {
  return migrateSimple(
    () => pg.aboutContent.findMany(),
    (r) => ({ ...r, metadata: stringifyMetadata(r.metadata) }),
    (rows) => d1.aboutContent.createMany({ data: rows as never[], }),
    dryRun
  );
}

async function migrateTeamMembers(pg: PgClient, d1: D1Client, dryRun: boolean): Promise<TableStats> {
  return migrateSimple(
    () => pg.teamMember.findMany(),
    (r) => ({ ...r }),
    (rows) => d1.teamMember.createMany({ data: rows as never[], }),
    dryRun
  );
}

async function migrateContactInfo(pg: PgClient, d1: D1Client, dryRun: boolean): Promise<TableStats> {
  return migrateSimple(
    () => pg.contactInfo.findMany(),
    (r) => ({ ...r }),
    (rows) => d1.contactInfo.createMany({ data: rows as never[], }),
    dryRun
  );
}

async function migrateSiteConfig(pg: PgClient, d1: D1Client, dryRun: boolean): Promise<TableStats> {
  return migrateSimple(
    () => pg.siteConfig.findMany(),
    (r) => ({ ...r }),
    (rows) => d1.siteConfig.createMany({ data: rows as never[], }),
    dryRun
  );
}

async function migratePageSections(pg: PgClient, d1: D1Client, dryRun: boolean): Promise<TableStats> {
  return migrateSimple(
    () => pg.pageSection.findMany(),
    (r) => ({
      ...r,
      data: r.data == null ? "{}" : stringifyMetadata(r.data) ?? "{}",
    }),
    (rows) => d1.pageSection.createMany({ data: rows as never[], }),
    dryRun
  );
}

// ─── Parent + join tables ────────────────────────────────────────────────────

async function migrateServices(pg: PgClient, d1: D1Client, dryRun: boolean): Promise<TableStats> {
  const rows = await pg.service.findMany();
  const stats = { read: rows.length, written: 0, children: 0, errors: 0 };

  for (const r of rows) {
    const tags = arrayToJoinRows(r.id, "serviceId", r.technologyTags ?? []);
    stats.children += tags.length;

    if (dryRun) continue;

    try {
      await d1.$transaction([
        d1.service.create({
          data: {
            id: r.id,
            slug: r.slug,
            title: r.title,
            shortDescription: r.shortDescription,
            description: r.description,
            icon: r.icon,
            features: stringifyStringArray(r.features),
            imageUrl: r.imageUrl,
            imageAlt: r.imageAlt,
            order: r.order,
            isPublished: r.isPublished,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
          },
        }),
        d1.serviceTechnologyTag.createMany({ data: tags }),
      ]);
      stats.written += 1;
    } catch (err) {
      console.error(`  Error migrating service id=${r.id}:`, err);
      stats.errors += 1;
      throw err;
    }
  }
  return stats;
}

async function migrateServiceTechnologyTags(): Promise<TableStats> {
  return { read: 0, written: 0, children: 0, errors: 0 };
}

async function migrateBlogPosts(pg: PgClient, d1: D1Client, dryRun: boolean): Promise<TableStats> {
  const rows = await pg.blogPost.findMany();
  const stats = { read: rows.length, written: 0, children: 0, errors: 0 };

  for (const r of rows) {
    const tags = arrayToJoinRows(r.id, "blogPostId", r.tags ?? []);
    stats.children += tags.length;
    if (dryRun) continue;

    try {
      await d1.$transaction([
        d1.blogPost.create({
          data: {
            id: r.id,
            slug: r.slug,
            title: r.title,
            excerpt: r.excerpt,
            content: r.content,
            category: r.category,
            author: r.author,
            imageUrl: r.imageUrl,
            imageAlt: r.imageAlt,
            readTime: r.readTime,
            isFeatured: r.isFeatured,
            isHeadline: r.isHeadline,
            isPublished: r.isPublished,
            publishedAt: r.publishedAt,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
          },
        }),
        d1.blogPostTag.createMany({ data: tags }),
      ]);
      stats.written += 1;
    } catch (err) {
      console.error(`  Error migrating blog_post id=${r.id}:`, err);
      stats.errors += 1;
      throw err;
    }
  }
  return stats;
}

async function migrateBlogPostTags(): Promise<TableStats> {
  return { read: 0, written: 0, children: 0, errors: 0 };
}

async function migrateProjects(pg: PgClient, d1: D1Client, dryRun: boolean): Promise<TableStats> {
  const rows = await pg.project.findMany();
  const stats = { read: rows.length, written: 0, children: 0, errors: 0 };

  for (const r of rows) {
    const tagRows = arrayToJoinRows(r.id, "projectId", r.tags ?? []);
    const stackRows = arrayToJoinRows(r.id, "projectId", r.techStack ?? []);
    stats.children += tagRows.length + stackRows.length;
    if (dryRun) continue;

    try {
      await d1.$transaction([
        d1.project.create({
          data: {
            id: r.id,
            slug: r.slug,
            title: r.title,
            client: r.client,
            category: r.category,
            excerpt: r.excerpt,
            description: r.description,
            challenge: r.challenge,
            solution: r.solution,
            results: stringifyStringArray(r.results),
            coverImageUrl: r.coverImageUrl,
            images: stringifyStringArray(r.images),
            liveUrl: r.liveUrl,
            isFeatured: r.isFeatured,
            order: r.order,
            isPublished: r.isPublished,
            completedAt: r.completedAt,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
          },
        }),
        d1.projectTag.createMany({ data: tagRows }),
        d1.projectTechStackItem.createMany({ data: stackRows }),
      ]);
      stats.written += 1;
    } catch (err) {
      console.error(`  Error migrating project id=${r.id}:`, err);
      stats.errors += 1;
      throw err;
    }
  }
  return stats;
}

async function migrateProjectTags(): Promise<TableStats> {
  return { read: 0, written: 0, children: 0, errors: 0 };
}

async function migrateProjectTechStackItems(): Promise<TableStats> {
  return { read: 0, written: 0, children: 0, errors: 0 };
}

async function migrateJobs(pg: PgClient, d1: D1Client, dryRun: boolean): Promise<TableStats> {
  return migrateSimple(
    () => pg.job.findMany(),
    (r) => ({
      ...r,
      requirements: stringifyStringArray(r.requirements),
      niceToHave: stringifyStringArray(r.niceToHave),
    }),
    (rows) => d1.job.createMany({ data: rows as never[], }),
    dryRun
  );
}

async function migrateJobApplications(pg: PgClient, d1: D1Client, dryRun: boolean): Promise<TableStats> {
  return migrateSimple(
    () => pg.jobApplication.findMany(),
    (r) => ({ ...r, metadata: stringifyMetadata(r.metadata) }),
    (rows) => d1.jobApplication.createMany({ data: rows as never[], }),
    dryRun
  );
}

async function migrateContacts(pg: PgClient, d1: D1Client, dryRun: boolean): Promise<TableStats> {
  return migrateSimple(
    () => pg.contact.findMany(),
    (r) => ({ ...r, metadata: stringifyMetadata(r.metadata) }),
    (rows) => d1.contact.createMany({ data: rows as never[], }),
    dryRun
  );
}

async function migrateRequirements(pg: PgClient, d1: D1Client, dryRun: boolean): Promise<TableStats> {
  return migrateSimple(
    () => pg.requirement.findMany(),
    (r) => ({ ...r, metadata: stringifyMetadata(r.metadata) }),
    (rows) => d1.requirement.createMany({ data: rows as never[], }),
    dryRun
  );
}

async function migrateAdminUsers(pg: PgClient, d1: D1Client, dryRun: boolean): Promise<TableStats> {
  return migrateSimple(
    () => pg.adminUser.findMany(),
    (r) => ({ ...r }),
    (rows) => d1.adminUser.createMany({ data: rows as never[], }),
    dryRun
  );
}

async function migrateRefreshTokens(pg: PgClient, d1: D1Client, dryRun: boolean): Promise<TableStats> {
  return migrateSimple(
    () => pg.refreshToken.findMany(),
    (r) => ({ ...r }),
    (rows) => d1.refreshToken.createMany({ data: rows as never[], }),
    dryRun
  );
}

async function migratePasswordResetTokens(pg: PgClient, d1: D1Client, dryRun: boolean): Promise<TableStats> {
  return migrateSimple(
    () => pg.passwordResetToken.findMany(),
    (r) => ({ ...r }),
    (rows) => d1.passwordResetToken.createMany({ data: rows as never[], }),
    dryRun
  );
}

async function migrateAuditLogs(pg: PgClient, d1: D1Client, dryRun: boolean): Promise<TableStats> {
  return migrateSimple(
    () => pg.auditLog.findMany(),
    (r) => ({ ...r, metadata: stringifyMetadata(r.metadata) }),
    (rows) => d1.auditLog.createMany({ data: rows as never[], }),
    dryRun
  );
}

type Migrator = (pg: PgClient, d1: D1Client, dryRun: boolean) => Promise<TableStats>;

const MIGRATORS: Record<TableName, Migrator> = {
  process_steps: migrateProcessSteps,
  featured_works: migrateFeaturedWorks,
  why_choose_us: migrateWhyChooseUs,
  stats: migrateStats,
  testimonials: migrateTestimonials,
  industries: migrateIndustries,
  engagement_models: migrateEngagementModels,
  faqs: migrateFaqs,
  technologies: migrateTechnologies,
  work_values: migrateWorkValues,
  about_content: migrateAboutContent,
  team_members: migrateTeamMembers,
  contact_info: migrateContactInfo,
  site_config: migrateSiteConfig,
  page_sections: migratePageSections,
  services: migrateServices,
  service_technology_tags: () => migrateServiceTechnologyTags(),
  blog_posts: migrateBlogPosts,
  blog_post_tags: () => migrateBlogPostTags(),
  projects: migrateProjects,
  project_tags: () => migrateProjectTags(),
  project_tech_stack_items: () => migrateProjectTechStackItems(),
  jobs: migrateJobs,
  job_applications: migrateJobApplications,
  contacts: migrateContacts,
  requirements: migrateRequirements,
  admin_users: migrateAdminUsers,
  refresh_tokens: migrateRefreshTokens,
  password_reset_tokens: migratePasswordResetTokens,
  audit_logs: migrateAuditLogs,
};

export async function runMigration(
  table: TableName,
  pg: PgClient,
  d1: D1Client,
  dryRun: boolean
): Promise<TableStats> {
  const migrator = MIGRATORS[table];
  if (!migrator) {
    throw new Error(`No migrator for table ${table}`);
  }
  return migrator(pg, d1, dryRun);
}
