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
        "group/switch relative inline-flex shrink-0 items-center justify-start rounded-full p-0.5 ring-1 transition outline-none pointer-coarse:after:absolute pointer-coarse:after:inset-[min(0px,calc((100%_-_44px)/2))] data-[size=default]:w-6 data-[size=sm]:w-5",
        "bg-control-off ring-edge/20 data-checked:bg-brand data-checked:ring-brand-edge-strong",
        // Forced colours (Windows high contrast): Canvas track with a CanvasText edge, Highlight when on.
        "forced-colors:bg-[Canvas] forced-colors:outline-1 forced-colors:[--tw-outline-style:solid] forced-colors:-outline-offset-1 forced-colors:outline-[CanvasText] forced-colors:forced-color-adjust-none forced-colors:data-checked:bg-[Highlight] forced-colors:focus-visible:outline-2 forced-colors:focus-visible:outline-offset-2 forced-colors:focus-visible:outline-[CanvasText]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[--tw-outline-style:solid] focus-visible:outline-ring data-disabled:cursor-not-allowed data-disabled:opacity-40",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "relative rounded-full bg-surface bg-linear-to-b from-black/0 to-black/2 ring-1 transition-all duration-120 motion-reduce:transition-none",
          "group-data-[size=default]/switch:size-3 group-data-[size=sm]/switch:size-2.5",
          "ring-edge/4 shadow-thumb",
          "forced-colors:bg-[CanvasText] forced-colors:bg-none forced-colors:data-checked:bg-[HighlightText]",
          "data-checked:shadow-none data-checked:ring-edge/12 group-data-[size=default]/switch:data-checked:ml-2 group-data-[size=sm]/switch:data-checked:ml-1.5"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
