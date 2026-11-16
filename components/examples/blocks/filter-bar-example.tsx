"use client"

import { useRef, useState } from "react"
import { CheckIcon, LinkIcon, RotateCwIcon } from "lucide-react"
import { DateRangePicker, type DateRangeValue } from "@/components/blocks/date-range-picker"
import { FilterBar, type FilterDefinition, type FilterValues } from "@/components/blocks/filter-bar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const demoFilters: FilterDefinition[] = [
  { id: "event", label: "Event Type", mono: true, options: ["user.created", "user.updated", "user.deleted", "session.created", "session.ended", "workspace.created"] },
  { id: "user", label: "User ID", placeholder: "usr_01…" },
  { id: "identifier", label: "Identifier" },
  { id: "ip", label: "IP Address" },
  { id: "session", label: "Session ID" },
]

export default function FilterBarExample() {
  const [values, setValues] = useState<FilterValues>({ event: ["user.created", "session.created"] })
  const [range, setRange] = useState<DateRangeValue>({ preset: "last24Hours" })
  const [spinning, setSpinning] = useState(false)
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const refetch = () => {
    setSpinning(true)
    setTimeout(() => setSpinning(false), 700)
  }
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
    } catch {}
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 1500)
  }

  const actions = (touch: boolean) => (
    <>
      <DateRangePicker value={range} onChange={setRange} touch={touch} maxAgeMs={24 * 3_600_000} />
      <Button variant="elevated" size={touch ? "icon-compact-md" : "icon-compact-sm"} aria-label="Refetch events" onClick={refetch}>
        <RotateCwIcon aria-hidden="true" className={cn("text-subtle", spinning && "animate-spin [animation-duration:700ms]")} />
      </Button>
      <Button variant="elevated" size={touch ? "icon-compact-md" : "icon-compact-sm"} aria-label={copied ? "Link copied" : "Copy link"} onClick={copyLink}>
        {copied ? <CheckIcon aria-hidden="true" className="text-success" /> : <LinkIcon aria-hidden="true" className="text-subtle" />}
      </Button>
    </>
  )

  return (
    <div className="mx-auto max-w-5xl p-6 sm:p-10">
      <FilterBar
        filters={demoFilters}
        values={values}
        onChange={(id, v) => setValues((s) => ({ ...s, [id]: v }))}
        onClearAll={() => setValues({})}
        label="log filters"
        actions={actions(false)}
        touchActions={actions(true)}
      />
    </div>
  )
}
