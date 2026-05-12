"use client";

import { Table } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { formatDateTime } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Edit, EyeOff } from "lucide-react";
import type { Supplier } from "@/types/supplier.type";

type Props = {
  data: Supplier[];
  isLoading: boolean;
  isAdmin: boolean;
  onEdit: (supplier: Supplier) => void;
  onHide: (id: number) => void;
};

export function SupplierTable({ data, isLoading, isAdmin, onEdit, onHide }: Props) {
  const columns = [
    { key: "name", header: "Tên nhà cung cấp" },
    { key: "phone", header: "Số điện thoại", render: (s: Supplier) => s.phone || "-" },
    { key: "email", header: "Email", render: (s: Supplier) => s.email || "-" },
    { key: "address", header: "Địa chỉ", render: (s: Supplier) => s.address || "-" },
    { key: "productCount", header: "Số sản phẩm", render: (s: Supplier) => s.productCount ?? "-" },
    { key: "isActive", header: "Trạng thái", render: (s: Supplier) => (
      <Badge variant={s.isActive ? "success" : "neutral"}>{s.isActive ? "Hoạt động" : "Tạm khóa"}</Badge>
    )},
    ...(isAdmin ? [{
      key: "actions" as const, header: "Thao tác", render: (s: Supplier) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(s)} aria-label="Sửa"><Edit className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={() => onHide(s.id)} aria-label="Ẩn"><EyeOff className="h-4 w-4 text-warning" /></Button>
        </div>
      ),
    }] : []),
  ];

  return <Table columns={columns} data={data} isLoading={isLoading} />;
}
