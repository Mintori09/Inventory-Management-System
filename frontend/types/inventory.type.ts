import type { PaginationMeta } from "@/types/api.type";

export type MovementType = "import" | "export" | "adjustment";

export type StockMovement = {
  id: number;
  type: MovementType;
  quantityChange: number;
  stockBefore: number;
  stockAfter: number;
  referenceId?: number;
  referenceType?: "stock_import" | "stock_export" | "manual";
  note?: string;
  createdAt: string;
  product: { id: number; sku: string; name: string };
  createdBy: { id: number; fullName: string };
};

export type StockOverviewItem = {
  id: number;
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  unit: string;
  stockStatus: "in_stock" | "low_stock" | "out_of_stock";
};

export type ImportStockPayload = {
  productId: number;
  supplierId?: number;
  quantity: number;
  importPrice: number;
  note?: string;
};

export type ExportStockPayload = {
  productId: number;
  quantity: number;
  exportPrice: number;
  note?: string;
};

export type AdjustStockPayload = {
  productId: number;
  adjustmentType: "increase" | "decrease";
  quantity: number;
  note: string;
};

export type MovementListParams = {
  search?: string;
  type?: MovementType;
  startDate?: string;
  endDate?: string;
  userId?: number;
  productId?: number;
  page?: number;
  limit?: number;
};

export type MovementsResponse = {
  items: StockMovement[];
  pagination: PaginationMeta;
};

export type LowStockItem = StockOverviewItem & {
  shortage: number;
};

export type LowStockResponse = {
  items: LowStockItem[];
  pagination: PaginationMeta;
  summary: {
    total: number;
    lowStock: number;
    outOfStock: number;
  };
};
