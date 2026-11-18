"use client"

/** Marketing hero: headline, supporting copy, a primary CTA beside a copy-to-clipboard pill, and an optional logo cloud. */
import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** Pill that copies a snippet (an install command, a prompt) to the clipboard: stacked dots, a label and a copy icon that swaps to a check. */
export function CopyPromptPill({
  text,
  label = "Copy",
  copiedLabel = "Copied",
  className,
}: {
  /** The text written to the clipboard. */
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
        "group relative inline-flex h-7.5 items-center gap-2 self-start rounded-full bg-foreground/5 pr-3 pl-1.5 text-sm font-medium text-foreground transition-colors outline-none hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[--tw-outline-style:solid] focus-visible:outline-ring",
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
      {copied ? (
        <CheckIcon aria-hidden="true" className="size-3.5 flex-none text-subtle transition-colors group-hover:text-foreground" />
      ) : (
        <CopyIcon aria-hidden="true" className="size-3.5 flex-none text-subtle transition-colors group-hover:text-foreground" />
      )}
    </button>
  )
}

/** Row of text wordmarks under a short label ("Used by teams at…"). */
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

/**
 * Marketing hero: headline, supporting copy, a primary CTA beside a copy-to-clipboard pill, and an optional logo cloud.
 *
 * The primary action renders through `linkComponent`, which defaults to `"a"`; pass your router's `Link`
 * for client-side navigation.
 */
export function HeroSection({
  title,
  description,
  primaryAction,
  prompt,
  logosLabel,
  logos = [],
  linkComponent,
  className,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  primaryAction?: { label: string; href: string } | null
  /** Copy-to-clipboard pill beside the CTA. Omit or pass `null` to hide it. */
  prompt?: { text: string; label?: string; copiedLabel?: string } | null
  logosLabel?: string
  /** Wordmarks under the hero; the logo cloud is hidden while empty. */
  logos?: string[]
  /** Element or component used for links, e.g. your router's `Link`. Defaults to `"a"`. */
  linkComponent?: React.ElementType
  className?: string
}) {
  const Link = linkComponent ?? "a"
  return (
    <section className={cn("relative isolate overflow-x-clip bg-background", className)}>
      <div className="mx-auto w-[calc(100%-2.5rem)] max-w-6xl pt-20 pb-12 sm:pt-28 lg:pt-32">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 lg:items-end lg:gap-1">
          <div className="lg:col-span-3">
            <h1 className="text-[2rem] leading-[1.12] font-semibold tracking-[-0.015em] text-balance text-foreground sm:text-center sm:text-[3.5rem] sm:leading-16 sm:tracking-[-0.035em] lg:text-left">
              {title}
            </h1>
            {description && (
              <p className="mt-4 max-w-152 text-[0.9375rem]/6 text-balance text-muted-foreground sm:mx-auto sm:text-center sm:text-lg/[1.55] lg:mx-0 lg:text-left">
                {description}
              </p>
            )}
          </div>
          {(primaryAction || prompt) && (
            <div className="flex flex-wrap items-center gap-3 max-sm:justify-start sm:justify-center lg:mb-2 lg:flex-col lg:items-end">
              {primaryAction && (
                <Button size="lg" nativeButton={false} render={<Link href={primaryAction.href} />}>
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
