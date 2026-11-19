"use client"

import { useState } from "react"
import { CalendarIcon, ChevronDownIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

/* --------------------------------- Types ----------------------------------- */

export type DateRangePreset = {
  key: string
  label: string
  /** Length of the window ending at "now", in milliseconds. */
  ms: number
  /** Shown but not selectable (for example, beyond the current plan's window). */
  disabled?: boolean
  /** Optional shorter label for the trigger button. */
  triggerLabel?: string
}

/** Either a preset (resolved against "now" when the picker opens) or a fixed custom range. */
export type DateRangeValue = { preset: string | null; from?: Date; to?: Date }

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/** Generic relative windows. Mark entries `disabled` (for example, beyond a plan's retention) in your own copy. */
export const defaultDateRangePresets: DateRangePreset[] = [
  { key: "last15Minutes", label: "Last 15 minutes", ms: HOUR / 4 },
  { key: "last1Hour", label: "Last 1 hour", ms: HOUR },
  { key: "last3Hours", label: "Last 3 hours", ms: 3 * HOUR },
  { key: "last24Hours", label: "Last 24 hours", ms: DAY, triggerLabel: "Last 1 day" },
  { key: "last3Days", label: "Last 3 days", ms: 3 * DAY },
  { key: "last7Days", label: "Last 7 days", ms: 7 * DAY },
  { key: "last30Days", label: "Last 30 days", ms: 30 * DAY },
]

/** Built-in strings of DateRangePicker and DateTimeRow; pass `labels` to translate them. */
export const dateRangePickerLabels = {
  dateRange: (from: string, to: string) => `${from} – ${to}`,
  selectRange: "Select range",
  dateOf: (label: string, date: string) => `${label} date ${date}`,
  timeOf: (label: string) => `${label} time`,
  datePresets: "Date presets",
  customRange: "Custom range",
  from: "From",
  to: "To",
  startAfterEnd: "Start is after end",
  cancel: "Cancel",
  apply: "Apply",
}
export type DateRangePickerLabels = typeof dateRangePickerLabels

/* -------------------------------- Helpers ---------------------------------- */

const pad = (n: number) => String(n).padStart(2, "0")
const startOfDay = (d: Date) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x }
const endOfDay = (d: Date) => { const x = new Date(d); x.setHours(23, 59, 0, 0); return x }
const sameDay = (a: Date, b: Date) => startOfDay(a).getTime() === startOfDay(b).getTime()

function rangeLabel(value: DateRangeValue, presets: DateRangePreset[], t: DateRangePickerLabels, locale: string) {
  const shortDay = new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" })
  const preset = presets.find((p) => p.key === value.preset)
  if (preset) return preset.triggerLabel ?? preset.label
  if (value.from && value.to) return t.dateRange(shortDay.format(value.from), shortDay.format(value.to))
  return t.selectRange
}

type Draft = { preset: string | null; from: Date; to: Date }

/* ------------------------------ Date/time row ------------------------------ */

const fieldBox =
  "flex h-7 items-center rounded-md bg-field p-1.5 text-xs/4 text-subtle tabular-nums shadow-[0_2px_2px_-1px_rgb(0_0_0/0.06),0_4px_4px_-2px_rgb(0_0_0/0.04)] ring-1 ring-field-ring"

/** One "From" / "To" row: a read-only date readout plus an editable 24h time field. */
export function DateTimeRow({
  label,
  value,
  onTimeChange,
  invalid,
  labels,
}: {
  label: string
  value: Date
  onTimeChange?: (hours: number, minutes: number) => void
  invalid?: boolean
  /** Translations of the built-in strings (English by default). */
  labels?: Partial<DateRangePickerLabels>
}) {
  const t = { ...dateRangePickerLabels, ...labels }
  const dd = pad(value.getDate())
  const mm = pad(value.getMonth() + 1)
  const yyyy = value.getFullYear()
  const time = `${pad(value.getHours())}:${pad(value.getMinutes())}`
  const sep = <span className="text-placeholder">/</span>
  return (
    <div className="flex w-full items-center justify-between gap-4 pl-0.5">
      <span className="text-xs/4 font-medium text-subtle">{label}</span>
      <div className="flex items-center gap-2">
        <div className={cn(fieldBox, "w-26.5 justify-between")} aria-label={t.dateOf(label, `${dd}/${mm}/${yyyy}`)} role="group">
          <span className="w-5 text-center">{dd}</span>{sep}<span className="w-5 text-center">{mm}</span>{sep}<span className="w-10 text-center">{yyyy}</span>
        </div>
        <input
          type="time"
          aria-label={t.timeOf(label)}
          aria-invalid={invalid || undefined}
          value={time}
          readOnly={!onTimeChange}
          onChange={(e) => {
            const [h, m] = e.target.value.split(":").map(Number)
            if (Number.isFinite(h) && Number.isFinite(m)) onTimeChange?.(h, m)
          }}
          className={cn(
            fieldBox,
            "w-20 justify-center text-center text-foreground outline-none focus-visible:ring-field-ring-focus focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:[--tw-outline-style:solid] focus-visible:outline-ring aria-invalid:ring-field-invalid [&::-webkit-calendar-picker-indicator]:hidden"
          )}
        />
      </div>
    </div>
  )
}

/* --------------------------------- Picker ---------------------------------- */

/**
 * Popover date-range picker with relative presets, From/To date-time rows and a range calendar.
 * Presets resolve against "now" when the popover opens, so nothing time-based runs during render.
 * Presets are a radio group (arrow keys move the selection); the calendar is a react-day-picker grid
 * (arrow keys move by day/week, PageUp/PageDown by month, Home/End to the week's ends).
 */
export function DateRangePicker({
  value,
  onChange,
  presets = defaultDateRangePresets,
  maxAgeMs,
  touch = false,
  align = "end",
  getNow = () => new Date(),
  locale = "en-US",
  labels,
  className,
}: {
  value: DateRangeValue
  onChange: (value: DateRangeValue) => void
  presets?: DateRangePreset[]
  /** Oldest selectable point, relative to now (for example a 1-day log window). Omit for no limit. */
  maxAgeMs?: number
  /** Taller, truncating trigger for phone toolbars. */
  touch?: boolean
  align?: "start" | "center" | "end"
  /** Clock source, called when the popover opens. */
  getNow?: () => Date
  /** Translations of the built-in strings (English by default). */
  /** BCP 47 locale for the dates in the trigger ("en-US" by default), for example "de-DE". */
  locale?: string
  labels?: Partial<DateRangePickerLabels>
  className?: string
}) {
  const t = { ...dateRangePickerLabels, ...labels }
  const [open, setOpen] = useState(false)
  // The clock is read only in the open handler, never during render.
  const [clock, setClock] = useState<{ now: Date; min?: Date; minDay?: Date } | null>(null)
  const [draft, setDraft] = useState<Draft | null>(null)

  const now = clock?.now ?? null
  const min = clock?.min
  const clampFrom = (d: Date) => (min && d < min ? new Date(min) : d)
  const invalid = draft ? draft.from > draft.to : false

  const pickPreset = (key: string) => {
    const p = presets.find((x) => x.key === key)
    if (!p || !now) return
    setDraft({ preset: key, from: new Date(now.getTime() - p.ms), to: new Date(now) })
  }

  const pickRange = (range: DateRange | undefined) => {
    if (!range?.from || !now) return
    const last = range.to ?? range.from
    setDraft({
      preset: null,
      from: clampFrom(startOfDay(range.from)),
      to: sameDay(last, now) ? new Date(now) : endOfDay(last),
    })
  }

  const setTime = (which: "from" | "to") => (h: number, m: number) =>
    setDraft((d) => {
      if (!d) return d
      const next = new Date(d[which])
      next.setHours(h, m, 0, 0)
      return { ...d, preset: null, [which]: which === "from" ? clampFrom(next) : next }
    })

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) return
        const t = getNow()
        const m = maxAgeMs ? new Date(t.getTime() - maxAgeMs) : undefined
        setClock({ now: t, min: m, minDay: m && startOfDay(m) })
        const p = presets.find((x) => x.key === value.preset)
        setDraft(
          p
            ? { preset: p.key, from: new Date(t.getTime() - p.ms), to: new Date(t) }
            : { preset: null, from: value.from ?? new Date(t.getTime() - DAY), to: value.to ?? new Date(t) }
        )
      }}
    >
      <PopoverTrigger
        render={
          touch ? (
            <Button variant="elevated" size="compact-md" className={cn("min-w-0 justify-start gap-1.5 pl-2", className)} />
          ) : (
            <Button variant="elevated" size="compact-sm" className={cn("gap-1.5 pl-1", className)} />
          )
        }
      >
        <CalendarIcon aria-hidden="true" className="size-4 flex-none text-subtle" />
        <span className="truncate">{rangeLabel(value, presets, t, locale)}</span>
        {!touch && <ChevronDownIcon aria-hidden="true" className={cn("size-4 text-subtle transition-transform", open && "rotate-180")} />}
      </PopoverTrigger>
      <PopoverContent
        align={align}
        sideOffset={6}
        className="w-auto max-w-[calc(100vw-2rem)] flex-row gap-0 overflow-clip rounded-2xl bg-surface-muted p-0 text-foreground"
      >
        {draft && now && (
          <>
            <RadioGroup
              aria-label={t.datePresets}
              value={draft.preset ?? ""}
              onValueChange={(key) => typeof key === "string" && key && pickPreset(key)}
              className="hidden min-w-44 flex-1 content-start gap-1.5 px-1.5 py-4 sm:grid"
            >
              {presets.map((p) => (
                <label
                  key={p.key}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-2 rounded-md px-1.5 py-2 text-xs/4 font-medium text-subtle transition-colors hover:bg-subtle/4 hover:text-foreground has-data-checked:bg-subtle/8 has-data-checked:text-brand-text has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50 has-data-disabled:hover:bg-transparent has-data-disabled:hover:text-subtle"
                  )}
                >
                  <RadioGroupItem value={p.key} disabled={p.disabled} />
                  {p.label}
                </label>
              ))}
            </RadioGroup>
            <div className="flex flex-col divide-y divide-edge/6 rounded-xl bg-surface shadow-surface ring-1 ring-edge/4">
              <div className="w-72 max-w-full flex-1 overflow-y-auto p-4">
                <label className="mb-4 block sm:hidden">
                  <span className="sr-only">{t.datePresets}</span>
                  <NativeSelect
                    size="sm"
                    className="w-full"
                    value={draft.preset ?? ""}
                    onChange={(e) => e.target.value && pickPreset(e.target.value)}
                  >
                    <NativeSelectOption value="" disabled>{t.customRange}</NativeSelectOption>
                    {presets.map((p) => (
                      <NativeSelectOption key={p.key} value={p.key} disabled={p.disabled}>{p.label}</NativeSelectOption>
                    ))}
                  </NativeSelect>
                </label>
                <div className="flex flex-col gap-4">
                  <DateTimeRow label={t.from} value={draft.from} onTimeChange={setTime("from")} invalid={invalid} labels={t} />
                  <DateTimeRow label={t.to} value={draft.to} onTimeChange={setTime("to")} invalid={invalid} labels={t} />
                </div>
                <Calendar
                  mode="range"
                  selected={{ from: draft.from, to: draft.to }}
                  onSelect={pickRange}
                  today={now}
                  defaultMonth={draft.to}
                  weekStartsOn={1}
                  startMonth={min}
                  endMonth={now}
                  disabled={clock?.minDay ? [{ before: clock.minDay }, { after: now }] : { after: now }}
                  className="mt-4 w-full bg-transparent p-0"
                  classNames={{ root: "w-full" }}
                />
              </div>
              <footer className="flex items-center justify-end gap-3 p-4">
                {invalid && <p className="mr-auto text-xs/4 text-destructive-text" role="alert">{t.startAfterEnd}</p>}
                <Button variant="elevated" size="compact-sm" onClick={() => setOpen(false)}>{t.cancel}</Button>
                <Button
                  variant="primary"
                  size="compact-sm"
                  disabled={invalid}
                  onClick={() => {
                    onChange(draft.preset ? { preset: draft.preset } : { preset: null, from: draft.from, to: draft.to })
                    setOpen(false)
                  }}
                >
                  {t.apply}
                </Button>
              </footer>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}
