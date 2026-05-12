"use client";

import { Table } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/lib/format";
import { Edit, Lock, Unlock } from "lucide-react";
import type { User } from "@/types/user.type";

type Props = {
  data: User[];
  isLoading: boolean;
  onEdit: (id: number) => void;
  onToggleStatus: (id: number, isActive: boolean) => void;
};

export function UserTable({ data, isLoading, onEdit, onToggleStatus }: Props) {
  const columns = [
    { key: "fullName", header: "Họ tên" },
    { key: "email", header: "Email" },
    { key: "role", header: "Vai trò", render: (u: User) => (
      <Badge variant={u.role === "admin" ? "info" : "neutral"}>{u.role === "admin" ? "Admin" : "Nhân viên"}</Badge>
    )},
    { key: "isActive", header: "Trạng thái", render: (u: User) => (
      <Badge variant={u.isActive ? "success" : "danger"}>{u.isActive ? "Hoạt động" : "Tạm khóa"}</Badge>
    )},
    { key: "createdAt", header: "Ngày tạo", render: (u: User) => formatDateTime(u.createdAt) },
    { key: "actions", header: "Thao tác", render: (u: User) => (
      <div className="flex gap-1">
        <Button variant="ghost" size="sm" onClick={() => onEdit(u.id)} aria-label="Sửa">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onToggleStatus(u.id, !u.isActive)} aria-label={u.isActive ? "Khóa" : "Mở khóa"}>
          {u.isActive ? <Lock className="h-4 w-4 text-warning" /> : <Unlock className="h-4 w-4 text-success" />}
        </Button>
      </div>
    )},
  ];

  return <Table columns={columns} data={data} isLoading={isLoading} />;
}
