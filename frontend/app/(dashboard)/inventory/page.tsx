"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStockOverview } from "@/hooks/useInventory";
import { StockOverviewTable } from "@/components/inventory/StockOverviewTable";
import { StockSummaryCard } from "@/components/inventory/StockSummaryCard";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/ui/EmptyState";
import { ExportExcelButton } from "@/components/ui/ExportExcelButton";
import { useDebounce } from "@/hooks/useDebounce";

export default function InventoryPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useStockOverview({
    search: debouncedSearch || undefined,
    stockStatus: status || undefined,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tồn kho</h1>
        <ExportExcelButton
          columns={[
            { key: "sku", header: "SKU" },
            { key: "name", header: "Tên sản phẩm" },
            { key: "category", header: "Danh mục" },
            { key: "currentStock", header: "Tồn kho" },
            { key: "minStock", header: "Tồn tối thiểu" },
            { key: "stockStatus", header: "Trạng thái" },
          ]}
          data={(data?.items || []).map((i: Record<string, unknown>) => ({ sku: i.sku, name: i.name, category: i.category, currentStock: i.currentStock, minStock: i.minStock, stockStatus: i.stockStatus }))}
          filename="ton-kho"
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
          options={[
            { value: "in_stock", label: "Còn hàng" },
            { value: "low_stock", label: "Sắp hết" },
            { value: "out_of_stock", label: "Hết hàng" },
          ]}
          placeholder="Trạng thái"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
      </div>

      <StockSummaryCard
        isLoading={isLoading}
        totalProducts={data?.items.length}
        lowStockCount={data?.items.filter((i: any) => i.stockStatus === "low_stock").length}
        outOfStockCount={data?.items.filter((i: any) => i.stockStatus === "out_of_stock").length}
      />

      {!isLoading && data?.items.length === 0 ? (
        <EmptyState title="Không có dữ liệu tồn kho" />
      ) : (
        <StockOverviewTable
          data={data?.items || []}
          isLoading={isLoading}
          onView={(sku) => router.push(`/products/${sku}`)}
          onImport={() => router.push("/inventory/import")}
          onExport={() => router.push("/inventory/export")}
        />
      )}
    </div>
  );
}
