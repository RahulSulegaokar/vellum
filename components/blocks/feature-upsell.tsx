"use client"

import { useState } from "react"
import { BookOpenIcon, ChevronLeftIcon, ChevronRightIcon, EyeIcon } from "lucide-react"
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

/** Built-in strings of FeatureUpsell and FeatureCarousel; pass `labels` to translate them. */
export const featureUpsellLabels = {
  carousel: "carousel",
  previousFeature: "Previous feature",
  nextFeature: "Next feature",
}
export type FeatureUpsellLabels = typeof featureUpsellLabels

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

function ArrowButton({ dir, onClick, t }: { dir: "prev" | "next"; onClick: () => void; t: FeatureUpsellLabels }) {
  const Icon = dir === "prev" ? ChevronLeftIcon : ChevronRightIcon
  return (
    <Button type="button" variant="elevated" size="icon-compact" aria-label={dir === "prev" ? t.previousFeature : t.nextFeature} onClick={onClick}>
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
  labels,
}: {
  features: UpsellFeature[]
  /** Accessible name for the carousel group. */
  label: string
  initialIndex?: number
  /** The main call to action, rendered between the phone-size arrows. */
  action?: React.ReactNode
  /** Translations of the built-in strings (English by default). */
  labels?: Partial<FeatureUpsellLabels>
}) {
  const t = { ...featureUpsellLabels, ...labels }
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
      aria-roledescription={t.carousel}
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
        <div className="absolute top-1/2 left-0 hidden -translate-y-1/2 sm:block"><ArrowButton dir="prev" onClick={prev} t={t} /></div>
        <div className="absolute top-1/2 right-0 hidden -translate-y-1/2 sm:block"><ArrowButton dir="next" onClick={next} t={t} /></div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="sm:hidden"><ArrowButton dir="prev" onClick={prev} t={t} /></div>
        {action}
        <div className="sm:hidden"><ArrowButton dir="next" onClick={next} t={t} /></div>
      </div>
    </div>
  )
}

/* ---------------------------------- Page ----------------------------------- */

/**
 * "Turn on a feature" panel: a feature carousel with illustrations and an enable button,
 * which swaps to an empty state with a turn-off action once enabled. Footer links to a video and docs.
 * Footer links render through `linkComponent` (default `"a"`); pass your router's `Link`, e.g. Inertia's.
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
  videoLabel = "Watch the video",
  docsLabel = "View docs",
  linkComponent,
  labels,
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
  videoLabel?: string
  docsLabel?: string
  /** Component used for links; defaults to `"a"`. */
  linkComponent?: React.ElementType
  /** Translations of the built-in strings (English by default). */
  labels?: Partial<FeatureUpsellLabels>
  className?: string
}) {
  const Link = linkComponent ?? "a"
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
            labels={labels}
            action={<Button type="button" variant="primary" size="compact" onClick={() => set(true)}>{enableLabel}</Button>}
          />
        )}
      </div>
      {(videoHref || docsHref) && (
        <footer className="flex items-center justify-between gap-4 px-5 pt-4 pb-3 text-[0.8125rem]/[1.125rem] text-subtle">
          {videoHref ? (
            <Link href={videoHref} className="inline-flex items-center gap-1.5 rounded-sm font-medium transition-colors outline-none hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[--tw-outline-style:solid] focus-visible:outline-ring">
              <EyeIcon aria-hidden="true" className="size-4" />
              {videoLabel}
            </Link>
          ) : <span />}
          {docsHref && (
            <Link href={docsHref} className="inline-flex items-center gap-1.5 rounded-sm font-medium transition-colors outline-none hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[--tw-outline-style:solid] focus-visible:outline-ring">
              <BookOpenIcon aria-hidden="true" className="size-4" />
              {docsLabel}
            </Link>
          )}
        </footer>
      )}
    </section>
  )
}
