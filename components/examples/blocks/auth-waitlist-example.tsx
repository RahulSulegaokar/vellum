"use client"

import { AuthLogo } from "@/components/blocks/auth-sign-in"
import { AuthWaitlist } from "@/components/blocks/auth-waitlist"

export default function AuthWaitlistExample() {
  return (
    <div className="flex justify-center bg-background p-6 sm:p-10">
      <AuthWaitlist
        logo={<AuthLogo name="Acme" href="#home" />}
        subtitle="Get an email as soon as access opens up."
        signInHref="#sign-in"
        onSubmit={() => new Promise((r) => setTimeout(r, 800))}
      />
    </div>
  )
}
