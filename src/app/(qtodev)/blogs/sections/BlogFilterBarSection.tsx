"use client";

import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";

interface BlogFilterBarSectionProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function BlogFilterBarSection({
  categories,
  activeCategory,
  onCategoryChange,
}: BlogFilterBarSectionProps) {
  return (
    <section className="py-8 bg-surface border-b border-border" aria-label="Filter by category">
      <Container>
        <div role="group" className="flex flex-wrap gap-3 justify-center">
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
