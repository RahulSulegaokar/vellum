"use client"

import * as React from "react"
import { Banner } from "@/components/blocks/banner"

export default function BannerExample() {
  const [shown, setShown] = React.useState(true)
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-3 p-6 sm:p-10">
      <Banner tone="info" title="Your trial ends in 9 days" action={<a href="#billing" className="underline underline-offset-4">Choose a plan</a>}>
        Add a payment method to keep sending without interruption.
      </Banner>
      <Banner tone="warning" title="Sending is paused">
        Your daily limit was reached. Sending resumes at 14:20.
      </Banner>
      <Banner tone="destructive" title="Template was not approved" action={<a href="#templates" className="underline underline-offset-4">Review</a>}>
        Two scheduled sends are on hold until it is fixed.
      </Banner>
      {shown && (
        <Banner tone="success" onDismiss={() => setShown(false)}>
          Your number is verified and ready to send.
        </Banner>
      )}
    </div>
  )
}
