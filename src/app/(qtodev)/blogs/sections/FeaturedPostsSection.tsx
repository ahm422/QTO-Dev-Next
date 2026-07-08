import { getFeaturedBlogPosts } from "@/lib/blog";
import { FeaturedPostsSectionClient } from "./FeaturedPostsSectionClient";
import { blogsPageConfig } from "@/config/blogsPage";
type BlogsPageConfigType = typeof blogsPageConfig;

interface FeaturedPostsSectionProps {
  config?: BlogsPageConfigType;
}

export async function FeaturedPostsSection({ config }: FeaturedPostsSectionProps) {
  const posts = await getFeaturedBlogPosts(2);
  return <FeaturedPostsSectionClient posts={posts} config={config} />;
}
