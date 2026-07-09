"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/common/Container";
import { cn } from "@/components/theme/cn";
import { projectsPageConfig } from "@/config/projectsPage";
type ProjectsPageConfigType = typeof projectsPageConfig;

interface ProjectsFilterBarSectionProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  config?: ProjectsPageConfigType;
}

export function ProjectsFilterBarSection({
  categories,
  activeCategory,
  onCategoryChange,
}: ProjectsFilterBarSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden border-b border-border bg-surface py-10 md:py-12"
      aria-label="Filter projects"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/[0.04] via-transparent to-transparent"
        aria-hidden
      />

      <Container className="relative">
        <div
          role="group"
          aria-label="Filter by category"
          className={cn(
            "mx-auto flex w-fit max-w-full flex-wrap justify-center gap-1.5 rounded-2xl p-1.5 sm:gap-2 sm:p-2",
            "border border-border/70 bg-surface-muted/60 shadow-sm shadow-black/5 backdrop-blur-sm",
            "dark:border-border/50 dark:bg-surface-muted/40 dark:shadow-black/20"
          )}
        >
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative isolate min-w-[4.5rem] rounded-full px-5 py-2.5 text-sm font-semibold sm:px-6",
                  "transition-colors duration-200",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                  isActive
                    ? "text-white"
                    : "text-foreground-muted hover:bg-foreground/[0.04] hover:text-foreground"
                )}
              >
                {isActive ? (
                  prefersReducedMotion ? (
                    <span
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-primary to-cta-gold shadow-md shadow-primary/30"
                      aria-hidden
                    />
                  ) : (
                    <motion.span
                      layoutId="projects-filter-indicator"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-primary to-cta-gold shadow-md shadow-primary/30"
                      transition={{ type: "spring", stiffness: 380, damping: 28 }}
                      aria-hidden
                    />
                  )
                ) : null}
                <span className="relative z-10">{category}</span>
              </button>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
