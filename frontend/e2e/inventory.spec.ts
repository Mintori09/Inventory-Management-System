import { test, expect } from "@playwright/test";

test.describe("Inventory Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "admin@example.com");
    await page.fill('input[type="password"]', "123456");
    await page.click('button[type="submit"]');
    await page.waitForURL("/dashboard");
  });

  test("shows inventory overview", async ({ page }) => {
    await page.goto("/inventory");
    await expect(page.getByRole("heading", { name: /tồn kho/i })).toBeVisible();
  });

  test("shows stock overview table", async ({ page }) => {
    await page.goto("/inventory");
    await expect(page.getByText(/SKU|bàn phím|chuột/i).first()).toBeVisible();
  });

  test("navigates to import stock page", async ({ page }) => {
    await page.goto("/inventory");
    await page.getByRole("link", { name: /nhập kho/i }).first().click();
    await expect(page.getByRole("heading", { name: /nhập kho/i })).toBeVisible();
  });

  test("shows movement history page", async ({ page }) => {
    await page.goto("/inventory/movements");
    await expect(
      page.getByRole("heading", { name: /lịch sử giao dịch/i })
    ).toBeVisible();
  });
});
