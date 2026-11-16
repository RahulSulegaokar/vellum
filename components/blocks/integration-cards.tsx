"use client"

import { useId, useState } from "react"
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

/**
 * One integration: icon tile, name and domain, a switch or connect button, description and a docs link.
 * The docs link renders through `linkComponent` (default `"a"`); pass your router's `Link`, e.g. Inertia's.
 */
export function IntegrationCard({
  item,
  enabled,
  onEnabledChange,
  connectLabel = "Connect",
  connectedLabel = "Connected",
  docsLabel = "Read documentation",
  linkComponent,
}: {
  item: Integration
  enabled: boolean
  onEnabledChange: (enabled: boolean) => void
  connectLabel?: string
  connectedLabel?: string
  docsLabel?: string
  /** Component used for links; defaults to `"a"`. */
  linkComponent?: React.ElementType
}) {
  const nameId = useId()
  const Link = linkComponent ?? "a"
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
                  {enabled ? connectedLabel : connectLabel}
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
          <Link href={item.docsHref} className="inline-flex items-center gap-1 rounded-sm text-xs/4 font-medium text-subtle transition outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand/40">
            {docsLabel}
            <span className="sr-only">: {item.name}</span>
            <BookOpenIcon aria-hidden="true" className="size-3.5" />
          </Link>
        </footer>
      )}
    </section>
  )
}

/**
 * Responsive grid of integration cards with an optional "request an integration" callout.
 * Pass `value`/`onValueChange` to control which items are on; otherwise state is kept internally.
 * Links render through `linkComponent` (default `"a"`); pass your router's `Link`, e.g. Inertia's.
 */
export function IntegrationCards({
  items,
  value,
  defaultValue = {},
  onValueChange,
  requestHref,
  requestText = "Missing a service you rely on? Let us know.",
  requestLabel = "Request integration",
  linkComponent,
  className,
}: {
  items: Integration[]
  value?: Record<string, boolean>
  defaultValue?: Record<string, boolean>
  onValueChange?: (value: Record<string, boolean>) => void
  requestHref?: string
  requestText?: string
  requestLabel?: string
  /** Component used for links; defaults to `"a"`. */
  linkComponent?: React.ElementType
  className?: string
}) {
  const Link = linkComponent ?? "a"
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
          <IntegrationCard key={item.id} item={item} enabled={!!state[item.id]} onEnabledChange={(on) => set(item.id, on)} linkComponent={linkComponent} />
        ))}
      </div>
      {requestHref && (
        <Callout>
          {requestText}{" "}
          <Link href={requestHref} className="rounded-sm font-medium text-foreground underline decoration-edge/20 underline-offset-2 outline-none hover:decoration-edge/60 focus-visible:ring-2 focus-visible:ring-brand/40">
            {requestLabel}
          </Link>
        </Callout>
      )}
    </div>
  )
}
