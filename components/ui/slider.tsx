import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { cn } from "@/lib/utils"

/**
 * Slider in the shape of shadcn's Luma style: an 8px track with a brand range and a 24×16 pill thumb
 * (16×24 when vertical). One thumb per value; a plain number is one thumb.
 */

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  getAriaValueText,
  getAriaLabel,
  ...props
}: SliderPrimitive.Root.Props &
  Pick<SliderPrimitive.Thumb.Props, "getAriaValueText" | "getAriaLabel">) {
  // One thumb per value. A plain number (value={50}) is one thumb; nothing at all is a min–max range, as in shadcn.
  const given = value ?? defaultValue
  const _values = Array.isArray(given) ? given : given != null ? [given] : [min, max]

  return (
    <SliderPrimitive.Root
      className={cn("data-horizontal:w-full data-vertical:h-full", className)}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow overflow-hidden rounded-full bg-muted forced-colors:outline-1 forced-colors:[--tw-outline-style:solid] forced-colors:-outline-offset-1 select-none data-horizontal:h-2 data-horizontal:w-full data-vertical:h-full data-vertical:w-2"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="bg-control-checked forced-colors:bg-[Highlight] forced-colors:forced-color-adjust-none select-none data-horizontal:h-full data-vertical:w-full"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            index={index}
            getAriaValueText={getAriaValueText}
            getAriaLabel={getAriaLabel}
            className="relative block h-4 w-6 shrink-0 rounded-full bg-surface shadow-thumb ring-1 ring-edge/12 dark:bg-foreground transition-[box-shadow] select-none data-vertical:h-6 data-vertical:w-4 after:absolute after:-inset-2 pointer-coarse:after:inset-[min(0px,calc((100%_-_44px)/2))] hover:ring-4 hover:ring-ring/30 active:ring-4 active:ring-ring/30 has-focus-visible:ring-4 has-focus-visible:ring-ring/30 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:[--tw-outline-style:solid] has-focus-visible:outline-ring forced-colors:bg-[CanvasText] forced-colors:ring-0 disabled:pointer-events-none disabled:opacity-50"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
