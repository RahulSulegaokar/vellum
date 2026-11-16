"use client"

/** Feature section: eyebrow, title and body over a bento grid of feature cards, with an optional animated badge row. */

import * as React from "react"
import { ArrowRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)"

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION)
  mq.addEventListener("change", cb)
  return () => mq.removeEventListener("change", cb)
}

function usePrefersReducedMotion() {
  return React.useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false
  )
}

/** Small label above a section title. */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-[0.8125rem] leading-6 font-medium text-brand-text", className)}>{children}</p>
}

/** Section heading (an `h2`). */
export function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn("mt-2 text-[1.75rem] leading-[1.12] font-semibold tracking-[-0.03em] text-balance text-foreground sm:text-[2rem]", className)}>
      {children}
    </h2>
  )
}

/** Supporting paragraph under a section title. */
export function SectionBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("mt-4 max-w-xl text-[0.9375rem] leading-6 text-pretty text-muted-foreground", className)}>{children}</p>
}

export type FeatureLink = { label: string; href: string }

/**
 * Bento card: a visual on top and copy at the bottom (or first with `copyFirst`).
 * An optional `link` renders under the copy through `linkComponent` (defaults to `"a"`).
 */
export function FeatureCard({
  title,
  body,
  link,
  linkComponent,
  children,
  copyFirst,
  className,
}: {
  title: string
  body: string
  link?: FeatureLink
  /** Element or component used for `link`, e.g. your router's `Link`. Defaults to `"a"`. */
  linkComponent?: React.ElementType
  children?: React.ReactNode
  copyFirst?: boolean
  className?: string
}) {
  const Link = linkComponent ?? "a"
  const copy = (
    <div className="relative z-10 p-6 sm:p-8">
      <h3 className="text-[0.8125rem] leading-6 font-medium text-foreground">{title}</h3>
      <p className="mt-2 max-w-96 text-[0.8125rem] leading-5 text-muted-foreground">{body}</p>
      {link && (
        <Link
          href={link.href}
          className="group/link mt-3 inline-flex items-center gap-1 rounded-sm text-[0.8125rem] leading-5 font-medium text-brand-text outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        >
          {link.label}
          <ArrowRightIcon aria-hidden="true" className="size-3.5 transition-transform group-hover/link:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
  return (
    <div className={cn("relative flex flex-col overflow-hidden rounded-2xl bg-surface shadow-card dark:shadow-card-dark", className)}>
      {copyFirst && copy}
      {children && <div className="relative flex flex-1 items-center justify-center">{children}</div>}
      {!copyFirst && copy}
    </div>
  )
}

/** Browser chrome: three dots and a URL pill, with the page below. Wrap screenshots or mock UI in it. */
export function BrowserFrame({ url, className, children }: { url?: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("relative flex flex-col overflow-hidden rounded-lg bg-surface-muted shadow-card ring-1 ring-hairline dark:shadow-card-dark", className)}>
      <div className="relative z-20 flex w-full items-center justify-center bg-accent px-3 py-2 shadow-[0_0.5px_0_0_var(--color-hairline)]">
        <div aria-hidden="true" className="absolute top-1/2 left-3 flex -translate-y-1/2 gap-x-1.5">
          {[0, 1, 2].map((d) => (
            <span key={d} className="size-1.5 rounded-full bg-subtle/25" />
          ))}
        </div>
        <div className="flex h-3.5 min-w-0 items-center justify-center rounded-full bg-subtle/10 px-6 py-0.5 sm:px-16">
          {url && <span className="truncate text-[0.5625rem] leading-3.5 tracking-[0.01em] text-placeholder">{url}</span>}
        </div>
      </div>
      {children}
    </div>
  )
}

/** A label beside a row of short wordmarks that light up one after another (all lit under reduced motion). */
export function ComplianceBadges({ label, badges, interval = 2200, className }: { label: string; badges: string[]; interval?: number; className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [tick, setTick] = React.useState(0)
  React.useEffect(() => {
    if (reduced || badges.length < 2) return
    const id = setInterval(() => setTick((t) => t + 1), interval)
    return () => clearInterval(id)
  }, [reduced, badges.length, interval])
  const active = reduced ? -1 : tick % badges.length

  return (
    <div className={cn("sm:flex sm:items-center sm:justify-center sm:gap-x-6", className)}>
      <h3 className="text-center text-sm/5 font-medium text-balance text-foreground sm:w-48 sm:border-r sm:border-edge/12 sm:pr-10 sm:text-left">{label}</h3>
      <ul role="list" className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:mt-0 sm:justify-start sm:gap-x-16">
        {badges.map((b, i) => {
          const lit = reduced || i === active
          return (
            <li key={b}>
              <p className="relative text-xl font-semibold whitespace-nowrap">
                <span className={cn("absolute top-0 left-0 text-foreground transition-opacity duration-500", lit ? "opacity-100" : "opacity-0")}>{b}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "transition-opacity duration-500 [-webkit-text-fill-color:transparent] [-webkit-text-stroke:0.5px_var(--color-placeholder)] [paint-order:stroke_fill]",
                    lit ? "opacity-0" : "opacity-100"
                  )}
                >
                  {b}
                </span>
              </p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export type Feature = {
  title: string
  body: string
  /** Optional "Learn more"-style link under the copy. */
  link?: FeatureLink
  visual?: React.ReactNode
  copyFirst?: boolean
  /** Column span and other layout classes, e.g. `md:col-span-4` on the 6-column grid. */
  className?: string
}

/**
 * Feature section: eyebrow, title and body, a bento grid of feature cards, and an optional badge row.
 *
 * Feature links render through `linkComponent`, which defaults to `"a"`; pass your router's `Link`
 * for client-side navigation.
 */
export function FeatureGrid({
  eyebrow,
  title,
  description,
  features,
  compliance,
  linkComponent,
  tone = "light",
  className,
}: {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  features: Feature[]
  /** Label and wordmarks for the animated badge row (certifications, standards, platforms). Hidden when omitted or `null`. */
  compliance?: { label: string; badges: string[] } | null
  /** Element or component used for feature links, e.g. your router's `Link`. Defaults to `"a"`. */
  linkComponent?: React.ElementType
  tone?: "light" | "dark"
  className?: string
}) {
  return (
    <section data-tone={tone} className={cn("bg-background", tone === "dark" && "dark", className)}>
      <div className="max-w-2xl">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <SectionTitle>{title}</SectionTitle>
        {description && <SectionBody>{description}</SectionBody>}
      </div>
      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-6">
        {features.map((f) => (
          <FeatureCard
            key={f.title}
            title={f.title}
            body={f.body}
            link={f.link}
            linkComponent={linkComponent}
            copyFirst={f.copyFirst}
            className={f.className}
          >
            {f.visual}
          </FeatureCard>
        ))}
      </div>
      {compliance && <ComplianceBadges label={compliance.label} badges={compliance.badges} className="mt-16 sm:mt-24" />}
    </section>
  )
}
