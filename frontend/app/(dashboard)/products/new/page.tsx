"use client";

import { useRouter } from "next/navigation";
import { useCreateProduct } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useSuppliers } from "@/hooks/useSuppliers";
import { ProductForm } from "@/components/products/ProductForm";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const { data: catData } = useCategories();
  const { data: supData } = useSuppliers();
  const { mutateAsync: createProduct, isPending } = useCreateProduct();

  const handleSubmit = async (data: any) => {
    await createProduct(data);
    router.push("/products");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/products">
          <Button variant="ghost"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <h1 className="text-2xl font-bold">Thêm sản phẩm</h1>
      </div>
      <div className="rounded-xl border bg-white p-6">
        <ProductForm
          categories={catData?.items || []}
          suppliers={supData?.items || []}
          onSubmit={handleSubmit}
          isSubmitting={isPending}
        />
      </div>
    </div>
  );
}
