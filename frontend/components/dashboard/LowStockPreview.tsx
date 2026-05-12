"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { getStockStatusLabel } from "@/lib/format";
import type { Product } from "@/types/product.type";

const badgeVariantMap = {
  low_stock: "warning" as const,
  out_of_stock: "danger" as const,
  in_stock: "success" as const,
};

type Props = {
  data?: Product[];
  isLoading: boolean;
};

export function LowStockPreview({ data, isLoading }: Props) {
  if (isLoading) {
    return <div className="h-48 animate-pulse rounded-xl bg-gray-200" />;
  }

  const lowStockItems = (data || []).filter(
    (p) => p.stockStatus === "low_stock" || p.stockStatus === "out_of_stock"
  );

  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Cảnh báo tồn kho</h3>
        <Link href="/inventory/alerts" className="text-sm text-primary hover:underline">
          Xem tất cả
        </Link>
      </div>
      {lowStockItems.length === 0 ? (
        <p className="text-sm text-gray-500">Không có cảnh báo nào</p>
      ) : (
        <div className="space-y-3">
          {lowStockItems.slice(0, 5).map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">SKU: {item.sku}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{item.currentStock} / {item.minStock}</p>
                <Badge variant={badgeVariantMap[item.stockStatus]}>
                  {getStockStatusLabel(item.stockStatus)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
