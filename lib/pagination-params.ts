// utils/pagination.ts
import { DEFAULT_PAGE, DEFAULT_PER_PAGE, MAX_PER_PAGE } from '@/constants/pagination';

export function getPaginationParams(rawPage?: string | null, rawPerPage?: string | null) {
  const pageStr = rawPage && rawPage.trim() !== '' ? rawPage : undefined;
  const perPageStr = rawPerPage && rawPerPage.trim() !== '' ? rawPerPage : undefined;

  const parsedPage = parseInt(pageStr ?? String(DEFAULT_PAGE), 10);
  const parsedPerPage = parseInt(perPageStr ?? String(DEFAULT_PER_PAGE), 10);

  const currentPage = !isNaN(parsedPage) && parsedPage > 0 ? parsedPage : DEFAULT_PAGE;
  const perPage =
    !isNaN(parsedPerPage) && parsedPerPage > 0 && parsedPerPage <= MAX_PER_PAGE
      ? parsedPerPage
      : DEFAULT_PER_PAGE;

  return { currentPage, perPage };
}
