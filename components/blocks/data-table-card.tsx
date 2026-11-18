"use client"

import { useState } from "react"
import { ChevronDownIcon, EllipsisIcon, FilterIcon, SearchIcon, Settings2Icon, XIcon } from "lucide-react"
import { EmptyState } from "@/components/blocks/empty-state"
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
  /** When set, the action asks for confirmation in a dialog first. Destructive actions always confirm (titled "<label>?" by default). */
  confirm?: { title: string; description?: React.ReactNode; confirmLabel?: string }
}

/** Built-in strings of DataTableCard, TableToolbar and RowActions; pass `labels` to translate them. */
export const dataTableCardLabels = {
  confirmTitle: (action: string) => `${action}?`,
  cancel: "Cancel",
  clearSearch: "Clear search",
  columns: "Columns",
  showColumns: "Show columns",
  filtersActive: (count: number) => `Filters (${count} active)`,
  addFilter: "Add filter",
  filterBy: "Filter by",
  actions: "Actions",
  nothingHereYet: "Nothing here yet",
  noMatchingResults: "No matching results",
  noMatchingResultsDescription: "Try a different search or clear your filters.",
}
export type DataTableCardLabels = typeof dataTableCardLabels

const confirmOf = (action: RowAction, t: DataTableCardLabels) => action.confirm ?? (action.destructive ? { title: t.confirmTitle(action.label) } : undefined)

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
          "group/sort -mx-1 flex items-center gap-1 rounded-sm px-1 outline-none hover:text-foreground focus-visible:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[--tw-outline-style:solid] focus-visible:outline-ring",
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

/** Row "⋯" menu. Destructive actions, and any with `confirm`, open a confirmation dialog before running. */
export function RowActions({
  actions,
  label = "Actions",
  labels,
}: {
  actions: RowAction[]
  label?: string
  /** Translations of the built-in strings (English by default). */
  labels?: Partial<DataTableCardLabels>
}) {
  const t = { ...dataTableCardLabels, ...labels }
  // `current` stays set after closing so the dialog keeps its copy while it animates out.
  const [current, setCurrent] = useState<RowAction | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const confirm = current ? confirmOf(current, t) : undefined

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
                if (!confirmOf(action, t)) return action.onSelect()
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
              <DialogTitle>{confirm?.title}</DialogTitle>
              {confirm?.description && <DialogDescription>{confirm.description}</DialogDescription>}
            </DialogHeader>
          </DialogPanel>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="elevated" size="compact" />}>{t.cancel}</DialogClose>
            <Button
              type="button"
              variant={current?.destructive ? "destructive" : "primary"}
              size="compact"
              onClick={() => {
                current?.onSelect()
                setConfirmOpen(false)
              }}
            >
              {confirm?.confirmLabel ?? current?.label}
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
  labels,
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
  /** Translations of the built-in strings (English by default). */
  labels?: Partial<DataTableCardLabels>
  className?: string
}) {
  const t = { ...dataTableCardLabels, ...labels }
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
                aria-label={t.clearSearch}
                onClick={() => onQueryChange("")}
                className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2.5 text-subtle outline-none hover:text-foreground focus-visible:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:[--tw-outline-style:solid] focus-visible:outline-ring"
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
              {t.columns}
              <ChevronDownIcon aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-auto min-w-48">
              <CheckMenu label={t.showColumns} items={columns} onCheckedChange={(id, v) => onColumnChange?.(id, v)} />
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
                  aria-label={activeFilters > 0 ? t.filtersActive(activeFilters) : t.addFilter}
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
              <CheckMenu label={t.filterBy} items={filters} onCheckedChange={(id, v) => onFilterChange?.(id, v)} />
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
  labels,
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
  /** Translations of the built-in strings (English by default). */
  labels?: Partial<DataTableCardLabels>
  className?: string
}) {
  const t = { ...dataTableCardLabels, ...labels }
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
        labels={t}
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
                <span className="sr-only">{t.actions}</span>
              </th>
            )}
          </tr>
        }
      >
        {shown.length === 0 ? (
          <tr>
            <td colSpan={colCount}>
              {rows.length === 0
                ? (emptyState ?? <EmptyState title={t.nothingHereYet} />)
                : (noResultsState ?? (
                    <EmptyState icon={<SearchIcon aria-hidden="true" className="size-5 text-subtle" />} title={t.noMatchingResults} description={t.noMatchingResultsDescription} />
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
                  <RowActions actions={rowActions(row)} label={t.actions} labels={t} />
                </td>
              )}
            </tr>
          ))
        )}
      </TableCard>
    </div>
  )
}
