"use client"

import * as React from "react"
import {
  AuthCard,
  AuthDivider,
  AuthField,
  AuthSubmit,
  ProviderButtons,
  defaultProviders,
  usePending,
  type AuthProvider,
} from "@/components/blocks/auth-sign-in"

/** Sign-up card: logo, provider buttons, email and password (with show/hide), primary continue and a link to sign in. */
export function AuthSignUp({
  logo,
  title = "Create your account",
  subtitle = "Welcome! Fill in the details to get started.",
  providers = defaultProviders,
  lastUsedProvider,
  emailLabel = "Email address",
  emailPlaceholder = "Enter your email address",
  passwordLabel = "Password",
  passwordPlaceholder = "Create a password",
  passwordHint = "At least 8 characters.",
  minPasswordLength = 8,
  submitLabel = "Continue",
  signInHref = "#sign-in",
  signInPrompt = "Already have an account?",
  signInLabel = "Sign in",
  errors,
  footer,
  onSubmit,
  onProvider,
  className,
}: {
  logo?: React.ReactNode
  title?: string
  subtitle?: React.ReactNode
  providers?: AuthProvider[]
  lastUsedProvider?: string
  emailLabel?: string
  emailPlaceholder?: string
  passwordLabel?: string
  passwordPlaceholder?: string
  /** Helper line under the password field; replaced by `errors.password` when set. */
  passwordHint?: string
  minPasswordLength?: number
  submitLabel?: string
  signInHref?: string
  signInPrompt?: string
  signInLabel?: string
  /** Field errors from your backend. */
  errors?: { email?: string; password?: string }
  /** Optional neutral slot under the footer line (e.g. terms copy). */
  footer?: React.ReactNode
  onSubmit?: (values: { email: string; password: string }) => void | Promise<void>
  onProvider?: (id: string) => void
  className?: string
}) {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
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
          {signInPrompt}{" "}
          <a href={signInHref} className="rounded-sm font-medium text-foreground outline-none hover:underline focus-visible:ring-2 focus-visible:ring-brand/40">
            {signInLabel}
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
          run(() => onSubmit?.({ email, password }))
        }}
      >
        <div className="flex flex-col gap-6">
          <AuthField
            id="emailAddress"
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
              id="password"
              label={passwordLabel}
              type="password"
              autoComplete="new-password"
              placeholder={passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={minPasswordLength}
              error={errors?.password}
              aria-describedby={!errors?.password && passwordHint ? "password-hint" : undefined}
              required
            />
            {!errors?.password && passwordHint && (
              <p id="password-hint" className="text-[0.8125rem]/[1.125rem] text-subtle">
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

export default function AuthSignUpDemo() {
  return (
    <div className="flex justify-center bg-background p-6 sm:p-10">
      <AuthSignUp
        onSubmit={() => new Promise((r) => setTimeout(r, 800))}
        footer={
          <p className="text-xs text-subtle">
            By signing up, you agree to our{" "}
            <a href="#terms" className="font-medium hover:text-foreground">
              Terms
            </a>{" "}
            and{" "}
            <a href="#privacy" className="font-medium hover:text-foreground">
              Privacy Policy
            </a>
            .
          </p>
        }
      />
    </div>
  )
}
