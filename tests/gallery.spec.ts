import { readdirSync } from "node:fs"
import { expect, test } from "@playwright/test"

const names = readdirSync("components/examples")
  .filter((f) => f.endsWith("-example.tsx"))
  .map((f) => f.replace(/-example\.tsx$/, ""))

for (const name of names) {
  for (const theme of ["light", "dark"] as const) {
    test(`${name} (${theme})`, async ({ page }) => {
      const errors: string[] = []
      page.on("pageerror", (e) => errors.push(e.message))
      page.on("console", (m) => m.type() === "error" && !/Download the React DevTools|favicon/.test(m.text()) && errors.push(m.text()))
      await page.addInitScript((t) => localStorage.setItem("theme", t), theme)
      await page.goto(`/components/${name}`)
      await page.waitForLoadState("networkidle")
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(300)
      expect(errors, errors.join("\n")).toEqual([])
      await expect(page).toHaveScreenshot(`${name}-${theme}.png`, { fullPage: true })
    })
  }
}
