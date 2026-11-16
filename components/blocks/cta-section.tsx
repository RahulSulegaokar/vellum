import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** Large round mark used as the card's decorative art. */
function MarkArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="10" className="fill-surface" />
      <path d="M7.5 15.5 12 7l4.5 8.5" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="stroke-surface-muted" />
    </svg>
  )
}

/** Closing call-to-action card: title, short pitch and actions over soft line art. */
export function CtaSection({
  title = "Start building with Acme today",
  description = (
    <>
      Set up accounts and workspaces in minutes. <strong className="font-medium text-foreground">Free for your first 5,000 users</strong>, no
      credit card required.
    </>
  ),
  actions = (
    <>
      <Button size="lg" nativeButton={false} render={<a href="#start" />}>
        Start for free
      </Button>
      <Button variant="elevated" size="lg" nativeButton={false} render={<a href="#sales" />}>
        Talk to sales
      </Button>
    </>
  ),
  art = true,
  className,
}: {
  title?: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  /** Show the line art and mark on the right. */
  art?: boolean
  className?: string
}) {
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
              <MarkArt className="size-full drop-shadow-[0_24px_40px_rgb(0_0_0/0.12)]" />
            </div>
          </div>
        </>
      )}
      <div className="relative px-6 pt-20 pb-14 sm:px-10 sm:pb-20 lg:px-18">
        <h2 className="max-w-80 text-2xl font-semibold tracking-[-0.02em] text-balance text-foreground sm:text-3xl">{title}</h2>
        {description && <p className="mt-4 max-w-104 text-base/6 text-muted-foreground">{description}</p>}
        {actions && <div className="relative z-10 mt-6 flex flex-wrap items-center gap-3">{actions}</div>}
      </div>
    </section>
  )
}

export default function CtaSectionDemo() {
  return (
    <div className="mx-auto max-w-5xl p-6 sm:p-10">
      <CtaSection />
    </div>
  )
}
