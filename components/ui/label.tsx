"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/** Field label; pass `optional` to append the small "Optional" tag. Children render directly (no wrapper) so shadcn's `has-[>…]` / `peer` selectors keep working. */
function Label({ className, children, optional, ...props }: React.ComponentProps<"label"> & { optional?: boolean }) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex cursor-default items-center gap-1.5 text-sm/5 font-medium text-foreground select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      {optional && (
        <span className="rounded bg-accent px-1.5 py-0.5 text-2xs/[0.875rem] tracking-[0.015em] text-muted-foreground ring-1 ring-hairline ring-inset">Optional</span>
      )}
    </label>
  )
}

export { Label }
