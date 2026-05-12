import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <FileQuestion className="h-16 w-16 text-gray-400" />
      <h1 className="text-2xl font-bold">Không tìm thấy trang</h1>
      <p className="text-gray-500">Trang bạn đang tìm không tồn tại.</p>
      <Link href="/dashboard">
        <Button>Về trang chủ</Button>
      </Link>
    </div>
  );
}
