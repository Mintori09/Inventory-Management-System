import { z } from "zod";

export const createUserSchema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập họ tên"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
  role: z.enum(["admin", "staff"]),
  isActive: z.boolean(),
});

export const updateUserSchema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập họ tên"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự").optional().or(z.literal("")),
  role: z.enum(["admin", "staff"]),
  isActive: z.boolean(),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
