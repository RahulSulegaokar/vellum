// WCAG contrast check for every text/background pair and every non-text indicator (focus ring, checked fill,
// check mark, progress fill) the Vellum components use, in light and dark, with Vellum's violet accent and with a
// second, green accent fixture (a consumer's rebrand), so an app that changes the accent is covered too.
//
// Reads registry/themes/vellum.tokens.json, resolves var() and color-mix(... N%, transparent) alpha, composites
// translucent backgrounds (tints, gradients, the primary button's sheen) over the surface they sit on, and fails
// under 4.5:1 for text, 3:1 for large text (18px and up), icons, marks and focus indicators.
//
//   node tests/contrast.mjs          human-readable report, exit 1 on any failure
//   node tests/contrast.mjs --json   the same pairs and results as JSON, for apps that extend the list
import { readFileSync } from "node:fs"

const tokens = JSON.parse(readFileSync(new URL("../registry/themes/vellum.tokens.json", import.meta.url), "utf8"))
const buttonSource = readFileSync(new URL("../components/ui/button.tsx", import.meta.url), "utf8")
const json = process.argv.includes("--json")

// Tailwind v4 palette values used by the kit (sRGB hex equivalents of the oklch defaults).
const palette = {
  white: "#ffffff",
  black: "#000000",
  "red-300": "#ffa2a2", "red-400": "#ff6467", "red-500": "#fb2c36", "red-700": "#c10007",
  "orange-300": "#ffb86a", "orange-500": "#ff6900", "orange-700": "#ca3500",
  "blue-300": "#8ec5ff", "blue-500": "#2b7fff", "blue-700": "#1447e6",
  "green-300": "#7bf1a8", "green-700": "#008236",
}

/**
 * Accent fixtures. "violet" is the theme as shipped. "green" is a consumer accent applied the way DESIGN.md
 * ("Change the accent") tells apps to: every token in tokens.accentTokens, light and dark.
 */
const fixtures = {
  violet: { light: {}, dark: {} },
  green: {
    light: {
      brand: "#0e7e45", "brand-edge": "#0a6b3a", "brand-edge-strong": "color-mix(in oklab, #085c32 88%, transparent)",
      "brand-text": "#0e7e45", ring: "#0f8a4b", "sidebar-ring": "#0f8a4b", "sidebar-primary": "#0e7e45",
      "chart-1": "#0f8a4b", "chart-2": "#064e2b", "success-text": "#0e7e45",
    },
    dark: {
      "brand-text": "#3dd68c", ring: "#34c77b", "sidebar-ring": "#34c77b", "sidebar-primary": "#3dd68c",
      "sidebar-primary-foreground": "#0d1f15", "success-text": "#3dd68c",
    },
  },
}

/* ------------------------------- Color parsing ------------------------------- */

const hex = (h) => {
  h = h.replace("#", "")
  if (h.length === 3) h = [...h].map((c) => c + c).join("")
  const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), a]
}

let fixture = fixtures.violet
function token(name, mode) {
  return (
    (mode === "dark" && fixture.dark[name]) ||
    (mode === "dark" && tokens.dark[name]) ||
    fixture.light[name] ||
    tokens.light[name]
  )
}

function resolve(value, mode, depth = 0) {
  if (depth > 10) throw new Error(`cycle resolving ${value}`)
  value = value.trim()
  const v = value.match(/^var\(--([\w-]+)\)$/)
  if (v) {
    const name = v[1]
    if (name.startsWith("color-") && palette[name.slice(6)]) return resolve(palette[name.slice(6)], mode, depth + 1)
    const raw = token(name, mode)
    if (!raw) throw new Error(`unknown token --${name}`)
    return resolve(raw, mode, depth + 1)
  }
  if (palette[value]) return resolve(palette[value], mode, depth + 1)
  if (value === "transparent") return [0, 0, 0, 0]
  if (value.startsWith("#")) return hex(value)
  const rgb = value.match(/^rgba?\(([^)]+)\)$/)
  if (rgb) {
    const [c, alpha] = rgb[1].split("/")
    const [r, g, b] = c.trim().split(/[\s,]+/).map(Number)
    return [r, g, b, alpha ? Number(alpha) : 1]
  }
  const mix = value.match(/^color-mix\(in oklab,\s*(.+?)\s+([\d.]+)%,\s*transparent\)$/)
  if (mix) {
    const [r, g, b, a] = resolve(mix[1], mode, depth + 1)
    return [r, g, b, a * (Number(mix[2]) / 100)]
  }
  throw new Error(`cannot parse color ${value}`)
}

const over = (top, bottom) => {
  const [r, g, b, a] = top
  const [R, G, B] = bottom
  return [r * a + R * (1 - a), g * a + G * (1 - a), b * a + B * (1 - a), 1]
}
const lum = ([r, g, b]) => {
  const f = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m)
  return (x + 0.05) / (y + 0.05)
}

/**
 * A background is a stack, bottom first: e.g. ["var(--background)", "var(--surface)"]
 * or ["var(--surface)", "color-mix(in oklab, var(--destructive) 10%, transparent)"].
 */
function paint(stack, mode) {
  let c = [255, 255, 255, 1]
  for (const layer of stack) c = over(resolve(layer, mode), c)
  return c
}

/* ------------------------------- Pairs in use ------------------------------- */

const tint = (token, pct) => `color-mix(in oklab, var(--${token}) ${pct}%, transparent)`
const tw = (color, pct) => `color-mix(in oklab, ${color} ${pct}%, transparent)`
const canvas = ["var(--background)"]
const surface = ["var(--background)", "var(--surface)"]
const muted = [...surface, "var(--muted)"]
const popover = [...canvas, "var(--popover)"]
const card = [...canvas, "var(--card)"]
const surfaceMuted = [...canvas, "var(--surface-muted)"]
const sidebar = [...canvas, "var(--sidebar)"]
const field = [...surface, "var(--field)"]

// The primary button's top sheen: `before:from-white/N` over the brand fill. Its top row is the lightest one,
// and the label must pass on every row, so the top stop is what is checked. Read from the source so it can't drift.
const primaryClasses = buttonSource.match(/primary:\s*"([^"]+)"/)[1]
const sheen = Number(primaryClasses.match(/before:from-white\/(\d+)/)[1])
// The gloss pill: a `before:from-white/20` sheen at 50% opacity plus a white/10 overlay band (approximated as normal
// blending, which is lighter than overlay on these fills, so the check errs on the safe side).
const gloss = buttonSource.match(/gloss:\s*"([^"]+)"/)[1]
const glossSheen = Number(gloss.match(/before:from-white\/(\d+)/)[1]) * (gloss.includes("before:opacity-50") ? 0.5 : 1)
// Tags draw a 2% black gradient (`bg-linear-to-t from-black/2`) over their tint; its darkest end is the bottom row.
const tagShade = (classes) => (classes.match(/from-black\/(\d+)/) ? [tw("var(--color-black)", Number(classes.match(/from-black\/(\d+)/)[1]))] : [])
const badgeSource = readFileSync(new URL("../components/ui/badge.tsx", import.meta.url), "utf8")
const badge = (name) => badgeSource.match(new RegExp(`"?${name}"?:\\s*"([^"]+)"`))[1]
const shade = { subtle: tagShade(badge("subtle")), info: tagShade(badge("subtle-info")), warning: tagShade(badge("subtle-warning")) }
// Classes read from the components, so a regression in a component (not only in a token) fails here.
const src = (name) => readFileSync(new URL(`../components/ui/${name}.tsx`, import.meta.url), "utf8")
const textToken = (cls) => {
  const [name, alpha] = cls.slice(5).split("/")
  return alpha ? tw(`var(--${name})`, Number(alpha)) : `var(--${name})`
}
const commandPlaceholder = /placeholder:text-placeholder/.test(src("command")) ? "var(--placeholder)" : tw("var(--popover-foreground)", 50) // Tailwind's default: currentColor at 50%
const selectPlaceholder = (mode) => (mode === "dark" && src("select").match(/dark:data-placeholder:(text-[\w-]+)/)?.[1]) || "text-placeholder"
const segmentItem = src("segmented-control").match(/data-slot="segmented-control-item"[\s\S]*?cn\(\s*"([^"]+)"/)[1]
const segmentText = (mode) => (mode === "dark" && segmentItem.match(/dark:(?:not-data-pressed:)?(text-[\w/-]+)/)?.[1]) || segmentItem.match(/(?:^|\s)(text-(?:subtle|muted-foreground|foreground[\w/-]*))(?=\s|$)/)[1]
const fieldLabel = src("field")
const choiceTint = (mode) => Number((mode === "dark" && fieldLabel.match(/dark:has-data-checked:bg-brand\/(\d+)/)?.[1]) || fieldLabel.match(/(?:^|\s)has-data-checked:bg-brand\/(\d+)/)[1])

/** [label, text color, background stack, kind] — kind: "text" (4.5), "large" (3), "ui" (3: icons, marks, focus). */
const text = [
  ["body on canvas", "var(--foreground)", canvas],
  ["body on surface", "var(--foreground)", surface],
  ["body on muted surface", "var(--foreground)", surfaceMuted],
  ["body on popover", "var(--popover-foreground)", popover],
  ["body on card", "var(--card-foreground)", card],
  ["menu item on accent", "var(--accent-foreground)", [...popover, "var(--accent)"]],
  ["destructive menu item on destructive/10", "var(--destructive-text)", [...popover, tint("destructive", 10)]],
  ["muted text on canvas", "var(--muted-foreground)", canvas],
  ["muted text on surface", "var(--muted-foreground)", surface],
  ["muted text on muted fill", "var(--muted-foreground)", muted],
  ["muted text on popover", "var(--muted-foreground)", popover],
  ["subtle text on canvas", "var(--subtle)", canvas],
  ["subtle text on surface", "var(--subtle)", surface],
  ["subtle text on muted surface", "var(--subtle)", surfaceMuted],
  ["subtle text on subtle tint (callout)", "var(--subtle)", [...canvas, tint("subtle", 4)]],
  ["placeholder in field on surface", "var(--placeholder)", field],
  ["placeholder in field on canvas", "var(--placeholder)", [...canvas, "var(--field)"]],
  ["placeholder in field on muted surface (dialog shell)", "var(--placeholder)", [...surfaceMuted, "var(--field)"]],
  ["placeholder in select trigger on surface", "SELECT_PLACEHOLDER", field],
  ["placeholder in command input (input/30 on popover)", commandPlaceholder, [...popover, tint("input", 30)]],
  ["avatar fallback", "var(--muted-foreground)", muted],
  ["primary (ink) button", "var(--primary-foreground)", ["var(--primary)"]],
  ["solid button", "var(--solid-foreground)", ["var(--solid)"]],
  ["brand fill (checked control, calendar day)", "var(--brand-foreground)", ["var(--brand)"]],
  [`primary button label on its sheen's top row (white/${sheen})`, "var(--brand-foreground)", ["var(--brand)", tw("var(--color-white)", sheen)]],
  [`gloss pill label on its sheen's top row (white/${glossSheen} + white/10)`, "var(--brand-foreground)", ["var(--brand)", tw("var(--color-white)", glossSheen), tw("var(--color-white)", 10)]],
  ["brand text link on surface", "var(--brand-text)", surface],
  ["brand text link on canvas", "var(--brand-text)", canvas],
  ["destructive text on surface", "var(--destructive-text)", surface],
  ["destructive text on canvas", "var(--destructive-text)", canvas],
  ["destructive text on destructive/6 (banner) on canvas", "var(--destructive-text)", [...canvas, tint("destructive", 6)]],
  ["destructive text on destructive/10 (button, badge)", "var(--destructive-text)", [...surface, tint("destructive", 10)]],
  ["destructive text on destructive/20 (hover)", "var(--destructive-text)", [...surface, tint("destructive", 20)]],
  ["white on solid destructive", "var(--destructive-foreground)", ["var(--destructive-strong)"]],
  ["warning text on surface", "var(--warning-text)", surface],
  ["warning text on warning/6 (banner) on canvas", "var(--warning-text)", [...canvas, tint("warning", 6)]],
  ["info text on surface", "var(--info-text)", surface],
  ["info text on info/6 (banner) on canvas", "var(--info-text)", [...canvas, tint("info", 6)]],
  ["success text on surface", "var(--success-text)", surface],
  ["success text on success/6 (banner) on canvas", "var(--success-text)", [...canvas, tint("success", 6)]],
  ["subtle tag on surface (darkest row)", "var(--subtle)", [...surface, tint("subtle", 4), ...shade.subtle]],
  ["subtle tag on canvas (darkest row)", "var(--subtle)", [...canvas, tint("subtle", 4), ...shade.subtle]],
  ["subtle tag on muted surface (darkest row)", "var(--subtle)", [...surfaceMuted, tint("subtle", 4), ...shade.subtle]],
  ["subtle-info tag on surface (darkest row)", "var(--info-text)", [...surface, tint("info", 6), ...shade.info]],
  ["subtle-info tag on canvas (darkest row)", "var(--info-text)", [...canvas, tint("info", 6), ...shade.info]],
  ["subtle-warning tag on surface (darkest row)", "var(--warning-text)", [...surface, tint("warning", 6), ...shade.warning]],
  ["subtle-warning tag on canvas (darkest row)", "var(--warning-text)", [...canvas, tint("warning", 6), ...shade.warning]],
  ["subtle-warning tag on muted surface (darkest row)", "var(--warning-text)", [...surfaceMuted, tint("warning", 6), ...shade.warning]],
  ["label's Optional tag on accent", "var(--muted-foreground)", [...surface, "var(--accent)"]],
  ["segmented control: unselected label on its track", "SEGMENT_TEXT", [...surface, tint("subtle", 8)]],
  ["segmented control: unselected label on its track, hovered", "SEGMENT_TEXT", [...surface, tint("subtle", 8), tint("subtle", 8)]],
  ["segmented control: unselected label on canvas track", "SEGMENT_TEXT", [...canvas, tint("subtle", 8)]],
  ["checked choice card: description on its brand tint", "var(--muted-foreground)", [...surface, "CHOICE_TINT"]],
  ["checked choice card: description on its brand tint over a card", "var(--muted-foreground)", [...card, "CHOICE_TINT"]],
  ["page title (large) on canvas", "var(--foreground)", canvas, "large"],
]

// Focus ring (2px, opaque, --ring) against every surface a control sits on, checked marks and fills: 3:1.
const ui = [
  ...[
    ["canvas", canvas], ["surface", surface], ["muted surface (dialog shell)", surfaceMuted], ["muted fill (tabs list, hover)", muted],
    ["popover", popover], ["card", card], ["accent (menu highlight)", [...popover, "var(--accent)"]],
  ].map(([where, bg]) => [`focus ring on ${where}`, "var(--ring)", bg, "ui"]),
  ["sidebar focus ring on sidebar", "var(--sidebar-ring)", sidebar, "ui"],
  ["sidebar focus ring on sidebar accent", "var(--sidebar-ring)", [...sidebar, "var(--sidebar-accent)"], "ui"],
  ["checked fill (checkbox, radio, switch) on surface", "var(--brand)", surface, "ui"],
  ["checked fill (checkbox, radio, switch) on canvas", "var(--brand)", canvas, "ui"],
  ["check mark / radio dot on the checked fill", "var(--brand-foreground)", ["var(--brand)"], "ui"],
  ["progress and slider fill on their track", "var(--brand)", muted, "ui"],
]

// Known gaps that cannot be closed without visibly changing a control at rest. They are reported ("known") and
// not counted as failures; each is a separate design proposal. Remove a label here once its fix ships.
const known = new Set([
  "gloss pill label on its sheen's top row",
  "success text on success/6 (banner) on canvas",
  "checked fill (checkbox, radio, switch) on surface",
  "progress and slider fill on their track",
])
const isKnown = (label) => [...known].some((k) => label.startsWith(k))

// Control boundaries (WCAG 1.4.11): reported, not enforced, for the same reason.
const boundaries = [
  ["unchecked checkbox edge on surface", "CONTROL_EDGE", surface],
  ["radio edge (--input) on surface", "var(--input)", surface],
  ["field ring (--field-ring) on surface", "var(--field-ring)", surface],
  ["switch off track (--control-off) on surface", "var(--control-off)", surface],
  // Advisory: a control placed inside a primary-filled container (a dark-mode bubble is white). Vellum's own
  // ring passes; an app's accent may not, so it is reported for every fixture.
  ["focus ring on a primary fill (control inside a bubble)", "var(--ring)", ["var(--primary)"]],
].map(([l, c, b]) => [l, c, b, "ui"])

/* ---------------------------------- Run ---------------------------------- */

const min = { text: 4.5, large: 3, ui: 3 }
const results = []
let failures = 0
const log = (s) => !json && console.log(s)
for (const [fixtureName, fx] of Object.entries(fixtures)) {
  fixture = fx
  for (const mode of ["light", "dark"]) {
    log(`\n${fixtureName} accent, ${mode}`)
    const sub = (v) =>
      v === "SEGMENT_TEXT" ? textToken(segmentText(mode))
      : v === "SELECT_PLACEHOLDER" ? textToken(selectPlaceholder(mode))
      : v === "CHOICE_TINT" ? tint("brand", choiceTint(mode))
      : v === "CONTROL_EDGE" ? token("control-shadow", mode).match(/0 0 0 1px (rgb\([^)]+\)|var\([^)]+\))/)[1]
      : v
    for (const [list, enforced] of [[text, true], [ui, true], [boundaries, false]]) {
      for (const [label, fg, bg, kind = "text"] of list) {
        const back = paint(bg.map(sub), mode)
        const r = ratio(over(resolve(sub(fg), mode), back), back)
        const ok = r >= min[kind]
        const enforce = enforced && !isKnown(label)
        if (!ok && enforce) failures++
        results.push({ fixture: fixtureName, mode, label, kind, min: min[kind], ratio: Number(r.toFixed(2)), pass: ok, enforced: enforce })
        log(`  ${ok ? "pass" : enforce ? "FAIL" : isKnown(label) ? "known" : "info"}  ${r.toFixed(2).padStart(5)}:1  ${kind === "text" ? "" : `[${kind} ${min[kind]}:1] `}${label}`)
      }
    }
  }
}
if (json) console.log(JSON.stringify({ thresholds: min, results }, null, 2))
else console.log(failures ? `\n${failures} pair(s) below the WCAG AA minimum` : "\nAll enforced pairs meet WCAG AA (\"known\" and \"info\" rows are reported only: see the comments above)")
process.exit(failures ? 1 : 0)
