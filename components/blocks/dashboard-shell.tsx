"use client"

import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import {
  ArrowRightIcon,
  BellIcon,
  BoxIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  LayoutGridIcon,
  LogOutIcon,
  MailIcon,
  PlusIcon,
  SettingsIcon,
  UserPlusIcon,
} from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

/* ---------------------------------- Types ---------------------------------- */

export type ShellNavItem = { label: string; href: string }
export type ShellWorkspace = { id: string; name: string; plan?: string }
export type ShellAccount = { name: string; email: string; initials: string }
export type ShellApplication = { id: string; name: string; href?: string }
export type ShellEnvironment = { id: string; label: string; tone: "development" | "production" }

/* ------------------------------- Shared bits ------------------------------- */

/** Breadcrumb-style menu trigger: flat until hovered or open, then a raised white chip. */
const crumb =
  "group/crumb relative isolate flex h-8 items-center justify-center gap-1.5 rounded-md px-1.5 text-[0.8125rem]/4 font-medium whitespace-nowrap text-foreground transition outline-none hover:bg-surface hover:shadow-chip hover:ring-1 hover:ring-hairline focus-visible:outline-3 focus-visible:outline-brand/40 data-popup-open:bg-surface data-popup-open:shadow-chip data-popup-open:ring-1 data-popup-open:ring-hairline"

const menuItem =
  "flex w-full cursor-default items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-[0.8125rem]/5 text-muted-foreground outline-none select-none data-highlighted:bg-accent data-highlighted:text-foreground [&_svg]:size-4 [&_svg]:shrink-0"

function CrumbChevron() {
  return <ChevronDownIcon aria-hidden="true" className="mx-0.5 size-3.5 text-subtle transition-transform group-data-popup-open/crumb:rotate-180" />
}

function Slash() {
  return (
    <svg className="mx-1 h-4 w-2 flex-none text-edge/20" viewBox="0 0 8 16" fill="none" aria-hidden="true">
      <path d="M7 1 1 15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function WorkspaceAvatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("flex flex-none items-center justify-center rounded-md bg-brand font-semibold text-brand-foreground ring-1 ring-edge/12 ring-inset", className)}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  )
}

const envDot: Record<ShellEnvironment["tone"], string> = {
  development: "bg-orange-500 shadow-orange-500/25",
  production: "bg-green-500 shadow-green-500/25",
}

function EnvironmentDot({ tone }: { tone: ShellEnvironment["tone"] }) {
  return <span aria-hidden="true" className={cn("block size-1.5 flex-none rounded-full shadow-[0_0_0_3px]", envDot[tone])} />
}

/* ------------------------------ Workspace menu ----------------------------- */

/** Workspace and account switcher: current workspace with plan badge, other workspaces and account actions. */
export function WorkspaceMenu({
  account,
  workspaces,
  currentWorkspaceId,
  onWorkspaceChange,
  onAddWorkspace,
  onOpenSettings,
  onInviteMembers,
  onSignOut,
}: {
  account: ShellAccount
  workspaces: ShellWorkspace[]
  currentWorkspaceId: string
  onWorkspaceChange?: (id: string) => void
  onAddWorkspace?: () => void
  onOpenSettings?: () => void
  onInviteMembers?: () => void
  onSignOut?: () => void
}) {
  const current = workspaces.find((w) => w.id === currentWorkspaceId) ?? workspaces[0]
  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="Open workspace menu" className={cn(crumb, "gap-2 px-1")}>
        <WorkspaceAvatar name={current.name} className="size-6 text-[0.6875rem]" />
        <span className="max-w-40 truncate">{current.name}</span>
        {current.plan && <Badge variant="subtle">{current.plan}</Badge>}
        <CrumbChevron />
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={8} className="w-80 max-w-[calc(100vw-2rem)] rounded-xl p-0">
        <div className="flex items-center gap-3 px-4 py-3.5">
          <span className="relative flex-none">
            <WorkspaceAvatar name={current.name} className="size-9 text-sm" />
            <span
              aria-hidden="true"
              className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full bg-foreground text-[0.5625rem] font-semibold text-background ring-2 ring-popover"
            >
              {account.initials}
            </span>
          </span>
          <div className="flex min-w-0 flex-col">
            <p className="truncate text-sm/5 font-medium text-foreground">{account.name}</p>
            <p className="truncate text-[0.8125rem]/4 text-subtle">{account.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator className="mx-0 my-0 bg-edge/6" />
        <div className="max-h-60 overflow-y-auto p-1">
          <DropdownMenuRadioGroup value={current.id} onValueChange={(v) => onWorkspaceChange?.(v as string)}>
            {workspaces.map((w) => (
              <MenuPrimitive.RadioItem key={w.id} value={w.id} closeOnClick className={cn(menuItem, "font-medium text-foreground")}>
                <WorkspaceAvatar name={w.name} className="size-6 text-[0.6875rem]" />
                <span className="min-w-0 flex-1 truncate">{w.name}</span>
                <MenuPrimitive.RadioItemIndicator className="text-subtle">
                  <CheckIcon />
                </MenuPrimitive.RadioItemIndicator>
              </MenuPrimitive.RadioItem>
            ))}
          </DropdownMenuRadioGroup>
          {onAddWorkspace && (
            <MenuPrimitive.Item onClick={onAddWorkspace} className={cn(menuItem, "font-medium")}>
              <span className="flex size-6 items-center justify-center"><PlusIcon /></span>
              Add workspace
            </MenuPrimitive.Item>
          )}
        </div>
        <DropdownMenuSeparator className="mx-0 my-0 bg-edge/6" />
        <div className="p-1">
          <MenuPrimitive.Item onClick={onOpenSettings} className={cn(menuItem, "font-medium")}>
            <span className="flex size-6 items-center justify-center"><SettingsIcon /></span>
            <span className="flex-1">Settings</span>
            <ChevronRightIcon />
          </MenuPrimitive.Item>
          <MenuPrimitive.Item onClick={onInviteMembers} className={cn(menuItem, "font-medium")}>
            <span className="flex size-6 items-center justify-center"><UserPlusIcon /></span>
            Invite members
          </MenuPrimitive.Item>
        </div>
        <DropdownMenuSeparator className="mx-0 my-0 bg-edge/6" />
        <div className="p-1">
          <MenuPrimitive.Item onClick={onSignOut} className={cn(menuItem, "font-medium")}>
            <span className="flex size-6 items-center justify-center"><LogOutIcon /></span>
            Sign out
          </MenuPrimitive.Item>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* ----------------------------- Application menu ---------------------------- */

/** Application switcher: current application with a settings shortcut, other applications and create/all links. */
export function ApplicationMenu({
  applications,
  currentApplicationId,
  settingsHref = "#",
  allApplicationsHref = "#",
  onCreateApplication,
}: {
  applications: ShellApplication[]
  currentApplicationId: string
  settingsHref?: string
  allApplicationsHref?: string
  onCreateApplication?: () => void
}) {
  const current = applications.find((a) => a.id === currentApplicationId) ?? applications[0]
  const others = applications.filter((a) => a.id !== current.id)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="Switch application" className={crumb}>
        <span className="max-w-48 truncate">{current.name}</span>
        <CrumbChevron />
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={8} className="w-68 p-0">
        <div className="flex items-center gap-2.5 border-b border-edge/6 p-2.5 text-[0.8125rem]/5">
          <span aria-hidden="true" className="flex size-6 flex-none items-center justify-center rounded-md bg-accent text-subtle ring-1 ring-edge/12 ring-inset">
            <BoxIcon className="size-3.5" />
          </span>
          <span className="min-w-0 grow truncate font-medium text-foreground">{current.name}</span>
          <MenuPrimitive.LinkItem
            href={settingsHref}
            aria-label="Application settings"
            className="flex size-6 items-center justify-center rounded-md bg-surface text-subtle shadow-control outline-none data-highlighted:bg-surface-muted data-highlighted:text-foreground"
          >
            <SettingsIcon className="size-4" />
          </MenuPrimitive.LinkItem>
        </div>
        {others.length > 0 && (
          <div role="group" aria-label="Applications" className="max-h-56 overflow-y-auto border-b border-edge/6 p-1">
            {others.map((app) => (
              <MenuPrimitive.LinkItem key={app.id} href={app.href ?? "#"} className={cn(menuItem, "group/app text-foreground")}>
                <BoxIcon className="text-subtle" />
                <span className="flex-1 truncate">{app.name}</span>
                <ArrowRightIcon className="text-subtle opacity-0 transition-opacity group-data-highlighted/app:opacity-100" />
              </MenuPrimitive.LinkItem>
            ))}
          </div>
        )}
        <div className="p-1">
          {onCreateApplication && (
            <MenuPrimitive.Item onClick={onCreateApplication} className={menuItem}>
              <PlusIcon />
              <span className="font-medium">Create application</span>
            </MenuPrimitive.Item>
          )}
          <MenuPrimitive.LinkItem href={allApplicationsHref} className={menuItem}>
            <LayoutGridIcon />
            <span className="font-medium">All applications</span>
          </MenuPrimitive.LinkItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* ----------------------------- Environment menu ---------------------------- */

/** Environment switcher with a status dot (orange for development, green for production). */
export function EnvironmentMenu({
  environments,
  value,
  onValueChange,
  onCreateEnvironment,
  createLabel = "Create production instance",
}: {
  environments: ShellEnvironment[]
  value: string
  onValueChange?: (id: string) => void
  onCreateEnvironment?: () => void
  createLabel?: string
}) {
  const current = environments.find((e) => e.id === value) ?? environments[0]
  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="Switch environment" className={cn(crumb, "pl-2.5")}>
        <EnvironmentDot tone={current.tone} />
        <span>{current.label}</span>
        <CrumbChevron />
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={8} className="w-60">
        <DropdownMenuRadioGroup value={current.id} onValueChange={(v) => onValueChange?.(v as string)}>
          {environments.map((env) => (
            <MenuPrimitive.RadioItem key={env.id} value={env.id} closeOnClick className={cn(menuItem, "font-medium text-foreground")}>
              <span className="flex size-4 items-center justify-center">
                <MenuPrimitive.RadioItemIndicator keepMounted className="text-foreground data-unchecked:opacity-0">
                  <CheckIcon />
                </MenuPrimitive.RadioItemIndicator>
              </span>
              <EnvironmentDot tone={env.tone} />
              <span className="truncate">{env.label}</span>
            </MenuPrimitive.RadioItem>
          ))}
        </DropdownMenuRadioGroup>
        {onCreateEnvironment && (
          <DropdownMenuItem
            onClick={onCreateEnvironment}
            className="gap-2.5 px-2 py-1.5 text-[0.8125rem]/5 font-medium text-brand focus:text-brand not-data-[variant=destructive]:focus:**:text-brand"
          >
            <PlusIcon />
            {createLabel}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* ------------------------------ Primary nav -------------------------------- */

/** Underline tab navigation under the shell header; the active item gets `aria-current="page"`. */
export function ShellNav({
  items,
  activeHref,
  label = "Primary",
  onNavigate,
}: {
  items: ShellNavItem[]
  activeHref?: string
  label?: string
  onNavigate?: (item: ShellNavItem, event: React.MouseEvent<HTMLAnchorElement>) => void
}) {
  return (
    <div className="sticky top-0 z-10 h-12 border-t border-edge/6 bg-surface-muted shadow-rule">
      <nav aria-label={label} className="relative flex h-full overflow-x-auto px-0.5 pb-px [scrollbar-width:none] md:px-1.5">
        {items.map((item) => {
          const active = item.href === activeHref
          return (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => onNavigate?.(item, e)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex shrink-0 items-center rounded-xl px-3.5 text-[0.8125rem] font-normal transition outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-inset",
                active ? "text-foreground" : "text-subtle"
              )}
            >
              {item.label}
              {active && <span aria-hidden="true" className="absolute inset-x-3.5 top-full h-px bg-foreground" />}
            </a>
          )
        })}
      </nav>
    </div>
  )
}

/* --------------------------------- Shell ----------------------------------- */

/** Dashboard chrome: workspace, application and environment menus, header actions and the primary tab nav above the page content. */
export function DashboardShell({
  account,
  workspaces,
  currentWorkspaceId,
  onWorkspaceChange,
  onAddWorkspace,
  onOpenSettings,
  onInviteMembers,
  onSignOut,
  applications,
  currentApplicationId,
  onCreateApplication,
  environments,
  environment,
  onEnvironmentChange,
  onCreateEnvironment,
  nav,
  activeHref,
  onNavigate,
  notificationCount = 0,
  onNotificationsClick,
  inviteLabel = "Invite",
  onInvite,
  primaryAction,
  className,
  children,
}: {
  account: ShellAccount
  workspaces: ShellWorkspace[]
  currentWorkspaceId: string
  onWorkspaceChange?: (id: string) => void
  onAddWorkspace?: () => void
  onOpenSettings?: () => void
  onInviteMembers?: () => void
  onSignOut?: () => void
  applications: ShellApplication[]
  currentApplicationId: string
  onCreateApplication?: () => void
  environments: ShellEnvironment[]
  environment: string
  onEnvironmentChange?: (id: string) => void
  onCreateEnvironment?: () => void
  nav: ShellNavItem[]
  activeHref?: string
  onNavigate?: (item: ShellNavItem, event: React.MouseEvent<HTMLAnchorElement>) => void
  notificationCount?: number
  onNotificationsClick?: () => void
  inviteLabel?: string
  onInvite?: () => void
  /** The one primary action in the header, e.g. "Go to production". */
  primaryAction?: { label: string; onClick?: () => void }
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div data-slot="dashboard-shell" className={cn("flex min-h-dvh flex-col bg-background", className)}>
      <header className="relative h-14 bg-surface-muted">
        <div className="relative flex h-full items-center justify-between overflow-x-auto overscroll-x-none pl-2 [scrollbar-width:none] md:pl-3.5">
          <div className="me-4 flex items-center">
            <WorkspaceMenu
              account={account}
              workspaces={workspaces}
              currentWorkspaceId={currentWorkspaceId}
              onWorkspaceChange={onWorkspaceChange}
              onAddWorkspace={onAddWorkspace}
              onOpenSettings={onOpenSettings}
              onInviteMembers={onInviteMembers}
              onSignOut={onSignOut}
            />
            <Slash />
            <ApplicationMenu applications={applications} currentApplicationId={currentApplicationId} onCreateApplication={onCreateApplication} />
            <Slash />
            <EnvironmentMenu environments={environments} value={environment} onValueChange={onEnvironmentChange} onCreateEnvironment={onCreateEnvironment} />
          </div>
          <div className="sticky end-0 isolate flex h-full items-center gap-2.5 bg-surface-muted px-4 md:px-5">
            <div className="relative inline-flex">
              <Button
                variant="elevated"
                size="icon-compact-sm"
                onClick={onNotificationsClick}
                aria-label={notificationCount > 0 ? `Notifications, ${notificationCount} unread` : "Notifications"}
              >
                <BellIcon className="text-subtle" />
              </Button>
              {notificationCount > 0 && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[0.625rem] font-medium text-brand-foreground tabular-nums"
                >
                  {notificationCount > 99 ? "99+" : notificationCount}
                </span>
              )}
            </div>
            {onInvite && (
              <Button variant="elevated" size="compact-sm" onClick={onInvite} aria-label={inviteLabel} className="max-sm:w-6 max-sm:px-0">
                <span className="max-sm:hidden">{inviteLabel}</span>
                <MailIcon className="text-subtle sm:hidden" />
              </Button>
            )}
            {primaryAction && (
              <Button variant="primary" size="compact-sm" onClick={primaryAction.onClick}>
                {primaryAction.label}
              </Button>
            )}
          </div>
        </div>
      </header>
      <ShellNav items={nav} activeHref={activeHref} onNavigate={onNavigate} />
      <div className="flex-1">{children}</div>
    </div>
  )
}

/* ---------------------------------- Demo ----------------------------------- */

const demoAccount: ShellAccount = { name: "Maya Lindqvist", email: "maya@acme.dev", initials: "ML" }
const demoWorkspaces: ShellWorkspace[] = [
  { id: "acme", name: "acme", plan: "Pro" },
  { id: "acme-labs", name: "acme-labs", plan: "Hobby" },
]
const demoApplications: ShellApplication[] = [
  { id: "web", name: "Acme Web" },
  { id: "storefront", name: "Acme Storefront", href: "#" },
  { id: "internal", name: "Internal tools", href: "#" },
]
const demoEnvironments: ShellEnvironment[] = [
  { id: "development", label: "Development", tone: "development" },
  { id: "production", label: "Production", tone: "production" },
]
const demoNav: ShellNavItem[] = [
  { label: "Overview", href: "#overview" },
  { label: "Users", href: "#users" },
  { label: "Organizations", href: "#organizations" },
  { label: "Billing", href: "#billing" },
  { label: "Logs", href: "#logs" },
  { label: "Configure", href: "#configure" },
]

export default function DashboardShellDemo() {
  const [workspace, setWorkspace] = useState("acme")
  const [environment, setEnvironment] = useState("development")
  const [active, setActive] = useState("#users")
  const page = demoNav.find((n) => n.href === active)?.label ?? "Overview"

  return (
    <DashboardShell
      account={demoAccount}
      workspaces={demoWorkspaces}
      currentWorkspaceId={workspace}
      onWorkspaceChange={setWorkspace}
      onAddWorkspace={() => {}}
      applications={demoApplications}
      currentApplicationId="web"
      onCreateApplication={() => {}}
      environments={demoEnvironments}
      environment={environment}
      onEnvironmentChange={setEnvironment}
      nav={demoNav}
      activeHref={active}
      onNavigate={(item, e) => {
        e.preventDefault()
        setActive(item.href)
      }}
      notificationCount={1}
      onInvite={() => {}}
      primaryAction={environment === "development" ? { label: "Go to production", onClick: () => setEnvironment("production") } : undefined}
    >
      <main className="mx-auto w-[calc(100%-2.5rem)] max-w-6xl pt-8 pb-10">
        <h1 className="text-xl font-semibold text-foreground">{page}</h1>
        <p className="mt-1 text-sm text-subtle">Page content renders here.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {["Total users", "Active this week", "New sign-ups"].map((label) => (
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
