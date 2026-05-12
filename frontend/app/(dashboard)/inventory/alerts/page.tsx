"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLowStock } from "@/hooks/useInventory";
import { LowStockTable } from "@/components/inventory/LowStockTable";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, XCircle, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "all", label: "Tất cả" },
  { key: "low_stock", label: "Sắp hết" },
  { key: "out_of_stock", label: "Hết hàng" },
];

export default function AlertsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const { data, isLoading } = useLowStock({
    stockStatus: activeTab !== "all" ? activeTab : undefined,
  });

  const summary = data?.summary;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Cảnh báo tồn kho</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Tất cả cảnh báo" value={summary?.total ?? 0} icon={<Bell className="h-5 w-5" />} />
        <StatCard title="Sắp hết hàng" value={summary?.lowStock ?? 0} icon={<AlertTriangle className="h-5 w-5 text-warning" />} />
        <StatCard title="Hết hàng" value={summary?.outOfStock ?? 0} icon={<XCircle className="h-5 w-5 text-danger" />} />
      </div>

      <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.key
                ? "bg-white text-foreground shadow-sm"
                : "text-gray-500 hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <LowStockTable
        data={data?.items || []}
        isLoading={isLoading}
        onImport={(id) => router.push("/inventory/import")}
        onView={(id) => router.push(`/products/${id}`)}
      />
    </div>
  );
}
