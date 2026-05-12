"use client";

import { Table } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/lib/format";
import { Eye } from "lucide-react";
import type { AuditLog } from "@/types/audit-log.type";

type Props = {
  data: AuditLog[];
  isLoading: boolean;
  onView: (id: number) => void;
};

export function AuditLogTable({ data, isLoading, onView }: Props) {
  const columns = [
    { key: "createdAt", header: "Thời gian", render: (l: AuditLog) => formatDateTime(l.createdAt) },
    { key: "user", header: "Người thực hiện", render: (l: AuditLog) => l.user.fullName },
    { key: "action", header: "Hành động", render: (l: AuditLog) => <Badge variant="info">{l.action}</Badge> },
    { key: "tableName", header: "Bảng" },
    { key: "recordId", header: "Record ID" },
    { key: "description", header: "Mô tả" },
    { key: "actions", header: "", render: (l: AuditLog) => (
      <Button variant="ghost" size="sm" onClick={() => onView(l.id)} aria-label="Xem chi tiết">
        <Eye className="h-4 w-4" />
      </Button>
    )},
  ];

  return <Table columns={columns} data={data} isLoading={isLoading} />;
}
