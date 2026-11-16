"use client"

import { AtSignIcon, GitBranchIcon, MessageCircleIcon, PlayIcon, RssIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type FooterLink = { label: string; href?: string; onClick?: () => void }
export type FooterColumn = { title: string; links: FooterLink[] }
export type FooterSocial = { label: string; href: string; icon: React.ReactNode }

function FooterLogo({ name = "Acme", href = "#home" }: { name?: string; href?: string }) {
  return (
    <a href={href} className="inline-flex items-center gap-1.5 text-[1.0625rem] font-semibold tracking-[-0.03em] text-foreground">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4.5">
        <circle cx="12" cy="12" r="10" className="fill-foreground" />
        <path d="M7.5 15.5 12 7l4.5 8.5" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="stroke-background" />
      </svg>
      {name.toLowerCase()}
    </a>
  )
}

/** One dotted hairline that runs past its box by 1.25rem and fades out at both ends. */
function DottedEdge({ side }: { side: "top" | "bottom" | "left" | "right" }) {
  const horizontal = side === "top" || side === "bottom"
  const pos = {
    top: "inset-x-[-1.25rem] h-px -top-px",
    bottom: "inset-x-[-1.25rem] h-px -bottom-px",
    left: "inset-y-[-1.25rem] w-px -left-px",
    right: "inset-y-[-1.25rem] w-px -right-px",
  }[side]
  const mask = `linear-gradient(${horizontal ? "to right, " : ""}transparent, black 1.25rem, black calc(100% - 1.25rem), transparent)`
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute text-edge opacity-30",
        horizontal
          ? "bg-[repeating-linear-gradient(to_right,currentColor_0_1px,transparent_1px_4px)]"
          : "bg-[repeating-linear-gradient(to_bottom,currentColor_0_1px,transparent_1px_4px)]",
        pos
      )}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    />
  )
}

const linkClass = "text-left font-medium text-foreground transition-colors hover:text-muted-foreground"

/** Marketing footer: framed logo, link columns, social links and a legal line. `tone="dark"` for dark pages. */
export function SiteFooter({
  logo = <FooterLogo />,
  columns = defaultColumns,
  socials = defaultSocials,
  legal = "Acme, Inc. All rights reserved.",
  year,
  tone = "light",
  className,
}: {
  logo?: React.ReactNode
  columns?: FooterColumn[]
  socials?: FooterSocial[]
  legal?: string
  /** Shown before `legal`; pass it from the server or a build-time constant to avoid hydration drift. */
  year?: number
  tone?: "light" | "dark"
  className?: string
}) {
  return (
    <footer data-tone={tone} className={cn("bg-background pt-16", tone === "dark" && "dark", className)}>
      <div className="mx-auto w-[calc(100%-2.5rem)] max-w-6xl">
        <div className="grid grid-cols-1 gap-x-2 gap-y-10 lg:grid-cols-4">
          <div className="flex items-start pt-4">
            <div className="relative p-0.5">
              {(["top", "right", "bottom", "left"] as const).map((side) => (
                <DottedEdge key={side} side={side} />
              ))}
              {logo}
            </div>
          </div>
          <ul role="list" className="relative z-10 grid grid-cols-2 gap-x-4 gap-y-8 text-sm/4 sm:grid-cols-3 md:grid-cols-5 lg:col-span-3">
            {columns.map((col) => (
              <li key={col.title}>
                <div className="text-placeholder">{col.title}</div>
                <ul role="list" className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {l.href ? (
                        <a href={l.href} className={linkClass}>
                          {l.label}
                        </a>
                      ) : (
                        <button type="button" onClick={l.onClick} className={linkClass}>
                          {l.label}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative isolate mt-12 flex flex-wrap items-center gap-4 border-t border-edge/6 pt-6 pb-20 text-sm">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(var(--color-edge)_1px,transparent_1px)] bg-size-[8px_8px] opacity-[0.07]"
            style={{
              maskImage: "radial-gradient(85% 100% at 50% 100%, black, transparent 72.5%)",
              WebkitMaskImage: "radial-gradient(85% 100% at 50% 100%, black, transparent 72.5%)",
            }}
          />
          <p className="mr-auto text-muted-foreground">
            © {year != null && `${year} `}
            {legal}
          </p>
          <ul role="list" className="flex gap-5 text-muted-foreground">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} aria-label={s.label} className="block transition-colors hover:text-foreground [&_svg]:size-4">
                  {s.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

const defaultColumns: FooterColumn[] = [
  { title: "Product", links: [{ label: "Accounts", href: "#accounts" }, { label: "Access control", href: "#access" }, { label: "Workspaces", href: "#workspaces" }, { label: "Pricing", href: "#pricing" }] },
  { title: "Developers", links: [{ label: "Documentation", href: "#docs" }, { label: "API reference", href: "#api" }, { label: "CLI", href: "#cli" }, { label: "Status", href: "#status" }] },
  { title: "Company", links: [{ label: "About", href: "#about" }, { label: "Careers", href: "#careers" }, { label: "Blog", href: "#blog" }, { label: "Contact", href: "#contact" }] },
  { title: "Resources", links: [{ label: "Changelog", href: "#changelog" }, { label: "Guides", href: "#guides" }, { label: "Community", href: "#community" }] },
  { title: "Legal", links: [{ label: "Privacy", href: "#privacy" }, { label: "Terms", href: "#terms" }, { label: "Cookie settings" }] },
]

const defaultSocials: FooterSocial[] = [
  { label: "Social updates", href: "#social", icon: <AtSignIcon /> },
  { label: "Community forum", href: "#forum", icon: <MessageCircleIcon /> },
  { label: "Source code", href: "#source", icon: <GitBranchIcon /> },
  { label: "Video tutorials", href: "#videos", icon: <PlayIcon /> },
  { label: "Blog feed", href: "#feed", icon: <RssIcon /> },
]

export default function SiteFooterDemo() {
  return (
    <div className="bg-background">
      <SiteFooter year={2026} />
    </div>
  )
}
