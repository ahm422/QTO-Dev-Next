"use client";

import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { blogsPageConfig } from "@/config/blogsPage";
type BlogsPageConfigType = typeof blogsPageConfig;

interface BlogPaginationSectionProps {
  config?: BlogsPageConfigType;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function BlogPaginationSection({
  config,
  currentPage,
  totalPages,
  onPageChange,
}: BlogPaginationSectionProps) {
  const cfg = config ?? blogsPageConfig;
  const { pagination } = cfg;

  if (totalPages <= 1) return null;

  return (
    <section className="py-10 md:py-12 bg-surface-muted border-y border-border" aria-label="Pagination">
      <Container>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            type="button"
            variant="outline"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            {pagination.prevLabel}
          </Button>
          <p className="text-sm text-foreground-muted">
            {pagination.pageLabel} {currentPage} {pagination.ofLabel} {totalPages}
          </p>
          <Button
            type="button"
            variant="outline"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            {pagination.nextLabel}
          </Button>
        </div>
      </Container>
    </section>
  );
}
