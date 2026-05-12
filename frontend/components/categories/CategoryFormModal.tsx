"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, type CategoryFormValues } from "@/schemas/category.schema";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import type { Category } from "@/types/category.type";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormValues) => Promise<void>;
  initialData?: Category;
  isSubmitting: boolean;
};

export function CategoryFormModal({ open, onClose, onSubmit, initialData, isSubmitting }: Props) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData ? {
      name: initialData.name,
      description: initialData.description || "",
      isActive: initialData.isActive,
    } : { isActive: true },
  });

  const handleFormSubmit = async (data: CategoryFormValues) => {
    await onSubmit(data);
    reset();
  };

  return (
    <Modal open={open} onClose={onClose} title={initialData ? "Sửa danh mục" : "Thêm danh mục"}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
        <Input label="Tên danh mục" error={errors.name?.message} {...register("name")} />
        <Textarea label="Mô tả" {...register("description")} />
        <div className="flex items-center gap-2">
          <input type="checkbox" id="categoryIsActive" {...register("isActive")} className="rounded border-gray-300" />
          <label htmlFor="categoryIsActive" className="text-sm">Hoạt động</label>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={onClose}>Hủy</Button>
          <Button type="submit" isLoading={isSubmitting}>{initialData ? "Cập nhật" : "Thêm"}</Button>
        </div>
      </form>
    </Modal>
  );
}
