"use client";

import { useState } from "react";
import { Container } from "@/components/common/Container";

const categories = ["All", "Web Development", "Performance", "React", "CSS"];

export function BlogFilterBarSection() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <section className="py-8 border-b border-border">
      <Container>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface-muted text-foreground-muted hover:bg-border"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </Container>
    </section>
  );
}
