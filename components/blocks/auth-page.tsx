import * as React from "react"
import { cn } from "@/lib/utils"

export type AuthPageLink = { label: string; href: string }

/**
 * Full-page auth layout: soft centered glow on the canvas, a centered card slot and a copyright/links footer.
 * Pass `linkComponent` (e.g. your router's `Link`) to render the footer links with it; defaults to a plain `<a>`.
 */
export function AuthPage({
  brand,
  year,
  links = [],
  linkComponent,
  aside,
  className,
  children,
}: {
  /** Product or company name for the copyright line. Omit (with `year`) to hide the line. */
  brand?: string
  /** Copyright year. Pass a fixed value so server and client render the same. */
  year?: number
  /** Footer links (support, privacy, terms…). */
  links?: AuthPageLink[]
  /** Component used for links, e.g. Next.js or Inertia `Link`. Defaults to `"a"`. */
  linkComponent?: React.ElementType
  /** Optional content under the card (legal copy, region notice). */
  aside?: React.ReactNode
  className?: string
  /** One of the auth cards (sign in, sign up, waitlist). */
  children: React.ReactNode
}) {
  const Link = linkComponent ?? "a"
  const copyright = [year, brand].filter(Boolean).join(" ")
  return (
    <div data-slot="auth-page" className={cn("relative isolate flex min-h-dvh flex-col items-center overflow-hidden bg-background px-4 py-6", className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[150vh] -translate-1/2 bg-[radial-gradient(closest-side,var(--surface),color-mix(in_oklab,var(--surface)_35%,transparent)_45%,transparent)] select-none"
      />
      <div className="relative flex w-full max-w-100 flex-1 flex-col justify-center gap-y-6">
        <main id="main" className="grid flex-1 content-center justify-items-center gap-6">
          {children}
          {aside && <div className="text-center text-[0.8125rem] text-subtle">{aside}</div>}
        </main>
        {(copyright || links.length > 0) && (
          <footer className="flex flex-wrap justify-between gap-2 text-[0.8125rem] text-subtle">
            {copyright ? <p>© {copyright}</p> : <span />}
            {links.length > 0 && (
              <ul className="flex gap-2">
                {links.map((l) => (
                  <li key={l.label} className="flex items-center gap-2 after:size-[1.5px] after:rounded-full after:bg-subtle last:after:hidden">
                    <Link href={l.href} className="rounded-sm outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand/40">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </footer>
        )}
      </div>
    </div>
  )
}
