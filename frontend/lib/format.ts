import type { StockStatus } from "@/types/product.type";

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
  }).format(new Date(value));
}

export function getStockStatusLabel(status: StockStatus): string {
  const map: Record<StockStatus, string> = {
    in_stock: "Còn hàng",
    low_stock: "Sắp hết",
    out_of_stock: "Hết hàng",
  };
  return map[status];
}

export function getMovementTypeLabel(type: string): string {
  const map: Record<string, string> = {
    import: "Nhập kho",
    export: "Xuất kho",
    adjustment: "Điều chỉnh",
  };
  return map[type] || type;
}
