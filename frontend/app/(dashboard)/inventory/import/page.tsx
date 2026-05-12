"use client";

import { useRouter } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { useSuppliers } from "@/hooks/useSuppliers";
import { useImportStock } from "@/hooks/useInventory";
import { ImportStockForm } from "@/components/inventory/ImportStockForm";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ImportStockPage() {
  const router = useRouter();
  const { data: products } = useProducts({});
  const { data: suppliers } = useSuppliers();
  const { mutateAsync: importStock, isPending } = useImportStock();

  const handleSubmit = async (data: any) => {
    await importStock(data);
    router.push("/inventory/movements");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/inventory">
          <Button variant="ghost"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <h1 className="text-2xl font-bold">Nhập kho</h1>
      </div>
      <div className="rounded-xl border bg-white p-6">
        <ImportStockForm
          products={products?.items || []}
          suppliers={suppliers?.items || []}
          onSubmit={handleSubmit}
          isSubmitting={isPending}
        />
      </div>
    </div>
  );
}
