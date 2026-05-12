"use client";

import { useState } from "react";
import { useMovements } from "@/hooks/useInventory";
import { MovementTable } from "@/components/inventory/MovementTable";
import { MovementDetailDrawer } from "@/components/inventory/MovementDetailDrawer";
import { Pagination } from "@/components/ui/Pagination";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/ui/EmptyState";
import { ExportExcelButton } from "@/components/ui/ExportExcelButton";
import { usePagination } from "@/hooks/usePagination";
import { useDebounce } from "@/hooks/useDebounce";
import { MOVEMENT_TYPE_OPTIONS } from "@/lib/constants";

export default function MovementsPage() {
  const { page, setPage } = usePagination();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [viewId, setViewId] = useState<number | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useMovements({
    search: debouncedSearch || undefined,
    type: type || undefined,
    page,
    limit: 10,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Lịch sử giao dịch</h1>
        <ExportExcelButton
          columns={[
            { key: "id", header: "ID" },
            { key: "type", header: "Loại" },
            { key: "product", header: "Sản phẩm" },
            { key: "quantityChange", header: "Số lượng" },
            { key: "createdBy", header: "Người thực hiện" },
            { key: "createdAt", header: "Thời gian" },
          ]}
          data={(data?.items || []).map((m: Record<string, unknown>) => ({
            id: m.id, type: (m as any).type === "import" ? "Nhập" : (m as any).type === "export" ? "Xuất" : "Điều chỉnh",
            product: (m as any).product?.name || "", quantityChange: (m as any).quantityChange,
            createdBy: (m as any).createdBy?.fullName || "", createdAt: (m as any).createdAt,
          }))}
          filename="lich-su-giao-dich"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Tìm kiếm sản phẩm/SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
        <Select
          options={[...MOVEMENT_TYPE_OPTIONS]}
          placeholder="Loại giao dịch"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
      </div>

      {!isLoading && data?.items.length === 0 ? (
        <EmptyState title="Chưa có giao dịch nào" />
      ) : (
        <>
          <MovementTable
            data={data?.items || []}
            isLoading={isLoading}
            onView={(id) => setViewId(id)}
          />
          <Pagination
            page={data?.pagination.page || 1}
            totalPages={data?.pagination.totalPages || 1}
            onPageChange={setPage}
          />
        </>
      )}

      <MovementDetailDrawer
        movementId={viewId}
        onClose={() => setViewId(null)}
      />
    </div>
  );
}
