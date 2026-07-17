"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { blogsPageConfig } from "@/config/blogsPage";
type BlogsPageConfigType = typeof blogsPageConfig;
import { BlogFilterBarSection } from "./BlogFilterBarSection";
import { BlogGridSection } from "./BlogGridSection";
import { BlogPaginationSection } from "./BlogPaginationSection";
import type { BlogPost } from "@/types/blog";

const allLabel = blogsPageConfig.filter.allLabel;

function getCategories(posts: BlogPost[]): string[] {
  const uniques = [...new Set(posts.map((p) => p.category))].sort();
  return [allLabel, ...uniques];
}

function resolveCategory(initialCategory: string | undefined, posts: BlogPost[]): string {
  if (!initialCategory) return allLabel;
  const categories = getCategories(posts);
  return categories.includes(initialCategory) ? initialCategory : allLabel;
}

interface BlogsFilterAndGridClientProps {
  posts: BlogPost[];
  config?: BlogsPageConfigType;
  initialCategory?: string;
  initialTag?: string;
  initialPage?: number;
  initialSearch?: string;
  embedded?: boolean;
}

export function BlogsFilterAndGridClient({
  posts,
  config,
  initialCategory,
  initialTag,
  initialPage = 1,
  initialSearch,
  embedded = false,
}: BlogsFilterAndGridClientProps) {
  const cfg = config ?? blogsPageConfig;
  const rawPageSize = cfg.pagination?.pageSize;
  const pageSize =
    Number.isFinite(Number(rawPageSize)) && Number(rawPageSize) > 0
      ? Number(rawPageSize)
      : 9;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeCategory, setActiveCategory] = useState<string>(() =>
    resolveCategory(initialCategory, posts)
  );
  const [activeTag, setActiveTag] = useState<string | null>(initialTag ?? null);
  const [currentPage, setCurrentPage] = useState<number>(Math.max(1, initialPage));
  const [searchQuery, setSearchQuery] = useState(initialSearch ?? "");
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const categories = useMemo(() => getCategories(posts), [posts]);

  const postsForCategoryCounts = useMemo(() => {
    let results = posts;

    if (activeTag) {
      results = results.filter((p) => p.tags.includes(activeTag));
    }

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          (p.excerpt ?? p.description).toLowerCase().includes(query) ||
          p.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return results;
  }, [activeTag, posts, searchQuery]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      [allLabel]: postsForCategoryCounts.length,
    };

    for (const category of categories) {
      if (category === allLabel) continue;
      counts[category] = postsForCategoryCounts.filter((p) => p.category === category).length;
    }

    return counts;
  }, [categories, postsForCategoryCounts]);

  const filteredPosts = useMemo(() => {
    let results = posts;

    if (activeCategory !== allLabel) {
      results = results.filter((p) => p.category === activeCategory);
    }

    if (activeTag) {
      results = results.filter((p) => p.tags.includes(activeTag));
    }

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          (p.excerpt ?? p.description).toLowerCase().includes(query) ||
          p.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return results;
  }, [activeCategory, activeTag, posts, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedPosts = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredPosts.slice(start, start + pageSize);
  }, [filteredPosts, pageSize, safePage]);

  const updateUrl = useCallback(
    (next: { category?: string; tag?: string | null; page?: number; q?: string }) => {
      const params = new URLSearchParams(searchParams.toString());

      const category = next.category ?? activeCategory;
      const tag = next.tag !== undefined ? next.tag : activeTag;
      const page = next.page ?? safePage;
      const q = (next.q !== undefined ? next.q : searchQuery).trim();

      if (category && category !== allLabel) {
        params.set("category", category);
      } else {
        params.delete("category");
      }

      if (tag) {
        params.set("tag", tag);
      } else {
        params.delete("tag");
      }

      if (q) {
        params.set("q", q);
      } else {
        params.delete("q");
      }

      if (page > 1) {
        params.set("page", String(page));
      } else {
        params.delete("page");
      }

      const query = params.toString();
      router.replace(query ? `/blogs?${query}` : "/blogs", { scroll: false });
    },
    [activeCategory, activeTag, allLabel, router, safePage, searchParams, searchQuery]
  );

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
    updateUrl({ category, page: 1 });
  };

  const handleClearTag = () => {
    setActiveTag(null);
    setCurrentPage(1);
    updateUrl({ tag: null, page: 1 });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      updateUrl({ page: 1, q: query });
    }, 300);
  };

  const handlePageChange = (page: number) => {
    const nextPage = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(nextPage);
    updateUrl({ page: nextPage });
  };

  if (posts.length === 0) return null;

  return (
    <>
      <BlogFilterBarSection
        categories={categories}
        categoryCounts={categoryCounts}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        activeTag={activeTag}
        onClearTag={activeTag ? handleClearTag : undefined}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        config={cfg}
        embedded={embedded}
      />
      <BlogGridSection posts={paginatedPosts} config={cfg} embedded={embedded} />
      <BlogPaginationSection
        config={cfg}
        currentPage={safePage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        embedded={embedded}
      />
    </>
  );
}
