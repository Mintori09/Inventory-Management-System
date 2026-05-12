import type { PaginationMeta } from "@/types/api.type";

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export type Product = {
  id: number;
  sku: string;
  name: string;
  description?: string;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  currentStock: number;
  minStock: number;
  imageUrl?: string;
  isActive: boolean;
  stockStatus: StockStatus;
  category: { id: number; name: string };
  supplier?: { id: number; name: string };
  createdAt: string;
  updatedAt: string;
};

export type ProductListParams = {
  search?: string;
  categoryId?: number;
  supplierId?: number;
  stockStatus?: StockStatus;
  page?: number;
  limit?: number;
};

export type CreateProductPayload = {
  sku: string;
  name: string;
  categoryId: number;
  supplierId?: number;
  unit: string;
  description?: string;
  costPrice: number;
  sellingPrice: number;
  currentStock?: number;
  minStock: number;
  imageUrl?: string;
  isActive: boolean;
};

export type UpdateProductPayload = Partial<CreateProductPayload>;

export type ProductsResponse = {
  items: Product[];
  pagination: PaginationMeta;
};
