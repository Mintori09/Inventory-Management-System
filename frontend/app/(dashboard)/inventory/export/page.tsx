"use client";

import { useRouter } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { useExportStock } from "@/hooks/useInventory";
import { ExportStockForm } from "@/components/inventory/ExportStockForm";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ExportStockPage() {
  const router = useRouter();
  const { data: products } = useProducts({});
  const { mutateAsync: exportStock, isPending } = useExportStock();

  const handleSubmit = async (data: any) => {
    await exportStock(data);
    router.push("/inventory/movements");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/inventory">
          <Button variant="ghost"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <h1 className="text-2xl font-bold">Xuất kho</h1>
      </div>
      <div className="rounded-xl border bg-white p-6">
        <ExportStockForm
          products={products?.items || []}
          onSubmit={handleSubmit}
          isSubmitting={isPending}
        />
      </div>
    </div>
  );
}
