import { z } from "zod";

export const productSchema = z.object({
  sku: z.string().min(1, "Vui lòng nhập SKU"),
  name: z.string().min(1, "Vui lòng nhập tên sản phẩm"),
  categoryId: z.number({ message: "Vui lòng chọn danh mục" }).positive("Vui lòng chọn danh mục"),
  supplierId: z.number().optional(),
  unit: z.string().min(1, "Vui lòng nhập đơn vị tính"),
  description: z.string().optional(),
  costPrice: z.number({ message: "Giá nhập không hợp lệ" }).min(0, "Giá nhập không hợp lệ"),
  sellingPrice: z.number({ message: "Giá bán không hợp lệ" }).min(0, "Giá bán không hợp lệ"),
  currentStock: z.number().min(0, "Tồn kho không hợp lệ").optional(),
  minStock: z.number({ message: "Tồn tối thiểu không hợp lệ" }).min(0, "Tồn tối thiểu không hợp lệ"),
  imageUrl: z.string().optional(),
  isActive: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
