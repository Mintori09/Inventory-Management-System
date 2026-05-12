"use client";

import { useState } from "react";

type UsePaginationReturn = {
  page: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
};

export function usePagination(initialPage = 1, initialLimit = 10): UsePaginationReturn {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  return { page, limit, setPage, setLimit };
}
