"use client"

import { useState } from "react"
import {
  DashboardShell,
  type ShellAccount,
  type ShellApplication,
  type ShellEnvironment,
  type ShellNavItem,
  type ShellWorkspace,
} from "@/components/blocks/dashboard-shell"

const account: ShellAccount = { name: "Maya Lindqvist", email: "maya@example.com", initials: "ML" }
const workspaces: ShellWorkspace[] = [
  { id: "northwind", name: "northwind", plan: "Team" },
  { id: "northwind-labs", name: "northwind-labs", plan: "Starter" },
]
const applications: ShellApplication[] = [
  { id: "web", name: "Northwind Web" },
  { id: "storefront", name: "Northwind Storefront" },
  { id: "internal", name: "Internal tools" },
]
const environments: ShellEnvironment[] = [
  { id: "sandbox", label: "Sandbox", tone: "sandbox" },
  { id: "live", label: "Live", tone: "live" },
]
const nav: ShellNavItem[] = [
  { label: "Overview", href: "#overview" },
  { label: "Customers", href: "#customers" },
  { label: "Projects", href: "#projects" },
  { label: "Billing", href: "#billing" },
  { label: "Logs", href: "#logs" },
  { label: "Settings", href: "#settings" },
]

export default function DashboardShellExample() {
  const [workspace, setWorkspace] = useState("northwind")
  const [application, setApplication] = useState("web")
  const [environment, setEnvironment] = useState("sandbox")
  const [active, setActive] = useState("#customers")
  const page = nav.find((n) => n.href === active)?.label ?? "Overview"

  return (
    <DashboardShell
      account={account}
      workspaces={workspaces}
      currentWorkspaceId={workspace}
      onWorkspaceChange={setWorkspace}
      onAddWorkspace={() => console.info("Add workspace")}
      onOpenSettings={() => setActive("#settings")}
      onInviteMembers={() => console.info("Invite members")}
      onSignOut={() => console.info("Sign out")}
      applications={applications}
      currentApplicationId={application}
      onApplicationChange={setApplication}
      onCreateApplication={() => console.info("Create application")}
      environments={environments}
      environment={environment}
      onEnvironmentChange={setEnvironment}
      nav={nav}
      activeHref={active}
      onNavigate={(item, e) => {
        e.preventDefault()
        setActive(item.href)
      }}
      notificationCount={1}
      onNotificationsClick={() => console.info("Open notifications")}
      onInvite={() => console.info("Invite")}
      primaryAction={environment === "sandbox" ? { label: "Go live", onClick: () => setEnvironment("live") } : undefined}
    >
      <main className="mx-auto w-[calc(100%-2.5rem)] max-w-6xl pt-8 pb-10">
        <h1 className="text-xl font-semibold text-foreground">{page}</h1>
        <p className="mt-1 text-sm text-subtle">Page content renders here.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {["Total customers", "Active this week", "New sign-ups"].map((label) => (
            <div key={label} className="rounded-xl bg-surface p-5 shadow-card">
              <p className="text-[0.8125rem] text-subtle">{label}</p>
              <div className="mt-3 h-6 w-20 rounded-md bg-accent" />
            </div>
          ))}
        </div>
        <div className="mt-8 h-64 rounded-xl bg-surface shadow-card" />
      </main>
    </DashboardShell>
  )
}
