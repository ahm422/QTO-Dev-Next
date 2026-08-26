import { describe, expect, it } from "vitest";
import { mapPrismaToContentService } from "@/lib/cms/mapContentService";
import type { ServiceWithTags } from "@/lib/prisma/serviceData";

function makeRow(overrides: Partial<ServiceWithTags> = {}): ServiceWithTags {
  return {
    id: "svc-1",
    slug: "web-development",
    title: "Web Development",
    shortDescription: "",
    description: "",
    icon: "laptop-code",
    features: "[]",
    imageUrl: null,
    imageAlt: null,
    order: 0,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    technologyTags: [],
    ...overrides,
  } as ServiceWithTags;
}

describe("mapPrismaToContentService", () => {
  it("passes rich-text description through untouched for overviewText (rendered via RichText)", () => {
    const html = "<p>We build <strong>scalable</strong> platforms.</p>";
    const result = mapPrismaToContentService(makeRow({ description: html }));
    expect(result.overviewText).toBe(html);
  });

  it("strips HTML out of the description fallback used for subheadline when shortDescription is empty", () => {
    const html = "<p>We build <strong>scalable</strong> platforms.</p>";
    const result = mapPrismaToContentService(
      makeRow({ shortDescription: "", description: html })
    );
    expect(result.subheadline).toBe("We build scalable platforms.");
    expect(result.subheadline).not.toContain("<");
  });

  it("prefers shortDescription over description for subheadline when both are present", () => {
    const result = mapPrismaToContentService(
      makeRow({
        shortDescription: "Short and sweet.",
        description: "<p>Longer rich text.</p>",
      })
    );
    expect(result.subheadline).toBe("Short and sweet.");
  });

  it("falls back to the default subheadline when both fields are empty", () => {
    const result = mapPrismaToContentService(
      makeRow({ shortDescription: "", description: "" })
    );
    expect(result.subheadline).toBe(
      "Premium web development and design services from QTO Dev."
    );
  });
});
