import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/main.test.js",
    reporters: [
      "default",
      [
        "json",
        {
          outputFile: "./tests/results/all-tests-results.json",
        },
      ],
      "./tests/utils/multiTestReporter.js",
    ],
    include: ["tests/**/*.{test,spec}.{js,jsx}"],
    exclude: ["node_modules", "dist"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "/src"),
    },
  },
  // server: {
  //   proxy: {
  //     "/auth": "http://localhost:3000", // Proxy for auth routes
  //   },
  // },
});
