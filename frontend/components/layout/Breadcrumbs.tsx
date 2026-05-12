"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const labelMap: Record<string, string> = {
  dashboard: "Dashboard",
  products: "Sản phẩm",
  categories: "Danh mục",
  suppliers: "Nhà cung cấp",
  inventory: "Tồn kho",
  import: "Nhập kho",
  export: "Xuất kho",
  adjust: "Điều chỉnh kho",
  movements: "Lịch sử giao dịch",
  alerts: "Cảnh báo tồn kho",
  admin: "Quản trị",
  users: "Người dùng",
  "audit-logs": "Nhật ký",
  new: "Thêm mới",
  edit: "Chỉnh sửa",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav className="mb-4 flex items-center gap-1 text-sm text-gray-500">
      {segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const label = labelMap[segment] || segment;
        const isLast = index === segments.length - 1;

        return (
          <span key={href} className="flex items-center gap-1">
            {index > 0 && <ChevronRight className="h-3 w-3" />}
            {isLast ? (
              <span className="font-medium text-foreground">{label}</span>
            ) : (
              <Link href={href} className="hover:text-primary">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
