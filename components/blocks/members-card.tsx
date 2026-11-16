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

function InviteDialog({
  open,
  onOpenChange,
  roles,
  onInvite,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  roles: string[]
  onInvite: (values: { emails: string[]; role: string }) => void | Promise<void>
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
              <DialogTitle>Invite members</DialogTitle>
              <DialogDescription>They&apos;ll get an email with a link to join this workspace.</DialogDescription>
            </DialogHeader>
            <DialogSection className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`${id}-emails`} className="text-[0.8125rem]">
                  Email addresses
                </Label>
                <Input
                  id={`${id}-emails`}
                  variant="compact"
                  placeholder="name@example.com, another@example.com"
                  value={emails}
                  onChange={(e) => setEmails(e.target.value)}
                  autoComplete="off"
                  required
                />
                <p className="text-[0.8125rem] text-subtle">Separate several addresses with commas.</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`${id}-role`} className="text-[0.8125rem]">
                  Role
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
            <DialogClose render={<Button type="button" variant="elevated" size="compact" />}>Cancel</DialogClose>
            <Button type="submit" variant="primary" size="compact" disabled={pending || list.length === 0}>
              {list.length > 1 ? `Send ${list.length} invitations` : "Send invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

/** Workspace members: Members/Invitations tabs, search, invite dialog, and a table with per-member role select and actions. */
export function MembersCard({
  title = "Members",
  members: membersProp = demoMembers,
  invitations: invitationsProp = demoInvitations,
  roles = ["Admin", "Member"],
  currentUserId = "m_1",
  onInvite,
  onRoleChange,
  onRemove,
  onRevokeInvitation,
  className,
}: {
  title?: string
  members?: Member[]
  invitations?: Invitation[]
  /** Role names offered in the selects. */
  roles?: string[]
  /** The signed-in member; their row can't be removed or re-roled. */
  currentUserId?: string
  onInvite?: (values: { emails: string[]; role: string }) => void | Promise<void>
  onRoleChange?: (memberId: string, role: string) => void
  onRemove?: (memberId: string) => void
  onRevokeInvitation?: (invitationId: string) => void
  className?: string
}) {
  // Local copies so the demo responds; pass callbacks to persist changes.
  const [members, setMembers] = React.useState(membersProp)
  const [invitations, setInvitations] = React.useState(invitationsProp)
  const [query, setQuery] = React.useState("")
  const [inviteOpen, setInviteOpen] = React.useState(false)
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
            Members <span className="text-subtle tabular-nums">{members.length}</span>
          </TabsTrigger>
          <TabsTrigger value="invitations">
            Invitations <span className="text-subtle tabular-nums">{invitations.length}</span>
          </TabsTrigger>
        </TabsList>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchField value={query} onChange={setQuery} placeholder="Search members…" label="Search members" />
          <Button variant="primary" size="compact" onClick={() => setInviteOpen(true)} className="self-start sm:self-auto">
            <PlusIcon aria-hidden="true" />
            Invite
          </Button>
        </div>
        <TabsContent value="members">
          <div className="overflow-x-auto rounded-lg ring-1 ring-edge/6">
            <table className="w-full min-w-120 text-[0.8125rem]">
              <thead>
                <tr className="border-b border-edge/6 text-left text-xs text-subtle">
                  <th scope="col" className="px-3 py-2 font-medium">User</th>
                  <th scope="col" className="w-32 px-3 py-2 font-medium">Joined</th>
                  <th scope="col" className="w-36 px-3 py-2 font-medium">Role</th>
                  <th scope="col" className="w-12 px-3 py-2"><span className="sr-only">Actions</span></th>
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
                            <AvatarFallback className="bg-solid text-[0.625rem] font-semibold text-solid-foreground">{initials(m.name)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 truncate font-medium text-foreground">
                              {m.name}
                              {self && <Badge variant="subtle">You</Badge>}
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
                          <SelectTrigger variant="elevated" aria-label={`Role for ${m.name}`} className="w-28">
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
                            render={<Button variant="ghost" size="icon-compact" aria-label={`Actions for ${m.name}`} />}
                          >
                            <MoreHorizontalIcon />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => {
                                setMembers((list) => list.filter((x) => x.id !== m.id))
                                onRemove?.(m.id)
                              }}
                            >
                              Remove member
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
                title="No matching members"
                description={`Nobody matches “${query.trim()}”.`}
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
                title="No pending invitations"
                description="Invite teammates by email and they'll show up here until they join."
              />
            ) : (
              <ul>
                {invitations
                  .filter((i) => !q || i.email.toLowerCase().includes(q))
                  .map((i) => (
                    <li key={i.id} className="flex items-center gap-3 border-b border-edge/6 px-3 py-2.5 text-[0.8125rem] last:border-0">
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium text-foreground">{i.email}</div>
                        <div className="text-xs text-subtle">Invited {formatDate(i.invitedAt)}</div>
                      </div>
                      <Badge variant="subtle">{i.role}</Badge>
                      <Button
                        variant="ghost"
                        size="compact-sm"
                        onClick={() => {
                          setInvitations((list) => list.filter((x) => x.id !== i.id))
                          onRevokeInvitation?.(i.id)
                        }}
                      >
                        Revoke
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
        onInvite={async (values) => {
          await onInvite?.(values)
          setInvitations((list) => [
            ...list,
            ...values.emails.map((email, n) => ({ id: `inv_${list.length + n}_${email}`, email, role: values.role, invitedAt: "2026-11-17T00:00:00Z" })),
          ])
        }}
      />
    </section>
  )
}

/** Roles list: search, a create action and a table of role name, key and permission count. */
export function RolesCard({
  title = "Roles & permissions",
  roles = demoRoles,
  onCreateRole,
  onSelectRole,
  className,
}: {
  title?: string
  roles?: Role[]
  onCreateRole?: () => void
  onSelectRole?: (key: string) => void
  className?: string
}) {
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
        <SearchField value={query} onChange={setQuery} placeholder="Search roles…" label="Search roles" />
        {onCreateRole && (
          <Button variant="elevated" size="compact" onClick={onCreateRole} className="self-start sm:self-auto">
            <PlusIcon aria-hidden="true" />
            Create role
          </Button>
        )}
      </div>
      <div className="mt-4 rounded-xl bg-surface-muted p-1">
        <div className="grid grid-cols-[minmax(0,1fr)_8rem_7rem] gap-3 px-4 py-2 text-xs font-medium text-subtle max-sm:grid-cols-[minmax(0,1fr)_7rem]">
          <span>Role</span>
          <span className="max-sm:hidden">Key</span>
          <span>Permissions</span>
        </div>
        <ul className="rounded-lg bg-surface shadow-surface ring-1 ring-edge/4">
          {filtered.map((r) => (
            <li key={r.key} className="border-b border-edge/6 last:border-0">
              <button
                type="button"
                onClick={() => onSelectRole?.(r.key)}
                className="grid w-full grid-cols-[minmax(0,1fr)_8rem_7rem] items-center gap-3 rounded-lg px-4 py-3.5 text-left text-[0.8125rem] outline-none hover:bg-surface-muted/60 focus-visible:ring-2 focus-visible:ring-brand/40 max-sm:grid-cols-[minmax(0,1fr)_7rem]"
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium text-foreground">{r.name}</span>
                  {r.description && <span className="block truncate text-xs text-subtle">{r.description}</span>}
                </span>
                <span className="truncate font-mono text-xs text-muted-foreground max-sm:hidden">{r.key}</span>
                <span className="text-muted-foreground tabular-nums">
                  {r.permissions} {r.permissions === 1 ? "permission" : "permissions"}
                </span>
              </button>
            </li>
          ))}
          {filtered.length === 0 && <li className="px-4 py-6 text-center text-[0.8125rem] text-subtle">No roles match “{query.trim()}”.</li>}
        </ul>
      </div>
    </section>
  )
}

const demoMembers: Member[] = [
  { id: "m_1", name: "Ada Park", email: "ada.park@example.com", role: "Admin", joinedAt: "2026-01-04T00:00:00Z" },
  { id: "m_2", name: "Ben Ortiz", email: "ben.ortiz@example.com", role: "Member", joinedAt: "2026-02-12T00:00:00Z" },
  { id: "m_3", name: "Cleo Ng", email: "cleo.ng@example.com", role: "Member", joinedAt: "2026-03-02T00:00:00Z" },
]
const demoInvitations: Invitation[] = [{ id: "inv_1", email: "dev.rao@example.com", role: "Member", invitedAt: "2026-11-10T00:00:00Z" }]
const demoRoles: Role[] = [
  { name: "Member", key: "workspace:member", permissions: 2, description: "Read access to workspace resources" },
  { name: "Admin", key: "workspace:admin", permissions: 9, description: "Full access, including members and billing" },
  { name: "Billing manager", key: "workspace:billing", permissions: 4 },
]

export default function MembersCardDemo() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 p-6 sm:p-10">
      <MembersCard />
      <RolesCard onCreateRole={() => {}} />
    </div>
  )
}
