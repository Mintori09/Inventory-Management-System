"use client";

import { useRouter } from "next/navigation";
import { useCreateUser } from "@/hooks/useUsers";
import { UserForm } from "@/components/users/UserForm";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewUserPage() {
  const router = useRouter();
  const { mutateAsync: createUser, isPending } = useCreateUser();

  const handleSubmit = async (data: any) => {
    await createUser(data);
    router.push("/admin/users");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/users">
          <Button variant="ghost"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <h1 className="text-2xl font-bold">Thêm người dùng</h1>
      </div>
      <div className="rounded-xl border bg-white p-6">
        <UserForm onSubmit={handleSubmit} isSubmitting={isPending} />
      </div>
    </div>
  );
}
