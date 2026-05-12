import type { PaginationMeta } from "@/types/api.type";

export type Category = {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateCategoryPayload = {
  name: string;
  description?: string;
  isActive?: boolean;
};

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

export type CategoriesResponse = {
  items: Category[];
  pagination: PaginationMeta;
};
