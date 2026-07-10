import { Suspense } from "react";
import { findAllPublishedBlogPosts } from "@/lib/cms/blog";
import { BlogsFilterAndGridClient } from "./BlogsFilterAndGridClient";
import { blogsPageConfig } from "@/config/blogsPage";
type BlogsPageConfigType = typeof blogsPageConfig;

interface BlogsFilterAndGridProps {
  config?: BlogsPageConfigType;
  initialCategory?: string;
  initialTag?: string;
  initialPage?: number;
  initialSearch?: string;
}

export async function BlogsFilterAndGrid({
  config,
  initialCategory,
  initialTag,
  initialPage,
  initialSearch,
}: BlogsFilterAndGridProps) {
  const posts = await findAllPublishedBlogPosts();
  if (posts.length === 0) return null;
  return (
    <Suspense fallback={null}>
      <BlogsFilterAndGridClient
        posts={posts}
        config={config}
        initialCategory={initialCategory}
        initialTag={initialTag}
        initialPage={initialPage}
        initialSearch={initialSearch}
      />
    </Suspense>
  );
}
