"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { exportStockSchema, type ExportStockFormValues } from "@/schemas/inventory.schema";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/format";
import { AlertTriangle } from "lucide-react";
import type { Product } from "@/types/product.type";

type Props = {
  products: Product[];
  onSubmit: (data: ExportStockFormValues) => Promise<void>;
  isSubmitting: boolean;
};

export function ExportStockForm({ products, onSubmit, isSubmitting }: Props) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ExportStockFormValues>({
    resolver: zodResolver(exportStockSchema),
  });

  const productId = watch("productId");
  const quantity = watch("quantity") || 0;
  const exportPrice = watch("exportPrice") || 0;

  const handleProductChange = (id: number) => {
    const product = products.find((p) => p.id === id) || null;
    setSelectedProduct(product);
  };

  const stockAfter = selectedProduct ? selectedProduct.currentStock - quantity : 0;
  const totalAmount = quantity * exportPrice;
  const insufficientStock = selectedProduct ? quantity > selectedProduct.currentStock : false;

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
            <p><strong>Tồn hiện tại:</strong> {selectedProduct.currentStock} {selectedProduct.unit}</p>
          </div>
        )}

        <Input label="Số lượng" type="number" error={errors.quantity?.message} {...register("quantity", { valueAsNumber: true })} />
        <Input label="Giá xuất" type="number" step="0.01" error={errors.exportPrice?.message} {...register("exportPrice", { valueAsNumber: true })} />

        {insufficientStock && (
          <div className="md:col-span-2 flex items-center gap-2 rounded-lg border border-danger/20 bg-danger/5 p-3 text-sm text-danger">
            <AlertTriangle className="h-4 w-4" />
            Không đủ tồn kho. Vui lòng nhập số lượng nhỏ hơn hoặc bằng tồn hiện tại.
          </div>
        )}

        {selectedProduct && quantity > 0 && !insufficientStock && (
          <div className="rounded-lg border border-info/20 bg-info/5 p-3 text-sm">
            <p><strong>Tồn sau khi xuất:</strong> {stockAfter} {selectedProduct.unit}</p>
            <p><strong>Tổng tiền:</strong> {formatCurrency(totalAmount)}</p>
          </div>
        )}

        <div className="md:col-span-2">
          <Textarea label="Ghi chú" {...register("note")} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting} disabled={insufficientStock}>
          Xuất kho
        </Button>
      </div>
    </form>
  );
}
