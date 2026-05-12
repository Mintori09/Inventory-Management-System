"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUsers, useToggleUserStatus } from "@/hooks/useUsers";
import { UserTable } from "@/components/users/UserTable";
import { Pagination } from "@/components/ui/Pagination";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { ExportExcelButton } from "@/components/ui/ExportExcelButton";
import { Plus, Users as UsersIcon } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import { useDebounce } from "@/hooks/useDebounce";
import { USER_ROLE_OPTIONS } from "@/lib/constants";
import Link from "next/link";

export default function UsersListPage() {
  const router = useRouter();
  const { page, setPage } = usePagination();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useUsers({
    search: debouncedSearch || undefined,
    role: role || undefined,
    status: status || undefined,
    page,
    limit: 10,
  });

  const { mutateAsync: toggleStatus } = useToggleUserStatus();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Người dùng</h1>
        <div className="flex items-center gap-2">
          <ExportExcelButton
            columns={[
              { key: "fullName", header: "Họ tên" },
              { key: "email", header: "Email" },
              { key: "role", header: "Vai trò" },
              { key: "isActive", header: "Trạng thái" },
            ]}
            data={(data?.items || []).map((u: Record<string, unknown>) => ({ fullName: u.fullName, email: u.email, role: (u as any).role === "admin" ? "Admin" : "Nhân viên", isActive: (u as any).isActive ? "Hoạt động" : "Vô hiệu" }))}
            filename="nguoi-dung"
          />
          <Link href="/admin/users/new">
            <Button><Plus className="h-4 w-4" /> Thêm người dùng</Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Tìm kiếm tên/email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
        <Select
          options={[...USER_ROLE_OPTIONS]}
          placeholder="Vai trò"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <Select
          options={[{ value: "active", label: "Hoạt động" }, { value: "inactive", label: "Tạm khóa" }]}
          placeholder="Trạng thái"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
      </div>

      {!isLoading && data?.items.length === 0 ? (
        <EmptyState title="Chưa có người dùng nào" icon={<UsersIcon className="h-12 w-12" />} />
      ) : (
        <>
          <UserTable
            data={data?.items || []}
            isLoading={isLoading}
            onEdit={(id) => router.push(`/admin/users/${id}/edit`)}
            onToggleStatus={(id, isActive) => toggleStatus({ id, isActive })}
          />
          <Pagination
            page={data?.pagination.page || 1}
            totalPages={data?.pagination.totalPages || 1}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
