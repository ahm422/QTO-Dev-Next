import { getRelatedBlogPosts } from "@/lib/blog";
import { RelatedArticles } from "./RelatedArticles";

export async function RelatedArticlesAsync({
  category,
  slug,
  limit = 3,
}: {
  category: string;
  slug: string;
  limit?: number;
}) {
  const relatedPosts = await getRelatedBlogPosts(category, slug, limit);
  if (!relatedPosts || relatedPosts.length === 0) return null;
  return <RelatedArticles posts={relatedPosts} />;
}

