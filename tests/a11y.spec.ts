import { readdirSync } from "node:fs"
import { expect, test, type Locator, type Page } from "@playwright/test"

/*
 * Accessibility checks that need a real browser: focus indicators (pixel-sampled), 44px touch areas on a coarse
 * pointer, 16px field text, forced colours, reduced motion, translated label props, FormControl, reflow at 320px
 * and a keyboard walk through the overlays. Fixture pages live under app/fixtures/.
 */

const CONTROLS = "/fixtures/controls"

/* ----------------------------------- Pixels ----------------------------------- */

type RGB = [number, number, number]
type Shot = { width: number; height: number; at: (x: number, y: number) => RGB }

/** Screenshot a page region and decode it in the browser, so no image library is needed. */
async function shoot(page: Page, clip: { x: number; y: number; width: number; height: number }): Promise<Shot> {
  const png = await page.screenshot({ clip, animations: "disabled", caret: "hide", style: "nextjs-portal { display: none !important; }" })
  const { width, data } = await page.evaluate(async (b64) => {
    const img = new Image()
    img.src = `data:image/png;base64,${b64}`
    await img.decode()
    const c = document.createElement("canvas")
    c.width = img.width
    c.height = img.height
    const ctx = c.getContext("2d")!
    ctx.drawImage(img, 0, 0)
    return { width: img.width, height: img.height, data: Array.from(ctx.getImageData(0, 0, img.width, img.height).data) }
  }, png.toString("base64"))
  const scale = width / clip.width
  return {
    width: clip.width,
    height: clip.height,
    at: (x, y) => {
      const i = (Math.round(y * scale) * width + Math.round(x * scale)) * 4
      return [data[i], data[i + 1], data[i + 2]]
    },
  }
}

const lum = ([r, g, b]: RGB) => {
  const f = (c: number) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}
const contrast = (a: RGB, b: RGB) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m)
  return (x + 0.05) / (y + 0.05)
}
const near = (a: RGB, b: RGB, tol = 28) => a.every((v, i) => Math.abs(v - b[i]) <= tol)
const differs = (a: RGB, b: RGB) => a.some((v, i) => Math.abs(v - b[i]) > 40)
const parseRGB = (css: string): RGB => css.match(/[\d.]+/g)!.slice(0, 3).map(Number) as RGB

/* ------------------------------- Focus indicators ------------------------------- */

/** The element that carries the visible indicator for whatever has focus (some controls focus a hidden input). */
async function indicatorFor(page: Page) {
  return page.evaluate(() => {
    const a = document.activeElement as HTMLElement | null
    if (!a || a === document.body) return null
    const target =
      a.closest<HTMLElement>("[data-slot=slider-thumb]") ??
      (a.matches("[data-input-otp]") ? document.querySelector<HTMLElement>("[data-slot=input-otp-slot][data-active=true]") : null) ??
      (a.matches("input,textarea") ? a.closest<HTMLElement>("[data-slot=input-group]") : null) ??
      // The calendar's month/year <select> is invisible over its label; the ring is drawn on the dropdown root.
      (a.matches("select") && a.closest("[data-slot=calendar]") ? a.parentElement : null) ??
      a.closest<HTMLElement>("[data-slot=combobox-chips]") ??
      (a.matches("[data-slot=code-block-content]") ? a.closest<HTMLElement>("[data-slot=code-block]") : null) ??
      (a.matches("input[type=radio],input[type=checkbox]") ? a.closest<HTMLElement>("[data-slot=questionnaire-choice]") : null) ??
      a
    const r = target.getBoundingClientRect()
    const s = getComputedStyle(target)
    return {
      // Demo copy passed into a component (a plain, unstyled <a> in a banner action or a logo) is not the kit's.
      // Known limitation: the attachment strip fades its scrolling edges with a mask, which also fades a ring there.
      inFadeStrip: !!target.closest("[data-slot=attachment-group]"),
      // Anything rendered by a kit component, or inside one (a link in an Alert or an accordion panel), is the kit's.
      // Bare demo copy written straight into the gallery's example cards is not.
      kit: !!a.closest("[data-slot]:not([data-slot^=example])") || (!location.pathname.startsWith("/components/") && a.hasAttribute("class")),
      name: `${a.tagName.toLowerCase()}${a.dataset.slot ? `[${a.dataset.slot}]` : ""} "${(a.getAttribute("aria-label") ?? a.textContent ?? "").trim().slice(0, 30)}"`,
      rect: { x: r.x, y: r.y, width: r.width, height: r.height },
      outline: { style: s.outlineStyle, width: parseFloat(s.outlineWidth), offset: parseFloat(s.outlineOffset), color: s.outlineColor },
      brandNeighbour: !!target.closest("[data-slot=slider], [data-slot=calendar]"),
      // A 1px resize handle: the ring encloses a hairline, so its two long sides merge into one band.
      hairline: target.matches("[data-slot=resizable-handle]"),
      // A tooltip opens on focus and its arrow sits over the trigger's top edge.
      tooltip: target.matches("[data-slot=tooltip-trigger]"),
      visible: r.width > 0 && r.height > 0 && r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth,
    }
  })
}

/**
 * Sample the pixels across each side's midpoint, from 7px outside the element to 5px inside, and look for two
 * consecutive pixels in the outline colour. All four sides must have it (so nothing clips it), and the colour must
 * reach 3:1 against the pixel just beyond it (the surface it sits on).
 */
async function checkRing(page: Page) {
  const f = await indicatorFor(page)
  if (!f || !f.visible) return null
  const { x, y, width: w, height: h } = f.rect
  const pad = 9
  // Whole-pixel clip, so the screenshot's pixel grid lines up with the page's.
  const cx = Math.max(0, Math.floor(x - pad))
  const cy = Math.max(0, Math.floor(y - pad))
  const clip = { x: cx, y: cy, width: Math.ceil(x + w + pad) - cx, height: Math.ceil(y + h + pad) - cy }
  const vw = page.viewportSize()!
  if (clip.x + clip.width > vw.width || clip.y + clip.height > vw.height) return null
  const shot = await shoot(page, clip)
  const rgba = f.outline.color.match(/[\d.]+/g)!.map(Number)
  const alpha = rgba[3] ?? 1
  // A translucent colour (only the UA's forced-colours Highlight is) is compared as painted over the surface.
  const painted = (surface: RGB): RGB => rgba.slice(0, 3).map((c, i) => c * alpha + surface[i] * (1 - alpha)) as RGB
  const ox = x - clip.x
  const oy = y - clip.y
  const sides = {
    top: (d: number) => [ox + w / 2, oy - d] as const,
    bottom: (d: number) => [ox + w / 2, oy + h - 1 + d] as const,
    left: (d: number) => [ox - d, oy + h / 2] as const,
    right: (d: number) => [ox + w - 1 + d, oy + h / 2] as const,
  }
  const result: Record<string, { found: boolean; ratio: number }> = {}
  for (const [side, at] of Object.entries(sides)) {
    let found = false
    let ratio = 0
    const ring = painted(shot.at(...at(9)))
    // An outside ring (offset >= 0) must be found outside the box, an inside one inside it, so a brand-filled
    // control whose own fill equals --ring can't pass on its fill alone.
    const outside = f.outline.offset >= 0
    for (let d = 7; d >= -5; d--) {
      if (outside ? d < 1 : d > 0) continue
      const p = shot.at(...at(d))
      const q = shot.at(...at(d - 1))
      // Two ring-coloured pixels in a row, or one exact one (a 2px ring on a fractional position anti-aliases
      // into one solid pixel and one blended one).
      if ((near(p, ring) && near(q, ring, 60)) || near(p, ring, 12)) {
        found = true
        // The surface the ring sits on: the first pixel outside the ring run (outside the control for an outside
        // ring, the list or panel behind it for an inside one).
        // Skip the soft halo some controls keep around the ring (up to 4px) and read the surface itself.
        // The surface just past the ring: the best of the next five pixels, which skips a soft halo without
        // reaching a neighbouring control.
        const outside = Math.max(...[1, 2, 3, 4, 5].map((k) => contrast(ring, shot.at(...at(d + k)))))
        // An inside ring (drawn within the control) is adjacent to the control's own fill as well.
        ratio = d <= 0 ? Math.max(outside, contrast(ring, shot.at(...at(d - 3)))) : outside
        break
      }
    }
    result[side] = { found, ratio }
  }
  return { ...f, alpha, sides: result }
}

/** Wait until the focused control's outline has finished its colour transition (opaque), up to a second. */
async function settle(page: Page) {
  await page
    .waitForFunction(() => {
      const a = document.activeElement
      if (!a || a === document.body) return true
      const t = a.closest("[data-slot=slider-thumb]") ?? a
      const c = getComputedStyle(t).outlineColor.match(/[\d.]+/g)
      return !c || c.length < 4 || Number(c[3]) === 1 || getComputedStyle(t).outlineStyle === "none"
    }, null, { timeout: 1000 })
    .catch(() => {})
  await page.waitForTimeout(60)
}

async function walk(page: Page, max = 400) {
  const problems: string[] = []
  let checked = 0
  const seen = new Set<string>()
  for (let i = 0; i < max; i++) {
    await page.keyboard.press("Tab")
    await page.waitForTimeout(160) // let `transition` (150ms) start and settle before sampling
    await settle(page)
    const r = await checkRing(page)
    if (!r || !r.kit || r.inFadeStrip) continue
    const key = `${r.name}@${Math.round(r.rect.x)},${Math.round(r.rect.y)}`
    if (seen.has(key)) break
    seen.add(key)
    checked++
    if (r.alpha < 1) problems.push(`${r.name}: outline colour is not opaque (${r.outline.color})`)
    if (r.outline.style === "none" || r.outline.width < 2) problems.push(`${r.name}: no 2px outline (${r.outline.style} ${r.outline.width}px)`)
    const missing = Object.entries(r.sides)
      .filter(([k, s]) => !s.found && !(r.tooltip && k === "top"))
      .map(([k]) => k)
    const hairlineOk = r.hairline && (["top", "bottom"].every((k) => !missing.includes(k)) || ["left", "right"].every((k) => !missing.includes(k)))
    if (missing.length && !hairlineOk) problems.push(`${r.name}: outline not visible on ${missing.join(", ")}`)
    // A ring next to a brand-filled neighbour (the slider's range, a selected day) cannot contrast with the brand on
    // that one side; three sides at 3:1 are required, all four when nothing brand-coloured is adjacent.
    const weak = Object.entries(r.sides).filter(([, s]) => s.found && s.ratio < 3)
    if (weak.length > 1 || (weak.length === 1 && !r.brandNeighbour)) problems.push(`${r.name}: outline contrast ${weak.map(([k, s]) => `${k} ${s.ratio.toFixed(2)}`).join(", ")}`)
  }
  return { checked, problems }
}

const walkPages = [
  CONTROLS,
  ...["button", "checkbox", "radio-group", "switch", "toggle", "toggle-group", "tabs", "select", "slider", "accordion", "breadcrumb", "input", "textarea", "native-select", "combobox", "input-otp", "pagination", "code-block", "badge", "field", "form", "item", "navigation-menu", "menubar", "resizable", "label", "calendar", "input-group", "questionnaire", "attachment", "bubble", "trace"].map((n) => `/components/${n}`),
  ...["banner", "dashboard-shell", "settings-sidebar", "faq-section", "filter-bar", "data-table-card", "account-menu", "site-header", "site-footer", "pricing-plans", "integration-cards", "auth-sign-in"].map((n) => `/blocks/${n}`),
]

test.describe("focus indicator", () => {
  for (const theme of ["light", "dark"] as const) {
    for (const path of walkPages) {
      test(`opaque 2px ring, visible on four sides, 3:1: ${path} (${theme})`, async ({ page }) => {
        test.setTimeout(240_000)
        await page.addInitScript((t) => localStorage.setItem("theme", t), theme)
        await page.goto(path)
        await page.waitForLoadState("networkidle")
        const { checked, problems } = await walk(page)
        expect(checked, "no focusable control was reached").toBeGreaterThan(0)
        expect(problems, problems.join("\n")).toEqual([])
      })
    }
  }
})

/* --------------------------------- Touch areas --------------------------------- */

test.describe("touch", () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 900, height: 1200 } })

  const controls = ["checkbox", "radio", "switch", "toggle", "toggle-group-item", "segmented-item", "tabs-trigger", "underline-tabs-trigger", "select-trigger", "slider", "breadcrumb-link", "icon-button", "accordion-trigger"]

  test("every control has its touch area on a coarse pointer, at its visual size", async ({ page }) => {
    await page.goto(CONTROLS)
    await page.waitForLoadState("networkidle")
    const problems = await page.evaluate((ids) => {
      const out: string[] = []
      for (const id of ids) {
        let el = document.querySelector<HTMLElement>(`[data-testid="${id}"]`)!
        if (id === "slider") el = el.querySelector<HTMLElement>("[data-slot=slider-thumb]")!
        const r = el.getBoundingClientRect()
        const cx = r.x + r.width / 2
        const cy = r.y + r.height / 2
        // Corners of the 44px box (or of the control, if larger), 2px inside so rounding never lands outside it.
        // 44 by 44px; stacked choice controls 44 wide by 36 tall (so rows at the kit's default 27px pitch don't
        // overlap); items in a row (toggle-group, segmented, tabs) 44 tall on the cross axis only.
        const stacked = ["checkbox", "radio", "switch"].includes(id)
        const row = ["toggle-group-item", "segmented-item", "tabs-trigger", "underline-tabs-trigger"].includes(id)
        const half = row ? r.width / 2 - 2 : Math.max(22, r.width / 2) - 2
        const halfY = Math.max(stacked ? 18 : 22, r.height / 2) - 2
        for (const [dx, dy] of [[-half, -halfY], [half, -halfY], [-half, halfY], [half, halfY], [0, -halfY], [0, halfY], [-half, 0], [half, 0]]) {
          const hit = document.elementFromPoint(cx + dx, cy + dy)
          if (!hit || !(hit === el || el.contains(hit))) out.push(`${id}: (${Math.round(dx)},${Math.round(dy)}) from the centre hits ${hit?.tagName.toLowerCase()}[${(hit as HTMLElement)?.dataset?.slot ?? ""}]`)
        }
      }
      return out
    }, controls)
    expect(problems, problems.join("\n")).toEqual([])
  })

  test("a tap at the edge of the 44px area activates the control", async ({ page }) => {
    await page.goto(CONTROLS)
    await page.waitForLoadState("networkidle")
    const edgeTap = async (locator: Locator, reach = 21) => {
      const r = (await locator.boundingBox())!
      await page.touchscreen.tap(r.x + r.width / 2, r.y + r.height / 2 - reach)
      await page.waitForTimeout(120)
    }
    await edgeTap(page.getByTestId("checkbox"), 17)
    await expect(page.getByTestId("checkbox")).toHaveAttribute("aria-checked", "true")
    await edgeTap(page.getByTestId("switch"), 17)
    await expect(page.getByTestId("switch")).toHaveAttribute("aria-checked", "true")
    await edgeTap(page.getByTestId("radio"), 17)
    await expect(page.getByTestId("radio")).toHaveAttribute("aria-checked", "true")
    await edgeTap(page.getByTestId("toggle"))
    await expect(page.getByTestId("toggle")).toHaveAttribute("aria-pressed", "true")
    await edgeTap(page.getByTestId("toggle-group-item"))
    await expect(page.getByTestId("toggle-group-item")).toHaveAttribute("aria-pressed", "true")
    await edgeTap(page.getByTestId("segmented-item"))
    await expect(page.getByTestId("segmented-item")).toHaveAttribute("aria-pressed", "true")
    await edgeTap(page.getByTestId("tabs-trigger"))
    await expect(page.getByTestId("tabs-trigger")).toHaveAttribute("aria-selected", "true")
    await edgeTap(page.getByTestId("underline-tabs-trigger"))
    await expect(page.getByTestId("underline-tabs-trigger")).toHaveAttribute("aria-selected", "true")
    await edgeTap(page.getByTestId("accordion-trigger"))
    await expect(page.getByTestId("accordion-trigger")).toHaveAttribute("aria-expanded", "true")
    await edgeTap(page.getByTestId("icon-button"))
    await expect(page.getByTestId("clicks")).toHaveText("1")
    await edgeTap(page.getByTestId("breadcrumb-link"))
    await expect(page).toHaveURL(/#crumb$/)
    await edgeTap(page.getByRole("button", { name: "Dismiss" }))
    await expect(page.getByTestId("banner-gone")).toBeVisible()
    await edgeTap(page.getByTestId("select-trigger"))
    await expect(page.locator("[data-slot=select-content]")).toBeVisible()
  })

  test("editable text is at least 16px on a coarse pointer, at any width", async ({ page }) => {
    for (const viewport of [{ width: 390, height: 844 }, { width: 844, height: 390 }, { width: 1280, height: 800 }]) {
      await page.setViewportSize(viewport)
      await page.goto(CONTROLS)
      await page.waitForLoadState("networkidle")
      const small = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>("[data-section=fields] input, [data-section=fields] textarea, [data-section=fields] select")]
          .map((el) => ({ el: `${el.tagName.toLowerCase()}[${el.dataset.slot ?? el.getAttribute("aria-label") ?? ""}]`, size: parseFloat(getComputedStyle(el).fontSize) }))
          .filter((x) => x.size < 16)
      )
      expect(small, `${viewport.width}x${viewport.height}: ${JSON.stringify(small)}`).toEqual([])
    }
  })
})

/*
 * Neighbours: an enlarged touch area must never cover another control's own visible box. A 5 by 3 grid of points
 * inside every control on every gallery page, on a coarse pointer, must hit that control, not a neighbour's
 * hit-area pseudo-element. (The Button's own 44px area predates these checks; overlaps between packed Buttons,
 * such as pagination, are listed in the changelog rather than tested here.)
 */
const galleryPages = [
  ...readdirSync("components/examples").filter((f) => f.endsWith("-example.tsx")).map((f) => `/components/${f.replace(/-example\.tsx$/, "")}`),
  ...readdirSync("components/examples/blocks").filter((f) => f.endsWith("-example.tsx")).map((f) => `/blocks/${f.replace(/-example\.tsx$/, "")}`),
]
test.describe("touch areas don't take taps from neighbours", () => {
  test.use({ hasTouch: true, isMobile: true })
  for (const width of [390, 900]) {
    test(`every gallery page at ${width}px`, async ({ page }) => {
      test.setTimeout(600_000)
      await page.setViewportSize({ width, height: 900 })
      const problems: string[] = []
      for (const path of galleryPages) {
        await page.goto(path)
        await page.waitForLoadState("load")
        await page.waitForTimeout(150)
        const found = await page.evaluate(() => {
          const CONTROL = "button, a[href], input:not([type=hidden]), select, textarea, [role=tab], [role=radio], [role=checkbox], [role=switch], [role=slider], [tabindex]:not([tabindex='-1'])"
          const AREA = "[data-slot=checkbox], [data-slot=radio-group-item], [data-slot=switch], [data-slot=toggle], [data-slot=toggle-group-item], [data-slot=segmented-control-item], [data-slot=tabs-trigger], [data-slot=select-trigger], [data-slot=slider-thumb], [data-slot=accordion-trigger], [data-slot=breadcrumb] a, [data-slot=banner] button, [data-slot=input-group] button, [data-slot=combobox-chip] button"
          const name = (e: Element) => `${e.tagName.toLowerCase()}${(e as HTMLElement).dataset?.slot ? `[${(e as HTMLElement).dataset.slot}]` : ""} "${(e.getAttribute("aria-label") ?? e.textContent ?? "").trim().slice(0, 24)}"`
          const out: string[] = []
          for (const el of document.querySelectorAll(CONTROL)) {
            const s = getComputedStyle(el)
            if (s.visibility === "hidden" || s.pointerEvents === "none" || el.closest("[inert], [aria-hidden=true]")) continue
            el.scrollIntoView({ block: "center", inline: "nearest" })
            const r = el.getBoundingClientRect()
            if (r.width < 4 || r.height < 4 || r.top < 0 || r.bottom > innerHeight || r.left < 0 || r.right > innerWidth) continue
            for (const fx of [0.1, 0.3, 0.5, 0.7, 0.9]) for (const fy of [0.15, 0.5, 0.85]) {
              const x = r.left + r.width * fx, y = r.top + r.height * fy
              const thief = document.elementFromPoint(x, y)?.closest(CONTROL)
              if (!thief || thief === el || el.contains(thief) || thief.contains(el) || !thief.matches(AREA)) continue
              const t = thief.getBoundingClientRect()
              if (x >= t.left && x <= t.right && y >= t.top && y <= t.bottom) continue // the thief's own box: a real overlap, not its hit area
              out.push(`${name(el)} is covered by the touch area of ${name(thief)}`)
            }
          }
          return [...new Set(out)]
        })
        for (const f of found) problems.push(`${path}: ${f}`)
      }
      expect(problems, problems.join("\n")).toEqual([])
    })
  }
})

test.describe("a consumer's position utility wins", () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 900, height: 1200 } })
  test("className=\"absolute\" stays absolute on a coarse pointer", async ({ page }) => {
    await page.goto(CONTROLS)
    await page.waitForLoadState("networkidle")
    for (const id of ["pos-toggle", "pos-toggle-group-item", "pos-select-trigger", "pos-breadcrumb-link"]) {
      await expect(page.getByTestId(id), id).toHaveCSS("position", "absolute")
    }
  })

  test("md:absolute, [position:absolute], inline style and a parent rule win on a coarse tablet (900px)", async ({ page }) => {
    await page.goto(CONTROLS)
    await page.waitForLoadState("networkidle")
    for (const id of ["pos-md-toggle", "pos-md-select-trigger", "pos-arbitrary-toggle", "pos-arbitrary-breadcrumb-link", "pos-inline-toggle", "pos-parent-toggle"]) {
      await expect(page.getByTestId(id), id).toHaveCSS("position", "absolute")
    }
    // With no position of its own the control is still the anchor of its touch area.
    await expect(page.getByTestId("pos-none-toggle")).toHaveCSS("position", "relative")
  })

  // In a consumer's build every utility sits in @layer utilities and their order decides ties. A rule of equal
  // standing placed before and after the kit's stylesheet must win either way.
  for (const where of ["before", "after"] as const) {
    test(`a consumer utility in @layer utilities wins when its CSS comes ${where} the kit's`, async ({ page }) => {
      await page.goto(CONTROLS)
      await page.waitForLoadState("networkidle")
      await page.evaluate((where) => {
        const style = document.createElement("style")
        style.textContent = "@layer utilities { .layered-absolute { position: absolute } }"
        if (where === "before") document.head.prepend(style)
        else document.head.append(style)
      }, where)
      await expect(page.getByTestId("pos-layered-toggle")).toHaveCSS("position", "absolute")
    })
  }
})

test.describe("position with a mouse", () => {
  test("controls without a position class stay static, as in v0.3.0", async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 1200 })
    await page.goto(CONTROLS)
    await page.waitForLoadState("networkidle")
    await expect(page.getByTestId("pos-none-toggle")).toHaveCSS("position", "static")
  })
})

test("on a fine pointer, field text keeps its desktop size (14px from the sm breakpoint)", async ({ page }) => {
  await page.goto(CONTROLS)
  await page.waitForLoadState("networkidle")
  const size = await page.getByRole("textbox", { name: "Name" }).evaluate((el) => getComputedStyle(el).fontSize)
  expect(size).toBe("14px")
})

/* -------------------------------- Forced colours -------------------------------- */

test.describe("forced colours", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ forcedColors: "active" })
    await page.goto(CONTROLS)
    await page.waitForLoadState("networkidle")
  })

  test("controls and their states stay visible", async ({ page }) => {
    const section = page.locator("[data-section=forced]")
    await section.scrollIntoViewIfNeeded()
    const box = (await section.boundingBox())!
    const shot = await shoot(page, box)
    const rel = async (testid: string, fx: number, fy: number) => {
      const r = (await page.getByTestId(testid).boundingBox())!
      return shot.at(r.x - box.x + r.width * fx, r.y - box.y + r.height * fy)
    }
    const problems: string[] = []
    const expectDiff = (what: string, a: RGB, b: RGB) => !differs(a, b) && problems.push(`${what}: ${a} vs ${b}`)
    // Edges: the pixel on the control's edge differs from the canvas just outside it.
    for (const id of ["fc-checkbox-off", "fc-input", "fc-switch-off", "fc-primary", "fc-elevated", "fc-progress"]) {
      expectDiff(`${id} edge`, await rel(id, 0.5, 0.02), await rel(id, 0.5, -0.6))
    }
    // States.
    expectDiff("checked checkbox fill vs unchecked", await rel("fc-checkbox-on", 0.2, 0.5), await rel("fc-checkbox-off", 0.2, 0.5))
    expectDiff("checked radio dot vs its ring interior", await rel("fc-radio-on", 0.5, 0.5), await rel("fc-radio-on", 0.2, 0.5))
    expectDiff("switch on: track vs off track", await rel("fc-switch-on", 0.3, 0.5), await rel("fc-switch-off", 0.8, 0.5))
    expectDiff("switch off: thumb vs track", await rel("fc-switch-off", 0.3, 0.5), await rel("fc-switch-off", 0.8, 0.5))
    expectDiff("progress fill vs rest of track", await rel("fc-progress", 0.3, 0.5), await rel("fc-progress", 0.85, 0.5))
    const sliderTrack = page.getByTestId("fc-slider").locator("[data-slot=slider-track]")
    const st = (await sliderTrack.boundingBox())!
    expectDiff("slider range vs track", shot.at(st.x - box.x + st.width * 0.25, st.y - box.y + st.height / 2), shot.at(st.x - box.x + st.width * 0.9, st.y - box.y + st.height / 2))
    expectDiff("pressed toggle vs canvas", await rel("fc-toggle", 0.15, 0.5), await rel("fc-toggle", 0.5, -0.5))
    const tabs = page.getByTestId("fc-tabs").locator("[data-slot=tabs-trigger]")
    const t0 = (await tabs.nth(0).boundingBox())!
    const t1 = (await tabs.nth(1).boundingBox())!
    expectDiff("selected tab vs other tab", shot.at(t0.x - box.x + 4, t0.y - box.y + t0.height / 2), shot.at(t1.x - box.x + 4, t1.y - box.y + t1.height / 2))
    const ut = page.getByTestId("fc-underline-tabs").locator("[data-slot=tabs-trigger]")
    const u0 = (await ut.nth(0).boundingBox())!
    const below = (dy: number) => shot.at(u0.x - box.x + u0.width / 2, u0.y - box.y + u0.height + dy)
    if (![-0.6, 0, 0.6, 1.2].some((dy) => differs(below(dy), below(8)))) problems.push("underline under the selected tab: not visible")
    const seg = page.getByTestId("fc-segmented").locator("[data-slot=segmented-control-item]")
    const s0 = (await seg.nth(0).boundingBox())!
    const s1 = (await seg.nth(1).boundingBox())!
    expectDiff("selected segment vs other", shot.at(s0.x - box.x + 3, s0.y - box.y + s0.height / 2), shot.at(s1.x - box.x + 3, s1.y - box.y + s1.height / 2))
    expect(problems, problems.join("\n")).toEqual([])
  })

  test("focus ring is visible", async ({ page }) => {
    for (const id of ["fc-switch-on", "fc-checkbox-on", "fc-primary", "fc-input"]) {
      await page.getByTestId(id).focus()
      await page.keyboard.press("Shift+Tab")
      await page.keyboard.press("Tab")
      await page.waitForTimeout(220)
      const r = await checkRing(page)
      expect(r, id).not.toBeNull()
      const missing = Object.entries(r!.sides).filter(([, s]) => !s.found).map(([k]) => k)
      expect(missing, `${id}: ring missing on ${missing.join(", ")}`).toEqual([])
    }
  })

  test("screenshot", async ({ page }) => {
    await expect(page.locator("[data-section=forced]")).toHaveScreenshot("forced-colors-controls.png")
  })
})

/* -------------------------------- Reduced motion -------------------------------- */

test.describe("reduced motion", () => {
  const overlays = [
    ["open-dialog", "dialog-popup"],
    ["open-sheet", "sheet-popup"],
    ["open-alert", "alert-popup"],
    ["open-popover", "popover-popup"],
    ["open-menu", "menu-popup"],
    ["open-select", "select-popup"],
  ] as const

  const motion = (popup: Locator) =>
    popup.evaluate((el) => {
      const els = [el, ...(el.parentElement ? [el.parentElement] : []), ...document.querySelectorAll("[data-slot$=overlay]")]
      const running = els.flatMap((e) => e.getAnimations()).filter((a) => a.playState === "running" && Number(a.effect?.getTiming().duration) > 0).length
      const transitions = els
        .map((e) => getComputedStyle(e))
        .filter((s) => s.transitionProperty !== "none" && s.transitionDuration.split(",").some((x) => parseFloat(x) > 0))
        .map((s) => `${s.transitionProperty} ${s.transitionDuration}`)
      return { running, transitions }
    })

  for (const [trigger, popup] of overlays) {
    test(`${popup} opens without animation when reduced motion is requested`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" })
      await page.goto(CONTROLS)
      await page.waitForLoadState("networkidle")
      await page.getByTestId(trigger).click()
      const m = await motion(page.getByTestId(popup))
      expect(m).toEqual({ running: 0, transitions: [] })
    })
  }

  test("and still animates without that preference", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" })
    await page.goto(CONTROLS)
    await page.waitForLoadState("networkidle")
    await page.getByTestId("open-dialog").click()
    const m = await motion(page.getByTestId("dialog-popup"))
    expect(m.running + m.transitions.length).toBeGreaterThan(0)
  })
})

/* ---------------------------- Labels, slots and reflow ---------------------------- */

test("label props translate the built-in strings, and icon-only buttons have names", async ({ page }) => {
  await page.goto(CONTROLS)
  await page.waitForLoadState("networkidle")
  const i18n = page.locator("[data-section=i18n]")
  await expect(i18n.getByText("Facultatif")).toBeVisible()
  await expect(i18n.getByRole("button", { name: "Copier" })).toBeVisible()
  await expect(i18n.getByText("Plus", { exact: true })).toHaveCount(1)
  await expect(i18n.getByText("Autres pages")).toHaveCount(1)
  await expect(i18n.getByLabel("Page précédente")).toBeVisible()
  await expect(i18n.getByLabel("Page suivante")).toBeVisible()
  await expect(i18n.getByRole("button", { name: "Diapositive précédente" })).toHaveCount(1)
  await expect(i18n.getByRole("button", { name: "Diapositive suivante" })).toHaveCount(1)
  await expect(i18n.locator("[data-slot=carousel]")).toHaveAttribute("aria-roledescription", "diaporama")
  await expect(i18n.locator("[data-slot=carousel-item]").first()).toHaveAttribute("aria-roledescription", "diapositive")
  const fields = page.locator("[data-section=fields]")
  await expect(fields.getByRole("button", { name: "Afficher les options" })).toHaveCount(1)
  await expect(fields.getByRole("button", { name: "Retirer" })).toHaveCount(1)
  await fields.getByRole("combobox", { name: "Fruit search" }).fill("App")
  await page.getByRole("option", { name: "Apple" }).click()
  await expect(fields.getByRole("button", { name: "Effacer" })).toHaveCount(1)
  await i18n.getByRole("button", { name: "Ouvrir le dialogue" }).click()
  const dialog = page.getByRole("dialog")
  await expect(dialog.getByRole("button", { name: "Fermer" })).toBeVisible()
  await expect(dialog.getByRole("button", { name: "Annuler" })).toBeVisible()
  await page.keyboard.press("Escape")
  await i18n.getByRole("button", { name: "Ouvrir le panneau" }).click()
  await expect(page.getByRole("dialog").getByRole("button", { name: "Fermer le panneau" })).toBeVisible()
})

test("dialogs are modal to assistive technology and add no landmarks", async ({ page }) => {
  await page.goto(CONTROLS)
  await page.waitForLoadState("networkidle")
  for (const [trigger, popup] of [["open-dialog", "dialog-popup"], ["open-sheet", "sheet-popup"], ["open-alert", "alert-popup"]]) {
    await page.getByTestId(trigger).click()
    await expect(page.getByTestId(popup)).toHaveAttribute("aria-modal", "true")
    expect(await page.getByTestId(popup).locator("header, footer").count()).toBe(0)
    await page.keyboard.press("Escape")
    await expect(page.getByTestId(popup)).toHaveCount(0)
  }
})

test("FormControl keeps the field's own data-slot", async ({ page }) => {
  await page.goto(CONTROLS)
  await page.waitForLoadState("networkidle")
  await expect(page.locator("#fc-input")).toHaveAttribute("data-slot", "input")
  await expect(page.locator("#fc-input")).toHaveAttribute("aria-invalid", "true")
  await expect(page.locator("#fc-textarea")).toHaveAttribute("data-slot", "textarea")
  await expect(page.locator("#fc-select")).toHaveAttribute("data-slot", "select-trigger")
  await expect(page.locator("#fc-raw")).toHaveAttribute("data-slot", "form-control")
  for (const id of ["#fc-input", "#fc-textarea", "#fc-select", "#fc-raw"]) await expect(page.locator(id)).toHaveAttribute("data-form-control", "")
})

test("tab lists with long labels don't make a 320px page scroll sideways", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 })
  await page.goto("/fixtures/reflow")
  await page.waitForLoadState("networkidle")
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow).toBe(0)
})

test("tab lists stay on one row on phones; a list too long for its parent scrolls inside it", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto("/fixtures/reflow")
  await page.waitForLoadState("networkidle")
  for (const id of ["tabs-fit", "tabs-narrow", "tabs-default", "tabs-line"]) {
    const m = await page.getByTestId(id).evaluate((el) => {
      const tops = new Set([...el.querySelectorAll("[data-slot=tabs-trigger]")].map((t) => Math.round(t.getBoundingClientRect().top)))
      return { rows: tops.size, height: Math.round(el.getBoundingClientRect().height), scrolls: el.scrollWidth > el.clientWidth }
    })
    expect(m.rows, `${id}: one row`).toBe(1)
    if (id !== "tabs-line") expect(m.height, `${id}: 32px tall`).toBe(32)
    if (id === "tabs-fit") expect(m.scrolls, `${id}: fits without scrolling`).toBe(false)
    if (id === "tabs-fit") expect(await page.getByTestId(id).evaluate((el) => getComputedStyle(el).overflowX), `${id}: not a scroll container`).toBe("visible")
    if (id === "tabs-narrow") expect(m.scrolls, `${id}: scrolls inside its parent`).toBe(true)
  }
})

test("the blocks' own tables scroll in a focusable, named region on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  for (const [path, name] of [["/blocks/data-table-card", "Table"], ["/blocks/members-card", "Members"]]) {
    await page.goto(path)
    await page.waitForLoadState("networkidle")
    const wrapper = page.locator("table").first().locator("..")
    await expect(wrapper, path).toHaveAttribute("role", "region")
    await expect(wrapper, path).toHaveAttribute("tabindex", "0")
    await expect(wrapper, path).toHaveAttribute("aria-label", name)
  }
})

test("the calendar's month and year dropdowns use 16px text on a coarse pointer", async ({ browser }) => {
  const ctx = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } })
  const page = await ctx.newPage()
  await page.goto("/components/calendar")
  await page.waitForLoadState("networkidle")
  const sizes = await page.locator("select").evaluateAll((els) => els.map((e) => parseFloat(getComputedStyle(e).fontSize)))
  expect(sizes.length).toBeGreaterThan(0)
  expect(Math.min(...sizes)).toBeGreaterThanOrEqual(16)
  await ctx.close()
})

test("a control focused inside an open accordion panel shows its whole ring", async ({ page }) => {
  await page.goto(CONTROLS)
  await page.waitForLoadState("networkidle")
  await page.getByTestId("accordion-panel-button").focus()
  await page.keyboard.press("Shift+Tab")
  await page.keyboard.press("Tab")
  await settle(page)
  const r = await checkRing(page)
  expect(r).not.toBeNull()
  const missing = Object.entries(r!.sides).filter(([, s]) => !s.found).map(([k]) => k)
  expect(missing, `ring clipped on ${missing.join(", ")}`).toEqual([])
})

test("in RTL a tab list reaching past the page's left edge is flagged as overflowing", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto("/fixtures/rtl-tabs")
  await page.waitForLoadState("networkidle")
  await expect(page.getByTestId("tabs-rtl-fit")).toHaveAttribute("data-overflowing", "true")
})

test("a table wider than its container scrolls in a focusable, named region", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 })
  await page.goto("/fixtures/reflow")
  await page.waitForLoadState("networkidle")
  const region = page.getByRole("region", { name: "Orders this week" })
  await expect(region).toHaveAttribute("tabindex", "0")
  await region.focus()
  await page.keyboard.press("ArrowRight")
  await expect.poll(() => region.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0)
  await page.setViewportSize({ width: 1280, height: 800 })
  await expect(page.locator("[data-slot=table-container]")).not.toHaveAttribute("tabindex", "0")
})

/* ------------------------------- Keyboard walk ------------------------------- */

test("overlays: keyboard opens them, focus moves in, Escape closes and returns focus", async ({ page }) => {
  await page.goto(CONTROLS)
  await page.waitForLoadState("networkidle")
  for (const [trigger, popup] of [["open-dialog", "dialog-popup"], ["open-sheet", "sheet-popup"], ["open-alert", "alert-popup"], ["open-popover", "popover-popup"], ["open-menu", "menu-popup"], ["open-select", "select-popup"]]) {
    const t = page.getByTestId(trigger)
    await t.focus()
    await page.keyboard.press("Enter")
    const p = page.getByTestId(popup)
    await expect(p, trigger).toBeVisible()
    await expect.poll(() => p.evaluate((el) => el.contains(document.activeElement)), `${trigger}: focus inside`).toBe(true)
    await page.keyboard.press("Escape")
    await expect(p, trigger).toBeHidden()
    await expect(t, `${trigger}: focus returns`).toBeFocused()
  }
})

/* ------------------------------ Slider spoken value ------------------------------ */

test("Slider passes getAriaValueText to its thumbs", async ({ page }) => {
  await page.goto(CONTROLS)
  await page.waitForLoadState("networkidle")
  await expect(page.getByTestId("slider").getByRole("slider")).toHaveAttribute("aria-valuetext", "50 percent volume")
})

/* ------------------------- Primary label on every pixel row ------------------------- */

test.describe("primary button label", () => {
  const green = ":root{--brand:#0e7e45;--brand-edge:#0a6b3a}"
  for (const theme of ["light", "dark"] as const) {
    for (const accent of ["default", "green"] as const) {
      test(`reaches 4.5:1 on every row below the 1px bevel, however it is rendered (${theme}, ${accent} brand)`, async ({ page }) => {
        await page.addInitScript((t) => localStorage.setItem("theme", t), theme)
        await page.goto("/fixtures/primary")
        await page.waitForLoadState("networkidle")
        if (accent === "green") await page.addStyleTag({ content: green })
        const problems: string[] = []
        const measure = async (testid: string) => {
          const el = page.getByTestId(testid)
          await expect(el).toBeVisible()
          const label = parseRGB(await el.evaluate((e) => getComputedStyle(e).color))
          await el.evaluate((e) => {
            e.style.setProperty("transition", "none", "important")
            e.style.setProperty("color", "transparent", "important")
            e.style.setProperty("text-shadow", "none", "important")
          })
          const box = (await el.boundingBox())!
          const shot = await shoot(page, box)
          let min = Infinity
          for (let y = 2; y < box.height - 1; y += 1) {
            const ratios = [0.3, 0.5, 0.7].map((fx) => contrast(label, shot.at(box.width * fx, y)))
            min = Math.min(min, ...ratios)
          }
          await el.evaluate((e) => e.style.removeProperty("color"))
          if (min < 4.5) problems.push(`${testid}: ${min.toFixed(2)}:1`)
        }
        for (const id of ["primary-button", "primary-default", "primary-link", "primary-dialog-trigger", "primary-popover-trigger"]) await measure(id)
        await page.getByTestId("primary-dialog-trigger").click()
        await measure("primary-dialog-close")
        await page.keyboard.press("Escape")
        await page.getByTestId("open-alert").click()
        await measure("primary-alert-action")
        expect(problems, problems.join("\n")).toEqual([])
      })
    }
  }
})
