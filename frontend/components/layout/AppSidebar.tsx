"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { getMenuItemsForRole } from "@/lib/menu";
import { Package, X, LayoutDashboard, FolderTree, Truck, Warehouse, ArrowDownToLine, ArrowUpFromLine, Scale, History, AlertTriangle, Users, FileText } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, Package, FolderTree, Truck, Warehouse,
  ArrowDownToLine, ArrowUpFromLine, Scale, History, AlertTriangle, Users, FileText,
};

type AppSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function AppSidebar({ open, onClose }: AppSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const menuItems = user ? getMenuItemsForRole(user.role) : [];

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-white">
            <Package className="h-6 w-6" />
            <span className="font-bold">Quản lý kho</span>
          </Link>
          <button onClick={onClose} className="text-gray-400 hover:text-white lg:hidden" aria-label="Đóng menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {menuItems.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-sidebar-hover text-white"
                    : "text-gray-400 hover:bg-sidebar-hover hover:text-white"
                )}
              >
                {Icon && <Icon className="h-5 w-5" />}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
