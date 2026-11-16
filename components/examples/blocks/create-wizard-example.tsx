"use client"

import { BellIcon, ChartColumnIcon, FolderKanbanIcon, HistoryIcon, LayoutTemplateIcon, MailIcon, ServerIcon, WebhookIcon } from "lucide-react"
import { CreateWizard, type WizardToggleOption, type WizardTypeOption } from "@/components/blocks/create-wizard"

const typeIcon = "mt-0.5 size-5 shrink-0 text-subtle"

const types: WizardTypeOption[] = [
  { value: "website", label: "Website", description: "Pages and forms that people visit in a browser.", icon: <LayoutTemplateIcon aria-hidden="true" strokeWidth={1.5} className={typeIcon} /> },
  { value: "service", label: "Backend service", description: "An API or worker that other apps call.", icon: <ServerIcon aria-hidden="true" strokeWidth={1.5} className={typeIcon} /> },
  { value: "internal", label: "Internal tool", description: "Dashboards and admin screens for your team.", icon: <FolderKanbanIcon aria-hidden="true" strokeWidth={1.5} className={typeIcon} /> },
]

const options: WizardToggleOption[] = [
  { id: "analytics", label: "Usage analytics", icon: <ChartColumnIcon className="size-4" /> },
  { id: "alerts", label: "Error alerts", icon: <BellIcon className="size-4" /> },
  { id: "email", label: "Email notifications", icon: <MailIcon className="size-4" /> },
  { id: "webhooks", label: "Webhooks", icon: <WebhookIcon className="size-4" /> },
  { id: "audit", label: "Audit log", icon: <HistoryIcon className="size-4" /> },
]

export default function CreateWizardExample() {
  return (
    <CreateWizard
      types={types}
      options={options}
      defaultName="Northwind portal"
      defaultEnabled={["analytics", "alerts"]}
      steps={["Project", "Features"]}
      typeTitle="What are you building?"
      nameTitle="Project name"
      optionsLabel="Features"
      createLabel="Create project"
      backHref="#projects"
      onCreate={(_values, signal) =>
        new Promise<void>((resolve, reject) => {
          const t = setTimeout(resolve, 1500)
          signal.addEventListener("abort", () => {
            clearTimeout(t)
            reject(signal.reason)
          })
        })
      }
    />
  )
}
