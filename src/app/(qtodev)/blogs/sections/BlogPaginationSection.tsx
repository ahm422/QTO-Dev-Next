"use client";

import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/theme/cn";
import { blogsPageConfig } from "@/config/blogsPage";
type BlogsPageConfigType = typeof blogsPageConfig;

interface BlogPaginationSectionProps {
  config?: BlogsPageConfigType;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  embedded?: boolean;
}

export function BlogPaginationSection({
  config,
  currentPage,
  totalPages,
  onPageChange,
  embedded = false,
}: BlogPaginationSectionProps) {
  const cfg = config ?? blogsPageConfig;
  const { pagination } = cfg;

  if (totalPages <= 1) return null;

  const content = (
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
  );

  return (
    <section
      className={cn(
        "bg-surface-muted border-y border-border",
        embedded ? "py-8 md:py-10" : "py-10 md:py-12"
      )}
      aria-label="Pagination"
    >
      {embedded ? content : <Container>{content}</Container>}
    </section>
  );
}
