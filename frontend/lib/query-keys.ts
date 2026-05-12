export const queryKeys = {
  authMe: ["auth", "me"] as const,

  dashboardSummary: ["dashboard", "summary"] as const,
  dashboardRecentMovements: ["dashboard", "recent-movements"] as const,
  dashboardImportExportChart: ["dashboard", "import-export-chart"] as const,
  dashboardCategoryChart: ["dashboard", "category-chart"] as const,

  products: (params?: Record<string, unknown>) => ["products", params],
  product: (id: number) => ["products", id] as const,

  categories: (params?: Record<string, unknown>) => ["categories", params],
  suppliers: (params?: Record<string, unknown>) => ["suppliers", params],

  stockOverview: (params?: Record<string, unknown>) => ["inventory", "stock-overview", params],
  movements: (params?: Record<string, unknown>) => ["inventory", "movements", params],
  lowStock: (params?: Record<string, unknown>) => ["inventory", "low-stock", params],

  users: (params?: Record<string, unknown>) => ["users", params],
  auditLogs: (params?: Record<string, unknown>) => ["audit-logs", params],
};
