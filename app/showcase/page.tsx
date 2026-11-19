"use client"

import Link from "next/link"
import { useSyncExternalStore } from "react"
import { useTheme } from "@/hooks/use-theme"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { GroupHeading } from "@/components/showcase/frame"
import { ActionsShowcase } from "@/components/showcase/actions"
import { FormsShowcase } from "@/components/showcase/forms"
import { OverlaysShowcase } from "@/components/showcase/overlays"
import { DataShowcase } from "@/components/showcase/data"

const groups = [
  {
    id: "actions",
    title: "Actions, status and layout",
    blurb: "Buttons and their groups, tags, toggles, avatars, loading and progress, cards, items, empty states, alerts and markers.",
    items: ["button", "button-group", "toggle", "toggle-group", "segmented-control", "badge", "kbd", "avatar", "spinner", "skeleton", "progress", "separator", "aspect-ratio", "card", "item", "empty", "alert", "marker"],
    Show: ActionsShowcase,
  },
  {
    id: "forms",
    title: "Forms and inputs",
    blurb: "Every field and choice control with its sizes and its default, focused, filled, disabled, read-only and invalid states.",
    items: ["input", "textarea", "label", "field", "form", "input-group", "input-otp", "native-select", "select", "combobox", "checkbox", "radio-group", "switch", "slider", "calendar", "questionnaire"],
    Show: FormsShowcase,
  },
  {
    id: "overlays",
    title: "Overlays, menus and navigation",
    blurb: "Floating layers open over the page, so they follow the page theme: switch it to check them in dark.",
    items: ["dialog", "alert-dialog", "sheet", "drawer", "popover", "hover-card", "tooltip", "dropdown-menu", "context-menu", "menubar", "command", "navigation-menu", "breadcrumb", "pagination", "tabs", "accordion", "collapsible", "sidebar", "toast", "sonner"],
    Show: OverlaysShowcase,
  },
  {
    id: "data",
    title: "Data, content and conversation",
    blurb: "Tables, charts, carousels, scrolling and resizable regions, code, attachments, chat bubbles, messages and agent traces.",
    items: ["table", "chart", "carousel", "scroll-area", "resizable", "code-block", "attachment", "bubble", "message", "message-scroller", "trace", "direction"],
    Show: DataShowcase,
  },
]

const subscribe = () => () => {}

export default function ShowcasePage() {
  const theme = useTheme()
  const mounted = useSyncExternalStore(subscribe, () => true, () => false)
  const setTheme = (t: string) => {
    document.documentElement.classList.toggle("dark", t === "dark")
    document.documentElement.style.colorScheme = t
    try {
      localStorage.setItem("theme", t)
    } catch {}
  }
  const total = groups.reduce((n, g) => n + g.items.length, 0)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-[1600px] gap-10 px-4 py-10 sm:px-8">
        <nav aria-label="Components" className="sticky top-6 hidden h-[calc(100vh-3rem)] w-48 shrink-0 overflow-y-auto pr-2 text-sm lg:block">
          <Link href="/" className="mb-4 block font-medium">← Vellum</Link>
          {groups.map((g) => (
            <div key={g.id} className="mb-4">
              <a href={`#${g.id}`} className="mb-1 block text-xs font-medium tracking-wide text-subtle uppercase">{g.title}</a>
              <ul>
                {g.items.map((i) => (
                  <li key={i}>
                    <a href={`#${i}`} className="block rounded-sm px-1.5 py-0.5 text-muted-foreground hover:bg-accent hover:text-foreground">{i}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <main className="min-w-0 flex-1">
          <header className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-semibold tracking-tight">Component showcase</h1>
              <p className="mt-2 text-muted-foreground">
                All {total} Vellum components with every variant, size and state, shown with real-world copy from
                Relay, a made-up customer messaging product. Each demo renders in the page theme and in dark.
              </p>
              <p className="mt-1 text-sm text-subtle">
                Hover, focus (Tab) and press the controls to see their interactive states. On a touch screen controls
                keep their size but get larger tap areas.
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Page theme</p>
              {mounted && (
                <RadioGroup value={theme} onValueChange={(v) => setTheme(v as string)} className="flex gap-4" aria-label="Page theme">
                  {["light", "dark"].map((t) => (
                    <Label key={t} className="flex items-center gap-2 capitalize">
                      <RadioGroupItem value={t} /> {t}
                    </Label>
                  ))}
                </RadioGroup>
              )}
            </div>
          </header>

          <div className="mt-10 flex flex-col gap-14">
            {groups.map(({ id, title, blurb, Show }) => (
              <div key={id} className="flex flex-col gap-14">
                <GroupHeading id={id} title={title}>{blurb}</GroupHeading>
                <Show />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
