"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema, updateUserSchema } from "@/schemas/user.schema";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { USER_ROLE_OPTIONS } from "@/lib/constants";
import type { User } from "@/types/user.type";

type UserFormProps = {
  initialData?: User;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
};

export function UserForm({ initialData, onSubmit, isSubmitting }: UserFormProps) {
  const isEdit = !!initialData;
  const schema = isEdit ? updateUserSchema : createUserSchema;

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData ? {
      fullName: initialData.fullName,
      email: initialData.email,
      password: "",
      role: initialData.role,
      isActive: initialData.isActive,
    } : {
      role: "staff",
      isActive: true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input label="Họ tên" error={errors.fullName?.message} {...register("fullName")} />
        <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
        <Input
          label="Mật khẩu"
          type="password"
          placeholder={isEdit ? "Để trống nếu không đổi" : ""}
          error={errors.password?.message}
          {...register("password")}
        />
        <Select
          label="Vai trò"
          options={[...USER_ROLE_OPTIONS]}
          {...register("role")}
        />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="userIsActive" {...register("isActive")} className="rounded border-gray-300" />
        <label htmlFor="userIsActive" className="text-sm">Hoạt động</label>
      </div>
      <div className="flex justify-end gap-3">
        <Button type="submit" isLoading={isSubmitting}>
          {isEdit ? "Cập nhật" : "Tạo người dùng"}
        </Button>
      </div>
    </form>
  );
}
