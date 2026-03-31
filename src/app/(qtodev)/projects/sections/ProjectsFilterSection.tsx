import { Container } from "@/components/common/Container";
import Link from "next/link";
import { cn } from "@/components/theme/cn";

interface ProjectsFilterSectionProps {
  categories: string[];
  activeCategory: string;
}

export function ProjectsFilterSection({
  categories,
  activeCategory,
}: ProjectsFilterSectionProps) {
  return (
    <section className="py-8 bg-surface border-b border-border" aria-label="Filter by category">
      <Container>
        <div role="group" className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            const href =
              isActive || category === categories[0]
                ? "/projects"
                : { pathname: "/projects", query: { category } };
            return (
              <Link
                key={category}
                href={href}
                className={cn(
                  "inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/40 hover:bg-primary/90 hover:shadow-primary/60"
                    : "border border-border/70 bg-background/40 text-foreground/80 hover:bg-background hover:text-foreground hover:border-primary/60 hover:shadow-[0_0_0_1px_rgba(249,115,22,0.5)]"
                )}
                aria-current={isActive ? "true" : undefined}
              >
                {category}
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
