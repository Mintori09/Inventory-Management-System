import { z } from "zod";

export const importStockSchema = z.object({
  productId: z.number().int().positive("Sản phẩm không hợp lệ"),
  supplierId: z.number().int().positive().optional(),
  quantity: z.number().int().positive("Số lượng phải lớn hơn 0"),
  importPrice: z.number().int().min(0, "Giá nhập không được âm"),
  note: z.string().optional(),
});

export const exportStockSchema = z.object({
  productId: z.number().int().positive("Sản phẩm không hợp lệ"),
  quantity: z.number().int().positive("Số lượng phải lớn hơn 0"),
  exportPrice: z.number().int().min(0, "Giá xuất không được âm"),
  note: z.string().optional(),
});

export const adjustStockSchema = z.object({
  productId: z.number().int().positive("Sản phẩm không hợp lệ"),
  adjustmentType: z.enum(["increase", "decrease"], {
    errorMap: () => ({ message: "Loại điều chỉnh phải là increase hoặc decrease" }),
  }),
  quantity: z.number().int().positive("Số lượng phải lớn hơn 0"),
  note: z.string().min(1, "Ghi chú không được để trống"),
});
