"use client"

import * as React from "react"
import { BellIcon, CreditCardIcon, KeyRoundIcon, ShieldIcon, UserIcon } from "lucide-react"
import { AccountProfile, type LinkedAccount, type ProfileEmail, type ProfileNavItem } from "@/components/blocks/account-profile"

const nav: ProfileNavItem[] = [
  { id: "profile", label: "Profile", icon: <UserIcon /> },
  { id: "security", label: "Security", icon: <ShieldIcon /> },
  { id: "notifications", label: "Notifications", icon: <BellIcon /> },
  { id: "billing", label: "Billing", icon: <CreditCardIcon /> },
  { id: "api-keys", label: "API keys", icon: <KeyRoundIcon /> },
]

const initialEmails: ProfileEmail[] = [
  { address: "ada.park@example.com", primary: true },
  { address: "ada@acme.example", verified: false },
]

const initialLinked: LinkedAccount[] = [{ id: "1", provider: "Google", account: "ada.park@example.com" }]

export default function AccountProfileExample() {
  const [emails, setEmails] = React.useState(initialEmails)
  const [linked, setLinked] = React.useState(initialLinked)
  return (
    <div className="mx-auto max-w-4xl p-6 sm:p-10">
      <AccountProfile
        nav={nav}
        subtitle="Your profile and sign-in details."
        user={{ name: "Ada Park" }}
        emails={emails}
        linkedAccounts={linked}
        onUpdateProfile={() => {}}
        onAddEmail={() => {}}
        onSetPrimaryEmail={(address) => setEmails((list) => list.map((e) => ({ ...e, primary: e.address === address })))}
        onRemoveEmail={(address) => setEmails((list) => list.filter((e) => e.address !== address))}
        onLinkAccount={() => {}}
        onUnlinkAccount={(id) => setLinked((list) => list.filter((a) => a.id !== id))}
      />
    </div>
  )
}
