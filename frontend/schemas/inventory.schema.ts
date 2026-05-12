import { z } from "zod";

export const importStockSchema = z.object({
  productId: z.number({ message: "Vui lòng chọn sản phẩm" }).positive("Vui lòng chọn sản phẩm"),
  supplierId: z.number().positive("Vui lòng chọn nhà cung cấp").optional(),
  quantity: z.number({ message: "Số lượng không hợp lệ" }).positive("Số lượng nhập phải lớn hơn 0"),
  importPrice: z.number({ message: "Giá nhập không hợp lệ" }).min(0, "Giá nhập không hợp lệ"),
  note: z.string().optional(),
});

export const exportStockSchema = z.object({
  productId: z.number({ message: "Vui lòng chọn sản phẩm" }).positive("Vui lòng chọn sản phẩm"),
  quantity: z.number({ message: "Số lượng không hợp lệ" }).positive("Số lượng xuất phải lớn hơn 0"),
  exportPrice: z.number({ message: "Giá xuất không hợp lệ" }).min(0, "Giá xuất không hợp lệ"),
  note: z.string().optional(),
});

export const adjustStockSchema = z.object({
  productId: z.number({ message: "Vui lòng chọn sản phẩm" }).positive("Vui lòng chọn sản phẩm"),
  adjustmentType: z.enum(["increase", "decrease"]),
  quantity: z.number({ message: "Số lượng không hợp lệ" }).positive("Số lượng phải lớn hơn 0"),
  note: z.string().min(1, "Vui lòng nhập ghi chú cho việc điều chỉnh"),
});

export type ImportStockFormValues = z.infer<typeof importStockSchema>;
export type ExportStockFormValues = z.infer<typeof exportStockSchema>;
export type AdjustStockFormValues = z.infer<typeof adjustStockSchema>;
