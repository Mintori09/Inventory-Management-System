"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import type { StockStatus } from "@/types/product.type";
import { useCategories } from "@/hooks/useCategories";
import { useSuppliers } from "@/hooks/useSuppliers";
import { useAuth } from "@/hooks/useAuth";
import { useDeleteProduct } from "@/hooks/useProducts";
import { ProductTable } from "@/components/products/ProductTable";
import { ProductFilters } from "@/components/products/ProductFilters";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ExportExcelButton } from "@/components/ui/ExportExcelButton";
import { Plus, Package } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import Link from "next/link";

export default function ProductsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { page, setPage } = usePagination();
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [stockStatus, setStockStatus] = useState<StockStatus | "">("");
  const [hideId, setHideId] = useState<number | null>(null);

  const { data, isLoading, error } = useProducts({
    search,
    categoryId: categoryId ? Number(categoryId) : undefined,
    supplierId: supplierId ? Number(supplierId) : undefined,
    stockStatus: stockStatus || undefined,
    page,
    limit: 10,
  });

  const { data: catData } = useCategories();
  const { data: supData } = useSuppliers();
  const { mutateAsync: deleteProduct } = useDeleteProduct();

  if (error) {
    return (
      <EmptyState
        title="Không thể tải dữ liệu"
        description="Đã có lỗi xảy ra khi tải danh sách sản phẩm"
        actionLabel="Thử lại"
        onAction={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sản phẩm</h1>
        <div className="flex items-center gap-2">
          <ExportExcelButton
            columns={[
              { key: "sku", header: "SKU" },
              { key: "name", header: "Tên sản phẩm" },
              { key: "category", header: "Danh mục" },
              { key: "costPrice", header: "Giá nhập" },
              { key: "sellingPrice", header: "Giá bán" },
              { key: "currentStock", header: "Tồn kho" },
            ]}
            data={(data?.items || []).map((p: Record<string, unknown>) => ({
              sku: p.sku,
              name: p.name,
              category: (p as any).category?.name || "",
              costPrice: (p as any).costPrice,
              sellingPrice: (p as any).sellingPrice,
              currentStock: (p as any).currentStock,
            }))}
            filename="san-pham"
          />
          {user?.role === "admin" && (
            <Link href="/products/new">
              <Button><Plus className="h-4 w-4" /> Thêm sản phẩm</Button>
            </Link>
          )}
        </div>
      </div>

      <ProductFilters
        search={search} categoryId={categoryId} supplierId={supplierId} stockStatus={stockStatus}
        onSearchChange={setSearch}
        onCategoryChange={setCategoryId}
        onSupplierChange={setSupplierId}
        onStatusChange={setStockStatus}
        categories={catData?.items || []}
        suppliers={supData?.items || []}
      />

      {!isLoading && data?.items.length === 0 && !search ? (
        <EmptyState
          title="Chưa có sản phẩm nào"
          description="Thêm sản phẩm đầu tiên để bắt đầu quản lý kho"
          icon={<Package className="h-12 w-12" />}
          actionLabel={user?.role === "admin" ? "Thêm sản phẩm" : undefined}
          onAction={user?.role === "admin" ? () => router.push("/products/new") : undefined}
        />
      ) : !isLoading && data?.items.length === 0 && search ? (
        <EmptyState title="Không tìm thấy sản phẩm phù hợp" />
      ) : (
        <>
          <ProductTable
            data={data?.items || []}
            isLoading={isLoading}
            role={user?.role || "staff"}
            onView={(id) => router.push(`/products/${id}`)}
            onEdit={(id) => router.push(`/products/${id}/edit`)}
            onHide={(id) => setHideId(id)}
            onImport={() => router.push("/inventory/import")}
            onExport={() => router.push("/inventory/export")}
          />
          <Pagination
            page={data?.pagination.page || 1}
            totalPages={data?.pagination.totalPages || 1}
            onPageChange={setPage}
          />
        </>
      )}

      <ConfirmDialog
        open={hideId !== null}
        onClose={() => setHideId(null)}
        onConfirm={async () => {
          if (hideId) await deleteProduct(hideId);
          setHideId(null);
        }}
        title="Ẩn sản phẩm"
        message="Bạn có chắc chắn muốn ẩn sản phẩm này?"
      />
    </div>
  );
}
