/** Closing call-to-action card: title, short pitch and up to two link actions over soft line art. */
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type CtaAction = { label: string; href: string }

/**
 * Closing call-to-action card: title, short pitch and actions over soft line art.
 *
 * `primaryAction` and `secondaryAction` render through `linkComponent`, which defaults to `"a"`; pass your
 * router's `Link` for client-side navigation. For anything else (a form, a button that opens a dialog) use `actions`.
 */
export function CtaSection({
  title,
  description,
  primaryAction,
  secondaryAction,
  actions,
  art = true,
  mark,
  linkComponent,
  className,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  primaryAction?: CtaAction
  secondaryAction?: CtaAction
  /** Extra content in the action row, rendered after the link actions. */
  actions?: React.ReactNode
  /** Show the line art and the round disc on the right. */
  art?: boolean
  /** Your brand mark or an icon, centered on the disc. Nothing renders on the disc when omitted. */
  mark?: React.ReactNode
  /** Element or component used for links, e.g. your router's `Link`. Defaults to `"a"`. */
  linkComponent?: React.ElementType
  className?: string
}) {
  const Link = linkComponent ?? "a"
  const hasActions = primaryAction || secondaryAction || actions
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden rounded-2xl bg-surface-muted bg-[radial-gradient(88%_100%_at_center_top,var(--color-surface),transparent)] shadow-card dark:shadow-card-dark",
        className
      )}
    >
      {art && (
        <>
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-full [mask:radial-gradient(34rem_34rem_at_calc(100%-9rem)_0,black_3%,transparent_70%)]">
            <div className="absolute -top-10 right-68 aspect-969/887 w-242 origin-right -scale-x-100 text-edge opacity-15">
              <svg viewBox="0 0 969 887" fill="none" stroke="currentColor" className="size-full">
                {Array.from({ length: 9 }, (_, i) => (
                  <path key={i} d={`M0 ${120 + i * 70}H${360 + Math.abs(i - 4) * 40}L${420 + Math.abs(i - 4) * 40} ${443 + (i - 4) * 14}H969`} />
                ))}
              </svg>
            </div>
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute -top-36 right-[calc(50%-16rem)] size-128 sm:-right-32 lg:-right-20 xl:right-3">
            <div className="absolute top-24 left-14 size-102 [mask:radial-gradient(closest-side,black_45%,transparent)]">
              <div className="grid size-full place-items-center rounded-full bg-surface p-[22%] text-surface-muted drop-shadow-[0_24px_40px_rgb(0_0_0/0.12)] [&_svg]:size-full">
                {mark}
              </div>
            </div>
          </div>
        </>
      )}
      <div className="relative px-6 pt-20 pb-14 sm:px-10 sm:pb-20 lg:px-18">
        <h2 className="max-w-80 text-2xl font-semibold tracking-[-0.02em] text-balance text-foreground sm:text-3xl">{title}</h2>
        {description && <p className="mt-4 max-w-104 text-base/6 text-muted-foreground">{description}</p>}
        {hasActions && (
          <div className="relative z-10 mt-6 flex flex-wrap items-center gap-3">
            {primaryAction && (
              <Button size="lg" nativeButton={false} render={<Link href={primaryAction.href} />}>
                {primaryAction.label}
              </Button>
            )}
            {secondaryAction && (
              <Button variant="elevated" size="lg" nativeButton={false} render={<Link href={secondaryAction.href} />}>
                {secondaryAction.label}
              </Button>
            )}
            {actions}
          </div>
        )}
      </div>
    </section>
  )
}
