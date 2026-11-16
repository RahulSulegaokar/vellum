import { PricingPlans, type PricingPlan } from "@/components/blocks/pricing-plans"

const plans: PricingPlan[] = [
  {
    name: "Starter",
    price: { monthly: null, annual: null, label: "Free" },
    note: "No card needed",
    blurb: "For one person automating their own week.",
    cta: { label: "Get started", href: "#start" },
    featuresTitle: "What you get",
    features: ["1,000 runs a month", "Five active flows", "Every connector", "Help from the forum"],
  },
  {
    name: "Team",
    price: { monthly: 30, annual: 24 },
    blurb: "For small teams sharing flows across a few apps.",
    cta: { label: "Try Team for 14 days", href: "#trial" },
    featured: true,
    featuresTitle: "Starter, and also",
    features: ["25,000 runs a month", "Unlimited flows", "Shared folders and comments", "Branching and schedules", "Replies by email within a day"],
  },
  {
    name: "Scale",
    price: { monthly: 140, annual: 112 },
    blurb: "For teams running flows the business depends on.",
    cta: { label: "Try Scale for 14 days", href: "#trial" },
    featuresTitle: "Team, and also",
    features: ["250,000 runs a month", "Run history kept for a year", "Per-folder permissions", "A faster reply when something breaks"],
  },
  {
    name: "Custom",
    price: { monthly: null, annual: null, label: "Let's talk" },
    note: "Priced to your volume",
    blurb: "For very high volumes or unusual hosting needs.",
    cta: { label: "Get a quote", href: "#quote" },
    featuresTitle: "Scale, and also",
    features: ["Runs in your own cloud account", "Invoicing on your terms", "A named contact on our side", "Help moving existing flows over"],
  },
]

export default function PricingPlansExample() {
  return (
    <div className="mx-auto max-w-6xl p-6 sm:p-10">
      <PricingPlans
        title="Pay for the runs you use"
        description="Start on the free plan and move up when your flows get busier. Every plan includes every connector."
        plans={plans}
        annualHint="20% off yearly"
      />
    </div>
  )
}
