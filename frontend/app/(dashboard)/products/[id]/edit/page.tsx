"use client";

import { useParams, useRouter } from "next/navigation";
import { useProduct, useUpdateProduct } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useSuppliers } from "@/hooks/useSuppliers";
import { ProductForm } from "@/components/products/ProductForm";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditProductPage() {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();
  const { data: product, isLoading: productLoading, error } = useProduct(id);
  const { data: catData } = useCategories();
  const { data: supData } = useSuppliers();
  const { mutateAsync: updateProduct, isPending } = useUpdateProduct();

  if (error) {
    return <EmptyState title="Không thể tải dữ liệu" description="Đã có lỗi xảy ra" actionLabel="Thử lại" onAction={() => window.location.reload()} />;
  }

  const handleSubmit = async (data: any) => {
    await updateProduct({ id, data });
    router.push(`/products/${id}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href={`/products/${id}`}>
          <Button variant="ghost"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <h1 className="text-2xl font-bold">Chỉnh sửa sản phẩm</h1>
      </div>
      {productLoading ? (
        <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
      ) : product ? (
        <div className="rounded-xl border bg-white p-6">
          <ProductForm
            categories={catData?.items || []}
            suppliers={supData?.items || []}
            initialData={product}
            onSubmit={handleSubmit}
            isSubmitting={isPending}
          />
        </div>
      ) : null}
    </div>
  );
}
