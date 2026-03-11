"use client";

import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
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
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <Button
                key={category}
                type="button"
                variant={isActive ? "default" : "outline"}
                className={cn(
                  "rounded-full px-6 transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/40 hover:bg-primary/90 hover:shadow-primary/60"
                    : "border-border/70 bg-background/40 text-foreground/80 hover:bg-background hover:text-foreground hover:border-primary/60 hover:shadow-[0_0_0_1px_rgba(249,115,22,0.5)]"
                )}
                onClick={() => onCategoryChange(category)}
                aria-current={isActive ? "true" : undefined}
              >
                {category}
              </Button>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
