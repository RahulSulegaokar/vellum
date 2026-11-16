"use client"

import * as React from "react"
import { MoreHorizontalIcon, PlusIcon, UserIcon } from "lucide-react"
import { EmptyState } from "@/components/blocks/empty-state"
import { ProviderGlyph } from "@/components/blocks/auth-sign-in"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export type ProfileNavItem = {
  id: string
  label: string
  icon?: React.ReactNode
  /** Render the item as a link instead of switching sections in place. */
  href?: string
}
export type ProfileEmail = { address: string; primary?: boolean; verified?: boolean }
export type LinkedAccount = { id: string; provider: string; account: string; icon?: React.ReactNode }

const defaultNav: ProfileNavItem[] = [{ id: "profile", label: "Profile", icon: <UserIcon /> }]

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("")
}

/**
 * Settings shell: title and vertical nav on the muted rail, the active section in a white panel. Nav scrolls horizontally on narrow screens.
 * Nav items with an `href` render as links through `linkComponent` (e.g. your router's `Link`; defaults to `"a"`); the rest are buttons that call `onNavChange`.
 */
export function ProfileShell({
  title,
  subtitle,
  nav,
  active,
  onNavChange,
  linkComponent,
  className,
  children,
}: {
  title: string
  subtitle?: string
  nav: ProfileNavItem[]
  active: string
  onNavChange?: (id: string) => void
  /** Component used for nav links, e.g. Next.js or Inertia `Link`. Defaults to `"a"`. */
  linkComponent?: React.ElementType
  className?: string
  children: React.ReactNode
}) {
  const Link = linkComponent ?? "a"
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
            const itemClass = cn(
              "flex h-7 shrink-0 items-center gap-2 rounded-md px-2.5 text-[0.8125rem] font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand/40 [&_svg]:size-3.5 [&_svg]:shrink-0",
              current ? "bg-accent text-foreground" : "text-subtle hover:bg-subtle/6 hover:text-foreground"
            )
            return n.href ? (
              <Link key={n.id} href={n.href} aria-current={current ? "page" : undefined} className={itemClass}>
                {n.icon}
                {n.label}
              </Link>
            ) : (
              <button key={n.id} type="button" aria-current={current ? "true" : undefined} onClick={() => onNavChange?.(n.id)} className={itemClass}>
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

type PendingConfirm = { kind: "email"; key: string } | { kind: "account"; key: string; label: string }

/**
 * Account settings panel with a sidebar nav and a Profile section (avatar and name, email addresses, linked sign-in accounts).
 * Removing an email or unlinking an account asks for confirmation first. Pass `nav` and `renderSection` to add more sections.
 */
export function AccountProfile({
  title = "Account settings",
  subtitle,
  nav = defaultNav,
  defaultSection = "profile",
  linkComponent,
  user,
  emails = [],
  linkedAccounts = [],
  renderSection,
  onUpdateProfile,
  onAddEmail,
  onSetPrimaryEmail,
  onRemoveEmail,
  onLinkAccount,
  onUnlinkAccount,
  className,
}: {
  title?: string
  subtitle?: string
  /** Sidebar sections. The "profile" id renders the built-in profile section. */
  nav?: ProfileNavItem[]
  defaultSection?: string
  /** Component used for nav items with an `href`, e.g. Next.js or Inertia `Link`. Defaults to `"a"`. */
  linkComponent?: React.ElementType
  user: { name: string; imageUrl?: string }
  emails?: ProfileEmail[]
  /** Third-party sign-in accounts linked to this user. */
  linkedAccounts?: LinkedAccount[]
  /** Content for nav sections other than "profile". Falls back to an empty state. */
  renderSection?: (id: string) => React.ReactNode
  /** Omit to hide the "Edit profile" button. */
  onUpdateProfile?: () => void
  /** Omit to hide "Add email address". */
  onAddEmail?: () => void
  onSetPrimaryEmail?: (address: string) => void
  /** Called after the user confirms. */
  onRemoveEmail?: (address: string) => void
  /** Omit to hide "Link account". */
  onLinkAccount?: () => void
  /** Called after the user confirms. */
  onUnlinkAccount?: (id: string) => void
  className?: string
}) {
  const [section, setSection] = React.useState(defaultSection)
  const [confirm, setConfirm] = React.useState<PendingConfirm | null>(null)
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const current = nav.find((n) => n.id === section)
  const ask = (c: PendingConfirm) => {
    setConfirm(c)
    setConfirmOpen(true)
  }
  const showEmails = emails.length > 0 || Boolean(onAddEmail)
  const showLinked = linkedAccounts.length > 0 || Boolean(onLinkAccount)
  return (
    <ProfileShell title={title} subtitle={subtitle} nav={nav} active={section} onNavChange={setSection} linkComponent={linkComponent} className={className}>
      {section === "profile" ? (
        <>
          <h2 className="border-b border-edge/6 pb-3 text-sm/5 font-bold tracking-[-0.01em] text-foreground">Profile</h2>
          <ProfileRow label="Name and photo">
            <div className="flex items-center gap-3 px-2 py-1">
              <Avatar size="lg">
                {user.imageUrl && <AvatarImage src={user.imageUrl} alt="" />}
                <AvatarFallback className="text-xs font-semibold">{initials(user.name)}</AvatarFallback>
              </Avatar>
              <span className="min-w-0 flex-1 truncate text-[0.8125rem] font-medium text-foreground">{user.name}</span>
              {onUpdateProfile && (
                <Button variant="ghost" size="compact-sm" onClick={onUpdateProfile}>
                  Edit profile
                </Button>
              )}
            </div>
          </ProfileRow>
          {showEmails && (
            <ProfileRow label="Email addresses">
              {emails.length > 0 && (
                <ul className="flex flex-col">
                  {emails.map((e) => {
                    const canSetPrimary = !e.primary && Boolean(onSetPrimaryEmail)
                    const canRemove = !e.primary && Boolean(onRemoveEmail)
                    return (
                      <li key={e.address} className="flex h-8 items-center gap-2 px-2">
                        <span className="min-w-0 truncate text-[0.8125rem] font-medium text-foreground">{e.address}</span>
                        {e.primary && <Badge variant="subtle">Primary</Badge>}
                        {e.verified === false && <Badge variant="subtle-warning">Unverified</Badge>}
                        {(canSetPrimary || canRemove) && (
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={<Button variant="ghost" size="icon-compact-sm" className="ml-auto" aria-label={`Actions for ${e.address}`} />}
                            >
                              <MoreHorizontalIcon aria-hidden="true" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              {canSetPrimary && <DropdownMenuItem onClick={() => onSetPrimaryEmail?.(e.address)}>Set as primary</DropdownMenuItem>}
                              {canRemove && (
                                <DropdownMenuItem variant="destructive" onClick={() => ask({ kind: "email", key: e.address })}>
                                  Remove email
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </li>
                    )
                  })}
                </ul>
              )}
              {onAddEmail && (
                <button type="button" onClick={onAddEmail} className={addRowClass}>
                  <PlusIcon className="size-3.5" aria-hidden="true" />
                  Add email address
                </button>
              )}
            </ProfileRow>
          )}
          {showLinked && (
            <ProfileRow label="Linked accounts">
              {linkedAccounts.length > 0 && (
                <ul className="flex flex-col">
                  {linkedAccounts.map((a) => (
                    <li key={a.id} className="flex h-8 items-center gap-2 px-2 text-[0.8125rem]">
                      {a.icon ?? <ProviderGlyph label={a.provider} />}
                      <span className="font-medium text-foreground">{a.provider}</span>
                      <span className="min-w-0 truncate text-subtle">· {a.account}</span>
                      {onUnlinkAccount && (
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={<Button variant="ghost" size="icon-compact-sm" className="ml-auto" aria-label={`Actions for ${a.provider} account`} />}
                          >
                            <MoreHorizontalIcon aria-hidden="true" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem variant="destructive" onClick={() => ask({ kind: "account", key: a.id, label: a.provider })}>
                              Unlink
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {onLinkAccount && (
                <button type="button" onClick={onLinkAccount} className={addRowClass}>
                  <PlusIcon className="size-3.5" aria-hidden="true" />
                  Link account
                </button>
              )}
            </ProfileRow>
          )}
        </>
      ) : (
        (renderSection?.(section) ?? (
          <div className="grid flex-1 place-items-center">
            <EmptyState title={`${current?.label ?? "This section"} is empty`} description="Nothing to show here yet." />
          </div>
        ))
      )}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen} onOpenChangeComplete={(open) => !open && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirm?.kind === "account" ? `Unlink ${confirm.label}?` : "Remove email address?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirm?.kind === "account"
                ? "You won't be able to sign in with this account until you link it again."
                : `${confirm?.key ?? "This address"} will no longer be able to sign in or receive account email.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="elevated" size="compact">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              size="compact"
              className="bg-destructive-strong text-destructive-foreground hover:bg-destructive-strong/90"
              onClick={() => {
                if (confirm?.kind === "email") onRemoveEmail?.(confirm.key)
                if (confirm?.kind === "account") onUnlinkAccount?.(confirm.key)
                setConfirmOpen(false)
              }}
            >
              {confirm?.kind === "account" ? "Unlink" : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ProfileShell>
  )
}
