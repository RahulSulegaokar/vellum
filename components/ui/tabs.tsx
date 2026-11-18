"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none",
  {
    variants: {
      variant: {
        /** Below the sm breakpoint the list wraps instead of pushing the page sideways when labels are long. */
        default: "bg-muted max-sm:max-w-full max-sm:flex-wrap max-sm:group-data-horizontal/tabs:h-auto max-sm:group-data-horizontal/tabs:min-h-8",
        line: "gap-1 bg-transparent max-sm:max-w-full max-sm:flex-wrap max-sm:group-data-horizontal/tabs:h-auto max-sm:group-data-horizontal/tabs:min-h-8",
        /** Underline tabs: text links over a 1px separator; the active one gets a 1px ink underline. */
        /** On touch screens the list gets 4px of room above and below, so the triggers' 44px hit areas are not clipped by the scroll. */
        underline: "h-auto! w-full justify-start gap-6 overflow-x-auto rounded-none bg-transparent p-0 pb-px scrollbar-none shadow-rule pointer-coarse:pt-1 pointer-coarse:pb-[5px]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-[calc(100%-1px)] max-sm:group-data-[variant=default]/tabs-list:group-data-horizontal/tabs:h-[calc(2rem-7px)] max-sm:group-data-[variant=line]/tabs-list:group-data-horizontal/tabs:h-[calc(2rem-7px)] pointer-coarse:before:absolute pointer-coarse:before:inset-[min(0px,calc((100%_-_44px)/2))] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:[--tw-outline-style:solid] focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:text-muted-foreground dark:hover:text-foreground group-data-[variant=default]/tabs-list:data-active:shadow-chip group-data-[variant=line]/tabs-list:data-active:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent",
        "forced-colors:group-data-[variant=default]/tabs-list:data-active:bg-[Highlight] forced-colors:group-data-[variant=default]/tabs-list:data-active:text-[HighlightText] forced-colors:group-data-[variant=default]/tabs-list:data-active:forced-color-adjust-none forced-colors:after:bg-[CanvasText] forced-colors:after:forced-color-adjust-none",
        "data-active:bg-background data-active:text-foreground dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground",
        "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100",
        "group-data-[variant=underline]/tabs-list:h-auto group-data-[variant=underline]/tabs-list:flex-none group-data-[variant=underline]/tabs-list:rounded-sm group-data-[variant=underline]/tabs-list:border-0 group-data-[variant=underline]/tabs-list:px-0 group-data-[variant=underline]/tabs-list:py-2 group-data-[variant=underline]/tabs-list:text-sm/5 group-data-[variant=underline]/tabs-list:font-normal group-data-[variant=underline]/tabs-list:text-subtle group-data-[variant=underline]/tabs-list:hover:text-foreground group-data-[variant=underline]/tabs-list:data-active:bg-transparent group-data-[variant=underline]/tabs-list:data-active:text-foreground group-data-[variant=underline]/tabs-list:data-active:shadow-none",
        "group-data-[variant=underline]/tabs-list:after:inset-x-0 group-data-[variant=underline]/tabs-list:after:top-full pointer-coarse:group-data-[variant=underline]/tabs-list:after:top-[calc(100%+4px)] group-data-[variant=underline]/tabs-list:after:bottom-auto group-data-[variant=underline]/tabs-list:after:h-px group-data-[variant=underline]/tabs-list:after:bg-foreground group-data-[variant=underline]/tabs-list:data-active:after:opacity-100",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[--tw-outline-style:solid] focus-visible:outline-ring", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
