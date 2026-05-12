export type DashboardSummary = {
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
  importToday: number;
  exportToday: number;
  totalStockValue: number;
};

export type RecentMovement = {
  id: number;
  type: "import" | "export" | "adjustment";
  quantityChange: number;
  createdAt: string;
  product: { id: number; name: string };
  createdBy: { id: number; fullName: string };
};

export type ImportExportChartData = {
  date: string;
  imports: number;
  exports: number;
};

export type CategoryStockData = {
  categoryName: string;
  totalStock: number;
};
