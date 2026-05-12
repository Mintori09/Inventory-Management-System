"use client";

import { useParams, useRouter } from "next/navigation";
import { useUser, useUpdateUser } from "@/hooks/useUsers";
import { UserForm } from "@/components/users/UserForm";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditUserPage() {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();
  const { data: user, isLoading: userLoading, error } = useUser(id);
  const { mutateAsync: updateUser, isPending } = useUpdateUser();

  if (error) {
    return <EmptyState title="Không thể tải dữ liệu" description="Đã có lỗi xảy ra" actionLabel="Thử lại" onAction={() => window.location.reload()} />;
  }

  const handleSubmit = async (data: any) => {
    const payload = { ...data };
    if (!payload.password) delete payload.password;
    await updateUser({ id, data: payload });
    router.push("/admin/users");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/users">
          <Button variant="ghost"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <h1 className="text-2xl font-bold">Chỉnh sửa người dùng</h1>
      </div>
      {userLoading ? (
        <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
      ) : user ? (
        <div className="rounded-xl border bg-white p-6">
          <UserForm initialData={user} onSubmit={handleSubmit} isSubmitting={isPending} />
        </div>
      ) : null}
    </div>
  );
}
