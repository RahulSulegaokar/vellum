"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "@/lib/utils"

/**
 * Switch with 2px track padding.
 * default: 24px track, 12px thumb sliding 8px. sm: 20px track, 10px thumb sliding 6px.
 * Off: control-off track, soft-shadowed thumb. On: brand purple track, flat thumb.
 */
function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "group/switch relative inline-flex shrink-0 items-center justify-start rounded-full p-0.5 ring-1 transition outline-none data-[size=default]:w-6 data-[size=sm]:w-5",
        "bg-control-off ring-edge/20 data-checked:bg-brand data-checked:ring-brand-edge-strong",
        "focus-visible:outline-3 focus-visible:outline-brand/40 data-disabled:cursor-not-allowed data-disabled:opacity-40",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "relative rounded-full bg-surface bg-linear-to-b from-black/0 to-black/2 ring-1 transition-all duration-120",
          "group-data-[size=default]/switch:size-3 group-data-[size=sm]/switch:size-2.5",
          "ring-edge/4 shadow-thumb",
          "data-checked:shadow-none data-checked:ring-edge/12 group-data-[size=default]/switch:data-checked:ml-2 group-data-[size=sm]/switch:data-checked:ml-1.5"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
