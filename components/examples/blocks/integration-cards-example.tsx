import { ChartColumnIcon, DatabaseIcon, HexagonIcon, MailIcon } from "lucide-react"
import { IntegrationCards, type Integration } from "@/components/blocks/integration-cards"

/* Placeholder partners with lucide marks in chart tokens. */
const items: Integration[] = [
  {
    id: "tidepool",
    name: "Tidepool",
    domain: "tidepool.example",
    description: "A hosted Postgres database with file storage and realtime channels. Use your app's session to scope every query to the signed-in user.",
    docsHref: "#docs-tidepool",
    icon: <DatabaseIcon aria-hidden="true" className="size-6 text-chart-1" />,
  },
  {
    id: "fernwave",
    name: "Fernwave",
    domain: "fernwave.example",
    description: "A TypeScript backend with server functions and scheduled jobs. The current user is available in every function.",
    docsHref: "#docs-fernwave",
    icon: <HexagonIcon aria-hidden="true" className="size-6 text-chart-2" />,
  },
  {
    id: "lumen",
    name: "Lumen Analytics",
    domain: "lumen.example",
    description: "Product analytics with funnels and retention. Send account and workspace events without writing a tracking plan.",
    docsHref: "#docs-lumen",
    action: "connect",
    icon: <ChartColumnIcon aria-hidden="true" className="size-6 text-chart-3" />,
  },
  {
    id: "relay",
    name: "Relay Mail",
    domain: "relaymail.example",
    description: "Transactional email delivery. Send receipts, alerts and one-time codes from your own domain.",
    docsHref: "#docs-relay",
    action: "connect",
    icon: <MailIcon aria-hidden="true" className="size-6 text-chart-4" />,
  },
]

export default function IntegrationCardsExample() {
  return (
    <div className="mx-auto max-w-5xl p-6 sm:p-10">
      <IntegrationCards items={items} defaultValue={{ tidepool: true }} requestHref="mailto:support@acme.example?subject=Integration%20request" />
    </div>
  )
}
