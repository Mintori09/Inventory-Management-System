"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { STOCK_STATUS_OPTIONS } from "@/lib/constants";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";
import type { Category } from "@/types/category.type";
import type { Supplier } from "@/types/supplier.type";
import type { StockStatus } from "@/types/product.type";

type ProductFiltersProps = {
  search: string;
  categoryId: string;
  supplierId: string;
  stockStatus: StockStatus | "";
  onSearchChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onSupplierChange: (v: string) => void;
  onStatusChange: (v: StockStatus | "") => void;
  categories: Category[];
  suppliers: Supplier[];
};

export function ProductFilters({
  search, categoryId, supplierId, stockStatus,
  onSearchChange, onCategoryChange, onSupplierChange, onStatusChange,
  categories, suppliers,
}: ProductFiltersProps) {
  const [localSearch, setLocalSearch] = useState(search);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <div className="flex flex-wrap gap-3">
      <Input
        placeholder="Tìm kiếm tên/SKU..."
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        className="w-64"
      />
      <Select
        options={categories.map((c) => ({ value: c.id, label: c.name }))}
        placeholder="Danh mục"
        value={categoryId}
        onChange={(e) => onCategoryChange(e.target.value)}
      />
      <Select
        options={suppliers.map((s) => ({ value: s.id, label: s.name }))}
        placeholder="Nhà cung cấp"
        value={supplierId}
        onChange={(e) => onSupplierChange(e.target.value)}
      />
      <Select
        options={[...STOCK_STATUS_OPTIONS]}
        placeholder="Trạng thái"
        value={stockStatus}
        onChange={(e) => onStatusChange(e.target.value as StockStatus | "")}
      />
    </div>
  );
}
