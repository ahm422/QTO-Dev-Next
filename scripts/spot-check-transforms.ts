/**
 * Spot-check high-risk transforms between Postgres source and D1 target.
 *
 * Usage:
 *   npx tsx scripts/spot-check-transforms.ts --d1=local --sample=10
 *   npx tsx scripts/spot-check-transforms.ts --d1=staging --check-urls
 */
import { loadMigrationEnv } from "./migration/env";
import { parseMigrationCli } from "./migration/cli";
import { initPgSource, disconnectPgSource } from "./migration/pg-source";
import { initD1Target, disconnectD1Target } from "./migration/d1-target";
import { parseMetadata, parseStringArray } from "../src/lib/metadata";
import { orderedTagValues } from "../src/lib/prisma/arrayFields";
import { deepEqual, sampleIds } from "./migration/transforms";

interface Mismatch {
  model: string;
  id: string;
  field: string;
  message: string;
}

const URL_COLUMNS: { model: string; table: string; columns: string[] }[] = [
  { model: "Service", table: "services", columns: ["imageUrl"] },
  { model: "FeaturedWork", table: "featured_works", columns: ["imageUrl"] },
  { model: "Testimonial", table: "testimonials", columns: ["mediaUrl", "avatarUrl"] },
  { model: "BlogPost", table: "blog_posts", columns: ["imageUrl"] },
  { model: "Project", table: "projects", columns: ["coverImageUrl", "images"] },
  { model: "AboutContent", table: "about_content", columns: ["imageUrl"] },
  { model: "TeamMember", table: "team_members", columns: ["avatarUrl"] },
  { model: "JobApplication", table: "job_applications", columns: ["resumeUrl"] },
];

function arraysEqual(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

async function main() {
  loadMigrationEnv();
  const opts = parseMigrationCli({ d1: "local", sample: 10 });

  const pg = await initPgSource();
  const d1 = await initD1Target(opts.d1);
  const mismatches: Mismatch[] = [];
  const garageHost = process.env.GARAGE_PUBLIC_URL
    ? new URL(process.env.GARAGE_PUBLIC_URL).host
    : null;
  const r2Host = process.env.R2_PUBLIC_URL ? new URL(process.env.R2_PUBLIC_URL).host : null;

  // EngagementModel features
  {
    const pgRows = await pg.engagementModel.findMany();
    for (const id of sampleIds(pgRows, opts.sample)) {
      const src = pgRows.find((r) => r.id === id)!;
      const tgt = await d1.engagementModel.findUnique({ where: { id } });
      if (!tgt) {
        mismatches.push({ model: "EngagementModel", id, field: "row", message: "missing in D1" });
        continue;
      }
      if (!arraysEqual(parseStringArray(tgt.features), src.features ?? [])) {
        mismatches.push({ model: "EngagementModel", id, field: "features", message: "array mismatch" });
      }
    }
  }

  // Services: features + technologyTags
  {
    const pgRows = await pg.service.findMany();
    for (const id of sampleIds(pgRows, opts.sample)) {
      const src = pgRows.find((r) => r.id === id)!;
      const tgt = await d1.service.findUnique({
        where: { id },
        include: { technologyTags: true },
      });
      if (!tgt) {
        mismatches.push({ model: "Service", id, field: "row", message: "missing in D1" });
        continue;
      }
      if (!arraysEqual(parseStringArray(tgt.features), src.features ?? [])) {
        mismatches.push({ model: "Service", id, field: "features", message: "array mismatch" });
      }
      if (!arraysEqual(orderedTagValues(tgt.technologyTags), src.technologyTags ?? [])) {
        mismatches.push({ model: "Service", id, field: "technologyTags", message: "join mismatch" });
      }
    }
  }

  // FeaturedWork tags
  {
    const pgRows = await pg.featuredWork.findMany();
    for (const id of sampleIds(pgRows, opts.sample)) {
      const src = pgRows.find((r) => r.id === id)!;
      const tgt = await d1.featuredWork.findUnique({ where: { id } });
      if (!tgt) {
        mismatches.push({ model: "FeaturedWork", id, field: "row", message: "missing in D1" });
        continue;
      }
      if (!arraysEqual(parseStringArray(tgt.tags), src.tags ?? [])) {
        mismatches.push({ model: "FeaturedWork", id, field: "tags", message: "array mismatch" });
      }
    }
  }

  // Industry bulletPoints
  {
    const pgRows = await pg.industry.findMany();
    for (const id of sampleIds(pgRows, opts.sample)) {
      const src = pgRows.find((r) => r.id === id)!;
      const tgt = await d1.industry.findUnique({ where: { id } });
      if (!tgt) {
        mismatches.push({ model: "Industry", id, field: "row", message: "missing in D1" });
        continue;
      }
      if (!arraysEqual(parseStringArray(tgt.bulletPoints), src.bulletPoints ?? [])) {
        mismatches.push({ model: "Industry", id, field: "bulletPoints", message: "array mismatch" });
      }
    }
  }

  // BlogPost tags
  {
    const pgRows = await pg.blogPost.findMany();
    for (const id of sampleIds(pgRows, opts.sample)) {
      const src = pgRows.find((r) => r.id === id)!;
      const tgt = await d1.blogPost.findUnique({ where: { id }, include: { tags: true } });
      if (!tgt) {
        mismatches.push({ model: "BlogPost", id, field: "row", message: "missing in D1" });
        continue;
      }
      if (!arraysEqual(orderedTagValues(tgt.tags), src.tags ?? [])) {
        mismatches.push({ model: "BlogPost", id, field: "tags", message: "join mismatch" });
      }
    }
  }

  // Project tags, techStack, results, images
  {
    const pgRows = await pg.project.findMany();
    for (const id of sampleIds(pgRows, opts.sample)) {
      const src = pgRows.find((r) => r.id === id)!;
      const tgt = await d1.project.findUnique({
        where: { id },
        include: { tags: true, techStack: true },
      });
      if (!tgt) {
        mismatches.push({ model: "Project", id, field: "row", message: "missing in D1" });
        continue;
      }
      if (!arraysEqual(orderedTagValues(tgt.tags), src.tags ?? [])) {
        mismatches.push({ model: "Project", id, field: "tags", message: "join mismatch" });
      }
      if (!arraysEqual(orderedTagValues(tgt.techStack), src.techStack ?? [])) {
        mismatches.push({ model: "Project", id, field: "techStack", message: "join mismatch" });
      }
      if (!arraysEqual(parseStringArray(tgt.results), src.results ?? [])) {
        mismatches.push({ model: "Project", id, field: "results", message: "array mismatch" });
      }
      if (!arraysEqual(parseStringArray(tgt.images), src.images ?? [])) {
        mismatches.push({ model: "Project", id, field: "images", message: "array mismatch" });
      }
    }
  }

  // Job requirements / niceToHave
  {
    const pgRows = await pg.job.findMany();
    for (const id of sampleIds(pgRows, opts.sample)) {
      const src = pgRows.find((r) => r.id === id)!;
      const tgt = await d1.job.findUnique({ where: { id } });
      if (!tgt) {
        mismatches.push({ model: "Job", id, field: "row", message: "missing in D1" });
        continue;
      }
      if (!arraysEqual(parseStringArray(tgt.requirements), src.requirements ?? [])) {
        mismatches.push({ model: "Job", id, field: "requirements", message: "array mismatch" });
      }
      if (!arraysEqual(parseStringArray(tgt.niceToHave), src.niceToHave ?? [])) {
        mismatches.push({ model: "Job", id, field: "niceToHave", message: "array mismatch" });
      }
    }
  }

  // Metadata models
  const metadataChecks = [
    { name: "Contact", pg: () => pg.contact.findMany(), d1: (id: string) => d1.contact.findUnique({ where: { id } }) },
    { name: "Requirement", pg: () => pg.requirement.findMany(), d1: (id: string) => d1.requirement.findUnique({ where: { id } }) },
    { name: "AboutContent", pg: () => pg.aboutContent.findMany(), d1: (id: string) => d1.aboutContent.findUnique({ where: { id } }) },
    { name: "JobApplication", pg: () => pg.jobApplication.findMany(), d1: (id: string) => d1.jobApplication.findUnique({ where: { id } }) },
    { name: "AuditLog", pg: () => pg.auditLog.findMany(), d1: (id: string) => d1.auditLog.findUnique({ where: { id } }) },
  ] as const;

  for (const check of metadataChecks) {
    const pgRows = await check.pg();
    for (const id of sampleIds(pgRows, opts.sample)) {
      const src = pgRows.find((r) => r.id === id)!;
      const tgt = await check.d1(id);
      if (!tgt) {
        mismatches.push({ model: check.name, id, field: "row", message: "missing in D1" });
        continue;
      }
      const srcMeta = (src as { metadata?: unknown }).metadata ?? null;
      const tgtMeta = parseMetadata((tgt as { metadata?: string | null }).metadata);
      if (!deepEqual(srcMeta, tgtMeta)) {
        mismatches.push({ model: check.name, id, field: "metadata", message: "JSON mismatch" });
      }
    }
  }

  // PageSection data
  {
    const pgRows = await pg.pageSection.findMany();
    for (const id of sampleIds(pgRows.map((r) => ({ id: r.slug })), opts.sample)) {
      const src = pgRows.find((r) => r.slug === id)!;
      const tgt = await d1.pageSection.findUnique({ where: { slug: id } });
      if (!tgt) {
        mismatches.push({ model: "PageSection", id, field: "row", message: "missing in D1" });
        continue;
      }
      const srcData = src.data ?? {};
      const tgtData = parseMetadata(tgt.data) ?? {};
      if (!deepEqual(srcData, tgtData)) {
        mismatches.push({ model: "PageSection", id, field: "data", message: "JSON mismatch" });
      }
    }
  }

  // URL checks (post media migration)
  if (opts.checkUrls && garageHost) {
    for (const { model, columns } of URL_COLUMNS) {
      if (model === "Service") {
        const rows = await d1.service.findMany();
        for (const row of rows) {
          for (const col of columns) {
            const url = row[col as keyof typeof row] as string | null;
            if (url && url.includes(garageHost)) {
              mismatches.push({
                model,
                id: row.id,
                field: col,
                message: `still uses Garage host (${garageHost})`,
              });
            }
          }
        }
      } else if (model === "FeaturedWork") {
        const rows = await d1.featuredWork.findMany();
        for (const row of rows) {
          if (row.imageUrl?.includes(garageHost)) {
            mismatches.push({ model, id: row.id, field: "imageUrl", message: `Garage URL` });
          }
        }
      } else if (model === "Testimonial") {
        const rows = await d1.testimonial.findMany();
        for (const row of rows) {
          for (const col of ["mediaUrl", "avatarUrl"] as const) {
            const url = row[col];
            if (url?.includes(garageHost)) {
              mismatches.push({ model, id: row.id, field: col, message: `Garage URL` });
            }
          }
        }
      } else if (model === "BlogPost") {
        const rows = await d1.blogPost.findMany();
        for (const row of rows) {
          if (row.imageUrl?.includes(garageHost)) {
            mismatches.push({ model, id: row.id, field: "imageUrl", message: `Garage URL` });
          }
        }
      } else if (model === "Project") {
        const rows = await d1.project.findMany();
        for (const row of rows) {
          if (row.coverImageUrl?.includes(garageHost)) {
            mismatches.push({ model, id: row.id, field: "coverImageUrl", message: `Garage URL` });
          }
          for (const url of parseStringArray(row.images)) {
            if (url.includes(garageHost)) {
              mismatches.push({ model, id: row.id, field: "images", message: `Garage URL in array` });
            }
          }
        }
      } else if (model === "AboutContent") {
        const rows = await d1.aboutContent.findMany();
        for (const row of rows) {
          if (row.imageUrl?.includes(garageHost)) {
            mismatches.push({ model, id: row.id, field: "imageUrl", message: `Garage URL` });
          }
        }
      } else if (model === "TeamMember") {
        const rows = await d1.teamMember.findMany();
        for (const row of rows) {
          if (row.avatarUrl?.includes(garageHost)) {
            mismatches.push({ model, id: row.id, field: "avatarUrl", message: `Garage URL` });
          }
        }
      } else if (model === "JobApplication") {
        const rows = await d1.jobApplication.findMany();
        for (const row of rows) {
          if (row.resumeUrl?.includes(garageHost)) {
            mismatches.push({ model, id: row.id, field: "resumeUrl", message: `Garage URL` });
          }
        }
      }
    }

    if (r2Host) {
      console.log(`URL check: expecting R2 host ${r2Host}, flagging Garage host ${garageHost}`);
    }
  }

  if (mismatches.length > 0) {
    console.error(`\n${mismatches.length} mismatch(es):`);
    console.table(mismatches);
    process.exit(1);
  }

  console.log(`\nSpot-check passed (sample=${opts.sample}${opts.checkUrls ? ", urls checked" : ""}).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await disconnectPgSource();
    await disconnectD1Target();
  });
