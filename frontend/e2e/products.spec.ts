import { test, expect } from "@playwright/test";

test.describe("Products Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "admin@example.com");
    await page.fill('input[type="password"]', "123456");
    await page.click('button[type="submit"]');
    await page.waitForURL("/dashboard");
  });

  test("shows products page with list", async ({ page }) => {
    await page.goto("/products");
    await expect(page.getByRole("heading", { name: /sản phẩm/i })).toBeVisible();
    await expect(page.getByText(/bàn phím/i).first()).toBeVisible();
  });

  test("filters products by search", async ({ page }) => {
    await page.goto("/products");
    const searchInput = page.getByPlaceholder(/tìm kiếm/i).first();
    await searchInput.fill("Chuột");
    await page.waitForTimeout(500);
    await expect(page.getByText(/chuột/i).first()).toBeVisible();
  });

  test("navigates to create product page", async ({ page }) => {
    await page.goto("/products");
    await page.getByRole("link", { name: /thêm/i }).first().click();
    await expect(page.getByRole("heading", { name: /thêm sản phẩm/i })).toBeVisible();
  });

  test("opens product detail page", async ({ page }) => {
    await page.goto("/products/1");
    await expect(page.getByRole("heading", { name: /chi tiết sản phẩm/i })).toBeVisible();
  });

  test("admin can see new product button", async ({ page }) => {
    await page.goto("/products");
    await expect(page.getByRole("link", { name: /thêm/i }).first()).toBeVisible();
  });
});
