"use client"

import { useState } from "react"
import { DateRangePicker, type DateRangePreset, type DateRangeValue } from "@/components/blocks/date-range-picker"

const HOUR = 3_600_000
const DAY = 24 * HOUR

// A one-day retention window: longer presets show but can't be picked.
const presets: DateRangePreset[] = [
  { key: "last15Minutes", label: "Last 15 minutes", ms: HOUR / 4 },
  { key: "last1Hour", label: "Last 1 hour", ms: HOUR },
  { key: "last3Hours", label: "Last 3 hours", ms: 3 * HOUR },
  { key: "last24Hours", label: "Last 24 hours", ms: DAY, triggerLabel: "Last 1 day" },
  { key: "last3Days", label: "Last 3 days", ms: 3 * DAY, disabled: true },
  { key: "last7Days", label: "Last 7 days", ms: 7 * DAY, disabled: true },
  { key: "last30Days", label: "Last 30 days", ms: 30 * DAY, disabled: true },
]

export default function DateRangePickerExample() {
  const [range, setRange] = useState<DateRangeValue>({ preset: "last24Hours" })
  return (
    <div className="mx-auto flex max-w-5xl justify-end p-6 sm:p-10">
      <DateRangePicker value={range} onChange={setRange} presets={presets} maxAgeMs={DAY} />
    </div>
  )
}
