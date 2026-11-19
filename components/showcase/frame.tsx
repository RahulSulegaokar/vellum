"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * One component on the showcase page: its name, install address, when to use it, the variants and states the
 * demo covers, and the demo itself rendered twice, in the page theme and inside a `.dark` panel.
 * Overlays (dialogs, menus, tooltips…) portal to <body>, so they follow the page theme whichever side opens them.
 */
export function Showcase({
  id,
  title,
  summary,
  covers,
  install = id,
  stacked = false,
  children,
}: {
  /** Registry item name; also the anchor id. */
  id: string
  title: string
  /** When to use it, one or two sentences. */
  summary: string
  /** Variants, sizes and states the demo shows. */
  covers: string[]
  /** Registry item to install, when it differs from `id`. */
  install?: string
  /** Put the light and dark panels under each other (wide demos such as tables, sidebars, charts). */
  stacked?: boolean
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        <code className="font-mono text-xs text-subtle">npx shadcn@latest add RahulSulegaokar/vellum/{install}</code>
      </div>
      <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{summary}</p>
      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Covered variants and states">
        {covers.map((c) => (
          <li key={c} className="rounded-sm bg-surface px-1.5 py-0.5 text-xs text-muted-foreground ring-1 ring-hairline">
            {c}
          </li>
        ))}
      </ul>
      <div className={cn("mt-4 grid gap-4", !stacked && "xl:grid-cols-2")}>
        <Panel label="Page theme">{children}</Panel>
        <Panel label="Dark" dark>
          {children}
        </Panel>
      </div>
    </section>
  )
}

function Panel({ label, dark, children }: { label: string; dark?: boolean; children: React.ReactNode }) {
  return (
    <div className={cn("min-w-0 rounded-2xl bg-background p-4 text-foreground ring-1 ring-hairline sm:p-6", dark && "dark")}>
      <p className="mb-4 text-xs font-medium text-subtle">{label}</p>
      <div className="flex flex-col gap-6">{children}</div>
    </div>
  )
}

/** A labelled row of examples inside a showcase panel ("Variants", "Sizes", "States"…). */
export function Demo({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-[0.6875rem] font-medium tracking-wide text-subtle uppercase">{label}</p>
      <div className={cn("flex flex-wrap items-center gap-3", className)}>{children}</div>
    </div>
  )
}

/** Heading for a group of showcase sections. */
export function GroupHeading({ id, title, children }: { id: string; title: string; children?: React.ReactNode }) {
  return (
    <div id={id} className="scroll-mt-6 border-t border-border pt-10">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      {children && <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{children}</p>}
    </div>
  )
}
