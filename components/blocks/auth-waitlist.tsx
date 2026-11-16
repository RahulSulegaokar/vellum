"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"
import { AuthCard, AuthField, AuthSubmit, usePending } from "@/components/blocks/auth-sign-in"

/** Waitlist card: email field and a join button, swapping to a confirmation once submitted. */
export function AuthWaitlist({
  logo,
  title = "Join the waitlist",
  subtitle = "We'll let you know when your spot is ready.",
  emailLabel = "Email address",
  emailPlaceholder = "Enter your email address",
  submitLabel = "Join the waitlist",
  successTitle = "You're on the list",
  successMessage = "We'll email you as soon as your spot opens up.",
  signInHref = "#sign-in",
  signInPrompt = "Already have access?",
  signInLabel = "Sign in",
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
  signInHref?: string
  signInPrompt?: string
  signInLabel?: string
  error?: string
  /** Optional neutral slot under the footer line. */
  footer?: React.ReactNode
  /** Resolve to show the confirmation; throw to stay on the form. */
  onSubmit?: (values: { email: string }) => void | Promise<void>
  className?: string
}) {
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
      footerText={
        <>
          {signInPrompt}{" "}
          <a href={signInHref} className="rounded-sm font-medium text-foreground outline-none hover:underline focus-visible:ring-2 focus-visible:ring-brand/40">
            {signInLabel}
          </a>
        </>
      }
    >
      {joined ? (
        <div role="status" className="-mt-4 flex flex-col items-center gap-3 text-center">
          <span className="grid size-10 place-items-center rounded-full bg-green-500/10 text-green-600 ring-1 ring-green-600/15 ring-inset">
            <CheckIcon className="size-5" aria-hidden="true" />
          </span>
          <p className="text-[0.8125rem]/[1.125rem] text-pretty text-subtle">
            {successMessage}
            <br />
            <span className="font-medium text-foreground">{email}</span>
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
            id="waitlist-email"
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

export default function AuthWaitlistDemo() {
  return (
    <div className="flex justify-center bg-background p-6 sm:p-10">
      <AuthWaitlist onSubmit={() => new Promise((r) => setTimeout(r, 800))} />
    </div>
  )
}
