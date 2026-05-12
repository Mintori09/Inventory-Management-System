"use client";

import { Table } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { formatDateTime } from "@/lib/format";
import type { RecentMovement } from "@/types/dashboard.type";
import type { MovementType } from "@/types/inventory.type";

const badgeVariant: Record<MovementType, "success" | "info" | "warning"> = {
  import: "success",
  export: "info",
  adjustment: "warning",
};

const typeLabel: Record<MovementType, string> = {
  import: "Nhập kho",
  export: "Xuất kho",
  adjustment: "Điều chỉnh",
};

type Props = {
  data?: RecentMovement[];
  isLoading: boolean;
};

export function RecentMovements({ data, isLoading }: Props) {
  const columns = [
    { key: "createdAt", header: "Thời gian", render: (item: RecentMovement) => formatDateTime(item.createdAt) },
    { key: "product", header: "Sản phẩm", render: (item: RecentMovement) => item.product.name },
    { key: "type", header: "Loại", render: (item: RecentMovement) => (
      <Badge variant={badgeVariant[item.type]}>{typeLabel[item.type]}</Badge>
    )},
    { key: "quantityChange", header: "Số lượng", render: (item: RecentMovement) => (
      <span className={item.quantityChange > 0 ? "text-success" : "text-danger"}>
        {item.quantityChange > 0 ? "+" : ""}{item.quantityChange}
      </span>
    )},
    { key: "createdBy", header: "Người thực hiện", render: (item: RecentMovement) => item.createdBy.fullName },
  ];

  return (
    <div className="rounded-xl border bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Giao dịch gần đây</h3>
      <Table columns={columns} data={data || []} isLoading={isLoading} />
    </div>
  );
}
