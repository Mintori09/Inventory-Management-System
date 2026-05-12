import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3001",
    trace: "on-first-retry",
    headless: true,
  },
  webServer: {
    command: "PORT=3001 pnpm build && PORT=3001 pnpm start",
    port: 3001,
    timeout: 120000,
    reuseExistingServer: true,
  },
});
