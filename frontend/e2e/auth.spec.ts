import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("shows login page", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /quản lý kho/i })).toBeVisible();
  });

  test("redirects unauthenticated user to login", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL(/\/login/);
  });

  test("logs in with valid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "admin@example.com");
    await page.fill('input[type="password"]', "123456");
    await page.click('button[type="submit"]');
    await page.waitForURL("/dashboard");
    await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible();
  });

  test("shows error with invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "admin@example.com");
    await page.fill('input[type="password"]', "wrongpass");
    await page.click('button[type="submit"]');
    await expect(page.getByText(/không đúng/i)).toBeVisible();
  });

  test("logs out successfully", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "admin@example.com");
    await page.fill('input[type="password"]', "123456");
    await page.click('button[type="submit"]');
    await page.waitForURL("/dashboard");

    await page.locator(".relative > button").first().click();
    await page.getByRole("button", { name: /đăng xuất|logout/i }).click();
    await page.waitForURL(/\/login/);
    await expect(page.getByRole("heading", { name: /quản lý kho/i })).toBeVisible();
  });
});
