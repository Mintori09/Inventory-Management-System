"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductFormValues } from "@/schemas/product.schema";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { Category } from "@/types/category.type";
import type { Supplier } from "@/types/supplier.type";
import type { Product } from "@/types/product.type";

type ProductFormProps = {
  categories: Category[];
  suppliers: Supplier[];
  initialData?: Product;
  onSubmit: (data: ProductFormValues) => Promise<void>;
  isSubmitting: boolean;
};

export function ProductForm({ categories, suppliers, initialData, onSubmit, isSubmitting }: ProductFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData ? {
      sku: initialData.sku,
      name: initialData.name,
      categoryId: initialData.category.id,
      supplierId: initialData.supplier?.id,
      unit: initialData.unit,
      description: initialData.description || "",
      costPrice: initialData.costPrice,
      sellingPrice: initialData.sellingPrice,
      minStock: initialData.minStock,
      imageUrl: initialData.imageUrl || "",
      isActive: initialData.isActive,
    } : {
      isActive: true,
      currentStock: 0,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {initialData && (
        <div className="rounded-lg bg-info/5 border border-info/20 p-4 text-sm text-info">
          Tồn kho được thay đổi qua nhập/xuất/điều chỉnh kho.
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input label="SKU" error={errors.sku?.message} {...register("sku")} />
        <Input label="Tên sản phẩm" error={errors.name?.message} {...register("name")} />
        <Select
          label="Danh mục"
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
          placeholder="Chọn danh mục"
          error={errors.categoryId?.message}
          {...register("categoryId", { valueAsNumber: true })}
        />
        <Select
          label="Nhà cung cấp"
          options={suppliers.map((s) => ({ value: s.id, label: s.name }))}
          placeholder="Chọn nhà cung cấp"
          {...register("supplierId", { valueAsNumber: true })}
        />
        <Input label="Đơn vị tính" error={errors.unit?.message} {...register("unit")} />
        {!initialData && (
          <Input label="Tồn kho ban đầu" type="number" error={errors.currentStock?.message} {...register("currentStock", { valueAsNumber: true })} />
        )}
        <Input label="Giá nhập" type="number" step="0.01" error={errors.costPrice?.message} {...register("costPrice", { valueAsNumber: true })} />
        <Input label="Giá bán" type="number" step="0.01" error={errors.sellingPrice?.message} {...register("sellingPrice", { valueAsNumber: true })} />
        <Input label="Tồn tối thiểu" type="number" error={errors.minStock?.message} {...register("minStock", { valueAsNumber: true })} />
        <Input label="URL hình ảnh" error={errors.imageUrl?.message} {...register("imageUrl")} />
      </div>
      <Textarea label="Mô tả" {...register("description")} />
      <div className="flex items-center gap-2">
        <input type="checkbox" id="isActive" {...register("isActive")} className="rounded border-gray-300" />
        <label htmlFor="isActive" className="text-sm">Sản phẩm hoạt động</label>
      </div>
      <div className="flex justify-end gap-3">
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? "Cập nhật" : "Tạo sản phẩm"}
        </Button>
      </div>
    </form>
  );
}
