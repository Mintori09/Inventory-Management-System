import { z } from "zod";

export const createProductSchema = z.object({
  categoryId: z.number().int().positive("Danh mục không hợp lệ"),
  supplierId: z.number().int().positive().optional(),
  sku: z.string().min(1, "SKU không được để trống").max(80),
  name: z.string().min(1, "Tên sản phẩm không được để trống").max(200),
  description: z.string().optional(),
  unit: z.string().min(1).default("cái"),
  costPrice: z.number().int().min(0, "Giá nhập không được âm"),
  sellingPrice: z.number().int().min(0, "Giá bán không được âm"),
  currentStock: z.number().int().min(0).default(0),
  minStock: z.number().int().min(0).default(0),
  imageUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

export const updateProductSchema = z.object({
  categoryId: z.number().int().positive().optional(),
  supplierId: z.number().int().positive().optional(),
  sku: z.string().min(1).max(80).optional(),
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  unit: z.string().min(1).optional(),
  costPrice: z.number().int().min(0).optional(),
  sellingPrice: z.number().int().min(0).optional(),
  minStock: z.number().int().min(0).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().optional(),
});
