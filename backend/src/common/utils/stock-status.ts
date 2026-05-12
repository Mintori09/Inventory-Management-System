export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export function getStockStatus(
  currentStock: number,
  minStock: number
): StockStatus {
  if (currentStock === 0) return "out_of_stock";
  if (currentStock <= minStock) return "low_stock";
  return "in_stock";
}
