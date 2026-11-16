"use client"

import { useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon, CirclePlusIcon, ListFilterIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

/* --------------------------------- Types ----------------------------------- */

export type FilterDefinition = {
  id: string
  label: string
  /** Fixed choices render as a checkbox list; omit for a free-text field. */
  options?: string[]
  placeholder?: string
  /** Render option labels in the mono face (event names, IDs). */
  mono?: boolean
}

export type FilterValues = Record<string, string[]>

const summary = (value: string[]) => (value.length > 1 ? `${value.length} selected` : value[0])
const textButton =
  "rounded-sm px-1 text-xs/4 font-medium text-subtle outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand/40"

/* -------------------------------- Editor ----------------------------------- */

/** Edits one filter: a checkbox list for fixed options, otherwise a text field with Apply. */
export function FilterEditor({
  filter,
  value,
  onChange,
  onDone,
  touch = false,
}: {
  filter: FilterDefinition
  value: string[]
  onChange: (value: string[]) => void
  onDone: () => void
  touch?: boolean
}) {
  const [draft, setDraft] = useState(filter.options ? "" : value[0] ?? "")

  if (filter.options) {
    return (
      <div className={cn("flex flex-col", touch ? "divide-y divide-edge/6" : "p-1")}>
        {filter.options.map((o) => (
          <label
            key={o}
            className={cn(
              "flex cursor-pointer items-center",
              filter.mono && "font-mono",
              touch ? "gap-3 px-5 py-3.5 text-[0.8125rem]/5 active:bg-surface-muted" : "gap-2.5 rounded-md px-2 py-1.5 text-xs/4 hover:bg-accent"
            )}
          >
            <Checkbox checked={value.includes(o)} onCheckedChange={(c) => onChange(c ? [...value, o] : value.filter((v) => v !== o))} />
            {o}
          </label>
        ))}
      </div>
    )
  }

  return (
    <form
      className={cn("flex flex-col gap-2", touch ? "p-5" : "p-3")}
      onSubmit={(e) => {
        e.preventDefault()
        onChange(draft.trim() ? [draft.trim()] : [])
        onDone()
      }}
    >
      <Input
        variant="compact"
        autoFocus
        aria-label={filter.label}
        placeholder={filter.placeholder ?? `Enter ${filter.label.toLowerCase()}`}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        className={cn(touch && "h-9 text-base sm:text-[0.8125rem]")}
      />
      <Button type="submit" variant="primary" size={touch ? "compact-md" : "compact-sm"} className="justify-center">Apply</Button>
    </form>
  )
}

/* --------------------------------- Pill ------------------------------------ */

/** Dashed "+ Label" pill that turns solid with a clear button and value summary once set. */
export function FilterPill({ filter, value, onChange }: { filter: FilterDefinition; value: string[]; onChange: (value: string[]) => void }) {
  const [open, setOpen] = useState(false)
  const active = value.length > 0
  const { label } = filter

  return (
    <div
      data-slot="filter-pill"
      className={cn(
        "flex h-6 max-w-full min-w-0 items-center rounded-full border pr-2 pl-1 text-xs/4 font-medium transition-[border-color,background-color]",
        active
          ? "border-edge/20 bg-surface text-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04)]"
          : "border-dashed border-subtle/48 bg-subtle/4 text-subtle hover:border-subtle/56 hover:bg-subtle/8"
      )}
    >
      {active && (
        <button
          type="button"
          aria-label={`Clear ${label} filter`}
          onClick={() => onChange([])}
          className="rounded-full text-subtle outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand/40"
        >
          <XIcon aria-hidden="true" className="size-4 p-0.5" />
        </button>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <button
              type="button"
              aria-label={active ? `Edit ${label} filter` : `Add ${label} filter`}
              className="relative flex min-w-0 items-center gap-0.5 whitespace-nowrap outline-none hover:text-foreground focus-visible:text-foreground"
            />
          }
        >
          {!active && <CirclePlusIcon aria-hidden="true" className="size-4 p-px" />}
          <span className={cn(active && "ps-0.5")}>{label}</span>
          {active && (
            <>
              <span className="mx-1 h-3 w-px bg-edge/20" aria-hidden="true" />
              <span className="truncate text-brand-text">{summary(value)}</span>
            </>
          )}
        </PopoverTrigger>
        <PopoverContent align="start" sideOffset={6} className="w-60 gap-0 p-0">
          <p className="border-b border-edge/6 px-3 py-2 text-xs/4 font-medium text-subtle">Filter by {label.toLowerCase()}</p>
          <FilterEditor filter={filter} value={value} onChange={onChange} onDone={() => setOpen(false)} />
        </PopoverContent>
      </Popover>
    </div>
  )
}

/* --------------------------------- Sheet ----------------------------------- */

/** Phone layout: every filter in one bottom sheet, one row per category that drills into its editor. */
export function FilterSheet({
  filters,
  values,
  onChange,
  onClearAll,
  label = "filters",
}: {
  filters: FilterDefinition[]
  values: FilterValues
  onChange: (id: string, value: string[]) => void
  onClearAll: () => void
  /** Used in the trigger's accessible name ("Open log filters"). */
  label?: string
}) {
  const [open, setOpen] = useState(false)
  const [currentId, setCurrentId] = useState<string | null>(null)
  const current = filters.find((f) => f.id === currentId) ?? null
  const valueOf = (id: string) => values[id] ?? []
  const count = filters.filter((f) => valueOf(f.id).length).length

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) setCurrentId(null)
      }}
    >
      <span className="relative inline-flex">
        <SheetTrigger render={<Button variant="elevated" size="icon-compact-md" aria-label={count ? `Open ${label}, ${count} active` : `Open ${label}`} />}>
          <ListFilterIcon aria-hidden="true" className="text-subtle" />
        </SheetTrigger>
        {count > 0 && (
          <span aria-hidden="true" className="pointer-events-none absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[0.625rem]/3 font-medium text-brand-foreground">
            {count}
          </span>
        )}
      </span>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="max-h-[min(80dvh,45rem)] gap-0 rounded-t-xl border-0 bg-surface p-0 text-foreground outline-none data-[side=bottom]:border-t-0"
      >
        <div className="box-border flex max-h-13.5 flex-none items-center gap-1 border-b border-edge/6 px-5 py-4">
          {current && (
            <button type="button" aria-label="Back to all filters" onClick={() => setCurrentId(null)} className="-ms-1.5 rounded-md p-0.5 text-subtle outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand/40">
              <ChevronLeftIcon aria-hidden="true" className="size-4" />
            </button>
          )}
          <SheetTitle className="min-w-0 flex-1 truncate text-[0.9375rem]/5 font-medium">{current?.label ?? "Filters"}</SheetTitle>
          {!current && count > 0 && <button type="button" onClick={onClearAll} className={textButton}>Clear all</button>}
          {current && valueOf(current.id).length > 0 && <button type="button" onClick={() => onChange(current.id, [])} className={textButton}>Clear</button>}
        </div>
        <div className="min-h-0 flex-1 overflow-auto overscroll-contain pb-[env(safe-area-inset-bottom)]">
          {current ? (
            <FilterEditor key={current.id} touch filter={current} value={valueOf(current.id)} onChange={(v) => onChange(current.id, v)} onDone={() => setCurrentId(null)} />
          ) : (
            <div className="divide-y divide-edge/6">
              {filters.map((f) => {
                const v = valueOf(f.id)
                return (
                  <button
                    key={f.id}
                    type="button"
                    data-slot="filter-category-row"
                    onClick={() => setCurrentId(f.id)}
                    className={cn("flex h-15 w-full items-center px-5 text-left outline-none focus-visible:bg-surface-muted active:bg-surface-muted", v.length ? "py-3" : "py-5")}
                  >
                    <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
                      <span className="text-[0.8125rem]/5 font-medium">{f.label}</span>
                      {v.length > 0 && <span className="max-w-full truncate text-xs/4 text-brand-text">{summary(v)}</span>}
                    </span>
                    <ChevronRightIcon aria-hidden="true" className="size-4 text-subtle" />
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

/* ---------------------------------- Bar ------------------------------------ */

/**
 * Filter toolbar: removable filter pills and "Clear all" on wider screens, a filter sheet on phones,
 * with leading and trailing slots for navigation and actions (date range, refresh, share).
 */
export function FilterBar({
  filters,
  values,
  onChange,
  onClearAll,
  leading,
  actions,
  touchActions,
  label,
  className,
}: {
  filters: FilterDefinition[]
  values: FilterValues
  onChange: (id: string, value: string[]) => void
  onClearAll: () => void
  /** Rendered before the pills (for example a sidebar toggle). */
  leading?: React.ReactNode
  /** Right-hand actions at xs and up. */
  actions?: React.ReactNode
  /** Phone actions shown beside the filter sheet trigger; defaults to `actions`. */
  touchActions?: React.ReactNode
  /** Accessible noun for the filter sheet trigger. */
  label?: string
  className?: string
}) {
  const activeCount = filters.filter((f) => values[f.id]?.length).length

  return (
    <div data-slot="filter-bar" className={cn("grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4", className)}>
      <div className="hidden min-w-0 items-start gap-2 xs:flex">
        {leading}
        <div className="flex min-w-0 flex-wrap items-center gap-2" data-slot="filter-pills">
          {filters.map((f) => (
            <FilterPill key={f.id} filter={f} value={values[f.id] ?? []} onChange={(v) => onChange(f.id, v)} />
          ))}
          {activeCount > 0 && <button type="button" onClick={onClearAll} className={textButton}>Clear all</button>}
        </div>
      </div>
      <div className="col-span-2 flex w-full items-center justify-between gap-2 xs:hidden">
        <div className="flex-none">{leading}</div>
        <div className="flex min-w-0 items-center gap-2">
          {touchActions ?? actions}
          <FilterSheet filters={filters} values={values} onChange={onChange} onClearAll={onClearAll} label={label} />
        </div>
      </div>
      {actions && <div className="hidden gap-2 xs:flex">{actions}</div>}
    </div>
  )
}
