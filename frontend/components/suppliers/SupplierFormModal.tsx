"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supplierSchema, type SupplierFormValues } from "@/schemas/supplier.schema";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import type { Supplier } from "@/types/supplier.type";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SupplierFormValues) => Promise<void>;
  initialData?: Supplier;
  isSubmitting: boolean;
};

export function SupplierFormModal({ open, onClose, onSubmit, initialData, isSubmitting }: Props) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      phone: initialData.phone || "",
      email: initialData.email || "",
      address: initialData.address || "",
      isActive: initialData.isActive,
    } : { isActive: true },
  });

  const handleFormSubmit = async (data: SupplierFormValues) => {
    await onSubmit(data);
    reset();
  };

  return (
    <Modal open={open} onClose={onClose} title={initialData ? "Sửa nhà cung cấp" : "Thêm nhà cung cấp"}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
        <Input label="Tên nhà cung cấp" error={errors.name?.message} {...register("name")} />
        <Input label="Số điện thoại" {...register("phone")} />
        <Input label="Email" error={errors.email?.message} {...register("email")} />
        <Textarea label="Địa chỉ" {...register("address")} />
        <div className="flex items-center gap-2">
          <input type="checkbox" id="supplierIsActive" {...register("isActive")} className="rounded border-gray-300" />
          <label htmlFor="supplierIsActive" className="text-sm">Hoạt động</label>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={onClose}>Hủy</Button>
          <Button type="submit" isLoading={isSubmitting}>{initialData ? "Cập nhật" : "Thêm"}</Button>
        </div>
      </form>
    </Modal>
  );
}
