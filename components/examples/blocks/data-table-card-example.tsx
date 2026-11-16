"use client"

import { useRef, useState } from "react"
import { PlusIcon, UserRoundIcon } from "lucide-react"
import { Callout } from "@/components/blocks/callout"
import { CreateUserDialog } from "@/components/blocks/create-user-dialog"
import { DataTableCard, type DataTableColumn, type DataTableFilter } from "@/components/blocks/data-table-card"
import { EmptyState } from "@/components/blocks/empty-state"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

type User = { id: string; firstName: string; lastName: string; email: string; createdAt: string; lastSignInAt: string | null }

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
const formatDate = (iso: string) => dateFormat.format(Date.parse(iso))

const initialUsers: User[] = [
  { id: "usr_01", firstName: "Maya", lastName: "Okafor", email: "maya.okafor@example.com", createdAt: "2026-03-02T09:12:00Z", lastSignInAt: "2026-11-14T16:40:00Z" },
  { id: "usr_02", firstName: "Jonas", lastName: "Lindqvist", email: "jonas@example.com", createdAt: "2026-04-18T13:05:00Z", lastSignInAt: "2026-11-02T08:21:00Z" },
  { id: "usr_03", firstName: "", lastName: "", email: "qa-bot@example.com", createdAt: "2026-06-11T10:00:00Z", lastSignInAt: null },
  { id: "usr_04", firstName: "Priya", lastName: "Raman", email: "priya.raman@example.com", createdAt: "2026-08-23T17:45:00Z", lastSignInAt: "2026-10-29T11:02:00Z" },
  { id: "usr_05", firstName: "Leo", lastName: "Martins", email: "leo.martins@example.com", createdAt: "2026-10-05T07:30:00Z", lastSignInAt: null },
]

const fullName = (u: User) => [u.firstName, u.lastName].filter(Boolean).join(" ")
const initials = (u: User) =>
  (fullName(u) || u.email)
    .split(/[\s@.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("")

const userColumns: DataTableColumn<User>[] = [
  {
    id: "email",
    header: "Users",
    sortValue: (u) => u.email,
    headerClassName: "w-[40%]",
    cell: (u) => {
      const name = fullName(u)
      return (
        <div className="flex items-center gap-3">
          <Avatar aria-hidden="true">
            <AvatarFallback className="bg-muted text-[0.6875rem] font-medium text-muted-foreground">{initials(u)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            {name && <div className="truncate font-medium text-foreground">{name}</div>}
            <div className={cn("truncate", !name && "font-medium text-foreground")}>{u.email}</div>
          </div>
        </div>
      )
    },
  },
  { id: "lastSignInAt", header: "Last signed in", hideable: true, sortValue: (u) => u.lastSignInAt, cell: (u) => (u.lastSignInAt ? formatDate(u.lastSignInAt) : "Never") },
  { id: "createdAt", header: "Joined", hideable: true, sortValue: (u) => u.createdAt, cell: (u) => formatDate(u.createdAt) },
]

const userFilters: DataTableFilter<User>[] = [
  { id: "signed-in", label: "Has signed in", predicate: (u) => u.lastSignInAt !== null },
  { id: "never-signed-in", label: "Never signed in", predicate: (u) => u.lastSignInAt === null },
]

export default function DataTableCardExample() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [showEmpty, setShowEmpty] = useState(false)
  const nextId = useRef(initialUsers.length + 1)
  const rows = showEmpty ? [] : users

  return (
    <div className="mx-auto max-w-5xl p-6 sm:p-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-xl/7 font-semibold tracking-[-0.015em] text-foreground">Users</h1>
        <label className="flex items-center gap-2 text-[0.8125rem]/4 text-subtle">
          <Switch checked={showEmpty} onCheckedChange={setShowEmpty} />
          Show empty state
        </label>
      </div>
      <DataTableCard
        columns={userColumns}
        rows={rows}
        getRowId={(u) => u.id}
        searchText={(u) => `${fullName(u)} ${u.email}`}
        searchLabel="Search users"
        filters={userFilters}
        defaultSort={{ key: "createdAt", dir: "desc" }}
        rowActions={(u) => [
          {
            label: "Delete user",
            destructive: true,
            confirm: { title: "Delete user?", description: <>{u.email} will lose access immediately. This can&apos;t be undone.</>, confirmLabel: "Delete" },
            onSelect: () => setUsers((list) => list.filter((x) => x.id !== u.id)),
          },
        ]}
        primaryAction={
          <CreateUserDialog
            trigger={
              <Button variant="primary" size="compact" className="gap-1 pl-2">
                <PlusIcon aria-hidden="true" />
                Create user
              </Button>
            }
            onCreate={(u) => {
              const id = `usr_${String(nextId.current++).padStart(2, "0")}`
              const createdAt = new Date().toISOString()
              setShowEmpty(false)
              setUsers((list) => [{ id, firstName: u.firstName, lastName: u.lastName, email: u.email, createdAt, lastSignInAt: null }, ...list])
            }}
          />
        }
        callout={
          <Callout>
            This sandbox is for internal and test users. When you&apos;re ready to invite real customers, switch your project to live.
          </Callout>
        }
        emptyState={
          <EmptyState
            icon={<UserRoundIcon aria-hidden="true" className="size-5 text-subtle" />}
            title="No users yet"
            description={
              <>
                Create a new user or learn how to{" "}
                <a href="/docs/import-users" className="text-foreground underline decoration-edge/20 underline-offset-2 hover:decoration-foreground">
                  import existing users
                </a>
              </>
            }
          />
        }
      />
    </div>
  )
}
