import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  BLOG_NEWS_CATEGORY,
  normalizeBlogCategory,
} from "@/config/blogCategories";
import { blogPostSchema } from "@/lib/validators/admin/blogPost";

describe("normalizeBlogCategory", () => {
  it("maps case-insensitive Company News to the canonical preset", () => {
    expect(normalizeBlogCategory("company news")).toBe(BLOG_NEWS_CATEGORY);
    expect(normalizeBlogCategory("Company News")).toBe(BLOG_NEWS_CATEGORY);
    expect(normalizeBlogCategory("COMPANY NEWS")).toBe(BLOG_NEWS_CATEGORY);
  });

  it("trims whitespace before matching presets", () => {
    expect(normalizeBlogCategory("  Company News  ")).toBe(BLOG_NEWS_CATEGORY);
    expect(normalizeBlogCategory("  React ")).toBe("React");
  });

  it("keeps unknown custom categories after trim", () => {
    expect(normalizeBlogCategory("  Engineering Notes ")).toBe("Engineering Notes");
  });
});

describe("blogPostSchema category + publish rules", () => {
  const base = {
    title: "Hello",
    slug: "hello",
    excerpt: "",
    content: "",
    tags: [] as string[],
    author: "QTO DEV Team",
    imageUrl: "",
    imageAlt: "",
    isFeatured: false,
    isHeadline: false,
  };

  it("normalizes category to Company News on parse", () => {
    const parsed = blogPostSchema.parse({
      ...base,
      category: "company news",
      isPublished: false,
    });
    expect(parsed.category).toBe(BLOG_NEWS_CATEGORY);
  });

  it("rejects empty category when publishing", () => {
    const result = blogPostSchema.safeParse({
      ...base,
      category: "   ",
      isPublished: true,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("category"))).toBe(true);
    }
  });

  it("allows draft with empty category", () => {
    const parsed = blogPostSchema.parse({
      ...base,
      category: "",
      isPublished: false,
    });
    expect(parsed.category).toBe("");
    expect(parsed.isPublished).toBe(false);
  });

  it("allows published post with Company News category", () => {
    const parsed = blogPostSchema.parse({
      ...base,
      category: BLOG_NEWS_CATEGORY,
      isPublished: true,
    });
    expect(parsed.category).toBe(BLOG_NEWS_CATEGORY);
    expect(parsed.isPublished).toBe(true);
  });
});

describe("revalidateBlogCaches", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('revalidates blog paths and tag "blog"', async () => {
    const revalidatePath = vi.fn();
    const revalidateTag = vi.fn();
    vi.doMock("next/cache", () => ({
      revalidatePath,
      revalidateTag,
    }));

    const { revalidateBlogCaches } = await import("@/lib/revalidate");
    revalidateBlogCaches("my-post");

    expect(revalidatePath).toHaveBeenCalledWith("/");
    expect(revalidatePath).toHaveBeenCalledWith("/blogs");
    expect(revalidatePath).toHaveBeenCalledWith("/sitemap.xml");
    expect(revalidatePath).toHaveBeenCalledWith("/blogs/my-post");
    expect(revalidateTag).toHaveBeenCalledWith("blog", "max");
  });
});
