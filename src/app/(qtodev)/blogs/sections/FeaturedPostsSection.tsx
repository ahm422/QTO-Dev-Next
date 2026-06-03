import { getFeaturedBlogPosts } from "@/lib/blog";
import { FeaturedPostsSectionClient } from "./FeaturedPostsSectionClient";

export async function FeaturedPostsSection() {
  const posts = await getFeaturedBlogPosts(2);
  return <FeaturedPostsSectionClient posts={posts} />;
}
