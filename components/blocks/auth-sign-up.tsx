"use client"

import * as React from "react"
import {
  AuthCard,
  AuthDivider,
  AuthField,
  AuthFooterLink,
  AuthSubmit,
  ProviderButtons,
  usePending,
  type AuthProvider,
} from "@/components/blocks/auth-sign-in"

/**
 * Sign-up card: optional logo, provider buttons, email and password (with show/hide), primary continue and a link to sign in.
 * Pass `linkComponent` (e.g. your router's `Link`) to render the sign-in link with it; defaults to a plain `<a>`.
 */
export function AuthSignUp({
  logo,
  title = "Create your account",
  subtitle,
  providers = [],
  recentProvider,
  recentLabel,
  emailLabel = "Email address",
  emailPlaceholder = "you@example.com",
  passwordLabel = "Password",
  passwordPlaceholder = "Create a password",
  minPasswordLength = 8,
  passwordHint = `At least ${minPasswordLength} characters.`,
  submitLabel = "Continue",
  signInHref,
  signInPrompt = "Already have an account?",
  signInLabel = "Sign in",
  linkComponent,
  errors,
  footer,
  onSubmit,
  onProvider,
  className,
}: {
  logo?: React.ReactNode
  title?: string
  subtitle?: React.ReactNode
  /** Social or SSO providers shown above the form. Empty hides the buttons and the divider. */
  providers?: AuthProvider[]
  /** Provider id that gets the `recentLabel` tag. */
  recentProvider?: string
  recentLabel?: string
  emailLabel?: string
  emailPlaceholder?: string
  passwordLabel?: string
  passwordPlaceholder?: string
  /** Helper line under the password field; replaced by `errors.password` when set. Pass "" to hide. */
  passwordHint?: string
  minPasswordLength?: number
  submitLabel?: string
  /** Omit to hide the sign-in line. */
  signInHref?: string
  signInPrompt?: string
  signInLabel?: string
  /** Component used for links, e.g. Next.js or Inertia `Link`. Defaults to `"a"`. */
  linkComponent?: React.ElementType
  /** Field errors from your backend. */
  errors?: { email?: string; password?: string }
  /** Optional neutral slot under the footer line (e.g. terms copy). */
  footer?: React.ReactNode
  onSubmit?: (values: { email: string; password: string }) => void | Promise<void>
  onProvider?: (id: string) => void
  className?: string
}) {
  const id = React.useId()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [pending, run] = usePending()
  const hintId = `${id}-password-hint`
  const showHint = !errors?.password && Boolean(passwordHint)
  return (
    <AuthCard
      logo={logo}
      title={title}
      subtitle={subtitle}
      className={className}
      footer={footer}
      footerText={signInHref ? <AuthFooterLink prompt={signInPrompt} label={signInLabel} href={signInHref} linkComponent={linkComponent} /> : undefined}
    >
      {providers.length > 0 && (
        <>
          <ProviderButtons providers={providers} recent={recentProvider} recentLabel={recentLabel} disabled={pending} onSelect={onProvider} />
          <AuthDivider />
        </>
      )}
      <form
        className="flex flex-col gap-8"
        onSubmit={(e) => {
          e.preventDefault()
          run(() => onSubmit?.({ email, password }))
        }}
      >
        <div className="flex flex-col gap-6">
          <AuthField
            id={`${id}-email`}
            name="email"
            label={emailLabel}
            type="email"
            autoComplete="email"
            placeholder={emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors?.email}
            required
          />
          <div className="flex flex-col gap-1.5">
            <AuthField
              id={`${id}-password`}
              name="password"
              label={passwordLabel}
              type="password"
              autoComplete="new-password"
              placeholder={passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={minPasswordLength}
              error={errors?.password}
              aria-describedby={showHint ? hintId : undefined}
              required
            />
            {showHint && (
              <p id={hintId} className="text-[0.8125rem]/[1.125rem] text-subtle">
                {passwordHint}
              </p>
            )}
          </div>
        </div>
        <AuthSubmit pending={pending}>{submitLabel}</AuthSubmit>
      </form>
    </AuthCard>
  )
}
