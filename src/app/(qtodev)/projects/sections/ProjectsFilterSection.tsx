"use client";

import { Container } from "@/components/common/Container";
import { cn } from "@/components/theme/cn";

interface ProjectsFilterSectionProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function ProjectsFilterSection({
  categories,
  activeCategory,
  onCategoryChange,
}: ProjectsFilterSectionProps) {
  return (
    <section className="py-8 bg-surface border-b border-border" aria-label="Filter by category">
      <Container>
        <div role="group" className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              aria-current={activeCategory === category ? "true" : undefined}
              className={cn(
                "px-6 py-2.5 rounded-full font-medium transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface-muted text-foreground border border-border hover:bg-background hover:border-primary/30"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </Container>
    </section>
  );
}
