"use client";

import { Table } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/lib/format";
import { Eye } from "lucide-react";
import type { StockMovement } from "@/types/inventory.type";

const badgeVariant: Record<string, "success" | "info" | "warning"> = {
  import: "success", export: "info", adjustment: "warning",
};
const typeLabel: Record<string, string> = {
  import: "Nhập kho", export: "Xuất kho", adjustment: "Điều chỉnh",
};

type Props = {
  data: StockMovement[];
  isLoading: boolean;
  onView: (id: number) => void;
};

export function MovementTable({ data, isLoading, onView }: Props) {
  const columns = [
    { key: "createdAt", header: "Thời gian", render: (m: StockMovement) => formatDateTime(m.createdAt) },
    { key: "product", header: "Sản phẩm", render: (m: StockMovement) => m.product.name },
    { key: "sku", header: "SKU", render: (m: StockMovement) => m.product.sku },
    { key: "type", header: "Loại", render: (m: StockMovement) => <Badge variant={badgeVariant[m.type]}>{typeLabel[m.type]}</Badge> },
    { key: "quantityChange", header: "Số lượng thay đổi", render: (m: StockMovement) => (
      <span className={m.quantityChange > 0 ? "text-success" : "text-danger"}>{m.quantityChange > 0 ? "+" : ""}{m.quantityChange}</span>
    )},
    { key: "stockBefore", header: "Tồn trước" },
    { key: "stockAfter", header: "Tồn sau" },
    { key: "createdBy", header: "Người thực hiện", render: (m: StockMovement) => m.createdBy.fullName },
    { key: "note", header: "Ghi chú", render: (m: StockMovement) => m.note || "-" },
    { key: "actions", header: "", render: (m: StockMovement) => (
      <Button variant="ghost" size="sm" onClick={() => onView(m.id)} aria-label="Xem chi tiết">
        <Eye className="h-4 w-4" />
      </Button>
    )},
  ];

  return <Table columns={columns} data={data} isLoading={isLoading} />;
}
