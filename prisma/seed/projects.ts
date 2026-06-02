import { projects as legacyProjects } from "@/data/projects";
import { getAllProjects } from "@/content/projects/index";
import { prisma } from "./helpers";

export async function seedProjects() {
  const detailProjects = await getAllProjects();
  const bySlug = new Map<string, (typeof detailProjects)[0]>();

  for (const p of detailProjects) {
    bySlug.set(p.slug, p);
  }

  for (let i = 0; i < legacyProjects.length; i++) {
    const legacy = legacyProjects[i];
    const detail = bySlug.get(legacy.slug);

    const challenge = detail?.problem?.join("\n\n") ?? null;
    const solution = detail?.solution?.join("\n\n") ?? null;
    const results = detail?.outcomes ?? [];
    const images =
      detail?.features?.map((f) => f.image.url) ??
      (legacy.image ? [legacy.image] : []);

    await prisma.project.upsert({
      where: { slug: legacy.slug },
      create: {
        slug: legacy.slug,
        title: legacy.title,
        client: detail?.about?.client ?? null,
        category: legacy.category,
        tags: legacy.tags,
        excerpt: legacy.shortDescription,
        description: legacy.description,
        challenge,
        solution,
        results,
        coverImageUrl: detail?.heroImage?.url ?? legacy.image ?? null,
        images,
        techStack: legacy.technologies,
        liveUrl: detail?.demoUrl ?? null,
        isFeatured: legacy.featured,
        order: i,
        isPublished: true,
      },
      update: {
        title: legacy.title,
        client: detail?.about?.client ?? null,
        category: legacy.category,
        tags: legacy.tags,
        excerpt: legacy.shortDescription,
        description: legacy.description,
        challenge,
        solution,
        results,
        coverImageUrl: detail?.heroImage?.url ?? legacy.image ?? null,
        images,
        techStack: legacy.technologies,
        liveUrl: detail?.demoUrl ?? null,
        isFeatured: legacy.featured,
        order: i,
        isPublished: true,
      },
    });
  }
}
