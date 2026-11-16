"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

/*
 * Dialog: a muted shell holding a surface panel (header + sections),
 * with the footer sitting on the gray shell below the panel. The popup is pinned
 * near the top of the viewport (min(10vh, 10rem)) like the reference, not centred.
 */

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-overlay backdrop-blur transition-opacity duration-240 data-[ending-style]:opacity-0 data-[ending-style]:duration-150 data-[starting-style]:opacity-0",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Viewport className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-5 py-[min(10vh,10rem)]">
        <DialogPrimitive.Popup
          data-slot="dialog-content"
          className={cn(
            "@container/dialog relative isolate w-full max-w-sm overflow-hidden rounded-xl bg-surface-muted text-foreground outline-none",
            "shadow-dialog ring-1 ring-edge/6",
            "origin-top transition-[opacity,scale,translate] duration-240 ease-[cubic-bezier(0.25,1,0.5,1)] data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0 data-[ending-style]:duration-150 data-[starting-style]:translate-y-1 data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0",
            className
          )}
          {...props}
        >
          {children}
          {showCloseButton && (
            <DialogPrimitive.Close data-slot="dialog-close" render={<Button variant="ghost" className="absolute top-2 right-2" size="icon-sm" />}>
              <XIcon />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Viewport>
    </DialogPortal>
  )
}

/** The white raised card inside the gray shell. */
function DialogPanel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-panel"
      className={cn("overflow-clip rounded-xl bg-surface shadow-surface ring-1 ring-edge/4", className)}
      {...props}
    />
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"header">) {
  return <header data-slot="dialog-header" className={cn("space-y-0.5 px-5 py-4", className)} {...props} />
}

/** Bordered body region; stack several and only the first loses its top border. */
function DialogSection({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-section" className={cn("border-t border-edge/6 p-5", className)} {...props} />
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"footer"> & {
  showCloseButton?: boolean
}) {
  return (
    <footer
      data-slot="dialog-footer"
      className={cn(
        "grid auto-cols-fr grid-flow-col items-stretch gap-3 p-4 **:data-[slot=button]:justify-center @[28rem]/dialog:flex @[28rem]/dialog:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="elevated" size="compact" />}>Close</DialogPrimitive.Close>
      )}
    </footer>
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return <DialogPrimitive.Title data-slot="dialog-title" className={cn("text-[0.9375rem]/5 font-semibold tracking-[-0.01em] text-foreground", className)} {...props} />
}

function DialogDescription({ className, ...props }: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("block text-[0.8125rem]/[1.125rem] text-subtle *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPanel,
  DialogPortal,
  DialogSection,
  DialogTitle,
  DialogTrigger,
}
