import { TestimonialsSection, type Testimonial } from "@/components/blocks/testimonials-section"

const featured: Testimonial[] = [
  {
    quote: "Our support queue used to need someone triaging it all morning. Now a flow tags, routes and replies before anyone logs in.",
    name: "Maya Lindqvist",
    role: "Support lead, Northwind Labs",
  },
  {
    quote: "We drew the whole onboarding hand-off on one canvas. New hires get their accounts before their first coffee.",
    name: "Daniel Okafor",
    role: "Operations, Halcyon",
  },
  {
    quote: "Run history is the feature I didn't know I needed. When something looks off I can replay it step by step.",
    name: "Priya Raman",
    role: "Engineering manager, Brightpath",
  },
]

const quotes: Testimonial[] = [
  { quote: "Our first flow was live before lunch. The template did most of the work.", name: "Tom Becker", role: "Founder, Quarry" },
  { quote: "Branching let us retire a pile of scripts nobody wanted to touch.", name: "Sofia Marin", role: "Head of data, Lumen" },
  { quote: "Schedules replaced three cron jobs and the server they ran on.", name: "Ken Watanabe", role: "Platform engineer" },
  { quote: "The handbook is short, clear and every recipe in it works as written.", name: "Ada Mensah", role: "Freelance developer" },
]

export default function TestimonialsSectionExample() {
  return (
    <TestimonialsSection
      title="Teams hand off the repetitive work"
      description="From two-person studios to support desks with hundreds of agents, people use Relay to stop copying things between tabs."
      featured={featured}
      quotes={quotes}
    />
  )
}
