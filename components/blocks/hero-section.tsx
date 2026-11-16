"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** Pill that copies a prompt to the clipboard: stacked bubbles, label and a copy glyph that swaps to a check. */
export function CopyPromptPill({
  text,
  label = "Build with your agent",
  copiedLabel = "Prompt copied",
  className,
}: {
  text: string
  label?: string
  copiedLabel?: string
  className?: string
}) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(t)
  }, [copied])

  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(text).catch(() => {})
        setCopied(true)
      }}
      className={cn(
        "group relative inline-flex h-7.5 items-center gap-2 self-start rounded-full bg-foreground/5 pr-3 pl-1.5 text-sm font-medium text-foreground transition-colors outline-none hover:bg-foreground/10 focus-visible:ring-2 focus-visible:ring-brand/50",
        className
      )}
    >
      <span aria-hidden="true" className="flex">
        {["bg-brand", "bg-foreground", "bg-subtle"].map((c, i) => (
          <span key={c} className={cn("size-4.5 rounded-full ring-2 ring-background", c, i > 0 && "-ml-1.5")} />
        ))}
      </span>
      <span className="relative grid">
        <span aria-hidden={copied} className={cn("[grid-area:1/1] transition-opacity duration-200", copied && "opacity-0")}>
          {label}
        </span>
        <span aria-hidden={!copied} className={cn("[grid-area:1/1] opacity-0 transition-opacity duration-200", copied && "opacity-100")}>
          {copiedLabel}
        </span>
      </span>
      <span role="status" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
      <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5 flex-none text-subtle transition-colors group-hover:text-foreground">
        {copied ? (
          <path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <g fill="none" stroke="currentColor" strokeWidth="1.25">
            <rect x="5.25" y="5.25" width="8" height="8" rx="1.75" />
            <path d="M10.75 3.5v-.25a1.5 1.5 0 0 0-1.5-1.5h-5.5a1.5 1.5 0 0 0-1.5 1.5v5.5a1.5 1.5 0 0 0 1.5 1.5H4" strokeLinecap="round" />
          </g>
        )}
      </svg>
    </button>
  )
}

/** Row of text wordmarks under a short label ("Trusted by teams at…"). */
export function LogoCloud({ label, logos, className }: { label?: string; logos: string[]; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      {label && <p className="text-center text-[0.8125rem] font-medium text-subtle">{label}</p>}
      <ul role="list" className="grid w-full grid-cols-2 sm:grid-cols-3 lg:flex lg:justify-center">
        {logos.map((name, i) => (
          <li
            key={name}
            className={cn(
              "flex justify-center border-edge/6 px-6 py-4 xl:px-10",
              i < logos.length - 1 && "lg:border-r"
            )}
          >
            <span className="text-xl font-semibold tracking-[-0.04em] whitespace-nowrap text-foreground/70">{name.toLowerCase()}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Marketing hero: headline, supporting copy, a primary CTA beside a copy-prompt pill, and an optional logo cloud. */
export function HeroSection({
  title = "Ship the boring parts of your product in an afternoon",
  description = "Acme gives your team accounts, workspaces and access control as ready-made building blocks, so you can spend your time on the features only you can build.",
  primaryAction = { label: "Start building", href: "#start" },
  prompt = defaultPrompt,
  logosLabel = "Trusted by product teams at",
  logos = defaultLogos,
  className,
}: {
  title?: React.ReactNode
  description?: React.ReactNode
  primaryAction?: { label: string; href: string } | null
  /** Pass `null` to hide the copy pill. */
  prompt?: { text: string; label?: string; copiedLabel?: string } | null
  logosLabel?: string
  /** Pass an empty array to hide the logo cloud. */
  logos?: string[]
  className?: string
}) {
  return (
    <section className={cn("relative isolate overflow-x-clip bg-background", className)}>
      <div className="mx-auto w-[calc(100%-2.5rem)] max-w-6xl pt-20 pb-12 sm:pt-28 lg:pt-32">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 lg:items-end lg:gap-1">
          <div className="lg:col-span-3">
            <h1 className="text-[2rem] leading-[1.12] font-semibold tracking-[-0.015em] text-balance text-foreground sm:text-center sm:text-[3.5rem] sm:leading-16 sm:tracking-[-0.035em] lg:text-left">
              {title}
            </h1>
            <p className="mt-4 max-w-152 text-[0.9375rem]/6 text-balance text-muted-foreground sm:mx-auto sm:text-center sm:text-lg/[1.55] lg:mx-0 lg:text-left">
              {description}
            </p>
          </div>
          {(primaryAction || prompt) && (
            <div className="flex flex-wrap items-center gap-3 max-sm:justify-start sm:justify-center lg:mb-2 lg:flex-col lg:items-end">
              {primaryAction && (
                <Button size="lg" nativeButton={false} render={<a href={primaryAction.href} />}>
                  {primaryAction.label}
                </Button>
              )}
              {prompt && <CopyPromptPill {...prompt} className="self-center lg:self-end" />}
            </div>
          )}
        </div>
        {logos.length > 0 && <LogoCloud label={logosLabel} logos={logos} className="mt-20" />}
      </div>
    </section>
  )
}

const defaultPrompt = {
  text: "Add Acme accounts and workspaces to this app. Follow the quickstart at acme.example/docs/quickstart.",
  label: "Build with your agent",
  copiedLabel: "Prompt copied",
}

const defaultLogos = ["Northwind", "Lumen", "Halcyon", "Brightpath", "Quarry"]

export default function HeroSectionDemo() {
  return <HeroSection />
}
