import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "admin@example.com");
    await page.fill('input[type="password"]', "123456");
    await page.click('button[type="submit"]');
    await page.waitForURL("/dashboard");
  });

  test("admin sees all sidebar menu items", async ({ page }) => {
    await expect(page.getByRole("link", { name: /sản phẩm/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /danh mục/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /nhà cung cấp/i })).toBeVisible();
    await expect(page.getByRole("link", { name: "Tồn kho", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: /người dùng/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /nhật ký/i })).toBeVisible();
  });

  test("navigates to products page", async ({ page }) => {
    await page.getByText(/sản phẩm/i).first().click();
    await page.waitForURL("/products");
    await expect(page.getByRole("heading", { name: /sản phẩm/i })).toBeVisible();
  });

  test("navigates to inventory page", async ({ page }) => {
    await page.getByText(/tồn kho/i).first().click();
    await page.waitForURL("/inventory");
    await expect(page.getByRole("heading", { name: /tồn kho/i })).toBeVisible();
  });

  test("navigates to categories page", async ({ page }) => {
    await page.getByText(/danh mục/i).first().click();
    await page.waitForURL("/categories");
    await expect(page.getByRole("heading", { name: /danh mục/i })).toBeVisible();
  });

  test("navigates to suppliers page", async ({ page }) => {
    await page.getByText(/nhà cung cấp/i).first().click();
    await page.waitForURL("/suppliers");
    await expect(
      page.getByRole("heading", { name: /nhà cung cấp/i })
    ).toBeVisible();
  });

  test("navigates to users page (admin)", async ({ page }) => {
    await page.getByText(/người dùng/i).first().click();
    await page.waitForURL("/admin/users");
    await expect(
      page.getByRole("heading", { name: /người dùng/i })
    ).toBeVisible();
  });

  test("navigates to audit logs page (admin)", async ({ page }) => {
    await page.getByText(/nhật ký/i).first().click();
    await page.waitForURL("/admin/audit-logs");
    await expect(
      page.getByRole("heading", { name: /nhật ký/i })
    ).toBeVisible();
  });
});
