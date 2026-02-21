import { useState } from "react";

interface UsePaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage?: number;
}

export function usePagination({
  totalItems,
  itemsPerPage,
  currentPage = 1,
}: UsePaginationProps) {
  const [page, setPage] = useState(currentPage);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const goToPage = (pageNumber: number) => {
    const validPage = Math.max(1, Math.min(pageNumber, totalPages));
    setPage(validPage);
  };

  const nextPage = () => goToPage(page + 1);
  const prevPage = () => goToPage(page - 1);

  return {
    page,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
