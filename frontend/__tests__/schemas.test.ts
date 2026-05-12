import { describe, it, expect } from "vitest";
import { loginSchema } from "@/schemas/auth.schema";
import { productSchema } from "@/schemas/product.schema";
import { categorySchema } from "@/schemas/category.schema";
import { supplierSchema } from "@/schemas/supplier.schema";
import { importStockSchema, exportStockSchema, adjustStockSchema } from "@/schemas/inventory.schema";
import { createUserSchema } from "@/schemas/user.schema";

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    const result = loginSchema.safeParse({ email: "admin@example.com", password: "123456" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({ email: "not-an-email", password: "123456" });
    expect(result.success).toBe(false);
  });

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({ email: "admin@example.com", password: "" });
    expect(result.success).toBe(false);
  });

  it("rejects missing fields", () => {
    const result = loginSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("productSchema", () => {
  const valid = {
    sku: "SP001",
    name: "Test Product",
    unit: "cái",
    costPrice: 10000,
    sellingPrice: 15000,
    minStock: 5,
    categoryId: 1,
    isActive: true,
  };

  it("accepts valid product", () => {
    const result = productSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects negative price", () => {
    const result = productSchema.safeParse({ ...valid, costPrice: -1 });
    expect(result.success).toBe(false);
  });

  it("accepts optional fields omitted", () => {
    const result = productSchema.safeParse({ ...valid, description: undefined, supplierId: undefined });
    expect(result.success).toBe(true);
  });
});

describe("categorySchema", () => {
  it("accepts valid category", () => {
    const result = categorySchema.safeParse({ name: "Điện thoại" });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = categorySchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });
});

describe("supplierSchema", () => {
  it("accepts valid supplier", () => {
    const result = supplierSchema.safeParse({ name: "Nhà cung cấp ABC" });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = supplierSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });
});

describe("importStockSchema", () => {
  it("accepts valid import", () => {
    const result = importStockSchema.safeParse({ productId: 1, quantity: 10, importPrice: 50000 });
    expect(result.success).toBe(true);
  });

  it("rejects zero quantity", () => {
    const result = importStockSchema.safeParse({ productId: 1, quantity: 0, importPrice: 50000 });
    expect(result.success).toBe(false);
  });

  it("rejects negative price", () => {
    const result = importStockSchema.safeParse({ productId: 1, quantity: 10, importPrice: -1 });
    expect(result.success).toBe(false);
  });
});

describe("exportStockSchema", () => {
  it("accepts valid export", () => {
    const result = exportStockSchema.safeParse({ productId: 1, quantity: 5, exportPrice: 60000 });
    expect(result.success).toBe(true);
  });

  it("rejects zero quantity", () => {
    const result = exportStockSchema.safeParse({ productId: 1, quantity: 0, exportPrice: 60000 });
    expect(result.success).toBe(false);
  });
});

describe("adjustStockSchema", () => {
  it("accepts valid increase", () => {
    const result = adjustStockSchema.safeParse({ productId: 1, adjustmentType: "increase", quantity: 5, note: "Bổ sung hàng" });
    expect(result.success).toBe(true);
  });

  it("accepts valid decrease", () => {
    const result = adjustStockSchema.safeParse({ productId: 1, adjustmentType: "decrease", quantity: 3, note: "Hàng hỏng" });
    expect(result.success).toBe(true);
  });

  it("rejects empty note", () => {
    const result = adjustStockSchema.safeParse({ productId: 1, adjustmentType: "increase", quantity: 5, note: "" });
    expect(result.success).toBe(false);
  });
});

describe("createUserSchema", () => {
  const valid = { fullName: "Nguyễn Văn A", email: "a@example.com", password: "123456", role: "staff" as const, isActive: true };

  it("accepts valid user", () => {
    const result = createUserSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = createUserSchema.safeParse({ ...valid, email: "bad" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid role", () => {
    const result = createUserSchema.safeParse({ ...valid, role: "superadmin" });
    expect(result.success).toBe(false);
  });
});
