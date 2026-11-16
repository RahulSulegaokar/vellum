"use client"

import { Building2Icon, ChevronDownIcon } from "lucide-react"
import { FeatureUpsell, type UpsellFeature } from "@/components/blocks/feature-upsell"
import { cn } from "@/lib/utils"

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
    { name: "Greenleaf", role: "Admin", dot: "bg-chart-3" },
    { name: "Personal", dot: "bg-chart-2" },
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

const features: UpsellFeature[] = [
  { id: "roles", title: "A role for every teammate", description: "Make someone an admin or an editor and choose what each role can change", art: (on) => <RolesArt on={on} /> },
  { id: "invites", title: "Invite by email", description: "Send a link and new teammates join with one click", art: (on) => <InvitesArt on={on} /> },
  { id: "tenants", title: "A space for each team", description: "Keep every team's projects, people and settings apart", art: (on) => <TenantsArt on={on} /> },
  { id: "switcher", title: "Switch in one click", description: "Move between teams and your personal space from the header", art: (on) => <SwitcherArt on={on} /> },
]

export default function FeatureUpsellExample() {
  return (
    <div className="mx-auto max-w-5xl p-6 sm:p-10">
      <FeatureUpsell
        features={features}
        label="Team features"
        enableLabel="Turn on teams"
        disableLabel="Turn off teams"
        enabledTitle="No teams yet"
        enabledDescription="Teams are on. Teams your users create will show up here."
        enabledIcon={<Building2Icon className="size-5 text-subtle" />}
        videoHref="#video"
        docsHref="#docs"
      />
    </div>
  )
}
