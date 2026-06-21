"use client";

import { useState, useMemo } from "react";
import { blogsPageConfig } from "@/config/blogsPage";
type BlogsPageConfigType = typeof blogsPageConfig;
import { BlogFilterBarSection } from "./BlogFilterBarSection";
import { BlogGridSection } from "./BlogGridSection";
import type { BlogPost } from "@/types/blog";

const allLabel = blogsPageConfig.filter.allLabel;

function getCategories(posts: BlogPost[]): string[] {
  const uniques = [...new Set(posts.map((p) => p.category))].sort();
  return [allLabel, ...uniques];
}

export function BlogsFilterAndGridClient({ posts, config }: { posts: BlogPost[]; config?: BlogsPageConfigType }) {
  const cfg = config ?? blogsPageConfig;
  const [activeCategory, setActiveCategory] = useState<string>(allLabel);
  const categories = useMemo(() => getCategories(posts), [posts]);
  const filteredPosts = useMemo(
    () =>
      activeCategory === allLabel
        ? posts
        : posts.filter((p) => p.category === activeCategory),
    [activeCategory, posts]
  );

  return (
    <>
      <BlogFilterBarSection
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <BlogGridSection posts={filteredPosts} />
    </>
  );
}
