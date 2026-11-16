"use client"

import * as React from "react"
import { LogOutIcon, PlusIcon, SettingsIcon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
      <AvatarFallback className="text-xs font-semibold">{initials(user.name)}</AvatarFallback>
    </Avatar>
  )
}

function AccountSummary({ user }: { user: AccountUser }) {
  return (
    <div className="flex min-w-0 items-center gap-4">
      <UserAvatar user={user} size="lg" />
      <div className="min-w-0">
        <div className="truncate text-[0.8125rem]/[1.125rem] font-medium tracking-[-0.01em] text-foreground">{user.name}</div>
        <div className="truncate text-xs text-muted-foreground">{user.email}</div>
      </div>
    </div>
  )
}

type SignOutAllCopy = {
  /** Shows a "Sign out of all accounts" action, confirmed in a dialog. Omit to hide it. */
  onSignOutAll?: () => void
  signOutAllLabel?: string
  signOutAllTitle?: string
  signOutAllDescription?: string
  cancelLabel?: string
}

function SignOutAllDialog({
  open,
  onOpenChange,
  onSignOutAll,
  signOutAllLabel = "Sign out of all accounts",
  signOutAllTitle = "Sign out of all accounts?",
  signOutAllDescription = "Every account on this device will be signed out. You'll need to sign in to each one again.",
  cancelLabel = "Cancel",
}: SignOutAllCopy & { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{signOutAllTitle}</AlertDialogTitle>
          <AlertDialogDescription>{signOutAllDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="elevated" size="compact">
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            size="compact"
            className="bg-destructive-strong text-destructive-foreground hover:bg-destructive-strong/90"
            onClick={() => {
              onOpenChange(false)
              onSignOutAll?.()
            }}
          >
            {signOutAllLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

type AccountMenuProps = SignOutAllCopy & {
  user: AccountUser
  /** Other signed-in accounts to switch to. */
  otherAccounts?: AccountUser[]
  manageLabel?: string
  signOutLabel?: string
  addAccountLabel?: string
  switchAccountLabel?: string
  /** Omit to hide the "Manage account" action. */
  onManageAccount?: () => void
  onSignOut?: () => void
  onSwitchAccount?: (id: string) => void
  /** Omit to hide the "Add account" row. */
  onAddAccount?: () => void
  className?: string
}

/**
 * The account panel on its own, for inline use (a sheet, a settings page): user summary, manage/sign-out buttons,
 * other signed-in accounts and "Add account". Use `AccountMenu` for the avatar-triggered dropdown.
 */
export function AccountMenuPanel({
  user,
  otherAccounts = [],
  manageLabel = "Manage account",
  signOutLabel = "Sign out",
  addAccountLabel = "Add account",
  switchAccountLabel = "Switch account",
  onManageAccount,
  onSignOut,
  onSwitchAccount,
  onAddAccount,
  className,
  ...signOutAll
}: AccountMenuProps) {
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  return (
    <div data-slot="account-menu-panel" className={cn("flex flex-col", className)}>
      <div className={cn("px-5 pt-4", onManageAccount || onSignOut ? "pb-3" : "pb-4")}>
        <AccountSummary user={user} />
      </div>
      {(onManageAccount || onSignOut) && (
        <div className="flex flex-wrap gap-2 pr-5 pb-4 pl-19">
          {onManageAccount && (
            <Button variant="elevated" size="compact-sm" onClick={onManageAccount}>
              <SettingsIcon className="size-3.5" aria-hidden="true" />
              {manageLabel}
            </Button>
          )}
          {onSignOut && (
            <Button variant="elevated" size="compact-sm" className="flex-1" onClick={onSignOut}>
              <LogOutIcon className="size-3.5" aria-hidden="true" />
              {signOutLabel}
            </Button>
          )}
        </div>
      )}
      {otherAccounts.length > 0 && (
        <>
          <Separator className="bg-edge/6" />
          <ul className="flex flex-col p-1" aria-label={switchAccountLabel}>
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
                    <span className="block truncate text-xs text-muted-foreground">{a.email}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      {(onAddAccount || signOutAll.onSignOutAll) && (
        <>
          <Separator className="bg-edge/6" />
          <div className="flex flex-col p-1">
            {onAddAccount && (
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
            )}
            {signOutAll.onSignOutAll && (
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="flex h-10 w-full items-center gap-4 rounded-md px-4 text-[0.8125rem] font-medium text-destructive-text outline-none hover:bg-destructive/6 focus-visible:bg-destructive/6 focus-visible:ring-2 focus-visible:ring-brand/40"
              >
                <span className="flex w-10 justify-center">
                  <LogOutIcon className="size-3.5" aria-hidden="true" />
                </span>
                {signOutAll.signOutAllLabel ?? "Sign out of all accounts"}
              </button>
            )}
          </div>
          <SignOutAllDialog open={confirmOpen} onOpenChange={setConfirmOpen} {...signOutAll} />
        </>
      )}
    </div>
  )
}

/**
 * Avatar button that opens an account dropdown menu: user summary, "Manage account" and "Sign out",
 * other signed-in accounts to switch to, "Add account" and an optional confirmed "Sign out of all accounts".
 */
export function AccountMenu({
  user,
  otherAccounts = [],
  manageLabel = "Manage account",
  signOutLabel = "Sign out",
  addAccountLabel = "Add account",
  switchAccountLabel = "Switch account",
  onManageAccount,
  onSignOut,
  onSwitchAccount,
  onAddAccount,
  defaultOpen,
  align = "end",
  className,
  ...signOutAll
}: AccountMenuProps & {
  defaultOpen?: boolean
  align?: "start" | "center" | "end"
}) {
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const hasFooter = Boolean(onAddAccount || signOutAll.onSignOutAll)
  return (
    <>
      <DropdownMenu defaultOpen={defaultOpen}>
        <DropdownMenuTrigger
          aria-label={`Account menu for ${user.name}`}
          className={cn("rounded-full outline-none focus-visible:ring-3 focus-visible:ring-brand/40", className)}
        >
          <UserAvatar user={user} className="size-7" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align={align} sideOffset={8} className="w-80 max-w-[calc(100vw-2rem)]">
          <div className="px-2 pt-2 pb-2.5">
            <AccountSummary user={user} />
          </div>
          {(onManageAccount || onSignOut) && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {onManageAccount && (
                  <DropdownMenuItem onClick={onManageAccount}>
                    <SettingsIcon aria-hidden="true" />
                    {manageLabel}
                  </DropdownMenuItem>
                )}
                {onSignOut && (
                  <DropdownMenuItem onClick={onSignOut}>
                    <LogOutIcon aria-hidden="true" />
                    {signOutLabel}
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </>
          )}
          {otherAccounts.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel>{switchAccountLabel}</DropdownMenuLabel>
                {otherAccounts.map((a) => (
                  <DropdownMenuItem key={a.id} onClick={() => onSwitchAccount?.(a.id)} className="gap-3 py-1.5">
                    <UserAvatar user={a} size="sm" />
                    <span className="min-w-0">
                      <span className="block truncate text-[0.8125rem]/[1.125rem] font-medium">{a.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">{a.email}</span>
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </>
          )}
          {hasFooter && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {onAddAccount && (
                  <DropdownMenuItem onClick={onAddAccount}>
                    <PlusIcon aria-hidden="true" />
                    {addAccountLabel}
                  </DropdownMenuItem>
                )}
                {signOutAll.onSignOutAll && (
                  <DropdownMenuItem variant="destructive" onClick={() => setConfirmOpen(true)}>
                    <LogOutIcon aria-hidden="true" />
                    {signOutAll.signOutAllLabel ?? "Sign out of all accounts"}
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {signOutAll.onSignOutAll && <SignOutAllDialog open={confirmOpen} onOpenChange={setConfirmOpen} {...signOutAll} />}
    </>
  )
}
