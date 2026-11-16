import { CalendarClockIcon, GitForkIcon, MailIcon, TicketIcon, WebhookIcon } from "lucide-react"
import { BrowserFrame, FeatureGrid, type Feature } from "@/components/blocks/feature-grid"
import { cn } from "@/lib/utils"

function FlowMock() {
  const steps = [
    { icon: <WebhookIcon />, label: "Form submitted" },
    { icon: <GitForkIcon />, label: "Is it urgent?" },
    { icon: <TicketIcon />, label: "Open a ticket" },
  ]
  return (
    <div className="w-full px-6 pt-8 sm:px-8">
      <BrowserFrame url="relay.example/flows/intake" className="mx-auto max-w-md">
        <ol className="flex flex-col items-center gap-0 px-8 py-8">
          {steps.map((s, i) => (
            <li key={s.label} className="flex flex-col items-center">
              {i > 0 && <span aria-hidden="true" className="h-4 w-px bg-edge/20" />}
              <span className="flex items-center gap-2 rounded-md bg-surface px-3 py-1.5 text-xs font-medium text-foreground shadow-surface ring-1 ring-hairline [&_svg]:size-3.5 [&_svg]:text-subtle">
                {s.icon}
                {s.label}
              </span>
            </li>
          ))}
        </ol>
      </BrowserFrame>
    </div>
  )
}

function RunsMock() {
  const rows = [
    { name: "Weekly digest", status: "Done", ok: true },
    { name: "Intake triage", status: "Done", ok: true },
    { name: "Invoice sync", status: "Retrying", ok: false },
  ]
  return (
    <ul className="w-full space-y-2 px-6 pt-8 sm:px-8">
      {rows.map((r) => (
        <li key={r.name} className="flex items-center gap-3 rounded-lg bg-surface-muted px-3 py-2 ring-1 ring-hairline">
          <span aria-hidden="true" className={cn("size-1.5 rounded-full", r.ok ? "bg-success" : "bg-warning")} />
          <span className="text-xs font-medium text-foreground">{r.name}</span>
          <span className={cn("ml-auto text-[0.6875rem]", r.ok ? "text-subtle" : "text-warning-text")}>{r.status}</span>
        </li>
      ))}
    </ul>
  )
}

function IconCluster() {
  const icons = [<WebhookIcon key="w" />, <CalendarClockIcon key="c" />, <MailIcon key="m" />, <GitForkIcon key="g" />]
  return (
    <div className="grid grid-cols-2 gap-3 pt-8">
      {icons.map((icon, i) => (
        <span key={i} className="flex size-12 items-center justify-center rounded-xl bg-surface-muted text-foreground shadow-surface ring-1 ring-hairline [&_svg]:size-5">
          {icon}
        </span>
      ))}
    </div>
  )
}

const features: Feature[] = [
  {
    title: "Draw it, then run it",
    body: "Lay out each step on a canvas: what starts the flow, which way it branches and where the result goes. What you see is what runs.",
    link: { label: "Tour the editor", href: "#editor" },
    visual: <FlowMock />,
    className: "md:col-span-4",
  },
  {
    title: "Every run, on the record",
    body: "See what each run did, step by step, and replay it after a fix.",
    visual: <RunsMock />,
    className: "md:col-span-2",
  },
  {
    title: "Many ways to start",
    body: "Kick off a flow from a webhook, a schedule, an inbox or another flow.",
    visual: <IconCluster />,
    className: "md:col-span-2",
  },
  {
    title: "Talks to what you already use",
    body: "Ready-made connectors for the usual suspects, plus plain HTTP for everything else, so Relay slots in beside your current tools.",
    link: { label: "Browse connectors", href: "#connectors" },
    copyFirst: true,
    visual: (
      <div className="flex w-full flex-wrap justify-center gap-2 px-6 pb-8 sm:px-8">
        {["HTTP", "Email", "Sheets", "Chat", "Calendar", "Webhooks", "SQL"].map((s) => (
          <span key={s} className="rounded-md bg-surface-muted px-2.5 py-1 font-mono text-xs text-muted-foreground ring-1 ring-hairline">
            {s}
          </span>
        ))}
      </div>
    ),
    className: "md:col-span-4",
  },
]

export default function FeatureGridExample() {
  return (
    <div className="mx-auto max-w-5xl p-6 sm:p-10">
      <FeatureGrid
        eyebrow="How it works"
        title="Repetitive work, drawn once and handled for good"
        description="Relay turns the steps you repeat every day into flows that run on their own and tell you when they need a hand."
        features={features}
        compliance={{ label: "Your data, your rules", badges: ["Encrypted", "Exportable", "Region-pinned", "Logged"] }}
      />
    </div>
  )
}
