"use client";

import { useParams } from "next/navigation";
import { useProduct } from "@/hooks/useProducts";
import { ProductInfoCard } from "@/components/products/ProductInfoCard";
import { ProductMovementMiniTable } from "@/components/products/ProductMovementMiniTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const { data: product, isLoading, error } = useProduct(id);

  if (error) {
    return (
      <EmptyState
        title="Không thể tải dữ liệu"
        description="Đã có lỗi xảy ra khi tải thông tin sản phẩm"
        actionLabel="Thử lại"
        onAction={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/products">
          <Button variant="ghost"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <h1 className="text-2xl font-bold">Chi tiết sản phẩm</h1>
      </div>
      {isLoading ? (
        <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
      ) : product ? (
        <div className="grid grid-cols-1 gap-6">
          <ProductInfoCard product={product} />
          <ProductMovementMiniTable productId={id} />
        </div>
      ) : null}
    </div>
  );
}
