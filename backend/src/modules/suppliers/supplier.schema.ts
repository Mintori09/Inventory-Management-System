import { z } from "zod";

export const createSupplierSchema = z.object({
  name: z.string().min(1, "Tên nhà cung cấp không được để trống"),
  phone: z.string().optional(),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  address: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const updateSupplierSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  isActive: z.boolean().optional(),
});
