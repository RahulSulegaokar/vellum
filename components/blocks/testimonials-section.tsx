"use client"

/** Testimonials section: heading, a rotating featured quote and a grid of quote cards. */

import * as React from "react"
import { QuoteIcon } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export type Testimonial = { quote: string; name: string; role: string }

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)"

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION)
  mq.addEventListener("change", cb)
  return () => mq.removeEventListener("change", cb)
}

/** True when the viewer asked for reduced motion; false during server render. */
function usePrefersReducedMotion() {
  return React.useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false
  )
}

const avatarTints = [
  "bg-brand text-brand-foreground",
  "bg-solid text-solid-foreground",
  "bg-accent text-foreground",
  "bg-foreground text-background",
  "bg-muted text-muted-foreground",
]

const initials = (name: string) =>
  name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)

function InitialsAvatar({ name, index, className }: { name: string; index: number; className?: string }) {
  return (
    <Avatar aria-hidden="true" className={className}>
      <AvatarFallback className={cn("text-[0.6875rem] font-medium", avatarTints[index % avatarTints.length])}>{initials(name)}</AvatarFallback>
    </Avatar>
  )
}

/** Stacked quotes in one grid cell; the active one sweeps in. Pauses on hover/focus and stays still under reduced motion. */
export function FeaturedQuotes({ quotes, interval = 6000, className }: { quotes: Testimonial[]; interval?: number; className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [active, setActive] = React.useState(0)
  const [paused, setPaused] = React.useState(false)

  React.useEffect(() => {
    if (reduced || paused || quotes.length < 2) return
    const id = setInterval(() => setActive((a) => (a + 1) % quotes.length), interval)
    return () => clearInterval(id)
  }, [reduced, paused, quotes.length, interval])

  return (
    <div
      className={cn("max-w-86", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <QuoteIcon aria-hidden="true" className="size-8 fill-current text-foreground/15" strokeWidth={1} />
      <div className="mt-4 grid">
        {quotes.map((q, i) => {
          const on = i === active
          return (
            <figure
              key={q.name}
              aria-hidden={!on}
              inert={!on || undefined}
              className={cn(
                "[grid-area:1/1] motion-safe:transition-[opacity,filter,transform] motion-safe:duration-700 motion-safe:ease-[cubic-bezier(0.4,0.36,0,1)]",
                on ? "translate-y-0 opacity-100 blur-0" : "pointer-events-none translate-y-1 opacity-0 blur-[2px]"
              )}
            >
              <blockquote className="text-base/6 font-medium tracking-[-0.01em] text-pretty text-foreground">{q.quote}</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <InitialsAvatar name={q.name} index={i} />
                <div>
                  <div className="text-sm/5 font-medium text-foreground">{q.name}</div>
                  <div className="text-xs/4.5 text-muted-foreground">{q.role}</div>
                </div>
              </figcaption>
            </figure>
          )
        })}
      </div>
      {quotes.length > 1 && (
        <div className="mt-6 flex gap-1.5">
          {quotes.map((q, i) => (
            <button
              key={q.name}
              type="button"
              aria-label={`Show quote ${i + 1} of ${quotes.length}`}
              aria-current={i === active || undefined}
              onClick={() => setActive(i)}
              className="group flex size-5 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            >
              <span className={cn("size-1.5 rounded-full transition-colors", i === active ? "bg-foreground" : "bg-subtle/30 group-hover:bg-subtle/60")} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/** A single quote card with an initials avatar. */
export function QuoteCard({ item, index = 0 }: { item: Testimonial; index?: number }) {
  return (
    <figure className="flex flex-col gap-y-6 rounded-xl bg-surface p-5 shadow-card dark:shadow-card-dark">
      <blockquote className="text-sm/5 text-pretty text-muted-foreground">{item.quote}</blockquote>
      <figcaption className="mt-auto flex items-center gap-3">
        <InitialsAvatar name={item.name} index={index} />
        <div className="min-w-0">
          <div className="truncate text-sm/5 font-medium text-foreground">{item.name}</div>
          <div className="truncate text-xs/4.5 text-subtle">{item.role}</div>
        </div>
      </figcaption>
    </figure>
  )
}

/** Testimonials: heading, an optional action, a rotating featured quote and a grid of quote cards. `tone="dark"` for dark bands. */
export function TestimonialsSection({
  title,
  description,
  action,
  featured = [],
  quotes = [],
  tone = "light",
  className,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  /** Rendered under the description, e.g. a button or copy-prompt pill. */
  action?: React.ReactNode
  /** Quotes that rotate under the heading. Hidden while empty. */
  featured?: Testimonial[]
  /** Quote cards in the grid. Hidden while empty. */
  quotes?: Testimonial[]
  tone?: "light" | "dark"
  className?: string
}) {
  return (
    <section data-tone={tone} className={cn("bg-surface-muted py-14 lg:py-24", tone === "dark" && "dark", className)}>
      <div className="mx-auto w-[calc(100%-2.5rem)] max-w-6xl lg:flex lg:items-start lg:gap-x-16">
        <div className="flex flex-col lg:w-96 lg:flex-none">
          <h2 className="max-w-md text-xl font-semibold tracking-[-0.015em] text-balance text-foreground md:text-3xl">{title}</h2>
          {description && <p className="mt-4 max-w-md text-base/6 text-pretty text-muted-foreground">{description}</p>}
          {action && <div className="mt-6">{action}</div>}
          {featured.length > 0 && (
            <>
              <div
                aria-hidden="true"
                className="mt-8 h-px bg-[repeating-linear-gradient(to_right,currentColor_0_2px,transparent_2px_5px)] text-foreground/20 mask-[linear-gradient(to_right,black_60%,transparent)] lg:mt-12"
              />
              <FeaturedQuotes quotes={featured} className="mt-8 lg:mt-12" />
            </>
          )}
        </div>
        {quotes.length > 0 && (
          <ul role="list" className="mt-12 grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-0">
            {quotes.map((q, i) => (
              <li key={q.name} className="flex [&>figure]:flex-1">
                <QuoteCard item={q} index={i + featured.length} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
