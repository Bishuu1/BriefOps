import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/tests/setup.ts"]
  },
  resolve: {
    alias: {
      "@features": "/src/features",
      "@shared": "/src/shared",
      "@infrastructure": "/src/infrastructure"
    }
  }
});
