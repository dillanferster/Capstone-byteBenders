import { defineConfig } from "vite";

export default defineConfig({
  test: {
    // testTimeout: 10000, // Added global 10 second timeout
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
    coverage: {
      provider: "v8", // or 'istanbul'
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "test/"],
    },
  },
});
