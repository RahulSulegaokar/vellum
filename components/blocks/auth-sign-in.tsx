"use client"

import * as React from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

/* ------------------------------ Shared auth pieces ------------------------------ */

export type AuthProvider = {
  id: string
  label: string
  /** Glyph shown before the label. Defaults to a monogram of the label. */
  icon?: React.ReactNode
}

/** Simple original monogram glyph for a sign-in provider (no third-party marks). */
export function ProviderGlyph({ label, className }: { label: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("grid size-4 shrink-0 place-items-center rounded-full bg-foreground text-[0.5625rem]/none font-semibold text-background", className)}
    >
      {label.charAt(0).toUpperCase()}
    </span>
  )
}

/** Default brand mark: a monogram tile plus the product name. */
export function AuthLogo({ name = "Acme", href = "/" }: { name?: string; href?: string }) {
  return (
    <a
      href={href}
      aria-label={`${name} home`}
      className="flex items-center gap-1.5 rounded-md text-[1.0625rem] font-semibold tracking-[-0.03em] text-foreground outline-none focus-visible:ring-3 focus-visible:ring-brand/40"
    >
      <span aria-hidden="true" className="grid size-5 place-items-center rounded-md bg-foreground text-[0.6875rem] font-bold text-background">
        {name.charAt(0)}
      </span>
      {name.toLowerCase()}
    </a>
  )
}

/** Muted shell around a white panel: logo, title and subtitle on top, a footer line and an optional slot below. */
export function AuthCard({
  logo = <AuthLogo />,
  title,
  subtitle,
  footerText,
  footer,
  className,
  children,
}: {
  logo?: React.ReactNode
  title: string
  subtitle?: React.ReactNode
  /** The line under the panel, e.g. "Don't have an account? Sign up". */
  footerText?: React.ReactNode
  /** Optional neutral slot under the footer line (legal copy, help link, badge). */
  footer?: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  return (
    <div data-slot="auth-card" className={cn("w-full max-w-100 rounded-xl bg-surface-muted shadow-dialog ring-1 ring-edge/6", className)}>
      <div className="flex flex-col gap-8 rounded-xl bg-surface px-10 pt-8 pb-10 shadow-surface ring-1 ring-edge/4 max-[26rem]:px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          {logo}
          <div>
            <h1 className="text-[1.0625rem]/6 font-bold tracking-[-0.01em] text-balance text-foreground">{title}</h1>
            {subtitle && <p className="mt-1 text-[0.8125rem]/[1.125rem] text-pretty text-subtle">{subtitle}</p>}
          </div>
        </div>
        {children}
      </div>
      {(footerText || footer) && (
        <div className="flex flex-col items-center gap-3 px-8 py-4 text-center text-[0.8125rem] text-subtle">
          {footerText && <p>{footerText}</p>}
          {footer}
        </div>
      )}
    </div>
  )
}

/** Provider buttons: two side by side, otherwise stacked full width. The last-used one gets a small tag. */
export function ProviderButtons({
  providers,
  lastUsed,
  disabled,
  onSelect,
}: {
  providers: AuthProvider[]
  lastUsed?: string
  disabled?: boolean
  onSelect?: (id: string) => void
}) {
  if (providers.length === 0) return null
  const grid = providers.length === 2
  return (
    <div className={cn("grid gap-2", grid ? "grid-cols-2 max-[22rem]:grid-cols-1" : "grid-cols-1")}>
      {providers.map((p) => (
        <Button
          key={p.id}
          type="button"
          variant="elevated"
          disabled={disabled}
          onClick={() => onSelect?.(p.id)}
          className="relative w-full gap-2 overflow-visible"
        >
          {p.icon ?? <ProviderGlyph label={p.label} />}
          {grid ? p.label : `Continue with ${p.label}`}
          {lastUsed === p.id && (
            <Badge variant="subtle" className="absolute -top-2 -right-1.5 bg-surface-muted">
              Last used
            </Badge>
          )}
        </Button>
      ))}
    </div>
  )
}

/** "or" rule between provider buttons and the form. */
export function AuthDivider({ label = "or" }: { label?: string }) {
  return (
    <div className="flex items-center gap-4 text-[0.8125rem] text-subtle">
      <span aria-hidden="true" className="h-px flex-1 bg-edge/6" />
      {label}
      <span aria-hidden="true" className="h-px flex-1 bg-edge/6" />
    </div>
  )
}

/** Labelled input; `type="password"` adds a show/hide toggle. */
export function AuthField({
  id,
  label,
  type = "text",
  error,
  className,
  "aria-describedby": describedBy,
  ...props
}: Omit<React.ComponentProps<"input">, "id"> & { id: string; label: string; error?: string }) {
  const [show, setShow] = React.useState(false)
  const pw = type === "password"
  const errorId = `${id}-error`
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id} className="text-[0.8125rem]">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          name={id}
          type={pw && show ? "text" : type}
          inputMode={type === "email" ? "email" : undefined}
          aria-invalid={error ? true : undefined}
          className={cn(pw && "pr-9")}
          {...props}
          aria-describedby={[describedBy, error ? errorId : undefined].filter(Boolean).join(" ") || undefined}
        />
        {pw && (
          <button
            type="button"
            aria-label={show ? "Hide password" : "Show password"}
            aria-pressed={show}
            onClick={() => setShow((s) => !s)}
            className="absolute top-1/2 right-1 grid size-6 -translate-y-1/2 cursor-pointer place-items-center rounded-md text-placeholder transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            {show ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
          </button>
        )}
      </div>
      {error && (
        <p id={errorId} className="text-[0.8125rem]/[1.125rem] text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

/** Full-width primary submit with a small play caret, swapped for a spinner while pending. */
export function AuthSubmit({ pending, children }: { pending?: boolean; children: React.ReactNode }) {
  return (
    <Button type="submit" variant="primary" disabled={pending} className="w-full gap-1">
      {pending ? <Spinner className="size-3.5" /> : null}
      {children}
      {!pending && (
        <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5 opacity-70">
          <path fill="currentColor" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" d="M9.5 8.25 6 6v4.5z" />
        </svg>
      )}
    </Button>
  )
}

/** Runs an optional async handler while tracking a pending flag. */
export function usePending() {
  const [pending, setPending] = React.useState(false)
  const run = React.useCallback(async (fn?: () => void | Promise<void>) => {
    if (!fn) return
    setPending(true)
    try {
      await fn()
    } finally {
      setPending(false)
    }
  }, [])
  return [pending, run] as const
}

export const defaultProviders: AuthProvider[] = [
  { id: "github", label: "GitHub" },
  { id: "google", label: "Google" },
]

/* ---------------------------------- Sign in ---------------------------------- */

/** Sign-in card: logo, provider buttons, email field, primary continue, an alternative method and a link to sign up. */
export function AuthSignIn({
  logo,
  title = "Sign in to Acme",
  subtitle = "Welcome back! Sign in to continue",
  providers = defaultProviders,
  lastUsedProvider,
  emailLabel = "Email address",
  emailPlaceholder = "Enter your email address",
  submitLabel = "Continue",
  alternativeLabel = "Use a passkey instead",
  onAlternative,
  signUpHref = "#sign-up",
  signUpPrompt = "Don't have an account?",
  signUpLabel = "Sign up",
  error,
  footer,
  onSubmit,
  onProvider,
  className,
}: {
  logo?: React.ReactNode
  title?: string
  subtitle?: React.ReactNode
  providers?: AuthProvider[]
  /** Provider id that gets the "Last used" tag. */
  lastUsedProvider?: string
  emailLabel?: string
  emailPlaceholder?: string
  submitLabel?: string
  /** Text link under the form (passkey, magic link…). Pass an empty string to hide it. */
  alternativeLabel?: string
  onAlternative?: () => void
  signUpHref?: string
  signUpPrompt?: string
  signUpLabel?: string
  /** Error shown under the email field. */
  error?: string
  /** Optional neutral slot under the footer line. */
  footer?: React.ReactNode
  onSubmit?: (values: { email: string }) => void | Promise<void>
  onProvider?: (id: string) => void
  className?: string
}) {
  const [email, setEmail] = React.useState("")
  const [pending, run] = usePending()
  return (
    <AuthCard
      logo={logo}
      title={title}
      subtitle={subtitle}
      className={className}
      footer={footer}
      footerText={
        <>
          {signUpPrompt}{" "}
          <a href={signUpHref} className="rounded-sm font-medium text-foreground outline-none hover:underline focus-visible:ring-2 focus-visible:ring-brand/40">
            {signUpLabel}
          </a>
        </>
      }
    >
      {providers.length > 0 && (
        <>
          <ProviderButtons providers={providers} lastUsed={lastUsedProvider} disabled={pending} onSelect={onProvider} />
          <AuthDivider />
        </>
      )}
      <form
        className="flex flex-col gap-8"
        onSubmit={(e) => {
          e.preventDefault()
          run(() => onSubmit?.({ email }))
        }}
      >
        <AuthField
          id="identifier"
          label={emailLabel}
          type="email"
          autoComplete="email"
          placeholder={emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          required
        />
        <AuthSubmit pending={pending}>{submitLabel}</AuthSubmit>
      </form>
      {alternativeLabel && (
        <div className="-mt-4 text-center">
          <button
            type="button"
            onClick={onAlternative}
            className="cursor-pointer rounded-sm text-[0.8125rem] font-medium text-foreground outline-none hover:underline focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            {alternativeLabel}
          </button>
        </div>
      )}
    </AuthCard>
  )
}

export default function AuthSignInDemo() {
  return (
    <div className="flex justify-center bg-background p-6 sm:p-10">
      <AuthSignIn lastUsedProvider="google" onSubmit={() => new Promise((r) => setTimeout(r, 800))} />
    </div>
  )
}
