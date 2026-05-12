"use client";

import { StatCard } from "@/components/ui/StatCard";
import { Package, AlertTriangle, XCircle } from "lucide-react";

type Props = {
  totalProducts?: number;
  lowStockCount?: number;
  outOfStockCount?: number;
  isLoading: boolean;
};

export function StockSummaryCard({ totalProducts, lowStockCount, outOfStockCount, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-200" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard title="Tổng sản phẩm" value={totalProducts ?? 0} icon={<Package className="h-5 w-5" />} />
      <StatCard title="Sắp hết hàng" value={lowStockCount ?? 0} icon={<AlertTriangle className="h-5 w-5 text-warning" />} />
      <StatCard title="Hết hàng" value={outOfStockCount ?? 0} icon={<XCircle className="h-5 w-5 text-danger" />} />
    </div>
  );
}
