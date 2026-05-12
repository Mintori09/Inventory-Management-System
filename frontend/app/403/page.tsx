import Link from "next/link";
import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <ShieldX className="h-16 w-16 text-danger" />
      <h1 className="text-2xl font-bold">Truy cập bị từ chối</h1>
      <p className="text-gray-500">Bạn không có quyền truy cập trang này.</p>
      <Link href="/dashboard">
        <Button>Về trang chủ</Button>
      </Link>
    </div>
  );
}
