"use client";

import { Table } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowDownToLine, Eye } from "lucide-react";
import type { LowStockItem } from "@/types/inventory.type";

const badgeVariant: Record<string, "warning" | "danger"> = {
  low_stock: "warning", out_of_stock: "danger",
};
const statusLabel: Record<string, string> = {
  low_stock: "Sắp hết", out_of_stock: "Hết hàng",
};

type Props = {
  data: LowStockItem[];
  isLoading: boolean;
  onImport: (id: number) => void;
  onView: (id: number) => void;
};

export function LowStockTable({ data, isLoading, onImport, onView }: Props) {
  const columns = [
    { key: "name", header: "Sản phẩm" },
    { key: "sku", header: "SKU" },
    { key: "category", header: "Danh mục" },
    { key: "currentStock", header: "Tồn hiện tại" },
    { key: "minStock", header: "Tồn tối thiểu", render: (item: LowStockItem) => (
      <span className="font-medium">{item.minStock}</span>
    )},
    { key: "shortage", header: "Thiếu hụt", render: (item: LowStockItem) => (
      <span className="text-danger font-medium">{item.shortage}</span>
    )},
    { key: "stockStatus", header: "Trạng thái", render: (item: LowStockItem) => (
      <Badge variant={badgeVariant[item.stockStatus]}>{statusLabel[item.stockStatus]}</Badge>
    )},
    { key: "actions", header: "Hành động", render: (item: LowStockItem) => (
      <div className="flex gap-1">
        <Button variant="ghost" size="sm" onClick={() => onImport(item.id)} aria-label="Nhập kho">
          <ArrowDownToLine className="h-4 w-4 text-success" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onView(item.id)} aria-label="Xem">
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    )},
  ];

  return <Table columns={columns} data={data} isLoading={isLoading} />;
}
