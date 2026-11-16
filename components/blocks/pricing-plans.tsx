"use client"

/** Pricing section: title, monthly/annual toggle and a responsive grid of plan cards. */

import * as React from "react"
import { CheckIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SegmentedControl, SegmentedControlItem } from "@/components/ui/segmented-control"
import { cn } from "@/lib/utils"

export type Billing = "monthly" | "annual"

export type PricingPlan = {
  name: string
  /** Per-month prices; leave both `null` for a free or custom plan and set `label` ("Free", "Custom"). */
  price: { monthly: number | null; annual: number | null; label?: string }
  /** Shown under the price for plans without a number ("Free forever"). */
  note?: string
  blurb: string
  cta: { label: string; href: string }
  featured?: boolean
  featuresTitle?: string
  features: string[]
}

/** Digits roll vertically when the value changes, like an odometer. */
function RollingNumber({ value, prefix = "$" }: { value: number; prefix?: string }) {
  const chars = String(value).split("")
  return (
    <span className="inline-flex tabular-nums">
      <span className="sr-only">
        {prefix}
        {value}
      </span>
      <span aria-hidden="true">{prefix}</span>
      {chars.map((c, i) => (
        <span key={`${chars.length}-${i}`} aria-hidden="true" className="relative inline-block h-[1lh] overflow-hidden">
          <span
            className="flex flex-col motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.23,1,0.32,1)]"
            style={{ transform: `translateY(${-Number(c) * 10}%)` }}
          >
            {Array.from({ length: 10 }, (_, d) => (
              <span key={d}>{d}</span>
            ))}
          </span>
        </span>
      ))}
    </span>
  )
}

/**
 * One plan: name, price, blurb, CTA and a feature list. `featured` adds the "Most popular" emphasis.
 * The CTA renders through `linkComponent` (defaults to `"a"`).
 */
export function PlanCard({
  plan,
  billing,
  popularLabel = "Most popular",
  linkComponent,
}: {
  plan: PricingPlan
  billing: Billing
  popularLabel?: string
  /** Element or component used for the CTA link, e.g. your router's `Link`. Defaults to `"a"`. */
  linkComponent?: React.ElementType
}) {
  const Link = linkComponent ?? "a"
  const amount = billing === "annual" ? plan.price.annual : plan.price.monthly
  const paid = amount !== null
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-xl bg-surface-muted p-1 shadow-card dark:shadow-card-dark",
        plan.featured && "ring-2 ring-brand"
      )}
    >
      <div className="rounded-lg bg-surface p-5 shadow-surface">
        <div className="flex h-6 items-center justify-between gap-2">
          <h3 className="text-base font-semibold text-foreground">{plan.name}</h3>
          {plan.featured && <Badge variant="subtle-info">{popularLabel}</Badge>}
        </div>
        <div className="mt-2.5 text-3xl font-semibold tracking-tight text-foreground">
          {paid ? <RollingNumber value={amount} /> : <span>{plan.price.label}</span>}
        </div>
        <div className="mt-0.5 text-[0.8125rem]/5 text-subtle">
          {paid ? (billing === "annual" ? "per month, billed annually" : "per month, billed monthly") : plan.note}
        </div>
        <p className="mt-3 text-[0.8125rem]/5 text-pretty text-muted-foreground">{plan.blurb}</p>
        <Button
          variant={plan.featured ? "primary" : "elevated"}
          nativeButton={false}
          render={<Link href={plan.cta.href} />}
          className="mt-4 w-full"
        >
          {plan.cta.label}
        </Button>
      </div>
      <div className="p-5">
        {plan.featuresTitle && <p className="text-[0.8125rem] font-medium text-foreground">{plan.featuresTitle}</p>}
        <ul role="list" className="mt-4 space-y-3 text-[0.8125rem]/5">
          {plan.features.map((f) => (
            <li key={f} className="flex gap-2">
              <span aria-hidden="true" className="mt-0.5 flex size-4 flex-none items-center justify-center rounded-full bg-subtle/10 text-foreground">
                <CheckIcon className="size-2.5" strokeWidth={3} />
              </span>
              <span className="text-pretty text-muted-foreground">{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/**
 * Pricing section: title, monthly/annual toggle and a responsive grid of plan cards.
 *
 * Plan CTAs render through `linkComponent`, which defaults to `"a"`; pass your router's `Link` for
 * client-side navigation.
 */
export function PricingPlans({
  title,
  description,
  plans,
  defaultBilling = "annual",
  annualHint,
  monthlyLabel = "Monthly",
  annualLabel = "Annual",
  billingLabel = "Billing period",
  popularLabel,
  linkComponent,
  className,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  plans: PricingPlan[]
  defaultBilling?: Billing
  /** Small badge beside the toggle, e.g. the annual discount. Hidden when omitted. */
  annualHint?: string
  monthlyLabel?: string
  annualLabel?: string
  /** Accessible name of the billing toggle. */
  billingLabel?: string
  /** Badge on the featured plan. Defaults to "Most popular". */
  popularLabel?: string
  /** Element or component used for links, e.g. your router's `Link`. Defaults to `"a"`. */
  linkComponent?: React.ElementType
  className?: string
}) {
  const [billing, setBilling] = React.useState<Billing>(defaultBilling)
  const titleId = React.useId()
  const cols = plans.length >= 4 ? "md:grid-cols-2 xl:grid-cols-4" : plans.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"
  return (
    <section aria-labelledby={titleId} className={cn("flex flex-col items-center", className)}>
      <h2 id={titleId} className="text-center text-3xl font-semibold tracking-[-0.03em] text-balance text-foreground sm:text-4xl">
        {title}
      </h2>
      {description && <p className="mt-4 max-w-xl text-center text-base/6 text-balance text-muted-foreground">{description}</p>}
      <div className="mt-8 flex items-center gap-3">
        <SegmentedControl aria-label={billingLabel} value={billing} onValueChange={(v) => setBilling(v as Billing)} className="w-fit">
          <SegmentedControlItem value="monthly">{monthlyLabel}</SegmentedControlItem>
          <SegmentedControlItem value="annual">{annualLabel}</SegmentedControlItem>
        </SegmentedControl>
        {annualHint && <Badge variant="subtle">{annualHint}</Badge>}
      </div>
      <div className={cn("mt-10 grid w-full grid-cols-1 gap-4", cols)}>
        {plans.map((p) => (
          <PlanCard key={p.name} plan={p} billing={billing} popularLabel={popularLabel} linkComponent={linkComponent} />
        ))}
      </div>
    </section>
  )
}
