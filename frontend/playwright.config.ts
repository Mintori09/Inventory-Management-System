import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    headless: true,
  },
  webServer: {
    command: "pnpm build && pnpm start",
    port: 3000,
    timeout: 120000,
    reuseExistingServer: true,
  },
});
