"use client";

import { formatCurrency, formatDateTime } from "@/lib/format";
import { ProductStatusBadge } from "./ProductStatusBadge";
import type { Product } from "@/types/product.type";

type Props = { product: Product };

export function ProductInfoCard({ product }: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-4 text-lg font-semibold">Thông tin cơ bản</h3>
          <dl className="space-y-3">
            <div><dt className="text-sm text-gray-500">SKU</dt><dd className="font-medium">{product.sku}</dd></div>
            <div><dt className="text-sm text-gray-500">Tên sản phẩm</dt><dd className="font-medium">{product.name}</dd></div>
            <div><dt className="text-sm text-gray-500">Danh mục</dt><dd>{product.category.name}</dd></div>
            <div><dt className="text-sm text-gray-500">Nhà cung cấp</dt><dd>{product.supplier?.name || "-"}</dd></div>
            <div><dt className="text-sm text-gray-500">Đơn vị tính</dt><dd>{product.unit}</dd></div>
            <div><dt className="text-sm text-gray-500">Trạng thái</dt><dd><ProductStatusBadge status={product.stockStatus} /></dd></div>
          </dl>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-semibold">Giá & Tồn kho</h3>
          <dl className="space-y-3">
            <div><dt className="text-sm text-gray-500">Giá nhập</dt><dd className="font-medium">{formatCurrency(product.costPrice)}</dd></div>
            <div><dt className="text-sm text-gray-500">Giá bán</dt><dd className="font-medium">{formatCurrency(product.sellingPrice)}</dd></div>
            <div><dt className="text-sm text-gray-500">Tồn kho</dt><dd className="font-medium">{product.currentStock} {product.unit}</dd></div>
            <div><dt className="text-sm text-gray-500">Tồn tối thiểu</dt><dd>{product.minStock} {product.unit}</dd></div>
            <div><dt className="text-sm text-gray-500">Ngày tạo</dt><dd>{formatDateTime(product.createdAt)}</dd></div>
            <div><dt className="text-sm text-gray-500">Cập nhật</dt><dd>{formatDateTime(product.updatedAt)}</dd></div>
          </dl>
        </div>
      </div>
      {product.description && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-500">Mô tả</h4>
          <p className="mt-1 text-sm">{product.description}</p>
        </div>
      )}
    </div>
  );
}
