export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export function getPagination(page?: number, limit?: number): PaginationParams {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit,
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export function getPaginationMeta(
  totalItems: number,
  pagination: PaginationParams
): PaginationMeta {
  return {
    page: pagination.page,
    limit: pagination.limit,
    totalItems,
    totalPages: Math.ceil(totalItems / pagination.limit),
  };
}
