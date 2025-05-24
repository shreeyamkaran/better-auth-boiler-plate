'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { getPaginationParams } from '@/lib/pagination-params';

export default function CustomPagination({ totalItems }: { totalItems: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCurrentPage = searchParams.get('page');
  const rawPerPage = searchParams.get('per_page');
  const { currentPage, perPage } = getPaginationParams(rawCurrentPage, rawPerPage);

  const totalPages = Math.ceil(totalItems / perPage);

  const updatePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`?${params.toString()}`);
  };

  const renderPage = (page: number) => (
    <PaginationItem key={`page-${page}`}>
      <PaginationLink
        href="#"
        isActive={page === currentPage}
        onClick={e => {
          e.preventDefault();
          updatePage(page);
        }}
      >
        {page}
      </PaginationLink>
    </PaginationItem>
  );

  const renderPages = () => {
    const pages = new Set<number>();

    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) {
        pages.add(i);
      }
    } else {
      pages.add(1);
      pages.add(totalPages);

      if (currentPage <= 3) {
        pages.add(2);
        pages.add(3);
        pages.add(4);
      } else if (currentPage >= totalPages - 2) {
        pages.add(totalPages - 1);
        pages.add(totalPages - 2);
        pages.add(totalPages - 3);
      } else {
        pages.add(currentPage - 1);
        pages.add(currentPage);
        pages.add(currentPage + 1);
      }
    }

    const sortedPages = Array.from(pages).sort((a, b) => a - b);
    const result: React.ReactNode[] = [];
    let prev: number | null = null;

    for (const page of sortedPages) {
      if (prev !== null && page - prev > 1) {
        result.push(<PaginationEllipsis key={`ellipsis-${prev}-${page}`} />);
      }
      result.push(renderPage(page));
      prev = page;
    }

    return result;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={e => {
              e.preventDefault();
              if (currentPage > 1) updatePage(currentPage - 1);
            }}
            aria-disabled={currentPage === 1}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>

        {renderPages()}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={e => {
              e.preventDefault();
              if (currentPage < totalPages) updatePage(currentPage + 1);
            }}
            aria-disabled={currentPage === totalPages}
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
