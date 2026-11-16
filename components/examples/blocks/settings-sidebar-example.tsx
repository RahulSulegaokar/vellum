"use client"

import { useState } from "react"
import { BellIcon, CodeIcon, CreditCardIcon, SettingsIcon, ShieldCheckIcon, UserIcon, UsersIcon } from "lucide-react"
import {
  SettingsMobileNav,
  SettingsSidebar,
  type SettingsNavigateHandler,
  type SettingsNavSection,
} from "@/components/blocks/settings-sidebar"

const sections: SettingsNavSection[] = [
  {
    title: "Workspace",
    items: [
      { label: "General", icon: <SettingsIcon strokeWidth={1.5} />, href: "#general" },
      { label: "Members", icon: <UsersIcon strokeWidth={1.5} />, href: "#members" },
      {
        label: "Billing",
        icon: <CreditCardIcon strokeWidth={1.5} />,
        children: [
          { label: "Plan", href: "#plan" },
          { label: "Invoices", href: "#invoices" },
          { label: "Payment methods", href: "#payment-methods" },
        ],
      },
      { label: "Notifications", icon: <BellIcon strokeWidth={1.5} />, href: "#notifications" },
      {
        label: "Security",
        icon: <ShieldCheckIcon strokeWidth={1.5} />,
        children: [
          { label: "Authentication", href: "#authentication" },
          { label: "Sessions", href: "#sessions" },
          { label: "Audit log", href: "#audit-log" },
        ],
      },
    ],
  },
  {
    title: "Developers",
    items: [
      {
        label: "API",
        icon: <CodeIcon strokeWidth={1.5} />,
        children: [
          { label: "API keys", href: "#api-keys" },
          { label: "Webhooks", href: "#webhooks" },
          { label: "Integrations", href: "#integrations" },
        ],
      },
    ],
  },
  { title: "Account", items: [{ label: "Profile", icon: <UserIcon strokeWidth={1.5} />, href: "#profile" }] },
]

const titles = new Map(sections.flatMap((s) => s.items.flatMap((g) => (g.children ? g.children : [{ label: g.label, href: g.href }]))).map((l) => [l.href, l.label]))

export default function SettingsSidebarExample() {
  const [current, setCurrent] = useState("#general")
  const title = titles.get(current) ?? "Settings"
  const navigate: SettingsNavigateHandler = (link, e) => {
    e?.preventDefault()
    setCurrent(link.href)
  }

  return (
    <div className="mx-auto w-[calc(100%-2.5rem)] max-w-6xl pt-8 pb-10 lg:pt-10">
      <div className="flex gap-4 max-lg:flex-col lg:gap-10">
        <SettingsSidebar sections={sections} current={current} onNavigate={navigate} shortcut />
        <SettingsMobileNav sections={sections} current={current} currentLabel={title} onNavigate={navigate} />
        <main className="min-w-0 flex-1">
          <h1 className="text-xl/7 font-semibold tracking-[-0.015em] text-foreground">{title}</h1>
          <p className="mt-1 text-sm text-subtle">Press ⌘K to jump to any setting.</p>
          <div className="mt-8 h-72 rounded-xl bg-surface shadow-card" />
        </main>
      </div>
    </div>
  )
}
