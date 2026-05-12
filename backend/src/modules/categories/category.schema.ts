import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Tên danh mục không được để trống"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});
