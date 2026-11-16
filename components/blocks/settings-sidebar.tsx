"use client"

import {
  BotIcon,
  BoxIcon,
  BrushIcon,
  Building2Icon,
  ChevronDownIcon,
  CodeIcon,
  FingerprintIcon,
  LayoutGridIcon,
  MenuIcon,
  PanelsTopLeftIcon,
  ReceiptIcon,
  SearchIcon,
  SettingsIcon,
  ShieldCheckIcon,
  UploadIcon,
} from "lucide-react"
import { useEffect, useId, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogPanel, DialogTitle } from "@/components/ui/dialog"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

/* ---------------------------------- Types ---------------------------------- */

export type SettingsNavLink = { label: string; href: string }
export type SettingsNavGroup = { label: string; icon?: React.ReactNode; href?: string; children?: SettingsNavLink[] }
export type SettingsNavSection = { title: string; items: SettingsNavGroup[] }
export type SettingsNavResult = SettingsNavLink & { group: string }
type NavigateHandler = (link: SettingsNavLink, event?: React.MouseEvent<HTMLAnchorElement>) => void

/* --------------------------------- Pieces ---------------------------------- */

const row =
  "relative isolate grid w-full grid-cols-[1rem_1fr] items-center gap-2 rounded-md px-2 py-1.5 text-left text-[0.8125rem]/5 text-foreground outline-none transition-colors before:absolute before:inset-x-0 before:inset-y-px before:-z-1 before:rounded-[inherit] before:bg-subtle/16 before:opacity-0 before:transition before:duration-50 hover:before:opacity-50 aria-[current=page]:before:opacity-100 focus-visible:ring-2 focus-visible:ring-brand/40 [&_svg]:size-4 [&_svg]:shrink-0"

function NavGroup({ group, current, onNavigate }: { group: SettingsNavGroup; current?: string; onNavigate?: NavigateHandler }) {
  const hasActive = group.children?.some((c) => c.href === current) ?? false
  const [open, setOpen] = useState(hasActive)
  // Re-open the group when navigation lands on one of its children.
  const [prevActive, setPrevActive] = useState(hasActive)
  if (hasActive !== prevActive) {
    setPrevActive(hasActive)
    if (hasActive) setOpen(true)
  }

  if (!group.children) {
    const href = group.href ?? "#"
    return (
      <li>
        <a
          href={href}
          onClick={(e) => onNavigate?.({ label: group.label, href }, e)}
          aria-current={href === current ? "page" : undefined}
          className={row}
        >
          <span className="flex text-muted-foreground">{group.icon}</span>
          <span>{group.label}</span>
        </a>
      </li>
    )
  }

  const children = group.children
  return (
    <li>
      <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)} className={row}>
        <span className="flex text-muted-foreground">{group.icon}</span>
        <span className="flex items-center">
          {group.label}
          <ChevronDownIcon aria-hidden="true" className={cn("ms-auto text-subtle transition-transform duration-150", open && "rotate-180")} />
        </span>
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <ul className="min-h-0 overflow-hidden" inert={!open}>
          {children.map((leaf, i) => {
            const active = leaf.href === current
            return (
              <li key={`${leaf.label}-${i}`}>
                <a href={leaf.href} onClick={(e) => onNavigate?.(leaf, e)} aria-current={active ? "page" : undefined} className={row}>
                  <span aria-hidden="true" className="relative flex h-full justify-center place-self-stretch">
                    <span className={cn("absolute -inset-y-1.5 w-px bg-subtle/16", i === 0 && "top-0", i === children.length - 1 && "bottom-0")} />
                    {active && <span className="absolute inset-y-0 w-px bg-foreground" />}
                  </span>
                  <span>{leaf.label}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </li>
  )
}

/** Grouped settings navigation: section headings, plain links and collapsible groups with a guide rail. */
export function SettingsNav({
  sections,
  current,
  onNavigate,
  label = "Settings",
  className,
}: {
  sections: SettingsNavSection[]
  /** href of the current page; matching links get `aria-current="page"`. */
  current?: string
  onNavigate?: NavigateHandler
  label?: string
  className?: string
}) {
  return (
    <nav aria-label={label} className={cn("isolate flex flex-col gap-8", className)}>
      {sections.map((s) => (
        <div key={s.title}>
          <h3 className="flex items-center gap-2 px-2 text-xs/4 font-medium text-subtle">{s.title}</h3>
          <ul className="mt-2">
            {s.items.map((g) => (
              <NavGroup key={g.label} group={g} current={current} onNavigate={onNavigate} />
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

/* ------------------------------ Find dialog -------------------------------- */

function flatten(sections: SettingsNavSection[]): SettingsNavResult[] {
  return sections.flatMap((s) =>
    s.items.flatMap((g) => (g.children ? g.children.map((c) => ({ ...c, group: g.label })) : [{ label: g.label, href: g.href ?? "#", group: s.title }]))
  )
}

/** ⌘K "Find a setting" dialog: a filtering combobox over every link in the settings navigation. */
export function SettingsFindDialog({
  sections,
  open,
  onOpenChange,
  onSelect,
  placeholder = "Find a setting…",
}: {
  sections: SettingsNavSection[]
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Called with the chosen link. Without it, the browser navigates to the link's href (unless it is "#"). */
  onSelect?: (link: SettingsNavResult) => void
  placeholder?: string
}) {
  const baseId = useId()
  const listId = `${baseId}-results`
  const optionId = (i: number) => `${baseId}-option-${i}`
  const [q, setQ] = useState("")
  const [active, setActive] = useState(0)
  const all = useMemo(() => flatten(sections), [sections])
  const results = useMemo(() => {
    const t = q.trim().toLowerCase()
    return t ? all.filter((l) => `${l.label} ${l.group}`.toLowerCase().includes(t)) : all
  }, [q, all])

  useEffect(() => {
    if (!open) return
    document.getElementById(`${baseId}-option-${active}`)?.scrollIntoView({ block: "nearest" })
  }, [active, open, baseId])

  const close = () => {
    onOpenChange(false)
    setQ("")
    setActive(0)
  }
  const choose = (link: SettingsNavResult) => {
    close()
    if (onSelect) onSelect(link)
    else if (link.href !== "#") window.location.assign(link.href)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (o) onOpenChange(true)
        else close()
      }}
    >
      <DialogContent className="max-w-lg" showCloseButton={false}>
        <DialogPanel className="p-0">
          <DialogTitle className="sr-only">Find a setting</DialogTitle>
          <div className="flex items-center gap-2 border-b border-edge/6 px-4">
            <SearchIcon aria-hidden="true" className="size-4 shrink-0 text-subtle" />
            <input
              autoFocus
              value={q}
              onChange={(e) => {
                setQ(e.target.value)
                setActive(0)
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault()
                  setActive((a) => Math.min(a + 1, results.length - 1))
                } else if (e.key === "ArrowUp") {
                  e.preventDefault()
                  setActive((a) => Math.max(a - 1, 0))
                } else if (e.key === "Home" && results.length) {
                  e.preventDefault()
                  setActive(0)
                } else if (e.key === "End" && results.length) {
                  e.preventDefault()
                  setActive(results.length - 1)
                } else if (e.key === "Enter" && results[active]) {
                  e.preventDefault()
                  choose(results[active])
                }
              }}
              placeholder={placeholder}
              aria-label="Find a setting"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded="true"
              aria-controls={listId}
              aria-activedescendant={results[active] ? optionId(active) : undefined}
              className="h-12 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-placeholder"
            />
          </div>
          <ul id={listId} role="listbox" aria-label="Settings" className="max-h-80 overflow-y-auto p-1">
            {results.length === 0 && (
              <li role="presentation" className="px-3 py-6 text-center text-[0.8125rem] text-subtle">
                No settings match “{q}”
              </li>
            )}
            {results.map((r, i) => (
              <li
                key={`${r.group}-${r.label}-${i}`}
                id={optionId(i)}
                role="option"
                aria-selected={i === active}
                onMouseMove={() => i !== active && setActive(i)}
                onClick={() => choose(r)}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-4 rounded-md px-3 py-2 text-[0.8125rem]/5",
                  i === active ? "bg-accent text-foreground" : "text-muted-foreground"
                )}
              >
                <span className="truncate">{r.label}</span>
                <span className="shrink-0 text-xs text-placeholder">{r.group}</span>
              </li>
            ))}
          </ul>
        </DialogPanel>
      </DialogContent>
    </Dialog>
  )
}

/* -------------------------------- Sidebar ---------------------------------- */

/** Desktop settings sidebar: a "Find…" box that opens the ⌘K dialog above the grouped, collapsible settings navigation. */
export function SettingsSidebar({
  sections,
  current,
  onNavigate,
  label,
  shortcut = true,
  className,
}: {
  sections: SettingsNavSection[]
  current?: string
  onNavigate?: NavigateHandler
  label?: string
  /** Listen for ⌘K / Ctrl+K on the window to open the find dialog. */
  shortcut?: boolean
  className?: string
}) {
  const [findOpen, setFindOpen] = useState(false)

  useEffect(() => {
    if (!shortcut) return
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setFindOpen(true)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [shortcut])

  return (
    <aside data-slot="settings-sidebar" className={cn("max-lg:hidden lg:w-58 lg:flex-none", className)}>
      <button
        type="button"
        onClick={() => setFindOpen(true)}
        aria-haspopup="dialog"
        aria-keyshortcuts={shortcut ? "Meta+K Control+K" : undefined}
        className="mb-7 flex w-full items-center justify-between rounded-md bg-field px-2.5 text-[0.8125rem] text-placeholder shadow-control transition outline-none hover:shadow-control-hover focus-visible:outline-3 focus-visible:outline-brand/40"
      >
        <span className="flex items-center">
          <SearchIcon aria-hidden="true" className="size-4 text-subtle" />
          <span className="px-2.5 py-1.5">Find...</span>
        </span>
        {shortcut && (
          <KbdGroup aria-hidden="true" className="-mr-1 gap-0.5">
            <Kbd className="text-sm leading-none">⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        )}
      </button>
      <SettingsNav sections={sections} current={current} onNavigate={onNavigate} label={label} />
      <SettingsFindDialog
        sections={sections}
        open={findOpen}
        onOpenChange={setFindOpen}
        onSelect={onNavigate ? (link) => onNavigate({ label: link.label, href: link.href }) : undefined}
      />
    </aside>
  )
}

/** Below lg: a menu button with the current section name that slides the same navigation in from the left. */
export function SettingsMobileNav({
  sections,
  current,
  currentLabel,
  onNavigate,
  label,
  className,
}: {
  sections: SettingsNavSection[]
  current?: string
  /** Shown next to the menu button, usually the current page title. */
  currentLabel: string
  onNavigate?: NavigateHandler
  label?: string
  className?: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <aside data-slot="settings-mobile-nav" className={cn("lg:hidden", className)}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger aria-label={`Open settings navigation, current page ${currentLabel}`} className="flex items-center gap-4 rounded-md outline-none focus-visible:outline-3 focus-visible:outline-brand/40">
          <span className="flex size-8 items-center justify-center rounded-md bg-surface text-subtle shadow-control">
            <MenuIcon aria-hidden="true" className="size-4" />
          </span>
          <span className="text-[0.8125rem] font-medium text-subtle">{currentLabel}</span>
        </SheetTrigger>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="gap-0 border-0 bg-surface p-0 text-foreground data-[side=left]:w-[96vw] data-[side=left]:max-w-80 data-[side=left]:border-r-0 data-[side=left]:sm:max-w-80"
        >
          <SheetTitle className="sr-only">Settings navigation</SheetTitle>
          <div className="h-full overflow-y-auto overscroll-contain p-6">
            <SettingsNav
              sections={sections}
              current={current}
              label={label}
              onNavigate={(link, e) => {
                onNavigate?.(link, e)
                setOpen(false)
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
    </aside>
  )
}

/* ---------------------------------- Demo ----------------------------------- */

const demoSections: SettingsNavSection[] = [
  {
    title: "Configure",
    items: [
      {
        label: "User & authentication",
        icon: <FingerprintIcon strokeWidth={1.5} />,
        children: [
          { label: "Sign-in methods", href: "#sign-in-methods" },
          { label: "SSO connections", href: "#sso" },
          { label: "Multi-factor", href: "#multi-factor" },
          { label: "Access mode", href: "#access-mode" },
          { label: "Legal", href: "#legal" },
        ],
      },
      { label: "Agents", icon: <BotIcon strokeWidth={1.5} />, children: [{ label: "MCP servers", href: "#mcp" }, { label: "Feedback", href: "#feedback" }] },
      { label: "Sessions", icon: <BoxIcon strokeWidth={1.5} />, children: [{ label: "Sessions", href: "#sessions" }, { label: "Token templates", href: "#tokens" }] },
      { label: "Organizations", icon: <Building2Icon strokeWidth={1.5} />, children: [{ label: "Settings", href: "#org-settings" }, { label: "Roles & permissions", href: "#roles" }] },
      { label: "Billing", icon: <ReceiptIcon strokeWidth={1.5} />, children: [{ label: "Settings", href: "#billing-settings" }, { label: "Plans", href: "#plans" }, { label: "Discounts", href: "#discounts" }] },
      { label: "Protect", icon: <ShieldCheckIcon strokeWidth={1.5} />, children: [{ label: "Protections", href: "#protections" }, { label: "Blocklist", href: "#blocklist" }] },
      { label: "Account portal", icon: <PanelsTopLeftIcon strokeWidth={1.5} />, href: "#portal" },
      { label: "Features", icon: <LayoutGridIcon strokeWidth={1.5} />, href: "#features" },
      { label: "Customization", icon: <BrushIcon strokeWidth={1.5} />, children: [{ label: "Avatars", href: "#avatars" }, { label: "Emails", href: "#emails" }, { label: "SMS", href: "#sms" }] },
      {
        label: "Developers",
        icon: <CodeIcon strokeWidth={1.5} />,
        children: [
          { label: "Webhooks", href: "#webhooks" },
          { label: "Domains", href: "#domains" },
          { label: "API keys", href: "#api-keys" },
          { label: "OAuth applications", href: "#oauth" },
          { label: "Integrations", href: "#integrations" },
        ],
      },
    ],
  },
  {
    title: "Environment",
    items: [
      { label: "Settings", icon: <SettingsIcon strokeWidth={1.5} />, href: "#environment-settings" },
      { label: "Updates", icon: <UploadIcon strokeWidth={1.5} />, href: "#updates" },
    ],
  },
  { title: "Application", items: [{ label: "Settings", icon: <SettingsIcon strokeWidth={1.5} />, href: "#application-settings" }] },
]

export default function SettingsSidebarDemo() {
  const [current, setCurrent] = useState("#sign-in-methods")
  const title = flatten(demoSections).find((l) => l.href === current)?.label ?? "Settings"
  const navigate: NavigateHandler = (link, e) => {
    e?.preventDefault()
    setCurrent(link.href)
  }

  return (
    <div className="mx-auto w-[calc(100%-2.5rem)] max-w-6xl pt-8 pb-10 lg:pt-10">
      <div className="flex gap-4 max-lg:flex-col lg:gap-10">
        <SettingsSidebar sections={demoSections} current={current} onNavigate={navigate} />
        <SettingsMobileNav sections={demoSections} current={current} currentLabel={title} onNavigate={navigate} />
        <main className="min-w-0 flex-1">
          <h1 className="text-xl/7 font-semibold tracking-[-0.015em] text-foreground">{title}</h1>
          <p className="mt-1 text-sm text-subtle">Press ⌘K to jump to any setting.</p>
          <div className="mt-8 h-72 rounded-xl bg-surface shadow-card" />
        </main>
      </div>
    </div>
  )
}
