"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Props for a sideways-scrolling wrapper: while its content is wider than it is, it becomes a focusable, named
 * region (tabindex 0, role "region") so keyboard users can scroll it. The name is `label`, else the caption of a
 * table inside it, else "Table". Spread the result on the wrapper: `<div {...useScrollRegion(label)}>`.
 */
function useScrollRegion(label?: string) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [overflows, setOverflows] = React.useState(false)
  const [caption, setCaption] = React.useState<string | undefined>()
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      setOverflows(el.scrollWidth > el.clientWidth + 1)
      setCaption(el.querySelector("caption")?.textContent?.trim() || undefined)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    if (el.firstElementChild) observer.observe(el.firstElementChild)
    return () => observer.disconnect()
  }, [])
  return { ref, ...(overflows ? { tabIndex: 0, role: "region", "aria-label": label ?? caption ?? "Table" } : {}) }
}

/** A scrolling table; see `useScrollRegion` for how it becomes a named, focusable region when it overflows. */
function Table({ className, label, ...props }: React.ComponentProps<"table"> & { label?: string }) {
  const region = useScrollRegion(label)
  return (
    <div
      {...region}
      data-slot="table-container"
      className="relative w-full overflow-x-auto outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:[--tw-outline-style:solid] focus-visible:outline-ring"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  useScrollRegion,
}
