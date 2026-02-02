"use client";

import { generatePagination } from "@/app/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useSearchParams } from "next/navigation";

export default function TransactionPagination({
  totalPages,
}: {
  totalPages: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const pages = generatePagination(currentPage, totalPages);

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  const createPageURL = (page: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          {isFirstPage ? (
            <PaginationPrevious
              aria-disabled
              className="pointer-events-none opacity-50"
            />
          ) : (
            <PaginationPrevious href={createPageURL(currentPage - 1)} />
          )}
        </PaginationItem>

        {/* Page numbers */}
        {pages.map((page, index) => (
          <PaginationItem key={index}>
            {page === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href={createPageURL(page)}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* Next */}
        <PaginationItem>
          {isLastPage ? (
            <PaginationNext
              aria-disabled
              className="pointer-events-none opacity-50"
            />
          ) : (
            <PaginationNext href={createPageURL(currentPage + 1)} />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
