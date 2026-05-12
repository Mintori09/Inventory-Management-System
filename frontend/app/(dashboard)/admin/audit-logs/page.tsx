"use client";

import { useState } from "react";
import { useAuditLogs } from "@/hooks/useAuditLogs";
import { AuditLogTable } from "@/components/audit-logs/AuditLogTable";
import { AuditLogDetailDrawer } from "@/components/audit-logs/AuditLogDetailDrawer";
import { Pagination } from "@/components/ui/Pagination";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { ExportExcelButton } from "@/components/ui/ExportExcelButton";
import { usePagination } from "@/hooks/usePagination";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect } from "react";

export default function AuditLogsPage() {
  const { page, setPage } = usePagination();
  const [search, setSearch] = useState("");
  const [viewId, setViewId] = useState<number | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useAuditLogs({
    search: debouncedSearch || undefined,
    page,
    limit: 10,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nhật ký hoạt động</h1>
        <ExportExcelButton
          columns={[
            { key: "action", header: "Hành động" },
            { key: "description", header: "Mô tả" },
            { key: "user", header: "Người thực hiện" },
            { key: "createdAt", header: "Thời gian" },
          ]}
          data={(data?.items || []).map((l: Record<string, unknown>) => ({ action: l.action, description: l.description, user: (l as any).user?.fullName || "", createdAt: (l as any).createdAt }))}
          filename="nhat-ky-hoat-dong"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Tìm kiếm mô tả/Record ID/người dùng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
      </div>

      {!isLoading && data?.items.length === 0 ? (
        <EmptyState title="Chưa có nhật ký nào" />
      ) : (
        <>
          <AuditLogTable
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

      <AuditLogDetailDrawer
        logId={viewId}
        onClose={() => setViewId(null)}
      />
    </div>
  );
}
