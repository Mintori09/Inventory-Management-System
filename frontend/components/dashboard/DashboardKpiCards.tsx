"use client";

import { StatCard } from "@/components/ui/StatCard";
import { Package, AlertTriangle, XCircle, ArrowDownToLine, ArrowUpFromLine, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { DashboardSummary } from "@/types/dashboard.type";

type Props = {
  data?: DashboardSummary;
  isLoading: boolean;
};

export function DashboardKpiCards({ data, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-200" />
        ))}
      </div>
    );
  }

  if (!data) return null;

  const cards = [
    { title: "Tổng sản phẩm", value: data.totalProducts, icon: <Package className="h-5 w-5" /> },
    { title: "Sắp hết hàng", value: data.lowStockCount, icon: <AlertTriangle className="h-5 w-5 text-warning" /> },
    { title: "Hết hàng", value: data.outOfStockCount, icon: <XCircle className="h-5 w-5 text-danger" /> },
    { title: "Nhập hôm nay", value: data.importToday, icon: <ArrowDownToLine className="h-5 w-5 text-success" /> },
    { title: "Xuất hôm nay", value: data.exportToday, icon: <ArrowUpFromLine className="h-5 w-5 text-info" /> },
    { title: "Giá trị tồn kho", value: formatCurrency(data.totalStockValue), icon: <DollarSign className="h-5 w-5" /> },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <StatCard key={card.title} title={card.title} value={card.value} icon={card.icon} />
      ))}
    </div>
  );
}
