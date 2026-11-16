"use client"

import { AuthLogo, AuthSignIn } from "@/components/blocks/auth-sign-in"

const providers = [
  { id: "github", label: "GitHub" },
  { id: "google", label: "Google" },
]

export default function AuthSignInExample() {
  return (
    <div className="flex justify-center bg-background p-6 sm:p-10">
      <AuthSignIn
        logo={<AuthLogo name="Acme" href="#home" />}
        title="Sign in to Acme"
        subtitle="Welcome back. Sign in to continue."
        providers={providers}
        recentProvider="google"
        alternativeLabel="Email me a sign-in link"
        onAlternative={() => {}}
        signUpHref="#sign-up"
        onSubmit={() => new Promise((r) => setTimeout(r, 800))}
      />
    </div>
  )
}
