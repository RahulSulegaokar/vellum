"use client"

import { AuthLogo } from "@/components/blocks/auth-sign-in"
import { AuthSignUp } from "@/components/blocks/auth-sign-up"

const providers = [
  { id: "github", label: "GitHub" },
  { id: "google", label: "Google" },
]

export default function AuthSignUpExample() {
  return (
    <div className="flex justify-center bg-background p-6 sm:p-10">
      <AuthSignUp
        logo={<AuthLogo name="Acme" href="#home" />}
        subtitle="Start your free trial. No card needed."
        providers={providers}
        signInHref="#sign-in"
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
