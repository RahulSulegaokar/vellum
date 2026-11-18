"use client"

import * as React from "react"
import { MoreHorizontalIcon, PlusIcon, SearchIcon, UsersIcon } from "lucide-react"
import { EmptyState } from "@/components/blocks/empty-state"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogSection,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export type Member = {
  id: string
  name: string
  email: string
  role: string
  /** ISO date, formatted deterministically. */
  joinedAt: string
  imageUrl?: string
}

export type Invitation = { id: string; email: string; role: string; invitedAt: string }

export type Role = {
  name: string
  key: string
  permissions: number
  description?: string
}

/** Built-in strings of MembersCard and RolesCard; pass `labels` to translate them. */
export const membersCardLabels = {
  removeMemberTitle: (name: string) => `Remove ${name}?`,
  revokeInvitationTitle: "Revoke invitation?",
  removeMemberDescription: "They'll lose access to this workspace right away. You can invite them again later.",
  revokeInvitationDescription: (email: string) => `The invitation link sent to ${email} will stop working. You can send a new one later.`,
  cancel: "Cancel",
  removeMember: "Remove member",
  revokeInvitation: "Revoke invitation",
  inviteMembersTitle: "Invite members",
  inviteMembersDescription: "They'll get an email with a link to join this workspace.",
  emailAddresses: "Email addresses",
  emailsPlaceholder: "name@example.com, another@example.com",
  separateWithCommas: "Separate several addresses with commas.",
  role: "Role",
  sendInvitations: (count: number) => `Send ${count} invitations`,
  sendInvitation: "Send invitation",
  members: "Members",
  invitations: "Invitations",
  searchMembersPlaceholder: "Search members…",
  searchMembers: "Search members",
  invite: "Invite",
  user: "User",
  joined: "Joined",
  actions: "Actions",
  you: "You",
  roleFor: (name: string) => `Role for ${name}`,
  actionsFor: (name: string) => `Actions for ${name}`,
  removeMemberEllipsis: "Remove member…",
  noMatchingMembers: "No matching members",
  nobodyMatches: (query: string) => `Nobody matches “${query}”.`,
  noPendingInvitations: "No pending invitations",
  noPendingInvitationsDescription: "Invite teammates by email and they'll show up here until they join.",
  invited: (date: React.ReactNode): React.ReactNode => <>Invited {date}</>,
  revokeInvitationFor: (email: string) => `Revoke invitation for ${email}`,
  revoke: "Revoke",
  searchRolesPlaceholder: "Search roles…",
  searchRoles: "Search roles",
  createRole: "Create role",
  key: "Key",
  permissions: "Permissions",
  permissionCount: (count: number): React.ReactNode => (
    <>
      {count} {count === 1 ? "permission" : "permissions"}
    </>
  ),
  noRolesMatch: (query: React.ReactNode): React.ReactNode => <>No roles match “{query}”.</>,
}
export type MembersCardLabels = typeof membersCardLabels

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
const formatDate = (iso: string) => dateFormat.format(new Date(iso))

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("")
}

function SearchField({ value, onChange, placeholder, label }: { value: string; onChange: (v: string) => void; placeholder: string; label: string }) {
  return (
    <div className="relative w-full sm:w-60">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-placeholder" aria-hidden="true" />
      <Input variant="compact" type="search" aria-label={label} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className="pl-8" />
    </div>
  )
}

type PendingRemoval = { kind: "member"; id: string; label: string } | { kind: "invitation"; id: string; label: string }

function ConfirmRemoveDialog({
  target,
  onOpenChange,
  onConfirm,
  t,
}: {
  target: PendingRemoval | null
  onOpenChange: (open: boolean) => void
  onConfirm: (target: PendingRemoval) => void
  t: MembersCardLabels
}) {
  // Keep the last target so the copy doesn't change while the dialog animates out.
  const [last, setLast] = React.useState(target)
  if (target && target !== last) setLast(target)
  const shown = target ?? last
  const member = shown?.kind === "member"
  return (
    <Dialog open={target !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" showCloseButton={false}>
        <DialogPanel>
          <DialogHeader>
            <DialogTitle>{member ? t.removeMemberTitle(shown.label) : t.revokeInvitationTitle}</DialogTitle>
            <DialogDescription>
              {member
                ? t.removeMemberDescription
                : t.revokeInvitationDescription(shown?.label ?? "")}
            </DialogDescription>
          </DialogHeader>
        </DialogPanel>
        <DialogFooter>
          <DialogClose render={<Button type="button" variant="elevated" size="compact" />}>{t.cancel}</DialogClose>
          <Button type="button" variant="destructive" size="compact" onClick={() => target && onConfirm(target)}>
            {member ? t.removeMember : t.revokeInvitation}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function InviteDialog({
  open,
  onOpenChange,
  roles,
  onInvite,
  t,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  roles: string[]
  onInvite: (values: { emails: string[]; role: string }) => void | Promise<void>
  t: MembersCardLabels
}) {
  const id = React.useId()
  const [emails, setEmails] = React.useState("")
  const [role, setRole] = React.useState(roles[roles.length - 1] ?? "")
  const [pending, setPending] = React.useState(false)
  const list = emails
    .split(/[\s,]+/)
    .map((e) => e.trim())
    .filter(Boolean)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            if (list.length === 0) return
            setPending(true)
            try {
              await onInvite({ emails: list, role })
              setEmails("")
              onOpenChange(false)
            } finally {
              setPending(false)
            }
          }}
        >
          <DialogPanel>
            <DialogHeader>
              <DialogTitle>{t.inviteMembersTitle}</DialogTitle>
              <DialogDescription>{t.inviteMembersDescription}</DialogDescription>
            </DialogHeader>
            <DialogSection className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`${id}-emails`} className="text-[0.8125rem]">
                  {t.emailAddresses}
                </Label>
                <Input
                  id={`${id}-emails`}
                  variant="compact"
                  placeholder={t.emailsPlaceholder}
                  value={emails}
                  onChange={(e) => setEmails(e.target.value)}
                  autoComplete="off"
                  required
                />
                <p className="text-[0.8125rem] text-subtle">{t.separateWithCommas}</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`${id}-role`} className="text-[0.8125rem]">
                  {t.role}
                </Label>
                <Select value={role} onValueChange={(v) => setRole(v as string)}>
                  <SelectTrigger id={`${id}-role`} variant="elevated">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </DialogSection>
          </DialogPanel>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="elevated" size="compact" />}>{t.cancel}</DialogClose>
            <Button type="submit" variant="primary" size="compact" disabled={pending || list.length === 0}>
              {list.length > 1 ? t.sendInvitations(list.length) : t.sendInvitation}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Workspace members: Members/Invitations tabs, search, invite dialog, and a table with per-member role select and
 * an actions menu. Removing a member or revoking an invitation asks for confirmation first.
 */
export function MembersCard({
  title = "Members",
  members: membersProp,
  invitations: invitationsProp = [],
  roles,
  currentUserId,
  onInvite,
  onRoleChange,
  onRemove,
  onRevokeInvitation,
  labels,
  className,
}: {
  title?: string
  members: Member[]
  /** Pending invitations; none by default. */
  invitations?: Invitation[]
  /** Role names offered in the selects. */
  roles: string[]
  /** The signed-in member; their row can't be removed or re-roled. */
  currentUserId?: string
  onInvite?: (values: { emails: string[]; role: string }) => void | Promise<void>
  onRoleChange?: (memberId: string, role: string) => void
  onRemove?: (memberId: string) => void
  onRevokeInvitation?: (invitationId: string) => void
  /** Translations of the built-in strings (English by default). */
  labels?: Partial<MembersCardLabels>
  className?: string
}) {
  const t = { ...membersCardLabels, ...labels }
  // Local copies so the list responds right away; pass callbacks to persist changes.
  const [members, setMembers] = React.useState(membersProp)
  const [invitations, setInvitations] = React.useState(invitationsProp)
  const [query, setQuery] = React.useState("")
  const [inviteOpen, setInviteOpen] = React.useState(false)
  const [removing, setRemoving] = React.useState<PendingRemoval | null>(null)
  const titleId = React.useId()

  const q = query.trim().toLowerCase()
  const filtered = q ? members.filter((m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)) : members

  return (
    <section data-slot="members-card" aria-labelledby={titleId} className={cn("rounded-xl bg-surface p-5 shadow-card sm:p-6 dark:shadow-card-dark", className)}>
      <h2 id={titleId} className="text-[0.9375rem]/5 font-semibold text-foreground">
        {title}
      </h2>
      <Tabs defaultValue="members" className="mt-3 gap-4">
        <TabsList variant="underline">
          <TabsTrigger value="members">
            {`${t.members} `}<span className="text-subtle tabular-nums">{members.length}</span>
          </TabsTrigger>
          <TabsTrigger value="invitations">
            {`${t.invitations} `}<span className="text-subtle tabular-nums">{invitations.length}</span>
          </TabsTrigger>
        </TabsList>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchField value={query} onChange={setQuery} placeholder={t.searchMembersPlaceholder} label={t.searchMembers} />
          <Button variant="primary" size="compact" onClick={() => setInviteOpen(true)} className="self-start sm:self-auto">
            <PlusIcon aria-hidden="true" />
            {t.invite}
          </Button>
        </div>
        <TabsContent value="members">
          <div className="overflow-x-auto rounded-lg ring-1 ring-edge/6">
            <table className="w-full min-w-120 text-[0.8125rem]">
              <thead>
                <tr className="border-b border-edge/6 text-left text-xs text-subtle">
                  <th scope="col" className="px-3 py-2 font-medium">{t.user}</th>
                  <th scope="col" className="w-32 px-3 py-2 font-medium">{t.joined}</th>
                  <th scope="col" className="w-36 px-3 py-2 font-medium">{t.role}</th>
                  <th scope="col" className="w-12 px-3 py-2"><span className="sr-only">{t.actions}</span></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => {
                  const self = m.id === currentUserId
                  return (
                    <tr key={m.id} className="border-b border-edge/6 last:border-0">
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <Avatar size="sm">
                            {m.imageUrl && <AvatarImage src={m.imageUrl} alt="" />}
                            <AvatarFallback className="bg-muted text-[0.625rem] font-semibold text-muted-foreground">{initials(m.name)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 truncate font-medium text-foreground">
                              {m.name}
                              {self && <Badge variant="subtle">{t.you}</Badge>}
                            </div>
                            <div className="truncate text-xs text-subtle">{m.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-subtle tabular-nums">{formatDate(m.joinedAt)}</td>
                      <td className="px-3 py-2.5">
                        <Select
                          value={m.role}
                          disabled={self}
                          onValueChange={(v) => {
                            const role = v as string
                            setMembers((list) => list.map((x) => (x.id === m.id ? { ...x, role } : x)))
                            onRoleChange?.(m.id, role)
                          }}
                        >
                          <SelectTrigger variant="elevated" aria-label={t.roleFor(m.name)} className="w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((r) => (
                              <SelectItem key={r} value={r}>
                                {r}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            disabled={self}
                            render={<Button variant="ghost" size="icon-compact" aria-label={t.actionsFor(m.name)} />}
                          >
                            <MoreHorizontalIcon />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem variant="destructive" onClick={() => setRemoving({ kind: "member", id: m.id, label: m.name })}>
                              {t.removeMemberEllipsis}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <EmptyState
                className="p-8"
                icon={<SearchIcon className="size-5 text-subtle" />}
                title={t.noMatchingMembers}
                description={t.nobodyMatches(query.trim())}
              />
            )}
          </div>
        </TabsContent>
        <TabsContent value="invitations">
          <div className="rounded-lg ring-1 ring-edge/6">
            {invitations.length === 0 ? (
              <EmptyState
                className="p-8"
                icon={<UsersIcon className="size-5 text-subtle" />}
                title={t.noPendingInvitations}
                description={t.noPendingInvitationsDescription}
              />
            ) : (
              <ul>
                {invitations
                  .filter((i) => !q || i.email.toLowerCase().includes(q))
                  .map((i) => (
                    <li key={i.id} className="flex items-center gap-3 border-b border-edge/6 px-3 py-2.5 text-[0.8125rem] last:border-0">
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium text-foreground">{i.email}</div>
                        <div className="text-xs text-subtle">{t.invited(formatDate(i.invitedAt))}</div>
                      </div>
                      <Badge variant="subtle">{i.role}</Badge>
                      <Button variant="ghost" size="compact-sm" aria-label={t.revokeInvitationFor(i.email)} onClick={() => setRemoving({ kind: "invitation", id: i.id, label: i.email })}>
                        {t.revoke}
                      </Button>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </TabsContent>
      </Tabs>
      <InviteDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        roles={roles}
        t={t}
        onInvite={async (values) => {
          await onInvite?.(values)
          const invitedAt = new Date().toISOString()
          setInvitations((list) => [
            ...list,
            ...values.emails.map((email, n) => ({ id: `inv_${list.length + n}_${email}`, email, role: values.role, invitedAt })),
          ])
        }}
      />
      <ConfirmRemoveDialog
        target={removing}
        onOpenChange={(open) => !open && setRemoving(null)}
        t={t}
        onConfirm={(t) => {
          setRemoving(null)
          if (t.kind === "member") {
            setMembers((list) => list.filter((x) => x.id !== t.id))
            onRemove?.(t.id)
          } else {
            setInvitations((list) => list.filter((x) => x.id !== t.id))
            onRevokeInvitation?.(t.id)
          }
        }}
      />
    </section>
  )
}

/** Roles list: search, a create action and a table of role name, key and permission count. */
export function RolesCard({
  title = "Roles & permissions",
  roles,
  onCreateRole,
  onSelectRole,
  labels,
  className,
}: {
  title?: string
  roles: Role[]
  onCreateRole?: () => void
  onSelectRole?: (key: string) => void
  /** Translations of the built-in strings (English by default). */
  labels?: Partial<MembersCardLabels>
  className?: string
}) {
  const t = { ...membersCardLabels, ...labels }
  const [query, setQuery] = React.useState("")
  const titleId = React.useId()
  const q = query.trim().toLowerCase()
  const filtered = q ? roles.filter((r) => r.name.toLowerCase().includes(q) || r.key.toLowerCase().includes(q)) : roles
  return (
    <section data-slot="roles-card" aria-labelledby={titleId} className={cn("rounded-xl bg-surface p-5 shadow-card sm:p-6 dark:shadow-card-dark", className)}>
      <h2 id={titleId} className="text-[0.9375rem]/5 font-semibold text-foreground">
        {title}
      </h2>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchField value={query} onChange={setQuery} placeholder={t.searchRolesPlaceholder} label={t.searchRoles} />
        {onCreateRole && (
          <Button variant="elevated" size="compact" onClick={onCreateRole} className="self-start sm:self-auto">
            <PlusIcon aria-hidden="true" />
            {t.createRole}
          </Button>
        )}
      </div>
      <div className="mt-4 rounded-xl bg-surface-muted p-1">
        <div className="grid grid-cols-[minmax(0,1fr)_8rem_7rem] gap-3 px-4 py-2 text-xs font-medium text-subtle max-sm:grid-cols-[minmax(0,1fr)_7rem]">
          <span>{t.role}</span>
          <span className="max-sm:hidden">{t.key}</span>
          <span>{t.permissions}</span>
        </div>
        <ul className="rounded-lg bg-surface shadow-surface ring-1 ring-edge/4">
          {filtered.map((r) => (
            <li key={r.key} className="border-b border-edge/6 last:border-0">
              <button
                type="button"
                onClick={() => onSelectRole?.(r.key)}
                className="grid w-full grid-cols-[minmax(0,1fr)_8rem_7rem] items-center gap-3 rounded-lg px-4 py-3.5 text-left text-[0.8125rem] outline-none hover:bg-surface-muted/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[--tw-outline-style:solid] focus-visible:outline-ring max-sm:grid-cols-[minmax(0,1fr)_7rem]"
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium text-foreground">{r.name}</span>
                  {r.description && <span className="block truncate text-xs text-subtle">{r.description}</span>}
                </span>
                <span className="truncate font-mono text-xs text-muted-foreground max-sm:hidden">{r.key}</span>
                <span className="text-muted-foreground tabular-nums">
                  {t.permissionCount(r.permissions)}
                </span>
              </button>
            </li>
          ))}
          {filtered.length === 0 && <li className="px-4 py-6 text-center text-[0.8125rem] text-subtle">{t.noRolesMatch(query.trim())}</li>}
        </ul>
      </div>
    </section>
  )
}
