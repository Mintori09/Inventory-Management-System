"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Table } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { formatDateTime } from "@/lib/format";
import { EmptyState } from "@/components/ui/EmptyState";
import type { StockMovement, MovementsResponse } from "@/types/inventory.type";

const badgeVariant: Record<string, "success" | "info" | "warning"> = { import: "success", export: "info", adjustment: "warning" };
const typeLabel: Record<string, string> = { import: "Nhập kho", export: "Xuất kho", adjustment: "Điều chỉnh" };

type Props = { productId: number };

export function ProductMovementMiniTable({ productId }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ["inventory", "movements", { productId, limit: 5 }],
    queryFn: () => apiClient<MovementsResponse>(`/inventory/movements?productId=${productId}&limit=5`),
  });

  const columns = [
    { key: "createdAt", header: "Thời gian", render: (m: StockMovement) => formatDateTime(m.createdAt) },
    { key: "type", header: "Loại", render: (m: StockMovement) => <Badge variant={badgeVariant[m.type]}>{typeLabel[m.type]}</Badge> },
    { key: "quantityChange", header: "Số lượng", render: (m: StockMovement) => (
      <span className={m.quantityChange > 0 ? "text-success" : "text-danger"}>{m.quantityChange > 0 ? "+" : ""}{m.quantityChange}</span>
    )},
    { key: "stockAfter", header: "Tồn sau" },
    { key: "createdBy", header: "Người thực hiện", render: (m: StockMovement) => m.createdBy.fullName },
  ];

  return (
    <div className="rounded-xl border bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Giao dịch gần đây</h3>
      {!isLoading && data?.items.length === 0 ? (
        <EmptyState title="Chưa có giao dịch nào" />
      ) : (
        <Table columns={columns} data={data?.items || []} isLoading={isLoading} />
      )}
    </div>
  );
}
