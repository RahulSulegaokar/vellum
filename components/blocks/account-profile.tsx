"use client"

import * as React from "react"
import { CreditCardIcon, KeyRoundIcon, MoreHorizontalIcon, PlusIcon, ShieldIcon, UserIcon } from "lucide-react"
import { EmptyState } from "@/components/blocks/empty-state"
import { ProviderGlyph } from "@/components/blocks/auth-sign-in"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export type ProfileNavItem = { id: string; label: string; icon?: React.ReactNode }
export type ProfileEmail = { address: string; primary?: boolean; verified?: boolean }
export type ConnectedAccount = { id: string; provider: string; account: string; icon?: React.ReactNode }

const defaultNav: ProfileNavItem[] = [
  { id: "profile", label: "Profile", icon: <UserIcon /> },
  { id: "security", label: "Security", icon: <ShieldIcon /> },
  { id: "billing", label: "Billing", icon: <CreditCardIcon /> },
  { id: "api-keys", label: "API keys", icon: <KeyRoundIcon /> },
]

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("")
}

/** Settings shell: title and vertical nav on the muted rail, the active section in a white panel. Nav scrolls horizontally on narrow screens. */
export function ProfileShell({
  title,
  subtitle,
  nav,
  active,
  onNavChange,
  className,
  children,
}: {
  title: string
  subtitle?: string
  nav: ProfileNavItem[]
  active: string
  onNavChange?: (id: string) => void
  className?: string
  children: React.ReactNode
}) {
  return (
    <div data-slot="profile-shell" className={cn("flex w-full flex-col rounded-xl bg-surface-muted shadow-dialog ring-1 ring-edge/6 sm:min-h-126 sm:flex-row", className)}>
      <div className="flex shrink-0 flex-col sm:w-48">
        <div className="flex flex-col justify-center px-5 py-4 sm:h-18.5 sm:py-0">
          <h2 className="text-[1.0625rem]/6 font-bold tracking-[-0.01em] text-foreground">{title}</h2>
          {subtitle && <p className="text-xs text-subtle">{subtitle}</p>}
        </div>
        <nav aria-label={title} className="flex gap-0.5 overflow-x-auto px-2.5 pb-2.5 sm:flex-col sm:pb-0">
          {nav.map((n) => {
            const current = n.id === active
            return (
              <button
                key={n.id}
                type="button"
                aria-current={current ? "page" : undefined}
                onClick={() => onNavChange?.(n.id)}
                className={cn(
                  "flex h-7 shrink-0 items-center gap-2 rounded-md px-2.5 text-[0.8125rem] font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand/40 [&_svg]:size-3.5 [&_svg]:shrink-0",
                  current ? "bg-accent text-foreground" : "text-subtle hover:bg-subtle/6 hover:text-foreground"
                )}
              >
                {n.icon}
                {n.label}
              </button>
            )
          })}
        </nav>
      </div>
      <div className="flex min-w-0 flex-1 flex-col rounded-xl bg-surface px-5 py-5 shadow-surface ring-1 ring-edge/4 sm:px-6">{children}</div>
    </div>
  )
}

/** One labelled settings row: label on the left, content on the right; stacks on narrow screens. */
export function ProfileRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 border-b border-edge/6 py-4 last:border-0 md:flex-row md:gap-5">
      <h3 className="flex h-7 items-center text-[0.8125rem] font-medium text-foreground md:flex-1">{label}</h3>
      <div className="flex min-w-0 flex-col gap-1 md:w-88">{children}</div>
    </div>
  )
}

const addRowClass =
  "flex h-7 w-fit items-center gap-1.5 rounded-md px-2 text-[0.8125rem] font-medium text-foreground outline-none hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-brand/40"

/** Account profile panel with a sidebar nav and Profile, Email addresses and Connected accounts sections. */
export function AccountProfile({
  title = "Account",
  subtitle = "Manage your account info.",
  nav = defaultNav,
  defaultSection = "profile",
  user = { name: "Ada Park" },
  emails = demoEmails,
  connectedAccounts = demoConnected,
  renderSection,
  onUpdateProfile,
  onAddEmail,
  onSetPrimaryEmail,
  onRemoveEmail,
  onConnectAccount,
  onDisconnectAccount,
  className,
}: {
  title?: string
  subtitle?: string
  nav?: ProfileNavItem[]
  defaultSection?: string
  user?: { name: string; imageUrl?: string }
  emails?: ProfileEmail[]
  connectedAccounts?: ConnectedAccount[]
  /** Content for nav sections other than "profile". Falls back to an empty state. */
  renderSection?: (id: string) => React.ReactNode
  onUpdateProfile?: () => void
  onAddEmail?: () => void
  onSetPrimaryEmail?: (address: string) => void
  onRemoveEmail?: (address: string) => void
  onConnectAccount?: () => void
  onDisconnectAccount?: (id: string) => void
  className?: string
}) {
  const [section, setSection] = React.useState(defaultSection)
  const current = nav.find((n) => n.id === section)
  return (
    <ProfileShell title={title} subtitle={subtitle} nav={nav} active={section} onNavChange={setSection} className={className}>
      {section === "profile" ? (
        <>
          <h2 className="border-b border-edge/6 pb-3 text-sm/5 font-bold tracking-[-0.01em] text-foreground">Profile details</h2>
          <ProfileRow label="Profile">
            <div className="flex items-center gap-3 px-2 py-1">
              <Avatar size="lg">
                {user.imageUrl && <AvatarImage src={user.imageUrl} alt="" />}
                <AvatarFallback className="bg-solid text-xs font-semibold text-solid-foreground">{initials(user.name)}</AvatarFallback>
              </Avatar>
              <span className="min-w-0 flex-1 truncate text-[0.8125rem] font-medium text-foreground">{user.name}</span>
              <Button variant="ghost" size="compact-sm" onClick={onUpdateProfile}>
                Update profile
              </Button>
            </div>
          </ProfileRow>
          <ProfileRow label="Email addresses">
            <ul className="flex flex-col">
              {emails.map((e) => (
                <li key={e.address} className="flex h-8 items-center gap-2 px-2">
                  <span className="min-w-0 truncate text-[0.8125rem] font-medium text-foreground">{e.address}</span>
                  {e.primary && <Badge variant="subtle">Primary</Badge>}
                  {e.verified === false && <Badge variant="subtle-warning">Unverified</Badge>}
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={<Button variant="ghost" size="icon-compact-sm" className="ml-auto" aria-label={`Actions for ${e.address}`} />}
                    >
                      <MoreHorizontalIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      {!e.primary && <DropdownMenuItem onClick={() => onSetPrimaryEmail?.(e.address)}>Set as primary</DropdownMenuItem>}
                      <DropdownMenuItem variant="destructive" disabled={e.primary} onClick={() => onRemoveEmail?.(e.address)}>
                        Remove email
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              ))}
            </ul>
            <button type="button" onClick={onAddEmail} className={addRowClass}>
              <PlusIcon className="size-3.5" aria-hidden="true" />
              Add email address
            </button>
          </ProfileRow>
          <ProfileRow label="Connected accounts">
            <ul className="flex flex-col">
              {connectedAccounts.map((a) => (
                <li key={a.id} className="flex h-8 items-center gap-2 px-2 text-[0.8125rem]">
                  {a.icon ?? <ProviderGlyph label={a.provider} />}
                  <span className="font-medium text-foreground">{a.provider}</span>
                  <span className="min-w-0 truncate text-subtle">· {a.account}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={<Button variant="ghost" size="icon-compact-sm" className="ml-auto" aria-label={`Actions for ${a.provider} account`} />}
                    >
                      <MoreHorizontalIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem variant="destructive" onClick={() => onDisconnectAccount?.(a.id)}>
                        Disconnect
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              ))}
            </ul>
            <button type="button" onClick={onConnectAccount} className={addRowClass}>
              <PlusIcon className="size-3.5" aria-hidden="true" />
              Connect account
            </button>
          </ProfileRow>
        </>
      ) : (
        (renderSection?.(section) ?? (
          <div className="grid flex-1 place-items-center">
            <EmptyState title={`${current?.label ?? "This section"} is empty`} description="Nothing to show here yet." />
          </div>
        ))
      )}
    </ProfileShell>
  )
}

const demoEmails: ProfileEmail[] = [
  { address: "ada.park@example.com", primary: true },
  { address: "ada@acme.example", verified: false },
]
const demoConnected: ConnectedAccount[] = [{ id: "ca_1", provider: "Google", account: "ada.park@example.com" }]

export default function AccountProfileDemo() {
  return (
    <div className="mx-auto max-w-4xl p-6 sm:p-10">
      <AccountProfile />
    </div>
  )
}
