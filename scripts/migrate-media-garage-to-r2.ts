/**
 * Copy media objects from Garage to R2 and rewrite URL columns in D1.
 *
 * Usage:
 *   npx tsx scripts/migrate-media-garage-to-r2.ts --d1=staging --dry-run
 */
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { loadMigrationEnv, requireGarageEnv, requireR2Env } from "./migration/env";
import { parseMigrationCli } from "./migration/cli";
import { initD1Target, disconnectD1Target } from "./migration/d1-target";
import { parseStringArray, stringifyStringArray } from "../src/lib/metadata";

function normalizeEndpoint(raw: string, bucket: string): string {
  const trimmed = raw.replace(/\/$/, "");
  const suffix = `/${bucket}`;
  return trimmed.endsWith(suffix) ? trimmed.slice(0, -suffix.length) : trimmed;
}

function extractKey(url: string, garagePublicUrl: string): string | null {
  try {
    const parsed = new URL(url);
    const garageBase = new URL(garagePublicUrl);
    if (parsed.host === garageBase.host) {
      return parsed.pathname.replace(/^\//, "");
    }
    if (parsed.pathname.includes("media/")) {
      const idx = parsed.pathname.indexOf("media/");
      return parsed.pathname.slice(idx + 1);
    }
  } catch {
    if (url.startsWith("media/")) return url;
  }
  return null;
}

function isGarageUrl(url: string, garagePublicUrl: string): boolean {
  try {
    const parsed = new URL(url);
    const garageBase = new URL(garagePublicUrl);
    return parsed.host === garageBase.host || parsed.pathname.includes("/media/");
  } catch {
    return url.includes("media/");
  }
}

async function copyObject(
  garage: S3Client,
  r2: S3Client,
  garageBucket: string,
  r2Bucket: string,
  key: string,
  dryRun: boolean
): Promise<"copied" | "skipped" | "failed"> {
  try {
    await r2.send(new HeadObjectCommand({ Bucket: r2Bucket, Key: key }));
    return "skipped";
  } catch {
    // not in R2 yet
  }

  if (dryRun) return "copied";

  try {
    const obj = await garage.send(new GetObjectCommand({ Bucket: garageBucket, Key: key }));
    const body = await obj.Body?.transformToByteArray();
    if (!body) return "failed";

    await r2.send(
      new PutObjectCommand({
        Bucket: r2Bucket,
        Key: key,
        Body: body,
        ContentType: obj.ContentType,
      })
    );
    return "copied";
  } catch (err) {
    console.error(`  Failed to copy ${key}:`, err);
    return "failed";
  }
}

async function main() {
  loadMigrationEnv();
  const opts = parseMigrationCli({ d1: "local" });
  const garage = requireGarageEnv();
  const r2Env = requireR2Env();

  const garageClient = new S3Client({
    endpoint: normalizeEndpoint(garage.endpoint, garage.bucket),
    region: garage.region,
    credentials: {
      accessKeyId: garage.accessKeyId,
      secretAccessKey: garage.secretAccessKey,
    },
    forcePathStyle: true,
  });

  const r2Client = new S3Client({
    endpoint: normalizeEndpoint(r2Env.endpoint, r2Env.bucket),
    region: r2Env.region,
    credentials: {
      accessKeyId: r2Env.accessKeyId,
      secretAccessKey: r2Env.secretAccessKey,
    },
    forcePathStyle: true,
  });

  const d1 = await initD1Target(opts.d1);
  const publicUrl = (key: string) => `${r2Env.publicUrl}/${key}`;

  let objectsCopied = 0;
  let objectsSkipped = 0;
  let objectsFailed = 0;
  let urlsUpdated = 0;

  async function rewriteUrl(url: string | null | undefined): Promise<string | null | undefined> {
    if (!url || !isGarageUrl(url, garage.publicUrl)) return url;
    const key = extractKey(url, garage.publicUrl);
    if (!key) return url;

    const result = await copyObject(
      garageClient,
      r2Client,
      garage.bucket,
      r2Env.bucket,
      key,
      opts.dryRun
    );
    if (result === "copied") objectsCopied++;
    else if (result === "skipped") objectsSkipped++;
    else objectsFailed++;

    const newUrl = publicUrl(key);
    urlsUpdated++;
    return newUrl;
  }

  // services.image_url
  for (const row of await d1.service.findMany()) {
    const newUrl = await rewriteUrl(row.imageUrl);
    if (newUrl !== row.imageUrl && !opts.dryRun) {
      await d1.service.update({ where: { id: row.id }, data: { imageUrl: newUrl } });
    }
  }

  // featured_works.image_url
  for (const row of await d1.featuredWork.findMany()) {
    const newUrl = await rewriteUrl(row.imageUrl);
    if (newUrl !== row.imageUrl && !opts.dryRun) {
      await d1.featuredWork.update({ where: { id: row.id }, data: { imageUrl: newUrl } });
    }
  }

  // testimonials
  for (const row of await d1.testimonial.findMany()) {
    const mediaUrl = await rewriteUrl(row.mediaUrl);
    const avatarUrl = await rewriteUrl(row.avatarUrl);
    if (!opts.dryRun && (mediaUrl !== row.mediaUrl || avatarUrl !== row.avatarUrl)) {
      await d1.testimonial.update({
        where: { id: row.id },
        data: { mediaUrl: mediaUrl ?? null, avatarUrl: avatarUrl ?? null },
      });
    }
  }

  // blog_posts
  for (const row of await d1.blogPost.findMany()) {
    const newUrl = await rewriteUrl(row.imageUrl);
    if (newUrl !== row.imageUrl && !opts.dryRun) {
      await d1.blogPost.update({ where: { id: row.id }, data: { imageUrl: newUrl } });
    }
  }

  // projects
  for (const row of await d1.project.findMany()) {
    const coverImageUrl = await rewriteUrl(row.coverImageUrl);
    const images = parseStringArray(row.images);
    const newImages: string[] = [];
    let imagesChanged = false;
    for (const url of images) {
      const rewritten = await rewriteUrl(url);
      newImages.push(rewritten ?? url);
      if (rewritten !== url) imagesChanged = true;
    }
    if (!opts.dryRun && (coverImageUrl !== row.coverImageUrl || imagesChanged)) {
      await d1.project.update({
        where: { id: row.id },
        data: {
          coverImageUrl: coverImageUrl ?? null,
          images: stringifyStringArray(newImages),
        },
      });
    }
  }

  // about_content
  for (const row of await d1.aboutContent.findMany()) {
    const newUrl = await rewriteUrl(row.imageUrl);
    if (newUrl !== row.imageUrl && !opts.dryRun) {
      await d1.aboutContent.update({ where: { id: row.id }, data: { imageUrl: newUrl } });
    }
  }

  // team_members
  for (const row of await d1.teamMember.findMany()) {
    const newUrl = await rewriteUrl(row.avatarUrl);
    if (newUrl !== row.avatarUrl && !opts.dryRun) {
      await d1.teamMember.update({ where: { id: row.id }, data: { avatarUrl: newUrl } });
    }
  }

  // job_applications
  for (const row of await d1.jobApplication.findMany()) {
    const newUrl = await rewriteUrl(row.resumeUrl);
    if (newUrl !== row.resumeUrl && !opts.dryRun) {
      await d1.jobApplication.update({ where: { id: row.id }, data: { resumeUrl: newUrl } });
    }
  }

  console.log("\nMedia migration summary:");
  console.table({
    objectsCopied,
    objectsSkipped,
    objectsFailed,
    urlsUpdated,
    dryRun: opts.dryRun,
  });

  if (objectsFailed > 0) process.exit(1);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => disconnectD1Target());
