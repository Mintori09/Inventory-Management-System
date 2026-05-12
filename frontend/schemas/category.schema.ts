import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên danh mục"),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
