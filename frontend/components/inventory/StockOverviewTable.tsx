"use client";

import { Table } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Eye, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import type { StockOverviewItem } from "@/types/inventory.type";

const badgeVariantMap: Record<string, "success" | "warning" | "danger"> = {
  in_stock: "success",
  low_stock: "warning",
  out_of_stock: "danger",
};

type Props = {
  data: StockOverviewItem[];
  isLoading: boolean;
  onView: (sku: string) => void;
  onImport: (sku: string) => void;
  onExport: (sku: string) => void;
};

export function StockOverviewTable({ data, isLoading, onView, onImport, onExport }: Props) {
  const columns = [
    { key: "name", header: "Sản phẩm" },
    { key: "sku", header: "SKU" },
    { key: "category", header: "Danh mục" },
    { key: "currentStock", header: "Tồn hiện tại" },
    { key: "minStock", header: "Tồn tối thiểu" },
    { key: "unit", header: "Đơn vị" },
    { key: "stockStatus", header: "Trạng thái", render: (item: StockOverviewItem) => (
      <Badge variant={badgeVariantMap[item.stockStatus]}>{item.stockStatus === "in_stock" ? "Còn hàng" : item.stockStatus === "low_stock" ? "Sắp hết" : "Hết hàng"}</Badge>
    )},
    { key: "actions", header: "Hành động", render: (item: StockOverviewItem) => (
      <div className="flex gap-1">
        <Button variant="ghost" size="sm" onClick={() => onView(item.sku)} aria-label="Xem"><Eye className="h-4 w-4" /></Button>
        <Button variant="ghost" size="sm" onClick={() => onImport(item.sku)} aria-label="Nhập"><ArrowDownToLine className="h-4 w-4 text-success" /></Button>
        <Button variant="ghost" size="sm" onClick={() => onExport(item.sku)} aria-label="Xuất"><ArrowUpFromLine className="h-4 w-4 text-info" /></Button>
      </div>
    )},
  ];

  return <Table columns={columns} data={data} isLoading={isLoading} />;
}
