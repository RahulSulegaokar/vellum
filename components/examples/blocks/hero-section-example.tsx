import { HeroSection } from "@/components/blocks/hero-section"

const prompt = {
  text: "npm install @relay/flows",
  label: "npm install @relay/flows",
  copiedLabel: "Command copied",
}

const logos = ["Northwind", "Lumen", "Halcyon", "Brightpath", "Quarry"]

export default function HeroSectionExample() {
  return (
    <HeroSection
      title="Hand the busywork between your tools to a flow"
      description="Relay watches for the events your team cares about and does the follow-up for you: filing tickets, posting updates, syncing records. Draw it once, then let it run."
      primaryAction={{ label: "Draw your first flow", href: "#start" }}
      prompt={prompt}
      logosLabel="Running quietly at"
      logos={logos}
    />
  )
}
