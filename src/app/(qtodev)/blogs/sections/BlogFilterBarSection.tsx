"use client";

import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { blogsPageConfig } from "@/config/blogsPage";
type BlogsPageConfigType = typeof blogsPageConfig;

interface BlogFilterBarSectionProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  activeTag?: string | null;
  onClearTag?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  config?: BlogsPageConfigType;
}

export function BlogFilterBarSection({
  categories,
  activeCategory,
  onCategoryChange,
  activeTag,
  onClearTag,
  searchQuery,
  onSearchChange,
  config,
}: BlogFilterBarSectionProps) {
  const cfg = config ?? blogsPageConfig;
  const { filter } = cfg;

  return (
    <section className="py-8 bg-surface border-b border-border" aria-label="Filter articles">
      <Container>
        <div className="mb-6 max-w-md mx-auto">
          <Input
            type="search"
            placeholder={filter.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label={filter.searchPlaceholder}
            className="rounded-full"
          />
        </div>

        {activeTag ? (
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-foreground-muted">
              {filter.activeTagLabel}: <strong className="text-foreground">#{activeTag}</strong>
            </span>
            {onClearTag ? (
              <Button type="button" variant="ghost" size="sm" onClick={onClearTag}>
                {filter.clearFiltersLabel}
              </Button>
            ) : null}
          </div>
        ) : null}

        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              type="button"
              variant={activeCategory === category ? "default" : "outline"}
              className="rounded-full px-6"
              onClick={() => onCategoryChange(category)}
              aria-current={activeCategory === category ? "true" : undefined}
            >
              {category}
            </Button>
          ))}
        </div>
      </Container>
    </section>
  );
}
