import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "admin@example.com");
    await page.fill('input[type="password"]', "123456");
    await page.click('button[type="submit"]');
    await page.waitForURL("/dashboard");
  });

  test("shows dashboard with summary cards", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible();
    await expect(page.getByText(/sản phẩm|tồn kho|giá trị/i).first()).toBeVisible();
  });

  test("shows recent movements section", async ({ page }) => {
    await expect(page.getByText(/giao dịch|movement|nhập|xuất|điều chỉnh/i).first()).toBeVisible();
  });
});
