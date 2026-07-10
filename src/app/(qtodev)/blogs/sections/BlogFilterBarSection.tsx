"use client";

import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { cn } from "@/components/theme/cn";
import { blogsPageConfig } from "@/config/blogsPage";
type BlogsPageConfigType = typeof blogsPageConfig;

interface BlogFilterBarSectionProps {
  categories: string[];
  categoryCounts: Record<string, number>;
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
  categoryCounts,
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
        <div className="mb-6 max-w-md mx-auto relative">
          <AppIcon
            name="magnifying-glass"
            size="sm"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted"
            aria-hidden
          />
          <Input
            type="search"
            placeholder={filter.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label={filter.searchPlaceholder}
            className={cn(
              "rounded-full pl-11",
              "focus-visible:ring-2 focus-visible:ring-primary focus-visible:shadow-[0_0_0_4px_hsl(var(--primary)/0.15)]"
            )}
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
          {categories.map((category) => {
            const count = categoryCounts[category] ?? 0;
            const isActive = activeCategory === category;
            return (
              <Button
                key={category}
                type="button"
                variant={isActive ? "default" : "outline"}
                className={cn(
                  "rounded-full px-5 gap-2",
                  "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                )}
                onClick={() => onCategoryChange(category)}
                aria-current={isActive ? "true" : undefined}
              >
                <span>{category}</span>
                <span
                  className={cn(
                    "inline-flex min-w-[1.5rem] items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums",
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-primary/10 text-primary"
                  )}
                >
                  {count}
                </span>
              </Button>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
