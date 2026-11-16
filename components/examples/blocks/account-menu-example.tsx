"use client"

import { AccountMenu, type AccountUser } from "@/components/blocks/account-menu"

const user: AccountUser = { id: "usr_01", name: "Ada Park", email: "ada.park@example.com" }
const otherAccounts: AccountUser[] = [{ id: "usr_02", name: "Ada Park (Work)", email: "ada@acme.example" }]

export default function AccountMenuExample() {
  return (
    <div className="min-h-96 w-full bg-background">
      <header className="flex h-12 items-center justify-between border-b border-edge/6 bg-surface px-4 sm:px-6">
        <span className="text-sm font-semibold text-foreground">Acme</span>
        <AccountMenu
          user={user}
          otherAccounts={otherAccounts}
          onManageAccount={() => {}}
          onSignOut={() => {}}
          onSwitchAccount={() => {}}
          onAddAccount={() => {}}
          onSignOutAll={() => {}}
        />
      </header>
    </div>
  )
}
