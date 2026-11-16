"use client"

import * as React from "react"
import { LogOutIcon, PlusIcon, SettingsIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export type AccountUser = {
  id: string
  name: string
  email: string
  imageUrl?: string
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("")
}

function UserAvatar({ user, size = "default", className }: { user: AccountUser; size?: "default" | "sm" | "lg"; className?: string }) {
  return (
    <Avatar size={size} className={className}>
      {user.imageUrl && <AvatarImage src={user.imageUrl} alt="" />}
      <AvatarFallback className="bg-solid text-xs font-semibold text-solid-foreground">{initials(user.name)}</AvatarFallback>
    </Avatar>
  )
}

/** The menu body on its own: user summary, manage/sign-out actions, other signed-in accounts and "Add account". */
export function AccountMenuPanel({
  user,
  otherAccounts = [],
  manageLabel = "Manage account",
  signOutLabel = "Sign out",
  addAccountLabel = "Add account",
  onManageAccount,
  onSignOut,
  onSwitchAccount,
  onAddAccount,
  className,
}: {
  user: AccountUser
  /** Other signed-in sessions to switch to. */
  otherAccounts?: AccountUser[]
  manageLabel?: string
  signOutLabel?: string
  addAccountLabel?: string
  onManageAccount?: () => void
  onSignOut?: () => void
  onSwitchAccount?: (id: string) => void
  /** Omit to hide the "Add account" row. */
  onAddAccount?: () => void
  className?: string
}) {
  return (
    <div data-slot="account-menu-panel" className={cn("flex flex-col", className)}>
      <div className="flex items-center gap-4 px-5 pt-4 pb-3">
        <UserAvatar user={user} size="lg" />
        <div className="min-w-0">
          <div className="truncate text-[0.8125rem]/[1.125rem] font-medium tracking-[-0.01em] text-foreground">{user.name}</div>
          <div className="truncate text-xs text-muted-foreground">{user.email}</div>
        </div>
      </div>
      <div className="flex gap-2 pr-5 pb-4 pl-19">
        <Button variant="elevated" size="compact-sm" onClick={onManageAccount}>
          <SettingsIcon className="size-3.5" aria-hidden="true" />
          {manageLabel}
        </Button>
        <Button variant="elevated" size="compact-sm" className="flex-1" onClick={onSignOut}>
          <LogOutIcon className="size-3.5" aria-hidden="true" />
          {signOutLabel}
        </Button>
      </div>
      {otherAccounts.length > 0 && (
        <>
          <Separator className="bg-edge/6" />
          <ul className="flex flex-col p-1" aria-label="Other accounts">
            {otherAccounts.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => onSwitchAccount?.(a.id)}
                  className="flex w-full items-center gap-4 rounded-md px-4 py-2 text-left outline-none hover:bg-surface-muted focus-visible:bg-surface-muted focus-visible:ring-2 focus-visible:ring-brand/40"
                >
                  <span className="flex w-10 justify-center">
                    <UserAvatar user={a} size="sm" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[0.8125rem]/[1.125rem] font-medium text-foreground">{a.name}</span>
                    <span className="block truncate text-xs text-subtle">{a.email}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      {onAddAccount && (
        <>
          <Separator className="bg-edge/6" />
          <div className="p-1">
            <button
              type="button"
              onClick={onAddAccount}
              className="flex h-10 w-full items-center gap-4 rounded-md px-4 text-[0.8125rem] font-medium text-muted-foreground outline-none hover:bg-surface-muted hover:text-foreground focus-visible:bg-surface-muted focus-visible:ring-2 focus-visible:ring-brand/40"
            >
              <span className="flex w-10 justify-center">
                <span className="grid size-6 place-items-center rounded-full border border-dashed border-edge/20 bg-surface-muted">
                  <PlusIcon className="size-3" aria-hidden="true" />
                </span>
              </span>
              {addAccountLabel}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

/** Avatar button that opens an account popover with the user summary and "Manage account" / "Sign out" actions. */
export function AccountMenu({
  defaultOpen,
  align = "end",
  ...props
}: React.ComponentProps<typeof AccountMenuPanel> & {
  defaultOpen?: boolean
  align?: "start" | "center" | "end"
}) {
  const [open, setOpen] = React.useState(defaultOpen ?? false)
  const close = <T extends unknown[]>(fn?: (...args: T) => void) => (...args: T) => {
    setOpen(false)
    fn?.(...args)
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label={`Open account menu for ${props.user.name}`}
        className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-brand/40"
      >
        <UserAvatar user={props.user} className="size-7" />
      </PopoverTrigger>
      <PopoverContent align={align} sideOffset={8} className="w-90 max-w-[calc(100vw-2rem)] gap-0 p-0">
        <AccountMenuPanel
          {...props}
          onManageAccount={close(props.onManageAccount)}
          onSignOut={close(props.onSignOut)}
          onSwitchAccount={close(props.onSwitchAccount)}
          onAddAccount={props.onAddAccount && close(props.onAddAccount)}
        />
      </PopoverContent>
    </Popover>
  )
}

const demoUser: AccountUser = { id: "u_1", name: "Ada Park", email: "ada.park@example.com" }
const demoOthers: AccountUser[] = [{ id: "u_2", name: "Ada Park (Work)", email: "ada@acme.example" }]

export default function AccountMenuDemo() {
  return (
    <div className="min-h-96 w-full bg-background">
      <header className="flex h-12 items-center justify-between border-b border-edge/6 bg-surface px-4 sm:px-6">
        <span className="text-sm font-semibold text-foreground">Acme</span>
        <AccountMenu defaultOpen user={demoUser} otherAccounts={demoOthers} onAddAccount={() => {}} />
      </header>
    </div>
  )
}
