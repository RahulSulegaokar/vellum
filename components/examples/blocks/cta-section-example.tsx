import { WaypointsIcon } from "lucide-react"
import { CtaSection } from "@/components/blocks/cta-section"

export default function CtaSectionExample() {
  return (
    <div className="mx-auto max-w-5xl p-6 sm:p-10">
      <CtaSection
        title="Put your first flow to work this week"
        description={
          <>
            Pick a template, connect two apps and switch it on. <strong className="font-medium text-foreground">Your first 1,000 runs each month cost nothing</strong>,
            and you can cancel any time.
          </>
        }
        primaryAction={{ label: "Try it free", href: "#start" }}
        secondaryAction={{ label: "Book a walkthrough", href: "#demo" }}
        mark={<WaypointsIcon strokeWidth={2.5} />}
      />
    </div>
  )
}
