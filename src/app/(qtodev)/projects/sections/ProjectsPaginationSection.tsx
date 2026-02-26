import { Container } from "@/components/common/Container";
import { projectsPageConfig } from "@/config/projectsPage";

export function ProjectsPaginationSection() {
  const { pagination } = projectsPageConfig;
  return (
    <section className="py-10 md:py-12 bg-surface-muted border-y border-border">
      <Container>
        <p className="text-center text-foreground-muted text-sm md:text-base">
          {pagination.placeholderText}
        </p>
      </Container>
    </section>
  );
}
