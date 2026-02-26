"use client";

import { useState, useMemo } from "react";
import { blogPosts } from "@/data/blog";
import { blogsPageConfig } from "@/config/blogsPage";
import { BlogFilterBarSection } from "./BlogFilterBarSection";
import { BlogGridSection } from "./BlogGridSection";
import type { BlogPost } from "@/types/blog";

const allLabel = blogsPageConfig.filter.allLabel;

function getCategories(posts: BlogPost[]): string[] {
  const uniques = [...new Set(posts.map((p) => p.category))].sort();
  return [allLabel, ...uniques];
}

export function BlogsFilterAndGrid() {
  const [activeCategory, setActiveCategory] = useState<string>(allLabel);
  const categories = useMemo(() => getCategories(blogPosts), []);
  const filteredPosts = useMemo(
    () =>
      activeCategory === allLabel
        ? blogPosts
        : blogPosts.filter((p) => p.category === activeCategory),
    [activeCategory]
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
