import { defineConfig, devices } from "@playwright/test"

/** Gallery checks: every component page renders without console errors and matches its screenshot. */
export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  workers: 2, // more workers starve the single dev server and make screenshots flaky
  reporter: [["list"]],
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.002, animations: "disabled", stylePath: "tests/screenshot.css" } },
  use: { baseURL: "http://localhost:3100", ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" },
  webServer: { command: "npm run dev -- -p 3100", url: "http://localhost:3100", reuseExistingServer: true, timeout: 180_000 },
})
