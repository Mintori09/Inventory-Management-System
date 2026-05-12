"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adjustStockSchema, type AdjustStockFormValues } from "@/schemas/inventory.schema";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import type { Product } from "@/types/product.type";

type Props = {
  products: Product[];
  onSubmit: (data: AdjustStockFormValues) => Promise<void>;
  isSubmitting: boolean;
};

export function StockAdjustmentForm({ products, onSubmit, isSubmitting }: Props) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<AdjustStockFormValues>({
    resolver: zodResolver(adjustStockSchema),
  });

  const productId = watch("productId");
  const adjustmentType = watch("adjustmentType");
  const quantity = watch("quantity") || 0;

  const handleProductChange = (id: number) => {
    const product = products.find((p) => p.id === id) || null;
    setSelectedProduct(product);
  };

  const stockAfter = selectedProduct
    ? adjustmentType === "increase"
      ? selectedProduct.currentStock + quantity
      : selectedProduct.currentStock - quantity
    : 0;

  const wouldGoNegative = adjustmentType === "decrease" && quantity > (selectedProduct?.currentStock || 0);

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

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Loại điều chỉnh</label>
          <div className="flex gap-2">
            <button
              type="button"
              className={cn(
                "flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                adjustmentType === "increase"
                  ? "border-success bg-success/5 text-success"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50"
              )}
              onClick={() => {
                const nativeSetter = Object.getOwnPropertyDescriptor(
                  window.HTMLSelectElement.prototype, "value"
                )?.set;
                // handled by the select below
              }}
            >
              Tăng
            </button>
            <button
              type="button"
              className={cn(
                "flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                adjustmentType === "decrease"
                  ? "border-danger bg-danger/5 text-danger"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50"
              )}
            >
              Giảm
            </button>
          </div>
          <select {...register("adjustmentType")} className="hidden">
            <option value="increase">Tăng</option>
            <option value="decrease">Giảm</option>
          </select>
        </div>

        <Input label="Số lượng" type="number" error={errors.quantity?.message} {...register("quantity", { valueAsNumber: true })} />

        {wouldGoNegative && (
          <div className="md:col-span-2 flex items-center gap-2 rounded-lg border border-danger/20 bg-danger/5 p-3 text-sm text-danger">
            <AlertTriangle className="h-4 w-4" />
            Không thể giảm nhiều hơn tồn kho hiện tại.
          </div>
        )}

        {selectedProduct && quantity > 0 && !wouldGoNegative && (
          <div className={cn(
            "rounded-lg border p-3 text-sm",
            adjustmentType === "increase"
              ? "border-success/20 bg-success/5 text-success"
              : "border-danger/20 bg-danger/5 text-danger"
          )}>
            <p><strong>Tồn sau khi điều chỉnh:</strong> {stockAfter} {selectedProduct.unit}</p>
          </div>
        )}

        <div className="md:col-span-2">
          <Textarea label="Ghi chú" error={errors.note?.message} {...register("note")} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting} disabled={wouldGoNegative}>
          Điều chỉnh
        </Button>
      </div>
    </form>
  );
}
