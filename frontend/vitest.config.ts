import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  define: {
    "process.env.NEXT_PUBLIC_API_URL": JSON.stringify("http://localhost:4000/api"),
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./test-setup.ts"],
    globals: true,
    css: true,
    exclude: ["e2e/**", "node_modules/**"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
