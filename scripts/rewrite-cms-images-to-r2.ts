/**
 * Rewrite legacy /images/... CMS URL columns to R2 static URLs (issue #370).
 *
 * Usage:
 *   npx tsx scripts/rewrite-cms-images-to-r2.ts --d1=local --dry-run
 *   npx tsx scripts/rewrite-cms-images-to-r2.ts --d1=local
 *   npx tsx scripts/rewrite-cms-images-to-r2.ts --d1=staging
 */
import { loadMigrationEnv } from "./migration/env";
import { parseCliD1Target } from "./migration/cli";
import { initD1Target, disconnectD1Target } from "./migration/d1-target";
import { resolveMediaUrl } from "../src/config/staticImages";
import { parseStringArray, stringifyStringArray } from "../src/lib/metadata";

function hasFlag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

function rewrite(url: string | null | undefined): string | null | undefined {
  if (!url) return url;
  if (!url.startsWith("/images/")) return url;
  return resolveMediaUrl(url) ?? url;
}

async function main() {
  loadMigrationEnv();
  const dryRun = hasFlag("dry-run");
  const d1 = await initD1Target(parseCliD1Target("local"));

  let updated = 0;

  for (const row of await d1.featuredWork.findMany()) {
    const imageUrl = rewrite(row.imageUrl);
    if (imageUrl !== row.imageUrl) {
      console.log(`featured_works ${row.title}: ${row.imageUrl} → ${imageUrl}`);
      if (!dryRun) {
        await d1.featuredWork.update({
          where: { id: row.id },
          data: { imageUrl: imageUrl ?? null },
        });
      }
      updated++;
    }
  }

  for (const row of await d1.service.findMany()) {
    const imageUrl = rewrite(row.imageUrl);
    if (imageUrl !== row.imageUrl) {
      console.log(`services ${row.title}: ${row.imageUrl} → ${imageUrl}`);
      if (!dryRun) {
        await d1.service.update({
          where: { id: row.id },
          data: { imageUrl: imageUrl ?? null },
        });
      }
      updated++;
    }
  }

  for (const row of await d1.blogPost.findMany()) {
    const imageUrl = rewrite(row.imageUrl);
    if (imageUrl !== row.imageUrl) {
      console.log(`blog_posts ${row.title}: ${row.imageUrl} → ${imageUrl}`);
      if (!dryRun) {
        await d1.blogPost.update({
          where: { id: row.id },
          data: { imageUrl: imageUrl ?? null },
        });
      }
      updated++;
    }
  }

  for (const row of await d1.testimonial.findMany()) {
    const mediaUrl = rewrite(row.mediaUrl);
    const avatarUrl = rewrite(row.avatarUrl);
    if (mediaUrl !== row.mediaUrl || avatarUrl !== row.avatarUrl) {
      console.log(`testimonials ${row.clientName}: media/avatar rewritten`);
      if (!dryRun) {
        await d1.testimonial.update({
          where: { id: row.id },
          data: {
            mediaUrl: mediaUrl ?? null,
            avatarUrl: avatarUrl ?? null,
          },
        });
      }
      updated++;
    }
  }

  for (const row of await d1.teamMember.findMany()) {
    const avatarUrl = rewrite(row.avatarUrl);
    if (avatarUrl !== row.avatarUrl) {
      console.log(`team_members ${row.name}: ${row.avatarUrl} → ${avatarUrl}`);
      if (!dryRun) {
        await d1.teamMember.update({
          where: { id: row.id },
          data: { avatarUrl: avatarUrl ?? null },
        });
      }
      updated++;
    }
  }

  for (const row of await d1.aboutContent.findMany()) {
    const imageUrl = rewrite(row.imageUrl);
    if (imageUrl !== row.imageUrl) {
      console.log(`about_content ${row.section}: ${row.imageUrl} → ${imageUrl}`);
      if (!dryRun) {
        await d1.aboutContent.update({
          where: { id: row.id },
          data: { imageUrl: imageUrl ?? null },
        });
      }
      updated++;
    }
  }

  for (const row of await d1.project.findMany()) {
    const coverImageUrl = rewrite(row.coverImageUrl);
    const images = parseStringArray(row.images);
    const newImages = images.map((u) => rewrite(u) ?? u);
    const imagesChanged = newImages.some((u, i) => u !== images[i]);
    if (coverImageUrl !== row.coverImageUrl || imagesChanged) {
      console.log(`projects ${row.title}: cover/images rewritten`);
      if (!dryRun) {
        await d1.project.update({
          where: { id: row.id },
          data: {
            coverImageUrl: coverImageUrl ?? null,
            images: stringifyStringArray(newImages),
          },
        });
      }
      updated++;
    }
  }

  console.log(`\nDone. Rows updated: ${updated}${dryRun ? " (dry-run)" : ""}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => disconnectD1Target());
