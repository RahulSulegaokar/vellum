"use client"

import { useState } from "react"
import { BookOpenIcon } from "lucide-react"
import { Callout } from "@/components/blocks/callout"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

export type Integration = {
  id: string
  name: string
  /** Secondary line under the name, usually the partner's domain. */
  domain?: string
  description: string
  icon: React.ReactNode
  docsHref?: string
  /** "switch" toggles in place; "connect" shows a Connect / Connected button. */
  action?: "switch" | "connect"
}

/** One integration: icon tile, name and domain, a switch or connect button, description and a docs link. */
export function IntegrationCard({
  item,
  enabled,
  onEnabledChange,
}: {
  item: Integration
  enabled: boolean
  onEnabledChange: (enabled: boolean) => void
}) {
  const nameId = `integration-${item.id}-name`
  return (
    <section data-slot="integration-card" className="flex flex-col rounded-2xl bg-surface-muted py-1">
      <div className="mx-1 grow overflow-hidden rounded-xl bg-surface shadow-card ring-1 ring-edge/4">
        <div className="space-y-5 px-5 py-6">
          <header className="flex w-full items-center gap-4">
            <span className="relative flex size-10 shrink-0 items-center justify-center overflow-clip rounded-md bg-surface after:absolute after:inset-0 after:rounded-md after:ring-1 after:ring-edge/12 after:ring-inset">
              {item.icon}
            </span>
            <div className="flex w-full min-w-0 items-center justify-between gap-3">
              <div className="flex min-w-0 flex-col">
                <h3 id={nameId} className="truncate text-[0.8125rem]/5 font-medium text-foreground">{item.name}</h3>
                {item.domain && <span className="truncate text-xs/4 text-placeholder">{item.domain}</span>}
              </div>
              {item.action === "connect" ? (
                <Button
                  variant={enabled ? "elevated" : "primary"}
                  size="compact-sm"
                  aria-describedby={nameId}
                  aria-pressed={enabled}
                  onClick={() => onEnabledChange(!enabled)}
                >
                  {enabled ? "Connected" : "Connect"}
                </Button>
              ) : (
                <Switch checked={enabled} onCheckedChange={onEnabledChange} aria-labelledby={nameId} className="top-px" />
              )}
            </div>
          </header>
          <p className="text-[0.8125rem]/5 text-pretty text-subtle">{item.description}</p>
        </div>
      </div>
      {item.docsHref && (
        <footer className="px-5 py-2">
          <a href={item.docsHref} className="inline-flex items-center gap-1 rounded-sm text-xs/4 font-medium text-subtle transition outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand/40">
            Read documentation
            <BookOpenIcon aria-hidden="true" className="size-3.5" />
          </a>
        </footer>
      )}
    </section>
  )
}

/**
 * Responsive grid of integration cards with an optional "request an integration" callout.
 * Pass `value`/`onValueChange` to control which items are on; otherwise state is kept internally.
 */
export function IntegrationCards({
  items,
  value,
  defaultValue = {},
  onValueChange,
  requestHref,
  requestText = "Missing a service you rely on? Let us know.",
  requestLabel = "Request integration",
  className,
}: {
  items: Integration[]
  value?: Record<string, boolean>
  defaultValue?: Record<string, boolean>
  onValueChange?: (value: Record<string, boolean>) => void
  requestHref?: string
  requestText?: string
  requestLabel?: string
  className?: string
}) {
  const [internal, setInternal] = useState(defaultValue)
  const state = value ?? internal
  const set = (id: string, on: boolean) => {
    const next = { ...state, [id]: on }
    if (value === undefined) setInternal(next)
    onValueChange?.(next)
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <IntegrationCard key={item.id} item={item} enabled={!!state[item.id]} onEnabledChange={(on) => set(item.id, on)} />
        ))}
      </div>
      {requestHref && (
        <Callout>
          {requestText}{" "}
          <a href={requestHref} className="rounded-sm font-medium text-foreground underline decoration-edge/20 underline-offset-2 outline-none hover:decoration-edge/60 focus-visible:ring-2 focus-visible:ring-brand/40">
            {requestLabel}
          </a>
        </Callout>
      )}
    </div>
  )
}

/* ---------------------------------- Demo ----------------------------------- */

/* Placeholder partners with original marks drawn in chart tokens. */
const demoItems: Integration[] = [
  {
    id: "tidepool",
    name: "Tidepool",
    domain: "tidepool.example",
    description: "A hosted Postgres platform with row-level security, instant REST endpoints, file storage and realtime channels. Pass Acme session tokens straight to its policies.",
    docsHref: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true" fill="none" strokeWidth="2.2" strokeLinecap="round">
        <path d="M4 15c2.5-3 5.5-3 8 0s5.5 3 8 0" className="stroke-chart-1" />
        <path d="M4 10c2.5-3 5.5-3 8 0s5.5 3 8 0" className="stroke-chart-3" />
      </svg>
    ),
  },
  {
    id: "fernwave",
    name: "Fernwave",
    domain: "fernwave.example",
    description: "A TypeScript backend with a reactive database, server functions and scheduled jobs. Acme users are available inside every query and mutation.",
    docsHref: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
        <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3Z" className="fill-chart-2" />
        <path d="M12 3v18M4 7.5l16 9M20 7.5l-16 9" className="stroke-surface" strokeOpacity="0.6" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: "lumen",
    name: "Lumen Analytics",
    domain: "lumen.example",
    description: "Product analytics with funnels and retention. Send sign-ups, sign-ins and workspace events without writing a tracking plan.",
    docsHref: "#",
    action: "connect",
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
        <rect x="4" y="12" width="4" height="8" rx="1" className="fill-chart-3" />
        <rect x="10" y="8" width="4" height="12" rx="1" className="fill-chart-2" />
        <rect x="16" y="4" width="4" height="16" rx="1" className="fill-chart-1" />
      </svg>
    ),
  },
  {
    id: "relay",
    name: "Relay Mail",
    domain: "relaymail.example",
    description: "Transactional email delivery. Route verification codes and magic links through your own sending domain.",
    docsHref: "#",
    action: "connect",
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.5" y="6" width="17" height="12" rx="2.5" className="stroke-chart-4" />
        <path d="m4.5 7.5 7.5 5.5 7.5-5.5" className="stroke-chart-1" />
      </svg>
    ),
  },
]

export default function IntegrationCardsDemo() {
  return (
    <div className="mx-auto max-w-5xl p-6 sm:p-10">
      <IntegrationCards items={demoItems} defaultValue={{ tidepool: true }} requestHref="mailto:support@acme.example?subject=Integration%20request" />
    </div>
  )
}
