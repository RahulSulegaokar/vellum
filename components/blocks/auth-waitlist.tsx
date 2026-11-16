"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"
import { AuthCard, AuthField, AuthFooterLink, AuthSubmit, usePending } from "@/components/blocks/auth-sign-in"

/**
 * Waitlist card: email field and a join button, swapping to a confirmation once submitted.
 * Pass `linkComponent` (e.g. your router's `Link`) to render the sign-in link with it; defaults to a plain `<a>`.
 */
export function AuthWaitlist({
  logo,
  title = "Join the waitlist",
  subtitle,
  emailLabel = "Email address",
  emailPlaceholder = "you@example.com",
  submitLabel = "Join the waitlist",
  successTitle = "You're on the list",
  successMessage = "We'll send an invite to this address when access opens:",
  signInHref,
  signInPrompt = "Have an account?",
  signInLabel = "Sign in",
  linkComponent,
  error,
  footer,
  onSubmit,
  className,
}: {
  logo?: React.ReactNode
  title?: string
  subtitle?: React.ReactNode
  emailLabel?: string
  emailPlaceholder?: string
  submitLabel?: string
  successTitle?: string
  successMessage?: React.ReactNode
  /** Omit to hide the sign-in line. */
  signInHref?: string
  signInPrompt?: string
  signInLabel?: string
  /** Component used for links, e.g. Next.js or Inertia `Link`. Defaults to `"a"`. */
  linkComponent?: React.ElementType
  error?: string
  /** Optional neutral slot under the footer line. */
  footer?: React.ReactNode
  /** Resolve to show the confirmation; throw to stay on the form. */
  onSubmit?: (values: { email: string }) => void | Promise<void>
  className?: string
}) {
  const id = React.useId()
  const [email, setEmail] = React.useState("")
  const [joined, setJoined] = React.useState(false)
  const [pending, run] = usePending()
  return (
    <AuthCard
      logo={logo}
      title={joined ? successTitle : title}
      subtitle={joined ? undefined : subtitle}
      className={className}
      footer={footer}
      footerText={signInHref ? <AuthFooterLink prompt={signInPrompt} label={signInLabel} href={signInHref} linkComponent={linkComponent} /> : undefined}
    >
      {joined ? (
        <div role="status" className="-mt-4 flex flex-col items-center gap-3 text-center">
          <span className="grid size-10 place-items-center rounded-full bg-success/6 text-success-text ring-1 ring-success/20 ring-inset">
            <CheckIcon className="size-5" aria-hidden="true" />
          </span>
          <p className="text-[0.8125rem]/[1.125rem] text-pretty text-subtle">
            {successMessage}
            <br />
            <span className="font-medium break-all text-foreground">{email}</span>
          </p>
        </div>
      ) : (
        <form
          className="flex flex-col gap-8"
          onSubmit={(e) => {
            e.preventDefault()
            run(async () => {
              await onSubmit?.({ email })
              setJoined(true)
            }).catch(() => {})
          }}
        >
          <AuthField
            id={`${id}-email`}
            name="email"
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
      )}
    </AuthCard>
  )
}
