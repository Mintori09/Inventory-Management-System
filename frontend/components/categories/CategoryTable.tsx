"use client";

import { Table } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { formatDateTime } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Edit, EyeOff } from "lucide-react";
import type { Category } from "@/types/category.type";

type Props = {
  data: Category[];
  isLoading: boolean;
  isAdmin: boolean;
  onEdit: (category: Category) => void;
  onHide: (id: number) => void;
};

export function CategoryTable({ data, isLoading, isAdmin, onEdit, onHide }: Props) {
  const columns = [
    { key: "name", header: "Tên danh mục" },
    { key: "description", header: "Mô tả", render: (c: Category) => c.description || "-" },
    { key: "productCount", header: "Số sản phẩm", render: (c: Category) => c.productCount ?? "-" },
    { key: "isActive", header: "Trạng thái", render: (c: Category) => (
      <Badge variant={c.isActive ? "success" : "neutral"}>{c.isActive ? "Hoạt động" : "Tạm khóa"}</Badge>
    )},
    { key: "createdAt", header: "Ngày tạo", render: (c: Category) => formatDateTime(c.createdAt) },
    ...(isAdmin ? [{
      key: "actions" as const, header: "Thao tác", render: (c: Category) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(c)} aria-label="Sửa"><Edit className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={() => onHide(c.id)} aria-label="Ẩn"><EyeOff className="h-4 w-4 text-warning" /></Button>
        </div>
      ),
    }] : []),
  ];

  return <Table columns={columns} data={data} isLoading={isLoading} />;
}
