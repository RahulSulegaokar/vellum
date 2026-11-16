"use client"

import * as React from "react"
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import { cn } from "@/lib/utils"

/**
 * Segmented control: a tinted 6px-radius track; the selected segment
 * lifts onto a white chip with a hairline ring and two soft drops. Single-select.
 */
function SegmentedControl({
  className,
  value,
  onValueChange,
  ...props
}: Omit<ToggleGroupPrimitive.Props, "value" | "onValueChange" | "multiple"> & {
  value: string
  onValueChange: (value: string) => void
}) {
  return (
    <ToggleGroupPrimitive
      data-slot="segmented-control"
      value={[value]}
      onValueChange={(next) => {
        // Ignore attempts to deselect the active segment.
        if (next.length) onValueChange(next[next.length - 1] as string)
      }}
      className={cn("isolate flex w-full items-stretch gap-0.5 rounded-md bg-subtle/8 ring-1 ring-subtle/16 sm:w-fit max-sm:*:flex-1", className)}
      {...props}
    />
  )
}

function SegmentedControlItem({ className, children, ...props }: TogglePrimitive.Props) {
  return (
    <TogglePrimitive
      data-slot="segmented-control-item"
      className={cn(
        "group/segment relative inline-flex items-center justify-center gap-1 rounded-md px-2 py-1.5 text-[0.8125rem]/4 font-medium text-subtle outline-none",
        "focus-visible:ring-2 focus-visible:ring-brand/50 data-disabled:cursor-not-allowed data-disabled:opacity-40 data-pressed:text-foreground",
        className
      )}
      {...props}
    >
      {/* hover wash */}
      <span aria-hidden="true" className="absolute inset-0 -z-20 rounded-[inherit] bg-subtle/8 opacity-0 transition-opacity group-hover/segment:opacity-100 group-data-pressed/segment:opacity-0" />
      {/* selected chip */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 rounded-[inherit] bg-surface bg-linear-to-b from-black/0 to-black/2 opacity-0 shadow-chip transition-opacity group-data-pressed/segment:opacity-100 dark:bg-none"
      />
      <span className="px-1 whitespace-nowrap">{children}</span>
    </TogglePrimitive>
  )
}

export { SegmentedControl, SegmentedControlItem }
