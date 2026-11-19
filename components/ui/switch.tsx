"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "@/lib/utils"

/**
 * Switch in the shape of shadcn's Luma style: a wide track with a pill-shaped thumb.
 * default: 44×20 track, 24×16 thumb sliding 16px. sm: 28×16 track, 16×12 thumb sliding 8px.
 * Off: control-off track, raised light thumb (light in dark mode too). On: brand track. Invalid: field-invalid edge.
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
        "group/switch relative inline-flex shrink-0 items-center justify-start rounded-full p-0.5 ring-1 transition-colors duration-150 outline-none motion-reduce:transition-none",
        "data-[size=default]:h-5 data-[size=default]:w-11 data-[size=sm]:h-4 data-[size=sm]:w-7",
        // Touch: at least 44 wide (the default track already is) by 36 tall, centred on the track.
        "pointer-coarse:after:absolute pointer-coarse:after:inset-x-[min(0px,calc((100%_-_44px)/2))] pointer-coarse:after:inset-y-[min(0px,calc((100%_-_36px)/2))]",
        "bg-control-off ring-edge/12 data-checked:bg-control-checked data-checked:ring-brand-edge-strong",
        "aria-invalid:ring-2 aria-invalid:ring-field-invalid data-checked:aria-invalid:ring-field-invalid",
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
          "pointer-events-none block rounded-full bg-surface ring-1 ring-edge/6 shadow-thumb dark:bg-foreground dark:data-checked:bg-brand-foreground transition-transform duration-150 ease-out motion-reduce:transition-none",
          "group-data-[size=default]/switch:h-4 group-data-[size=default]/switch:w-6 group-data-[size=sm]/switch:h-3 group-data-[size=sm]/switch:w-4",
          "group-data-[size=default]/switch:data-checked:translate-x-4 group-data-[size=sm]/switch:data-checked:translate-x-2",
          "rtl:group-data-[size=default]/switch:data-checked:-translate-x-4 rtl:group-data-[size=sm]/switch:data-checked:-translate-x-2",
          "forced-colors:bg-[CanvasText] forced-colors:data-checked:bg-[HighlightText]"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
