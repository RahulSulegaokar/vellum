"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { cn } from "@/lib/utils"

/**
 * Checkbox: 14px surface box with a hairline ring and two soft drops, a faint
 * bottom shade that clears on hover, brand fill with a drawn check when checked.
 */
function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer group/checkbox relative inline-flex size-3.5 after:absolute after:-inset-x-2.5 after:-inset-y-2 group-has-disabled/field:opacity-50 shrink-0 items-center justify-center rounded-sm bg-surface text-brand-foreground transition outline-none",
        "shadow-control",
        "before:absolute before:inset-0 before:rounded-[inherit] before:bg-linear-to-b before:to-black/2 before:transition-opacity hover:bg-accent hover:before:opacity-0 hover:shadow-control-hover",
        "data-checked:bg-brand data-checked:shadow-control-checked data-checked:hover:bg-brand",
        "focus-visible:outline-3 focus-visible:outline-brand/40 aria-invalid:bg-red-100 aria-invalid:shadow-[0_0_0_1px_var(--color-red-500)] data-disabled:cursor-not-allowed data-disabled:opacity-40",
                className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" keepMounted className="relative grid place-content-center">
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-3.5 transition-[stroke-dashoffset] duration-200 ease-out [stroke-dasharray:14] [stroke-dashoffset:14] group-data-checked/checkbox:[stroke-dashoffset:0]">
          <path d="M4.25 8.75 7.25 11.75 11.75 4.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
