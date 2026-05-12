export type PaginationMeta = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

export type ListResponse<T> = {
  items: T[];
  pagination: PaginationMeta;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type ApiError = {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
};
