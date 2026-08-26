import { describe, expect, it } from "vitest";
import { mapPrismaToContentProject } from "@/lib/cms/mapContentProject";
import type { ProjectWithRelations } from "@/lib/prisma/projectData";

function makeRow(overrides: Partial<ProjectWithRelations> = {}): ProjectWithRelations {
  return {
    id: "proj-1",
    slug: "acme-platform",
    title: "Acme Platform",
    client: "Acme Corp",
    category: "Technology",
    excerpt: "",
    description: "",
    challenge: null,
    solution: null,
    results: "[]",
    coverImageUrl: null,
    images: "[]",
    liveUrl: null,
    serviceSlug: null,
    isFeatured: false,
    order: 0,
    isPublished: true,
    completedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [],
    techStack: [],
    ...overrides,
  } as ProjectWithRelations;
}

describe("mapPrismaToContentProject", () => {
  it("passes rich-text description through untouched for about.overview (rendered via RichText)", () => {
    const html = "<p>We delivered a <a href=\"https://example.com\">scalable platform</a>.</p>";
    const result = mapPrismaToContentProject(makeRow({ description: html }), []);
    expect(result.about.overview).toBe(html);
  });

  it("strips HTML out of the description fallback used for subtitle when excerpt is empty", () => {
    const html = "<p>We delivered a <strong>scalable platform</strong>.</p>";
    const result = mapPrismaToContentProject(
      makeRow({ excerpt: "", description: html }),
      []
    );
    expect(result.subtitle).toBe("We delivered a scalable platform .");
    expect(result.subtitle).not.toContain("<");
  });

  it("prefers excerpt over description for subtitle when both are present", () => {
    const result = mapPrismaToContentProject(
      makeRow({ excerpt: "Short summary.", description: "<p>Longer rich text.</p>" }),
      []
    );
    expect(result.subtitle).toBe("Short summary.");
  });

  it("falls back to the default subtitle when both fields are empty", () => {
    const result = mapPrismaToContentProject(
      makeRow({ excerpt: "", description: "" }),
      []
    );
    expect(result.subtitle).toBe(
      "A product engagement focused on measurable outcomes and clear delivery."
    );
  });
});
