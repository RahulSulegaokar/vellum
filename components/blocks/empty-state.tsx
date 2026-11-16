import { InboxIcon } from "lucide-react"
import { cn } from "@/lib/utils"

/** Centered empty state: icon tile, title, supporting copy and optional actions. Sits inside a card or table body. */
export function EmptyState({
  icon = <InboxIcon className="size-5 text-subtle" />,
  title,
  description,
  actions,
  className,
}: {
  icon?: React.ReactNode
  title: string
  description?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <div data-slot="empty-state" className={cn("flex flex-col items-center gap-4 p-10 text-center", className)}>
      <div className="flex size-12 items-center justify-center rounded-md bg-subtle/4 ring-1 ring-edge/8 ring-inset">{icon}</div>
      <div className="flex flex-col gap-1">
        <h3 className="text-[0.9375rem]/5 font-semibold text-balance text-foreground">{title}</h3>
        {description && <div className="max-w-120 text-sm/5 text-balance text-subtle">{description}</div>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
