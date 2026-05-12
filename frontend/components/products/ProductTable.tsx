"use client";

import { Table } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/format";
import { ProductStatusBadge } from "./ProductStatusBadge";
import { Edit, Eye, MoreHorizontal, EyeOff, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { Product } from "@/types/product.type";
import type { UserRole } from "@/types/auth.type";

type ProductTableProps = {
  data: Product[];
  isLoading: boolean;
  role: UserRole;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onHide: (id: number) => void;
  onImport: (id: number) => void;
  onExport: (id: number) => void;
};

function RowActions({ product, role, onView, onEdit, onHide, onImport, onExport }: {
  product: Product;
  role: UserRole;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onHide: (id: number) => void;
  onImport: (id: number) => void;
  onExport: (id: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="rounded-lg p-1 hover:bg-gray-100" aria-label="Thao tác">
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-10 w-40 rounded-lg border bg-white py-1 shadow-lg">
          <button onClick={() => { onView(product.id); setOpen(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50">
            <Eye className="h-4 w-4" /> Xem chi tiết
          </button>
          {role === "admin" && (
            <button onClick={() => { onEdit(product.id); setOpen(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50">
              <Edit className="h-4 w-4" /> Chỉnh sửa
            </button>
          )}
          <button onClick={() => { onImport(product.id); setOpen(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50">
            <ArrowDownToLine className="h-4 w-4" /> Nhập kho
          </button>
          <button onClick={() => { onExport(product.id); setOpen(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50">
            <ArrowUpFromLine className="h-4 w-4" /> Xuất kho
          </button>
          {role === "admin" && (
            <button onClick={() => { onHide(product.id); setOpen(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger/5">
              <EyeOff className="h-4 w-4" /> Ẩn sản phẩm
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function ProductTable(props: ProductTableProps) {
  const columns = [
    { key: "sku", header: "SKU" },
    { key: "name", header: "Tên sản phẩm" },
    { key: "category", header: "Danh mục", render: (p: Product) => p.category.name },
    { key: "supplier", header: "Nhà cung cấp", render: (p: Product) => p.supplier?.name || "-" },
    { key: "currentStock", header: "Tồn kho", render: (p: Product) => `${p.currentStock} ${p.unit}` },
    { key: "sellingPrice", header: "Giá bán", render: (p: Product) => formatCurrency(p.sellingPrice) },
    { key: "stockStatus", header: "Trạng thái", render: (p: Product) => <ProductStatusBadge status={p.stockStatus} /> },
    { key: "actions", header: "Thao tác", render: (p: Product) => <RowActions product={p} role={props.role} onView={props.onView} onEdit={props.onEdit} onHide={props.onHide} onImport={props.onImport} onExport={props.onExport} /> },
  ];

  return <Table columns={columns} data={props.data} isLoading={props.isLoading} />;
}
