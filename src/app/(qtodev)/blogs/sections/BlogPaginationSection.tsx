import { Container } from "@/components/common/Container";
import { blogsPageConfig } from "@/config/blogsPage";
type BlogsPageConfigType = typeof blogsPageConfig;

export function BlogPaginationSection({ config }: { config?: BlogsPageConfigType }) {
  const cfg = config ?? blogsPageConfig;
  const { pagination } = cfg;
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
