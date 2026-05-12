import { describe, it, expect } from "vitest";
import { formatCurrency, formatDateTime, getStockStatusLabel } from "@/lib/format";
import { cn } from "@/lib/utils";
import { canAccessRoute, can } from "@/lib/permissions";

describe("formatCurrency", () => {
  it("formats Vietnamese dong", () => {
    const val = formatCurrency(25000000);
    expect(val).toContain("25");
    expect(val).toContain("000");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toContain("0");
  });
});

describe("formatDateTime", () => {
  it("formats ISO date string", () => {
    const result = formatDateTime("2025-03-10T08:00:00Z");
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });
});

describe("getStockStatusLabel", () => {
  it("returns correct Vietnamese labels", () => {
    expect(getStockStatusLabel("in_stock")).toBe("Còn hàng");
    expect(getStockStatusLabel("low_stock")).toBe("Sắp hết");
    expect(getStockStatusLabel("out_of_stock")).toBe("Hết hàng");
  });
});

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });
});

describe("canAccessRoute", () => {
  it("allows admin all routes", () => {
    expect(canAccessRoute("/admin/users", "admin")).toBe(true);
    expect(canAccessRoute("/inventory/adjust", "admin")).toBe(true);
  });

  it("denies staff admin routes", () => {
    expect(canAccessRoute("/admin/users", "staff")).toBe(false);
    expect(canAccessRoute("/inventory/adjust", "staff")).toBe(false);
  });

  it("allows staff basic routes", () => {
    expect(canAccessRoute("/dashboard", "staff")).toBe(true);
    expect(canAccessRoute("/inventory", "staff")).toBe(true);
    expect(canAccessRoute("/products", "staff")).toBe(true);
  });
});

describe("can", () => {
  it("allows admin all actions", () => {
    expect(can("create", "users", "admin")).toBe(true);
    expect(can("delete", "products", "admin")).toBe(true);
  });

  it("allows staff view only", () => {
    expect(can("view", "products", "staff")).toBe(true);
    expect(can("create", "products", "staff")).toBe(false);
    expect(can("delete", "products", "staff")).toBe(false);
  });
});
