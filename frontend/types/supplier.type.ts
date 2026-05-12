import type { PaginationMeta } from "@/types/api.type";

export type Supplier = {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  isActive: boolean;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateSupplierPayload = {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  isActive?: boolean;
};

export type UpdateSupplierPayload = Partial<CreateSupplierPayload>;

export type SuppliersResponse = {
  items: Supplier[];
  pagination: PaginationMeta;
};
