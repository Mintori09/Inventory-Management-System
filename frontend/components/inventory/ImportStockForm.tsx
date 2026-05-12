"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { importStockSchema, type ImportStockFormValues } from "@/schemas/inventory.schema";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/types/product.type";
import type { Supplier } from "@/types/supplier.type";

type Props = {
  products: Product[];
  suppliers: Supplier[];
  onSubmit: (data: ImportStockFormValues) => Promise<void>;
  isSubmitting: boolean;
};

export function ImportStockForm({ products, suppliers, onSubmit, isSubmitting }: Props) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ImportStockFormValues>({
    resolver: zodResolver(importStockSchema),
  });

  const productId = watch("productId");
  const quantity = watch("quantity") || 0;
  const importPrice = watch("importPrice") || 0;

  const handleProductChange = (id: number) => {
    const product = products.find((p) => p.id === id) || null;
    setSelectedProduct(product);
  };

  const stockAfter = selectedProduct ? selectedProduct.currentStock + quantity : 0;
  const totalAmount = quantity * importPrice;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Select
          label="Sản phẩm"
          options={products.map((p) => ({ value: p.id, label: `${p.name} (${p.sku})` }))}
          placeholder="Chọn sản phẩm"
          error={errors.productId?.message}
          {...register("productId", { valueAsNumber: true, onChange: (e) => handleProductChange(Number(e.target.value)) })}
        />

        {selectedProduct && (
          <div className="rounded-lg border bg-gray-50 p-3 text-sm">
            <p><strong>SKU:</strong> {selectedProduct.sku}</p>
            <p><strong>Tên:</strong> {selectedProduct.name}</p>
            <p><strong>Tồn hiện tại:</strong> {selectedProduct.currentStock} {selectedProduct.unit}</p>
            <p><strong>Tồn tối thiểu:</strong> {selectedProduct.minStock} {selectedProduct.unit}</p>
          </div>
        )}

        <Select
          label="Nhà cung cấp"
          options={suppliers.map((s) => ({ value: s.id, label: s.name }))}
          placeholder="Chọn nhà cung cấp"
          {...register("supplierId", { valueAsNumber: true })}
        />

        <Input label="Số lượng" type="number" error={errors.quantity?.message} {...register("quantity", { valueAsNumber: true })} />
        <Input label="Giá nhập" type="number" step="0.01" error={errors.importPrice?.message} {...register("importPrice", { valueAsNumber: true })} />

        {selectedProduct && quantity > 0 && (
          <div className="rounded-lg border border-success/20 bg-success/5 p-3 text-sm">
            <p><strong>Tồn sau khi nhập:</strong> {stockAfter} {selectedProduct.unit}</p>
            <p><strong>Tổng tiền:</strong> {formatCurrency(totalAmount)}</p>
          </div>
        )}

        <div className="md:col-span-2">
          <Textarea label="Ghi chú" {...register("note")} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting}>
          Nhập kho
        </Button>
      </div>
    </form>
  );
}
