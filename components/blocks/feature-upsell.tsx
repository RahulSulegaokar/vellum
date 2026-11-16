"use client"

import { useState } from "react"
import { BookOpenIcon, Building2Icon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, EyeIcon } from "lucide-react"
import { EmptyState } from "@/components/blocks/empty-state"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type UpsellFeature = {
  id: string
  title: string
  description: string
  /** Illustration for the 244×151 card; `active` is true for the centered card. */
  art?: (active: boolean) => React.ReactNode
}

const STEP = 264 // card width (244) + gap (20)
const CARD_W = 244

/* -------------------------------- Carousel --------------------------------- */

function FeatureCard({ feature, offset, onSelect }: { feature: UpsellFeature; offset: number; onSelect: () => void }) {
  const active = offset === 0
  const hidden = Math.abs(offset) > 1
  return (
    <div
      className="absolute top-0 left-1/2 h-37.75 w-61 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none"
      style={{ transform: `translate3d(${offset * STEP - CARD_W / 2}px,0,0)`, opacity: hidden ? 0 : 1 }}
      onClick={active || hidden ? undefined : onSelect}
    >
      <div className={cn("relative isolate size-full rounded-xl", !active && !hidden && "cursor-pointer")}>
        <div className="absolute inset-0 overflow-hidden rounded-xl bg-surface ring-1 ring-edge/6">{feature.art?.(false)}</div>
        <div className={cn("absolute inset-0 transition-opacity motion-reduce:transition-none", active ? "opacity-100 duration-[360ms]" : "opacity-0 duration-[140ms]")}>
          <div className="pointer-events-none absolute inset-0 rounded-xl bg-surface shadow-card ring-1 ring-edge/6" />
          <div className="absolute inset-0 overflow-hidden rounded-xl bg-surface">{feature.art?.(true)}</div>
        </div>
        <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 rounded-xl bg-linear-to-l from-surface/25 via-surface/90 to-surface transition-opacity duration-140", offset < 0 ? "opacity-100" : "opacity-0")} />
        <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 rounded-xl bg-linear-to-r from-surface/25 via-surface/90 to-surface transition-opacity duration-140", offset > 0 ? "opacity-100" : "opacity-0")} />
      </div>
    </div>
  )
}

function ArrowButton({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  const Icon = dir === "prev" ? ChevronLeftIcon : ChevronRightIcon
  return (
    <Button type="button" variant="elevated" size="icon-compact" aria-label={dir === "prev" ? "Previous feature" : "Next feature"} onClick={onClick}>
      <Icon aria-hidden="true" className="text-subtle" />
    </Button>
  )
}

/** Looping card carousel: neighbours peek and fade at the sides, title and description update below, arrows or ←/→ step. */
export function FeatureCarousel({
  features,
  label,
  initialIndex = 0,
  action,
}: {
  features: UpsellFeature[]
  /** Accessible name for the carousel group. */
  label: string
  initialIndex?: number
  /** The main call to action, rendered between the phone-size arrows. */
  action?: React.ReactNode
}) {
  // `pos` is unbounded so cards keep stable keys and slide instead of jumping.
  const [pos, setPos] = useState(initialIndex)
  const n = features.length
  const at = (k: number) => features[((k % n) + n) % n]
  const current = at(pos)
  const prev = () => setPos((p) => p - 1)
  const next = () => setPos((p) => p + 1)
  if (!n) return null

  return (
    <div
      className="flex w-full flex-col items-center"
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") prev()
        if (e.key === "ArrowRight") next()
      }}
    >
      <div aria-hidden="true" className="relative h-37.75 w-full transform-gpu overflow-x-clip">
        {[-2, -1, 0, 1, 2].map((o) => {
          const k = pos + o
          return <FeatureCard key={k} feature={at(k)} offset={o} onSelect={() => setPos(k)} />
        })}
      </div>

      <div className="relative mt-6 flex w-full max-w-118.5 flex-col items-center px-10 text-center sm:px-12">
        <div className="flex flex-col items-center gap-1" aria-live="polite">
          <h3 className="w-full text-[0.9375rem]/5 font-semibold text-foreground">{current.title}</h3>
          <p className="w-full max-w-91.5 text-[0.8125rem]/[1.125rem] text-pretty text-subtle">{current.description}</p>
        </div>
        <div className="absolute top-1/2 left-0 hidden -translate-y-1/2 sm:block"><ArrowButton dir="prev" onClick={prev} /></div>
        <div className="absolute top-1/2 right-0 hidden -translate-y-1/2 sm:block"><ArrowButton dir="next" onClick={next} /></div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="sm:hidden"><ArrowButton dir="prev" onClick={prev} /></div>
        {action}
        <div className="sm:hidden"><ArrowButton dir="next" onClick={next} /></div>
      </div>
    </div>
  )
}

/* ---------------------------------- Page ----------------------------------- */

/**
 * "Turn on a feature" panel: a feature carousel with illustrations and an enable button,
 * which swaps to an empty state with a turn-off action once enabled. Footer links to a video and docs.
 */
export function FeatureUpsell({
  features,
  label = "Feature highlights",
  enableLabel = "Enable feature",
  disableLabel = "Turn off",
  enabled: enabledProp,
  defaultEnabled = false,
  onEnabledChange,
  enabledTitle = "Nothing here yet",
  enabledDescription,
  enabledIcon,
  videoHref,
  docsHref,
  className,
}: {
  features: UpsellFeature[]
  label?: string
  enableLabel?: string
  disableLabel?: string
  enabled?: boolean
  defaultEnabled?: boolean
  onEnabledChange?: (enabled: boolean) => void
  enabledTitle?: string
  enabledDescription?: React.ReactNode
  enabledIcon?: React.ReactNode
  videoHref?: string
  docsHref?: string
  className?: string
}) {
  const [internal, setInternal] = useState(defaultEnabled)
  const enabled = enabledProp ?? internal
  const set = (on: boolean) => {
    if (enabledProp === undefined) setInternal(on)
    onEnabledChange?.(on)
  }

  return (
    <section data-slot="feature-upsell" className={cn("flex flex-col rounded-2xl bg-surface-muted py-1", className)}>
      <div className="mx-1 flex flex-col items-center overflow-hidden rounded-xl bg-surface py-12 shadow-card ring-1 ring-edge/4">
        {enabled ? (
          <EmptyState
            className="p-0 px-6"
            icon={enabledIcon}
            title={enabledTitle}
            description={enabledDescription}
            actions={<Button type="button" variant="elevated" size="compact" onClick={() => set(false)}>{disableLabel}</Button>}
          />
        ) : (
          <FeatureCarousel
            features={features}
            label={label}
            action={<Button type="button" variant="primary" size="compact" onClick={() => set(true)}>{enableLabel}</Button>}
          />
        )}
      </div>
      {(videoHref || docsHref) && (
        <footer className="flex items-center justify-between gap-4 px-5 pt-4 pb-3 text-[0.8125rem]/[1.125rem] text-subtle">
          {videoHref ? (
            <span className="inline-flex items-center gap-1.5">
              <EyeIcon aria-hidden="true" className="size-4" />
              <span>
                Watch the{" "}
                <a href={videoHref} className="font-medium text-foreground underline decoration-edge/20 underline-offset-2 hover:decoration-edge/60">video</a>
              </span>
            </span>
          ) : <span />}
          {docsHref && (
            <a href={docsHref} className="inline-flex items-center gap-1.5 rounded-sm font-medium transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand/40">
              <BookOpenIcon aria-hidden="true" className="size-4" />
              View docs
            </a>
          )}
        </footer>
      )}
    </section>
  )
}

/* ------------------------------ Demo artwork ------------------------------- */

const tile = "shadow-surface ring-1 ring-hairline"
const tiny = "text-[0.4375rem]/[0.6875rem] font-medium"
const people = ["text-chart-1", "text-chart-3", "text-chart-2", "text-chart-4"]

/** Head-and-shoulders figure that fills its box, drawn in currentColor. */
function Person({ tone, muted }: { tone: string; muted?: boolean }) {
  return (
    <svg viewBox="0 0 40 46" className={cn("absolute inset-x-0 bottom-0 mx-auto h-[86%]", muted ? "text-border" : tone)} aria-hidden="true">
      <circle cx="20" cy="17" r="8.5" fill="currentColor" opacity={muted ? 1 : 0.9} />
      <path d="M3 46c0-9.5 7.6-16 17-16s17 6.5 17 16Z" fill="currentColor" opacity={muted ? 0.7 : 0.55} />
    </svg>
  )
}

function RolesArt({ on }: { on: boolean }) {
  return (
    <div className="absolute top-6 left-6 flex flex-col gap-4">
      <div className="flex h-17 gap-2.5">
        {people.map((t, i) => (
          <div key={t} className={cn("relative h-17 w-14.75 flex-none rounded-md bg-surface p-0.75", tile)}>
            <div className={cn("relative size-full overflow-hidden rounded-sm ring-1 ring-edge/6", i === 0 && on ? "bg-brand/12" : "bg-surface-muted", i > 0 && "opacity-70")}>
              <Person tone={t} muted={i === 0 ? !on : false} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {["Member", "Admin", "Editor", "QA Tester"].map((r) => (
          <div key={r} className={cn("flex h-4.75 items-center rounded-full px-2", r === "Admin" ? (on ? "bg-foreground text-background" : "bg-subtle text-background") : "bg-surface-muted text-muted-foreground ring-1 ring-edge/10")}>
            <p className={tiny}>{r}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function InvitesArt({ on }: { on: boolean }) {
  const spots: [number, number][] = [[3, 5], [3, 79], [66, -27], [66, 47], [66, 121], [129, 5], [129, 79], [192, -27], [192, 47], [192, 121]]
  return (
    <>
      {spots.map(([x, y]) => (
        <div key={`${x}-${y}`} className="absolute h-16.5 w-13.75 rounded-lg bg-surface p-0.75 ring-1 ring-edge/6" style={{ left: x, top: y }}>
          <div className="relative size-full overflow-hidden rounded-md bg-surface-muted"><Person tone="" muted /></div>
        </div>
      ))}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(96%_96%_at_52%_74%,transparent_0%,var(--surface)_83%)]" />
      <div className="absolute top-10.5 left-1/2 h-16.5 w-13.75 -translate-x-1/2">
        <div className={cn("absolute -inset-0.5 rounded-xl opacity-60 blur-xs", on ? "bg-linear-to-br from-chart-1 to-chart-3" : "bg-border")} />
        <div className="absolute inset-0 rounded-lg bg-surface shadow-surface ring-1 ring-edge/6" />
        <div className={cn("absolute inset-0.5 overflow-hidden rounded-md ring-1 ring-edge/10", on ? "bg-chart-3/12" : "bg-surface-muted")}>
          <Person tone="text-chart-3" muted={!on} />
        </div>
        <span className={cn("absolute top-1.5 right-1.5 size-2.25 rounded-full", on ? "bg-brand" : "bg-placeholder")} />
      </div>
    </>
  )
}

function TenantsArt({ on }: { on: boolean }) {
  const minis = [
    { pos: "top-17.75 left-7.75", tone: people[0], lead: true },
    { pos: "-top-1.5 left-36.75", tone: people[1] },
    { pos: "top-23.5 left-44.75", tone: people[2] },
  ]
  return (
    <>
      {["size-30", "size-46", "size-62.25"].map((s) => (
        <div key={s} className={cn("absolute top-1/2 left-1/2 -translate-1/2 rounded-full border border-border", s)} />
      ))}
      {minis.map((m) => (
        <div key={m.pos} className={cn("absolute h-11.5 w-10 rounded-md bg-surface p-0.5", m.pos, tile)}>
          <div className={cn("relative size-full overflow-hidden rounded-sm ring-1 ring-edge/6", m.lead && on ? "bg-brand/12" : "bg-surface-muted", !m.lead && "opacity-60")}>
            <Person tone={m.tone} muted={m.lead && !on} />
          </div>
        </div>
      ))}
      <div className="absolute top-11.75 left-23.5 flex size-14 items-center justify-center rounded-full bg-subtle/4 ring-1 ring-border ring-inset">
        <Building2Icon aria-hidden="true" className="size-5 text-foreground" strokeWidth={1.5} />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(85%_85%_at_50%_61%,transparent_46%,color-mix(in_oklab,var(--surface)_80%,transparent)_79%)]" />
    </>
  )
}

function SwitcherArt({ on }: { on: boolean }) {
  const rows = [
    { name: "Northwind", role: "Member", dot: "bg-brand" },
    { name: "Greenleaf", role: "Admin", dot: "bg-green-600" },
    { name: "Personal account", dot: "bg-chart-2" },
  ]
  return (
    <>
      <div className={cn("absolute top-6 left-6 flex items-center gap-1 rounded-sm bg-surface px-1.5 py-0.75", tile)}>
        <span className="size-2.25 rounded-xs bg-foreground" />
        <p className={cn(tiny, "text-foreground")}>Acme Apps</p>
        <ChevronDownIcon aria-hidden="true" className="size-2 text-placeholder" />
      </div>
      <div className="absolute top-12.25 left-6 flex h-44 w-49 flex-col overflow-hidden rounded-md bg-surface-muted pb-3 shadow-popover ring-1 ring-hairline">
        <div className="flex flex-col overflow-hidden rounded-md bg-surface shadow-surface">
          {rows.map((r) => (
            <div key={r.name} className="flex items-center gap-2 border-b border-edge/6 p-1.5 pr-3">
              <div className={cn("flex size-7 items-center justify-center rounded-sm bg-surface", tile)}>
                <span className={cn("size-3 rounded-full", on ? r.dot : "bg-border")} />
              </div>
              <div className="flex flex-col text-[0.4375rem]/[0.6875rem] whitespace-nowrap">
                <p className="font-medium text-foreground">{r.name}</p>
                {r.role && <p className="text-placeholder">{r.role}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(92%_92%_at_50%_25%,transparent_46%,color-mix(in_oklab,var(--surface)_80%,transparent)_79%)]" />
    </>
  )
}

const demoFeatures: UpsellFeature[] = [
  { id: "roles", title: "Roles and permissions built in", description: "Give members roles like admin or editor and decide exactly what each one can do", art: (on) => <RolesArt on={on} /> },
  { id: "invites", title: "Team invitations included", description: "Members bring in teammates by email, and new people join with a single click", art: (on) => <InvitesArt on={on} /> },
  { id: "tenants", title: "Multi-tenancy out of the box", description: "People can spin up workspaces, add their team and control access without a custom backend", art: (on) => <TenantsArt on={on} /> },
  { id: "switcher", title: "A ready-made workspace switcher", description: "Prebuilt components let people hop between workspaces and their personal account", art: (on) => <SwitcherArt on={on} /> },
]

export default function FeatureUpsellDemo() {
  return (
    <div className="mx-auto max-w-5xl p-6 sm:p-10">
      <FeatureUpsell
        features={demoFeatures}
        label="Workspace features"
        enableLabel="Enable workspaces"
        disableLabel="Turn off workspaces"
        enabledTitle="No workspaces yet"
        enabledDescription="Workspaces are on. Ones your users create will show up here."
        enabledIcon={<Building2Icon className="size-5 text-subtle" />}
        videoHref="#"
        docsHref="#"
      />
    </div>
  )
}
