"use client"

import { useRef, useState } from "react"
import { ChevronDownIcon, EllipsisIcon, FilterIcon, PlusIcon, SearchIcon, Settings2Icon, UserRoundIcon, XIcon } from "lucide-react"
import { Callout } from "@/components/blocks/callout"
import { CreateUserDialog } from "@/components/blocks/create-user-dialog"
import { EmptyState } from "@/components/blocks/empty-state"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogPanel, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

/* ---------------------------------- Types ---------------------------------- */

export type SortDirection = "asc" | "desc"
export type SortState = { key: string; dir: SortDirection }

export type DataTableColumn<T> = {
  id: string
  header: string
  cell: (row: T) => React.ReactNode
  /** Makes the column sortable. Return `null` for "no value" (sorts as lowest). */
  sortValue?: (row: T) => string | number | null
  /** Lists the column in the toolbar's "Columns" menu. */
  hideable?: boolean
  /** Hidden on first render (only meaningful with `hideable`). */
  defaultHidden?: boolean
  /** Extra classes for the header cell, e.g. a width. */
  headerClassName?: string
  /** Extra classes for body cells. */
  cellClassName?: string
}

export type DataTableFilter<T> = { id: string; label: string; predicate: (row: T) => boolean }

export type RowAction = {
  label: string
  destructive?: boolean
  onSelect: () => void
  /** When set, the action asks for confirmation in a dialog first. */
  confirm?: { title: string; description?: React.ReactNode; confirmLabel?: string }
}

type MenuCheckItem = { id: string; label: string; checked: boolean }

/* ------------------------------ Table pieces ------------------------------- */

/** Header-cell classes; the height reads `--head` from `TableCard`. */
export const tableHeadCellClass = "h-(--head) px-5 pt-3 pb-[calc(0.75rem-1px)] text-left align-middle font-medium text-subtle transition-colors"
/** Body-cell classes with a hairline row divider. */
export const tableCellClass = "border-b border-edge/6 px-5 py-4 text-[0.8125rem]/5 text-subtle"
/** Row hover wash. */
export const tableRowClass = "transition-colors hover:bg-subtle/4"

/**
 * Table card: the header row sits on a muted strip; a raised, ringed, rounded body
 * is painted behind the rows starting at the header height.
 */
export function TableCard({ head, children, className }: { head: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("relative isolate overflow-hidden rounded-2xl bg-surface-muted p-1 [--head:2.4375rem]", className)}>
      <div className="relative -mt-1">
        <div aria-hidden="true" className="absolute inset-0 top-(--head) -z-1 rounded-xl bg-surface shadow-card ring-1 ring-edge/4" />
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0 whitespace-nowrap">
            <thead className="text-xs/4 font-medium">{head}</thead>
            <tbody className="[&>tr:last-child>td]:border-0">{children}</tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

/** Sortable `<th>` with `aria-sort`; the chevron shows on hover and flips for ascending. */
export function SortHeader({
  label,
  sortKey,
  sort,
  onSort,
  className,
}: {
  label: string
  sortKey: string
  sort: SortState
  onSort: (key: string) => void
  className?: string
}) {
  const active = sort.key === sortKey
  return (
    <th aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"} className={cn(tableHeadCellClass, className)}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn(
          "group/sort -mx-1 flex items-center gap-1 rounded-sm px-1 outline-none hover:text-foreground focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-brand/40",
          active ? "text-foreground" : "text-subtle"
        )}
      >
        {label}
        <ChevronDownIcon
          aria-hidden="true"
          className={cn("size-4 transition duration-150", active ? "opacity-100" : "opacity-0 group-hover/sort:opacity-60", active && sort.dir === "asc" && "rotate-180")}
        />
      </button>
    </th>
  )
}

/** Row "⋯" menu. Actions with `confirm` open a confirmation dialog before running. */
export function RowActions({ actions, label = "Actions" }: { actions: RowAction[]; label?: string }) {
  // `current` stays set after closing so the dialog keeps its copy while it animates out.
  const [current, setCurrent] = useState<RowAction | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-compact" aria-label={label} className="text-subtle hover:text-foreground" />}>
          <EllipsisIcon aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-auto min-w-40">
          {actions.map((action) => (
            <DropdownMenuItem
              key={action.label}
              variant={action.destructive ? "destructive" : "default"}
              className="text-[0.8125rem]/4 font-medium"
              onClick={() => {
                if (!action.confirm) return action.onSelect()
                setCurrent(action)
                setConfirmOpen(true)
              }}
            >
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent showCloseButton={false}>
          <DialogPanel>
            <DialogHeader>
              <DialogTitle>{current?.confirm?.title}</DialogTitle>
              {current?.confirm?.description && <DialogDescription>{current.confirm.description}</DialogDescription>}
            </DialogHeader>
          </DialogPanel>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="elevated" size="compact" />}>Cancel</DialogClose>
            <Button
              type="button"
              variant={current?.destructive ? "destructive" : "primary"}
              size="compact"
              onClick={() => {
                current?.onSelect()
                setConfirmOpen(false)
              }}
            >
              {current?.confirm?.confirmLabel ?? current?.label}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function CheckMenu({ label, items, onCheckedChange }: { label: string; items: MenuCheckItem[]; onCheckedChange: (id: string, checked: boolean) => void }) {
  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel className="px-2 pt-1 pb-1.5 text-xs/4 text-subtle">{label}</DropdownMenuLabel>
      {items.map((item) => (
        <DropdownMenuCheckboxItem
          key={item.id}
          checked={item.checked}
          onCheckedChange={(v) => onCheckedChange(item.id, v)}
          className="text-[0.8125rem]/4 font-medium"
        >
          {item.label}
        </DropdownMenuCheckboxItem>
      ))}
    </DropdownMenuGroup>
  )
}

/** Toolbar above a table: search field with clear button, "Columns" and filter menus, and trailing actions. */
export function TableToolbar({
  query,
  onQueryChange,
  searchLabel = "Search",
  searchPlaceholder = "Search...",
  columns,
  onColumnChange,
  filters,
  onFilterChange,
  actions,
  className,
}: {
  query?: string
  onQueryChange?: (query: string) => void
  searchLabel?: string
  searchPlaceholder?: string
  /** Items for the "Columns" menu; omit to hide the menu. */
  columns?: MenuCheckItem[]
  onColumnChange?: (id: string, visible: boolean) => void
  /** Items for the filter menu; omit to hide the menu. */
  filters?: MenuCheckItem[]
  onFilterChange?: (id: string, active: boolean) => void
  actions?: React.ReactNode
  className?: string
}) {
  const activeFilters = filters?.filter((f) => f.checked).length ?? 0
  return (
    <header className={cn("flex gap-4 max-sm:flex-col sm:items-stretch sm:justify-between", className)}>
      <div className="flex grow flex-wrap items-center gap-2">
        {onQueryChange && (
          <div className="relative grow sm:max-w-70">
            <SearchIcon aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-2.5 my-auto size-4 text-subtle" />
            <Input
              type="search"
              variant="compact"
              aria-label={searchLabel}
              placeholder={searchPlaceholder}
              value={query ?? ""}
              onChange={(e) => onQueryChange(e.target.value)}
              className="pr-9 pl-8 [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => onQueryChange("")}
                className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2.5 text-subtle outline-none hover:text-foreground focus-visible:text-foreground"
              >
                <XIcon aria-hidden="true" className="size-4" />
              </button>
            )}
          </div>
        )}
        {columns && columns.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="elevated" size="compact" className="gap-1 pr-1.5 pl-2 [&_svg]:text-subtle" />}>
              <Settings2Icon aria-hidden="true" />
              Columns
              <ChevronDownIcon aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-auto min-w-48">
              <CheckMenu label="Show columns" items={columns} onCheckedChange={(id, v) => onColumnChange?.(id, v)} />
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {filters && filters.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="elevated"
                  size="icon-compact"
                  aria-label={activeFilters > 0 ? `Filters (${activeFilters} active)` : "Add filter"}
                  className="relative overflow-visible [&_svg]:text-subtle"
                />
              }
            >
              <FilterIcon aria-hidden="true" />
              {activeFilters > 0 && (
                <span aria-hidden="true" className="absolute -top-1 -right-1 grid size-3.5 place-items-center rounded-full bg-brand text-[0.5625rem] text-brand-foreground">
                  {activeFilters}
                </span>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-auto min-w-48">
              <CheckMenu label="Filter by" items={filters} onCheckedChange={(id, v) => onFilterChange?.(id, v)} />
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      {actions && <div className="flex flex-none items-center gap-2 sm:ml-auto">{actions}</div>}
    </header>
  )
}

/* ------------------------------- Data table -------------------------------- */

/** Data table card with search, column visibility, filters, sortable headers, row actions and empty states. */
export function DataTableCard<T>({
  columns,
  rows,
  getRowId,
  rowActions,
  searchText,
  searchLabel,
  searchPlaceholder,
  filters,
  exclusiveFilters = true,
  defaultSort,
  primaryAction,
  callout,
  emptyState,
  noResultsState,
  className,
}: {
  columns: DataTableColumn<T>[]
  rows: T[]
  getRowId: (row: T) => string
  /** Actions for the row "⋯" menu; omit to drop the actions column. */
  rowActions?: (row: T) => RowAction[]
  /** Text a row is searched by; omit to hide the search field. */
  searchText?: (row: T) => string
  searchLabel?: string
  searchPlaceholder?: string
  filters?: DataTableFilter<T>[]
  /** Only one filter active at a time (checking one clears the others). */
  exclusiveFilters?: boolean
  defaultSort?: SortState
  /** Trailing toolbar content, usually the primary button. */
  primaryAction?: React.ReactNode
  /** Notice between the toolbar and the table. */
  callout?: React.ReactNode
  /** Shown when `rows` is empty. */
  emptyState?: React.ReactNode
  /** Shown when search or filters hide every row. */
  noResultsState?: React.ReactNode
  className?: string
}) {
  const [query, setQuery] = useState("")
  const [hidden, setHidden] = useState<Set<string>>(() => new Set(columns.filter((c) => c.hideable && c.defaultHidden).map((c) => c.id)))
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [sort, setSort] = useState<SortState>(() => defaultSort ?? { key: columns.find((c) => c.sortValue)?.id ?? "", dir: "desc" })

  const visible = columns.filter((c) => !hidden.has(c.id))
  const colCount = visible.length + (rowActions ? 1 : 0)

  const onSort = (key: string) => setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }))

  const shown = (() => {
    const q = query.trim().toLowerCase()
    const sortCol = columns.find((c) => c.id === sort.key && c.sortValue)
    const out = rows
      .filter((r) => !q || !searchText || searchText(r).toLowerCase().includes(q))
      .filter((r) => activeFilters.every((id) => filters?.find((f) => f.id === id)?.predicate(r) ?? true))
    if (!sortCol?.sortValue) return out
    const value = sortCol.sortValue
    return [...out].sort((a, b) => {
      const va = value(a)
      const vb = value(b)
      const c = va === vb ? 0 : va === null ? -1 : vb === null ? 1 : va < vb ? -1 : 1
      return sort.dir === "asc" ? c : -c
    })
  })()

  const hideable = columns.filter((c) => c.hideable)

  return (
    <div className={cn("flex flex-col", className)}>
      <TableToolbar
        className="mb-4 pb-3"
        query={query}
        onQueryChange={searchText ? setQuery : undefined}
        searchLabel={searchLabel}
        searchPlaceholder={searchPlaceholder}
        columns={hideable.map((c) => ({ id: c.id, label: c.header, checked: !hidden.has(c.id) }))}
        onColumnChange={(id, v) =>
          setHidden((prev) => {
            const next = new Set(prev)
            if (v) next.delete(id)
            else next.add(id)
            return next
          })
        }
        filters={filters?.map((f) => ({ id: f.id, label: f.label, checked: activeFilters.includes(f.id) }))}
        onFilterChange={(id, v) =>
          setActiveFilters((prev) => (v ? (exclusiveFilters ? [id] : [...prev, id]) : prev.filter((x) => x !== id)))
        }
        actions={primaryAction}
      />

      {callout && <div className="mb-6">{callout}</div>}

      <TableCard
        head={
          <tr>
            {visible.map((c) =>
              c.sortValue ? (
                <SortHeader key={c.id} label={c.header} sortKey={c.id} sort={sort} onSort={onSort} className={c.headerClassName} />
              ) : (
                <th key={c.id} className={cn(tableHeadCellClass, c.headerClassName)}>{c.header}</th>
              )
            )}
            {rowActions && (
              <th className={cn(tableHeadCellClass, "w-px")}>
                <span className="sr-only">Actions</span>
              </th>
            )}
          </tr>
        }
      >
        {shown.length === 0 ? (
          <tr>
            <td colSpan={colCount}>
              {rows.length === 0
                ? (emptyState ?? <EmptyState title="Nothing here yet" />)
                : (noResultsState ?? (
                    <EmptyState icon={<SearchIcon className="size-5 text-subtle" />} title="No matching results" description="Try a different search or clear your filters." />
                  ))}
            </td>
          </tr>
        ) : (
          shown.map((row) => (
            <tr key={getRowId(row)} className={tableRowClass}>
              {visible.map((c) => (
                <td key={c.id} className={cn(tableCellClass, c.cellClassName)}>{c.cell(row)}</td>
              ))}
              {rowActions && (
                <td className={cn(tableCellClass, "py-2")}>
                  <RowActions actions={rowActions(row)} />
                </td>
              )}
            </tr>
          ))
        )}
      </TableCard>
    </div>
  )
}

/* ---------------------------------- Demo ----------------------------------- */

type DemoUser = { id: string; firstName: string; lastName: string; email: string; createdAt: string; lastSignInAt: string | null }

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
const formatDate = (iso: string) => dateFormat.format(Date.parse(iso))

const demoUsers: DemoUser[] = [
  { id: "user_1", firstName: "Maya", lastName: "Okafor", email: "maya.okafor@acme.dev", createdAt: "2026-03-02T09:12:00Z", lastSignInAt: "2026-11-14T16:40:00Z" },
  { id: "user_2", firstName: "Jonas", lastName: "Lindqvist", email: "jonas@acme.dev", createdAt: "2026-04-18T13:05:00Z", lastSignInAt: "2026-11-02T08:21:00Z" },
  { id: "user_3", firstName: "", lastName: "", email: "qa-bot@acme.dev", createdAt: "2026-06-11T10:00:00Z", lastSignInAt: null },
  { id: "user_4", firstName: "Priya", lastName: "Raman", email: "priya.raman@acme.dev", createdAt: "2026-08-23T17:45:00Z", lastSignInAt: "2026-10-29T11:02:00Z" },
  { id: "user_5", firstName: "Leo", lastName: "Martins", email: "leo.martins@acme.dev", createdAt: "2026-10-05T07:30:00Z", lastSignInAt: null },
]

const fullName = (u: DemoUser) => [u.firstName, u.lastName].filter(Boolean).join(" ")
const initials = (u: DemoUser) =>
  (fullName(u) || u.email)
    .split(/[\s@.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("")

const userColumns: DataTableColumn<DemoUser>[] = [
  {
    id: "email",
    header: "Test users",
    sortValue: (u) => u.email,
    headerClassName: "w-[40%]",
    cell: (u) => {
      const name = fullName(u)
      return (
        <div className="flex items-center gap-3">
          <Avatar aria-hidden="true">
            <AvatarFallback className="text-[0.6875rem] font-medium">{initials(u)}</AvatarFallback>
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

const userFilters: DataTableFilter<DemoUser>[] = [
  { id: "signed-in", label: "Has signed in", predicate: (u) => u.lastSignInAt !== null },
  { id: "never-signed-in", label: "Never signed in", predicate: (u) => u.lastSignInAt === null },
]

export default function DataTableCardDemo() {
  const [users, setUsers] = useState<DemoUser[]>(demoUsers)
  const [showEmpty, setShowEmpty] = useState(false)
  const nextId = useRef(demoUsers.length + 1)
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
              const id = `user_${nextId.current++}`
              const createdAt = new Date().toISOString()
              setShowEmpty(false)
              setUsers((list) => [{ id, firstName: u.firstName, lastName: u.lastName, email: u.email, createdAt, lastSignInAt: null }, ...list])
            }}
          />
        }
        callout={
          <Callout>
            Use this development instance for internal and test users. When you&apos;re ready to invite real users, create your production instance.
          </Callout>
        }
        emptyState={
          <EmptyState
            icon={<UserRoundIcon className="size-5 text-subtle" />}
            title="No users yet"
            description={
              <>
                Create a new user or learn how to{" "}
                <a href="#" className="text-foreground underline decoration-edge/20 underline-offset-2 hover:decoration-foreground">
                  migrate existing users
                </a>
              </>
            }
          />
        }
      />
    </div>
  )
}
