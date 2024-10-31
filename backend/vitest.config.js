import { defineConfig } from "vite";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
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
});
