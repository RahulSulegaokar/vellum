import * as React from "react"
import { AuthSignIn } from "@/components/blocks/auth-sign-in"
import { cn } from "@/lib/utils"

export type AuthPageLink = { label: string; href: string }

const defaultLinks: AuthPageLink[] = [
  { label: "Support", href: "#support" },
  { label: "Privacy", href: "#privacy" },
  { label: "Terms", href: "#terms" },
]

/** Full-page auth layout: soft centered glow on the canvas, a centered card slot and a copyright/links footer. */
export function AuthPage({
  brand = "Acme",
  year = 2026,
  links = defaultLinks,
  aside,
  className,
  children,
}: {
  brand?: string
  /** Copyright year; fixed by default so server and client render the same. */
  year?: number
  links?: AuthPageLink[]
  /** Optional content under the card (legal copy, region notice). */
  aside?: React.ReactNode
  className?: string
  /** One of the auth cards (sign in, sign up, waitlist). */
  children: React.ReactNode
}) {
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
        <footer className="flex flex-wrap justify-between gap-2 text-[0.8125rem] text-subtle">
          <p>
            © {year} {brand}
          </p>
          {links.length > 0 && (
            <ul className="flex gap-2">
              {links.map((l) => (
                <li key={l.label} className="flex items-center gap-2 after:size-[1.5px] after:rounded-full after:bg-subtle last:after:hidden">
                  <a href={l.href} className="rounded-sm outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand/40">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </footer>
      </div>
    </div>
  )
}

export default function AuthPageDemo() {
  return (
    <AuthPage>
      <AuthSignIn lastUsedProvider="github" />
    </AuthPage>
  )
}
