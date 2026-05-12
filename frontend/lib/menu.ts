import type { UserRole } from "@/types/auth.type";

export type MenuItem = {
  label: string;
  href: string;
  icon: string;
  roles: UserRole[];
};

export const menuItems: MenuItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard", roles: ["admin", "staff"] },
  { label: "Sản phẩm", href: "/products", icon: "Package", roles: ["admin", "staff"] },
  { label: "Danh mục", href: "/categories", icon: "FolderTree", roles: ["admin", "staff"] },
  { label: "Nhà cung cấp", href: "/suppliers", icon: "Truck", roles: ["admin", "staff"] },
  { label: "Tồn kho", href: "/inventory", icon: "Warehouse", roles: ["admin", "staff"] },
  { label: "Nhập kho", href: "/inventory/import", icon: "ArrowDownToLine", roles: ["admin", "staff"] },
  { label: "Xuất kho", href: "/inventory/export", icon: "ArrowUpFromLine", roles: ["admin", "staff"] },
  { label: "Điều chỉnh kho", href: "/inventory/adjust", icon: "Scale", roles: ["admin"] },
  { label: "Lịch sử giao dịch", href: "/inventory/movements", icon: "History", roles: ["admin", "staff"] },
  { label: "Cảnh báo tồn kho", href: "/inventory/alerts", icon: "AlertTriangle", roles: ["admin", "staff"] },
  { label: "Người dùng", href: "/admin/users", icon: "Users", roles: ["admin"] },
  { label: "Nhật ký", href: "/admin/audit-logs", icon: "FileText", roles: ["admin"] },
];

export function getMenuItemsForRole(role: UserRole): MenuItem[] {
  return menuItems.filter((item) => item.roles.includes(role));
}
