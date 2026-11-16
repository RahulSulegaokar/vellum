// WCAG contrast check for every text/background token pair the Vellum components use.
// Reads registry/themes/vellum.tokens.json, resolves var() and color-mix(... N%, transparent) alpha,
// composites translucent backgrounds over the surface they sit on, and fails under 4.5:1
// (3:1 for large text, 18px and up). Run: `node tests/contrast.mjs`.
import { readFileSync } from "node:fs"

const tokens = JSON.parse(readFileSync(new URL("../registry/themes/vellum.tokens.json", import.meta.url), "utf8"))

// Tailwind v4 palette values used by the kit (sRGB hex equivalents of the oklch defaults).
const palette = {
  white: "#ffffff",
  black: "#000000",
  "red-300": "#ffa2a2", "red-400": "#ff6467", "red-500": "#fb2c36", "red-700": "#c10007",
  "orange-300": "#ffb86a", "orange-500": "#ff6900", "orange-700": "#ca3500",
  "blue-300": "#8ec5ff", "blue-500": "#2b7fff", "blue-700": "#1447e6",
  "green-300": "#7bf1a8", "green-700": "#008236",
}

/* ------------------------------- Color parsing ------------------------------- */

const hex = (h) => {
  h = h.replace("#", "")
  if (h.length === 3) h = [...h].map((c) => c + c).join("")
  const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), a]
}

function resolve(value, mode, depth = 0) {
  if (depth > 10) throw new Error(`cycle resolving ${value}`)
  value = value.trim()
  const v = value.match(/^var\(--([\w-]+)\)$/)
  if (v) {
    const name = v[1]
    if (name.startsWith("color-") && palette[name.slice(6)]) return resolve(palette[name.slice(6)], mode, depth + 1)
    const raw = (mode === "dark" && tokens.dark[name]) || tokens.light[name]
    if (!raw) throw new Error(`unknown token --${name}`)
    return resolve(raw, mode, depth + 1)
  }
  if (palette[value]) return resolve(palette[value], mode, depth + 1)
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

/** [label, text color, background stack, large text?] */
const pairs = [
  ["body on canvas", "var(--foreground)", canvas],
  ["body on surface", "var(--foreground)", surface],
  ["body on muted surface", "var(--foreground)", [...canvas, "var(--surface-muted)"]],
  ["body on popover", "var(--popover-foreground)", [...canvas, "var(--popover)"]],
  ["menu item on accent", "var(--accent-foreground)", [...surface, "var(--accent)"]],
  ["muted text on canvas", "var(--muted-foreground)", canvas],
  ["muted text on surface", "var(--muted-foreground)", surface],
  ["muted text on muted fill", "var(--muted-foreground)", [...surface, "var(--muted)"]],
  ["subtle text on canvas", "var(--subtle)", canvas],
  ["subtle text on surface", "var(--subtle)", surface],
  ["subtle text on muted surface", "var(--subtle)", [...canvas, "var(--surface-muted)"]],
  ["subtle text on subtle tint (callout, subtle badge)", "var(--subtle)", [...canvas, tint("subtle", 4)]],
  ["placeholder in field", "var(--placeholder)", [...surface, "var(--field)"]],
  ["avatar fallback", "var(--muted-foreground)", [...surface, "var(--muted)"]],
  ["primary button", "var(--primary-foreground)", ["var(--primary)"]],
  ["solid button", "var(--solid-foreground)", ["var(--solid)"]],
  ["brand button / checked control", "var(--brand-foreground)", ["var(--brand)"]],
  ["brand text link on surface", "var(--brand-text)", surface],
  ["brand text link on canvas", "var(--brand-text)", canvas],
  ["destructive text on surface", "var(--destructive-text)", surface],
  ["destructive text on canvas", "var(--destructive-text)", canvas],
  ["destructive text on destructive/10 (button, badge)", "var(--destructive-text)", [...surface, tint("destructive", 10)]],
  ["destructive text on destructive/20 (hover)", "var(--destructive-text)", [...surface, tint("destructive", 20)]],
  ["white on solid destructive", "var(--destructive-foreground)", ["var(--destructive-strong)"]],
  ["warning text on surface", "var(--warning-text)", surface],
  ["warning text on warning tint (badge)", "var(--warning-text)", [...surface, tint("warning", 6)]],
  ["info text on surface", "var(--info-text)", surface],
  ["info text on info tint (badge)", "var(--info-text)", [...surface, tint("info", 6)]],
  ["success text on surface", "var(--success-text)", surface],
  ["success text on success tint", "var(--success-text)", [...surface, tint("success", 6)]],
  ["page title (large) on canvas", "var(--foreground)", canvas, true],
]

/* ---------------------------------- Run ---------------------------------- */

let failures = 0
for (const mode of ["light", "dark"]) {
  console.log(`\n${mode}`)
  for (const [label, fg, bg, large] of pairs) {
    const back = paint(bg, mode)
    const r = ratio(over(resolve(fg, mode), back), back)
    const min = large ? 3 : 4.5
    const ok = r >= min
    if (!ok) failures++
    console.log(`  ${ok ? "pass" : "FAIL"}  ${r.toFixed(2).padStart(5)}:1  ${label}`)
  }
}
console.log(failures ? `\n${failures} pair(s) below the WCAG AA minimum` : "\nAll pairs meet WCAG AA")
process.exit(failures ? 1 : 0)
