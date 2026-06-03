import { findAllPublishedBlogPosts } from "@/lib/cms/blog";
import { BlogsFilterAndGridClient } from "./BlogsFilterAndGridClient";

export async function BlogsFilterAndGrid() {
  const posts = await findAllPublishedBlogPosts();
  return <BlogsFilterAndGridClient posts={posts} />;
}
