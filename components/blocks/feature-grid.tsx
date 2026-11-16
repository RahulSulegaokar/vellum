"use client"

import * as React from "react"
import { FingerprintIcon, KeyRoundIcon, ShieldCheckIcon, UsersIcon } from "lucide-react"
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
  return <p className={cn("text-[0.8125rem] leading-6 font-medium text-brand", className)}>{children}</p>
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

/** Bento card: a visual on top and copy at the bottom (or first with `copyFirst`). */
export function FeatureCard({
  title,
  body,
  children,
  copyFirst,
  className,
}: {
  title: string
  body: string
  children?: React.ReactNode
  copyFirst?: boolean
  className?: string
}) {
  const copy = (
    <div className="relative z-10 p-6 sm:p-8">
      <h3 className="text-[0.8125rem] leading-6 font-medium text-foreground">{title}</h3>
      <p className="mt-2 max-w-96 text-[0.8125rem] leading-5 text-muted-foreground">{body}</p>
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
export function BrowserFrame({ url = "acme.app", className, children }: { url?: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("relative flex flex-col overflow-hidden rounded-lg bg-surface-muted shadow-card ring-1 ring-hairline dark:shadow-card-dark", className)}>
      <div className="relative z-20 flex w-full items-center justify-center bg-accent px-3 py-2 shadow-[0_0.5px_0_0_var(--color-hairline)]">
        <div aria-hidden="true" className="absolute top-1/2 left-3 flex -translate-y-1/2 gap-x-1.5">
          {[0, 1, 2].map((d) => (
            <span key={d} className="size-1.5 rounded-full bg-subtle/25" />
          ))}
        </div>
        <div className="flex min-w-0 items-center justify-center rounded-full bg-subtle/10 px-6 py-0.5 sm:px-16">
          <span className="truncate text-[0.5625rem] leading-3.5 tracking-[0.01em] text-placeholder">{url}</span>
        </div>
      </div>
      {children}
    </div>
  )
}

/** "Secure and compliant" row whose badges light up one after another (static under reduced motion). */
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

export type Feature = { title: string; body: string; visual?: React.ReactNode; copyFirst?: boolean; className?: string }

/** Feature section: eyebrow, title and body, a bento grid of feature cards, and an optional compliance badge row. */
export function FeatureGrid({
  eyebrow = "Platform",
  title = "Everything your users touch, ready on day one",
  description = "Accounts, workspaces and permissions arrive as tested building blocks. Wire them in, then customize every screen.",
  features = defaultFeatures,
  compliance = { label: "Secure, private and compliant", badges: ["SOC 2", "GDPR", "HIPAA", "ISO 27001"] },
  tone = "light",
  className,
}: {
  eyebrow?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  features?: Feature[]
  /** Pass `null` to hide the badge row. */
  compliance?: { label: string; badges: string[] } | null
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
          <FeatureCard key={f.title} title={f.title} body={f.body} copyFirst={f.copyFirst} className={f.className}>
            {f.visual}
          </FeatureCard>
        ))}
      </div>
      {compliance && <ComplianceBadges label={compliance.label} badges={compliance.badges} className="mt-16 sm:mt-24" />}
    </section>
  )
}

/* ------------------------------- Demo visuals ------------------------------- */

function SkeletonLine({ className }: { className?: string }) {
  return <div className={cn("h-2 rounded-full bg-subtle/12", className)} />
}

function SignInMock() {
  return (
    <div className="w-full px-6 pt-8 sm:px-8">
      <BrowserFrame url="app.acme.example/sign-in" className="mx-auto max-w-md">
        <div className="flex flex-col items-center gap-3 px-8 py-8">
          <div className="size-6 rounded-full bg-foreground" />
          <SkeletonLine className="w-28" />
          <div className="mt-2 h-7 w-full rounded-md bg-field ring-1 ring-field-ring" />
          <div className="h-7 w-full rounded-md bg-solid" />
        </div>
      </BrowserFrame>
    </div>
  )
}

function MembersMock() {
  const rows = [
    { name: "Maya L.", role: "Admin" },
    { name: "Daniel O.", role: "Member" },
    { name: "Priya R.", role: "Member" },
  ]
  return (
    <ul className="w-full space-y-2 px-6 pt-8 sm:px-8">
      {rows.map((r) => (
        <li key={r.name} className="flex items-center gap-3 rounded-lg bg-surface-muted px-3 py-2 ring-1 ring-hairline">
          <span className="flex size-6 items-center justify-center rounded-full bg-accent text-[0.625rem] font-medium text-foreground">{r.name[0]}</span>
          <span className="text-xs font-medium text-foreground">{r.name}</span>
          <span className="ml-auto text-[0.6875rem] text-subtle">{r.role}</span>
        </li>
      ))}
    </ul>
  )
}

function IconCluster() {
  const icons = [<ShieldCheckIcon key="s" />, <KeyRoundIcon key="k" />, <FingerprintIcon key="f" />, <UsersIcon key="u" />]
  return (
    <div className="grid grid-cols-2 gap-3 pt-8">
      {icons.map((icon, i) => (
        <span key={i} className="flex size-12 items-center justify-center rounded-xl bg-surface-muted text-foreground shadow-surface ring-1 ring-hairline [&_svg]:size-5">
          {icon}
        </span>
      ))}
    </div>
  )
}

const defaultFeatures: Feature[] = [
  {
    title: "Prebuilt sign-in",
    body: "Drop in complete sign-in and sign-up screens that match your brand, with email, passkeys and social providers.",
    visual: <SignInMock />,
    className: "md:col-span-4",
  },
  {
    title: "Workspaces and roles",
    body: "Invite members, assign roles and scope data per workspace.",
    visual: <MembersMock />,
    className: "md:col-span-2",
  },
  {
    title: "Security by default",
    body: "Bot protection, session limits and breach checks are on from the start.",
    visual: <IconCluster />,
    className: "md:col-span-2",
  },
  {
    title: "Works with your stack",
    body: "SDKs for popular frameworks and a typed REST API, so Acme fits whatever you already run.",
    copyFirst: true,
    visual: (
      <div className="flex w-full flex-wrap justify-center gap-2 px-6 pb-8 sm:px-8">
        {["TypeScript", "Go", "Python", "Ruby", "REST", "Webhooks", "CLI"].map((s) => (
          <span key={s} className="rounded-md bg-surface-muted px-2.5 py-1 font-mono text-xs text-muted-foreground ring-1 ring-hairline">
            {s}
          </span>
        ))}
      </div>
    ),
    className: "md:col-span-4",
  },
]

export default function FeatureGridDemo() {
  return (
    <div className="mx-auto max-w-5xl p-6 sm:p-10">
      <FeatureGrid />
    </div>
  )
}
