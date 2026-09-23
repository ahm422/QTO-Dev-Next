import { d1 } from "../../d1/client.js";
import type { NormalizedRecord, SourceDefinition } from "../../types/document.js";
import { joinSections, stripHtml } from "../textUtils.js";

interface BlogPostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  is_featured: number;
  is_headline: number;
  is_published: number;
  published_at: string | null;
  updated_at: string;
}

interface TagRow {
  blog_post_id: string;
  value: string;
}

async function fetchRows(): Promise<Array<BlogPostRow & { tags: string[] }>> {
  const [posts, tags] = await Promise.all([
    d1.query<BlogPostRow>(
      `SELECT id, slug, title, excerpt, content, category, author, is_featured, is_headline, is_published, published_at, updated_at FROM blog_posts`
    ),
    d1.query<TagRow>(`SELECT blog_post_id, value FROM blog_post_tags ORDER BY sort_order ASC`),
  ]);

  const tagsByPost = new Map<string, string[]>();
  for (const t of tags) {
    const list = tagsByPost.get(t.blog_post_id) ?? [];
    list.push(t.value);
    tagsByPost.set(t.blog_post_id, list);
  }

  return posts.map((p) => ({ ...p, tags: tagsByPost.get(p.id) ?? [] }));
}

function normalize(row: BlogPostRow & { tags: string[] }): NormalizedRecord {
  const content = joinSections(
    row.title,
    row.excerpt,
    stripHtml(row.content),
    row.tags.length ? `Tags: ${row.tags.join(", ")}` : null
  );

  return {
    table: "blog_posts",
    recordId: row.id,
    slug: row.slug,
    title: row.title,
    content,
    metadata: {
      category: row.category,
      author: row.author,
      tags: row.tags,
      isFeatured: row.is_featured === 1,
      isHeadline: row.is_headline === 1,
      publishedAt: row.published_at,
      url: `/blogs/${row.slug}`,
    },
    isPublished: row.is_published === 1,
    updatedAt: row.updated_at,
  };
}

export const blogPostsSource: SourceDefinition = {
  table: "blog_posts",
  fetchAndNormalize: async () => (await fetchRows()).map(normalize),
};
