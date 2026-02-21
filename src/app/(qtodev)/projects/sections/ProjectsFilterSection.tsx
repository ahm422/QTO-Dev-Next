"use client";

import { useState } from "react";
import { Container } from "@/components/common/Container";

const categories = ["All", "Web", "Mobile", "E-commerce", "SaaS"];

export function ProjectsFilterSection() {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <section className="py-8 bg-surface">
      <Container>
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                activeFilter === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground-muted border border-border hover:bg-surface-muted"
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
