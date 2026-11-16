import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

export type FaqItem = { q: string; a: React.ReactNode }

/** Accordion list of questions, one open at a time. Use inside your own section layout. */
export function FaqList({ items, className }: { items: FaqItem[]; className?: string }) {
  return (
    <Accordion className={className}>
      {items.map((item) => (
        <AccordionItem key={item.q} value={item.q} className="border-b border-edge/6 not-last:border-edge/6">
          <AccordionTrigger className="gap-x-3 rounded-none py-6 text-base/6 font-medium text-pretty text-foreground hover:no-underline focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-inset">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="pb-6 text-[0.9375rem]/6 text-pretty text-muted-foreground">{item.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

/** FAQ section: title on the left, accordion of questions on the right. `tone="dark"` for dark bands. */
export function FaqSection({
  title = "Frequently asked questions",
  description,
  items = defaultItems,
  tone = "light",
  className,
}: {
  title?: React.ReactNode
  description?: React.ReactNode
  items?: FaqItem[]
  tone?: "light" | "dark"
  className?: string
}) {
  return (
    <section data-tone={tone} className={cn("bg-background", tone === "dark" && "dark", className)}>
      <div className="grid grid-cols-1 gap-y-10 px-2.5 py-14 sm:px-6 md:py-24 lg:grid-cols-[20rem_auto] lg:gap-x-16 lg:px-8">
        <div>
          <h2 className="max-w-72 text-2xl font-semibold tracking-[-0.02em] text-balance text-foreground md:max-w-full md:text-3xl/9">{title}</h2>
          {description && <p className="mt-4 text-[0.9375rem]/6 text-muted-foreground">{description}</p>}
        </div>
        <FaqList items={items} className="min-w-0 lg:-mt-6" />
      </div>
    </section>
  )
}

const defaultItems: FaqItem[] = [
  {
    q: "What counts as a monthly active user?",
    a: "Anyone who signs in or refreshes a session during the billing month. Users who only exist in your directory don't count.",
  },
  {
    q: "Can I try paid features before upgrading?",
    a: "Yes. Every development instance has all features unlocked, so you can build and test before you choose a plan.",
  },
  {
    q: "Do you offer discounts for startups and nonprofits?",
    a: "We do. Teams under two years old or registered nonprofits can apply for a year of credits from the billing page.",
  },
  {
    q: "How do I move existing users to Acme?",
    a: "Import them with the CLI or the API. Passwords hashed with common algorithms move over without a reset.",
  },
  {
    q: "Where is my data stored?",
    a: "You can pick a region when you create an application. Data stays in that region, including backups.",
  },
]

export default function FaqSectionDemo() {
  return (
    <div className="mx-auto max-w-5xl p-6 sm:p-10">
      <FaqSection />
    </div>
  )
}
