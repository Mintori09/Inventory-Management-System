import { test, expect } from "@playwright/test";

test.describe("Admin Access Control", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "staff@example.com");
    await page.fill('input[type="password"]', "123456");
    await page.click('button[type="submit"]');
    await page.waitForURL("/dashboard");
  });

  test("staff cannot access admin users page", async ({ page }) => {
    await page.goto("/admin/users");
    await expect(page).toHaveURL("/403");
  });

  test("staff cannot access inventory adjust", async ({ page }) => {
    await page.goto("/inventory/adjust");
    await expect(page).toHaveURL("/403");
  });

  test("staff can access products page", async ({ page }) => {
    await page.goto("/products");
    await expect(page.getByRole("heading", { name: /sản phẩm/i })).toBeVisible();
  });
});
