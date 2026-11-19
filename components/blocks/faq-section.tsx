/** FAQ section: title on the left, an accordion of questions on the right. */
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

export type FaqItem = { q: string; a: React.ReactNode }

/** Accordion list of questions, one open at a time. Use inside your own section layout. */
export function FaqList({ items, className }: { items: FaqItem[]; className?: string }) {
  return (
    <Accordion className={className}>
      {items.map((item) => (
        <AccordionItem key={item.q} value={item.q} className="border-b border-edge/6 not-last:border-edge/6">
          <AccordionTrigger className="gap-x-3 rounded-none py-6 text-base/6 font-medium text-pretty text-foreground hover:no-underline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:[--tw-outline-style:solid] focus-visible:outline-ring">
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
  items,
  tone = "light",
  className,
}: {
  title?: React.ReactNode
  description?: React.ReactNode
  items: FaqItem[]
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
