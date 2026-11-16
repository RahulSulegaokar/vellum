import { InfoIcon } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Inline notice for page-level context ("Use this development instance for test users…").
 * Tinted with the subtle token and a hairline inset ring; pass any icon to replace the info glyph.
 */
export function Callout({
  icon = <InfoIcon className="size-4 shrink-0 translate-y-0.5" />,
  className,
  children,
}: {
  icon?: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      data-slot="callout"
      className={cn(
        "flex items-start gap-2 rounded-md bg-subtle/4 p-2 text-[0.8125rem]/[1.125rem] text-subtle ring-1 ring-subtle/12 ring-inset",
        className
      )}
    >
      {icon}
      <p className="text-pretty">{children}</p>
    </div>
  )
}

export default function CalloutDemo() {
  return (
    <div className="mx-auto max-w-2xl p-10">
      <Callout>
        Use this development instance for internal and test users. When you&apos;re ready to invite real users, create
        your production instance.
      </Callout>
    </div>
  )
}
