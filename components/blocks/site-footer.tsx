/** Marketing footer: framed logo, link columns, social links and a legal line. */
import { cn } from "@/lib/utils"

export type FooterLink = { label: string; href: string; onClick?: never } | { label: string; onClick: () => void; href?: never }
export type FooterColumn = { title: string; links: FooterLink[] }
export type FooterSocial = { label: string; href: string; icon: React.ReactNode }

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

const linkClass =
  "rounded-sm text-left font-medium text-foreground transition-colors outline-none hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[--tw-outline-style:solid] focus-visible:outline-ring"

/**
 * Marketing footer: framed logo, link columns, social links and a legal line. `tone="dark"` for dark pages.
 *
 * Links render through `linkComponent`, which defaults to `"a"`; pass your router's `Link` for client-side
 * navigation. A footer link with `onClick` instead of `href` renders as a button (e.g. "Cookie settings").
 */
export function SiteFooter({
  logo,
  columns = [],
  socials = [],
  legal,
  year,
  linkComponent,
  tone = "light",
  className,
}: {
  /** Your brand mark, usually a link home. Nothing renders when omitted. */
  logo?: React.ReactNode
  columns?: FooterColumn[]
  socials?: FooterSocial[]
  /** Legal line after the © sign, e.g. "Your Company, Inc. All rights reserved." */
  legal?: React.ReactNode
  /** Shown before `legal`; pass it from the server or a build-time constant to avoid hydration drift. */
  year?: number
  /** Element or component used for every link, e.g. your router's `Link`. Defaults to `"a"`. */
  linkComponent?: React.ElementType
  tone?: "light" | "dark"
  className?: string
}) {
  const Link = linkComponent ?? "a"
  const showBottom = legal != null || year != null || socials.length > 0
  return (
    <footer data-tone={tone} className={cn("bg-background pt-16", tone === "dark" && "dark", className)}>
      <div className="mx-auto w-[calc(100%-2.5rem)] max-w-6xl">
        <div className="grid grid-cols-1 gap-x-2 gap-y-10 lg:grid-cols-4">
          <div className="flex items-start pt-4">
            {logo && (
              <div className="relative p-0.5">
                {(["top", "right", "bottom", "left"] as const).map((side) => (
                  <DottedEdge key={side} side={side} />
                ))}
                {logo}
              </div>
            )}
          </div>
          {columns.length > 0 && (
            <ul role="list" className="relative z-10 grid grid-cols-2 gap-x-4 gap-y-8 text-sm/4 sm:grid-cols-3 md:grid-cols-5 lg:col-span-3">
              {columns.map((col) => (
                <li key={col.title}>
                  <div className="text-placeholder">{col.title}</div>
                  <ul role="list" className="mt-5 space-y-3">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        {l.href != null ? (
                          <Link href={l.href} className={linkClass}>
                            {l.label}
                          </Link>
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
          )}
        </div>
        {showBottom && (
          <div className="relative isolate mt-12 flex flex-wrap items-center gap-4 border-t border-edge/6 pt-6 pb-20 text-sm">
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-[radial-gradient(var(--color-edge)_1px,transparent_1px)] bg-size-[8px_8px] opacity-[0.07]"
              style={{
                maskImage: "radial-gradient(85% 100% at 50% 100%, black, transparent 72.5%)",
                WebkitMaskImage: "radial-gradient(85% 100% at 50% 100%, black, transparent 72.5%)",
              }}
            />
            {(legal != null || year != null) && (
              <p className="mr-auto text-muted-foreground">
                © {year != null && `${year} `}
                {legal}
              </p>
            )}
            {socials.length > 0 && (
              <ul role="list" className="ml-auto flex gap-5 text-muted-foreground">
                {socials.map((s) => (
                  <li key={s.label}>
                    <Link
                      href={s.href}
                      aria-label={s.label}
                      className="block rounded-sm transition-colors outline-none hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[--tw-outline-style:solid] focus-visible:outline-ring [&_svg]:size-4"
                    >
                      {s.icon}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </footer>
  )
}
