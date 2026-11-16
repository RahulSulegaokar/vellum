import { FaqSection, type FaqItem } from "@/components/blocks/faq-section"

const items: FaqItem[] = [
  {
    q: "What counts as a run?",
    a: "One trip through a flow, from the trigger to the last step. Retries of a failed step are free and don't add a run.",
  },
  {
    q: "Can I try the paid features first?",
    a: "Yes. New projects get every feature for fourteen days, so you can build the flows you need before you pick a plan.",
  },
  {
    q: "Is there a discount for schools and charities?",
    a: "There is. Send us a note from your billing settings and we'll apply half off for as long as you qualify.",
  },
  {
    q: "Can I bring flows over from another tool?",
    a: "Most exports in JSON or YAML import directly. Anything we can't map is listed for you to finish by hand.",
  },
  {
    q: "What happens if a connected app is down?",
    a: "Relay pauses the affected step, retries with backoff and lets you know if it still hasn't gone through after an hour.",
  },
]

export default function FaqSectionExample() {
  return (
    <div className="mx-auto max-w-5xl p-6 sm:p-10">
      <FaqSection items={items} />
    </div>
  )
}
