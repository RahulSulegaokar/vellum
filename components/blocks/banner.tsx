import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type BannerTone = "info" | "warning" | "destructive" | "success"

const tones: Record<BannerTone, { box: string; icon: React.ReactNode; role: "status" | "alert" }> = {
  info: { box: "bg-info/6 text-info-text ring-info/20", icon: <InfoIcon />, role: "status" },
  success: { box: "bg-success/6 text-success-text ring-success/20", icon: <CircleCheckIcon />, role: "status" },
  warning: { box: "bg-warning/6 text-warning-text ring-warning/24", icon: <TriangleAlertIcon />, role: "alert" },
  destructive: { box: "bg-destructive/6 text-destructive-text ring-destructive/20", icon: <CircleAlertIcon />, role: "alert" },
}

/** Full-width notice strip for page or section state (trial ending, sending paused, verification needed). */
export function Banner({
  tone = "info",
  title,
  children,
  action,
  icon,
  onDismiss,
  dismissLabel = "Dismiss",
  className,
}: {
  tone?: BannerTone
  title?: React.ReactNode
  children?: React.ReactNode
  /** Usually a link or a compact button. */
  action?: React.ReactNode
  icon?: React.ReactNode | null
  onDismiss?: () => void
  dismissLabel?: string
  className?: string
}) {
  const t = tones[tone]
  return (
    <div
      data-slot="banner"
      data-tone={tone}
      role={t.role}
      className={cn("flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm/5 ring-1 ring-inset [&_svg:not([class*='size-'])]:size-4", t.box, className)}
    >
      {icon !== null && <span className="mt-0.5 shrink-0">{icon ?? t.icon}</span>}
      <div className="min-w-0 flex-1">
        {title && <p className="font-medium">{title}</p>}
        {children && <div className={cn(title && "mt-0.5", "text-pretty")}>{children}</div>}
      </div>
      {action && <div className="shrink-0 self-center font-medium">{action}</div>}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel}
          className="relative -mr-1 grid size-6 shrink-0 pointer-coarse:after:absolute pointer-coarse:after:inset-[min(0px,calc((100%_-_44px)/2))] place-items-center rounded-md outline-none hover:bg-current/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[--tw-outline-style:solid] focus-visible:outline-ring"
        >
          <XIcon />
        </button>
      )}
    </div>
  )
}
