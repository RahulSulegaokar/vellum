import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-[13px] font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:z-10 focus-visible:ring-ring/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[--tw-outline-style:solid] focus-visible:outline-ring active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 pointer-coarse:after:absolute pointer-coarse:after:top-1/2 pointer-coarse:after:left-1/2 pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 pointer-coarse:after:-translate-1/2",
  {
    variants: {
      variant: {
        default:
          "bg-solid text-solid-foreground shadow-button hover:bg-solid-hover dark:shadow-none",
        /** Glossy purple button (form submits, "Quickstarts"). */
        gloss: "relative isolate overflow-hidden border-0 forced-colors:outline-1 forced-colors:[--tw-outline-style:solid] forced-colors:-outline-offset-1 ring-[0.5px] shadow-[inset_0_1px_rgb(255_255_255/0.07),0_1px_3px_rgb(33_33_38/0.2)] transition duration-300 ease-[cubic-bezier(0.4,0.36,0,1)] active:not-aria-[haspopup]:translate-y-0 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-linear-to-b before:from-white/20 before:opacity-50 before:transition-opacity before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] hover:before:opacity-100 after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-[inherit] after:bg-linear-to-b after:from-white/10 after:from-46% after:to-54% after:mix-blend-overlay pointer-coarse:after:min-h-0 pointer-coarse:after:min-w-0 bg-brand text-brand-foreground ring-brand",
        /** Glossy near-black button ("Talk to sales"). */
        "gloss-solid": "relative isolate overflow-hidden border-0 forced-colors:outline-1 forced-colors:[--tw-outline-style:solid] forced-colors:-outline-offset-1 ring-[0.5px] shadow-[inset_0_1px_rgb(255_255_255/0.07),0_1px_3px_rgb(33_33_38/0.2)] transition duration-300 ease-[cubic-bezier(0.4,0.36,0,1)] active:not-aria-[haspopup]:translate-y-0 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-linear-to-b before:from-white/20 before:opacity-50 before:transition-opacity before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] hover:before:opacity-100 after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-[inherit] after:bg-linear-to-b after:from-white/10 after:from-46% after:to-54% after:mix-blend-overlay pointer-coarse:after:min-h-0 pointer-coarse:after:min-w-0 bg-solid-strong text-solid-foreground ring-solid-strong",
        /** Raised surface: hairline ring, two soft drops, faint bottom shade that clears on hover. */
        elevated: "border-0 forced-colors:outline-1 forced-colors:[--tw-outline-style:solid] forced-colors:-outline-offset-1 rounded-md transition before:pointer-events-none before:rounded-[inherit] before:absolute before:inset-0 before:size-full before:bg-linear-to-b before:transition-opacity hover:before:opacity-0 active:not-aria-[haspopup]:translate-y-0 motion-safe:active:scale-[0.98] focus-visible:ring-0 shadow-[var(--btn-inner),var(--btn-close-drop),var(--btn-far-drop),0_0_0_1px_var(--btn-ring)] motion-safe:active:shadow-[var(--btn-inner),var(--btn-close-drop),var(--btn-far-drop-pressed),0_0_0_1px_var(--btn-ring)] bg-surface text-foreground hover:bg-surface-muted before:from-black/0 before:from-30% before:to-black/2 [--btn-ring:var(--field-ring)] [--btn-inner:inset_0_1px_0.5px_0_rgb(255_255_255/0.05)] [--btn-close-drop:0_2px_2px_-1px_rgb(0_0_0/0.06)] [--btn-far-drop:0_4px_4px_-2px_rgb(0_0_0/0.04)] [--btn-far-drop-pressed:0_2.5px_4px_-2px_rgb(0_0_0/0.04)]",
        /** Raised brand fill with a top sheen and a text drop shadow. The sheen starts at 7% white so the label keeps 4.5:1 on every row (tests/contrast.mjs). */
        primary: "border-0 forced-colors:outline-1 forced-colors:[--tw-outline-style:solid] forced-colors:-outline-offset-1 rounded-md transition before:pointer-events-none before:rounded-[inherit] before:absolute before:inset-0 before:size-full before:bg-linear-to-b before:transition-opacity hover:before:opacity-0 active:not-aria-[haspopup]:translate-y-0 motion-safe:active:scale-[0.98] focus-visible:ring-0 shadow-[var(--btn-inner),var(--btn-close-drop),var(--btn-far-drop),0_0_0_1px_var(--btn-ring)] motion-safe:active:shadow-[var(--btn-inner),var(--btn-close-drop),var(--btn-far-drop-pressed),0_0_0_1px_var(--btn-ring)] bg-brand text-brand-foreground [text-shadow:0_1px_2px_rgb(0_0_0/0.2)] hover:[text-shadow:none] before:from-white/7 [--btn-ring:var(--brand-edge)] [--btn-inner:inset_0_1px_1px_0_rgb(255_255_255/0.12)] [--btn-close-drop:0_2px_2px_-1px_rgb(0_0_0/0.16)] [--btn-far-drop:0_4px_4px_-2px_rgb(0_0_0/0.24)] [--btn-far-drop-pressed:0_2.5px_4px_-2px_rgb(0_0_0/0.24)]",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive-text hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-3.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        /** 1.875rem pill used with the gloss variants. */
        pill: "h-[1.875rem] gap-0 px-3 text-sm",
        /** Compact size: 28px tall, 13px medium label. */
        compact: "h-7 gap-1.5 px-3 text-[0.8125rem]/4 font-medium",
        /** Extra-compact size (headers, toolbars): 24px tall, 12px label. */
        "compact-sm": "h-6 gap-1 px-2 text-xs/4 font-medium",
        /** Square compact icon buttons. */
        "icon-compact": "size-7 p-0",
        "icon-compact-sm": "size-6 p-0",
        /** Touch-sized compact buttons (phone toolbars): 32px tall. */
        "compact-md": "h-8 gap-1.5 px-2 text-[0.8125rem]/5 font-medium",
        "icon-compact-md": "size-8 p-0",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
