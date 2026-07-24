import { getBlogPostsByCategory } from "@/lib/blog";
import { blogsPageConfig, mergeBlogsPageConfig } from "@/config/blogsPage";
import { NewsSectionClient } from "./NewsSectionClient";

type BlogsPageConfigType = typeof blogsPageConfig;

interface NewsSectionProps {
  config?: BlogsPageConfigType;
}

export async function NewsSection({ config }: NewsSectionProps) {
  const cfg = mergeBlogsPageConfig(config);
  const posts = await getBlogPostsByCategory(cfg.news.category, cfg.news.limit);
  return <NewsSectionClient posts={posts} config={config} />;
}
