"use client"

// Test fixture for tests/a11y.spec.ts: set filter pills whose labels start with a full-height stem (translated
// labels), at normal size and with the text zoomed, so the clear button's ring sits right against the label.
import { useState } from "react"
import { FilterPill, type FilterValues } from "@/components/blocks/filter-bar"

const filters = [
  { id: "event", label: "Event Type", options: ["user.created"] },
  { id: "type", label: "Ereignistyp", options: ["user.created"] },
  { id: "host", label: "Hôte", options: ["api"] },
  { id: "id", label: "Identifier", options: ["usr_01"] },
  { id: "mode", label: "Mode", options: ["live"] },
  { id: "user", label: "Benutzer-ID", options: ["usr_01"] },
  { id: "region", label: "Région", options: ["eu"] },
  { id: "list", label: "Liste", options: ["a"] },
]

function Pills() {
  const [values, setValues] = useState<FilterValues>(Object.fromEntries(filters.map((f) => [f.id, [f.options[0]]])))
  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((f) => (
        <FilterPill key={f.id} filter={f} value={values[f.id] ?? []} onChange={(v) => setValues((s) => ({ ...s, [f.id]: v }))} />
      ))}
    </div>
  )
}

export default function FilterPillsFixture() {
  return (
    <main className="flex flex-col gap-8 p-6">
      <Pills />
      {/* Zoomed text, as with a larger browser text size. */}
      <div style={{ zoom: 1.5 }}>
        <Pills />
      </div>
    </main>
  )
}
