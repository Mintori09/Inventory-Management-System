"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { useLowStock } from "@/hooks/useInventory";
import { DashboardKpiCards } from "@/components/dashboard/DashboardKpiCards";
import { RecentMovements } from "@/components/dashboard/RecentMovements";
import { LowStockPreview } from "@/components/dashboard/LowStockPreview";
import { ImportExportChart } from "@/components/dashboard/ImportExportChart";
import { CategoryStockChart } from "@/components/dashboard/CategoryStockChart";
import { Button } from "@/components/ui/Button";

import type { DashboardSummary, RecentMovement, ImportExportChartData, CategoryStockData } from "@/types/dashboard.type";

const RANGES = [
  { label: "7 ngày", value: 7 },
  { label: "30 ngày", value: 30 },
  { label: "90 ngày", value: 90 },
] as const;

export default function DashboardPage() {
  const [range, setRange] = useState(7);

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: queryKeys.dashboardSummary,
    queryFn: () => apiClient<DashboardSummary>("/dashboard/summary"),
  });

  const { data: movements, isLoading: movementsLoading } = useQuery({
    queryKey: queryKeys.dashboardRecentMovements,
    queryFn: () => apiClient<RecentMovement[]>("/dashboard/recent-movements"),
  });

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: [...queryKeys.dashboardImportExportChart, range],
    queryFn: () => apiClient<ImportExportChartData[]>(`/dashboard/import-export-chart?range=${range}`),
  });

  const { data: categoryData, isLoading: categoryLoading } = useQuery({
    queryKey: queryKeys.dashboardCategoryChart,
    queryFn: () => apiClient<CategoryStockData[]>("/dashboard/category-chart"),
  });

  const { data: lowStockData, isLoading: lowStockLoading } = useLowStock();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-1 rounded-lg border p-1">
          {RANGES.map((r) => (
            <Button
              key={r.value}
              variant={range === r.value ? "primary" : "ghost"}
              size="sm"
              onClick={() => setRange(r.value)}
            >
              {r.label}
            </Button>
          ))}
        </div>
      </div>

      <DashboardKpiCards data={summary} isLoading={summaryLoading} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentMovements data={movements} isLoading={movementsLoading} />
        <LowStockPreview data={lowStockData?.items} isLoading={lowStockLoading} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ImportExportChart data={chartData} isLoading={chartLoading} />
        <CategoryStockChart data={categoryData} isLoading={categoryLoading} />
      </div>
    </div>
  );
}
