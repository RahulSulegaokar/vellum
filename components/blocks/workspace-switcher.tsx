"use client"

import * as React from "react"
import { ChevronsUpDownIcon, PlusIcon, SettingsIcon, UploadIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

export type Workspace = {
  id: string
  name: string
  /** Your role in it ("Admin", "Member"). Omit for a personal workspace. */
  role?: string
  imageUrl?: string
}

/** Built-in strings of WorkspaceSwitcher, WorkspaceList and CreateWorkspaceForm; pass `labels` to translate them. */
export const workspaceSwitcherLabels = {
  switchWorkspace: "Switch workspace",
  switchWorkspaceCurrent: (name: string) => `Switch workspace, current: ${name}`,
  uploadLogo: "Upload logo",
  remove: "Remove",
  logoHint: (maxMb: number) => `Square image, up to ${maxMb}MB.`,
  logoTooLarge: (maxMb: number) => `That file is over ${maxMb}MB.`,
  workspaceLogo: "Workspace logo",
  name: "Name",
  namePlaceholder: "Workspace name",
  url: "URL",
  slugPlaceholder: "my-workspace",
  cancel: "Cancel",
}
export type WorkspaceSwitcherLabels = typeof workspaceSwitcherLabels

function WorkspaceAvatar({ workspace, className }: { workspace: Pick<Workspace, "name" | "imageUrl">; className?: string }) {
  return (
    <Avatar className={cn("rounded-md after:rounded-md", className)}>
      {workspace.imageUrl && <AvatarImage src={workspace.imageUrl} alt="" className="rounded-md" />}
      <AvatarFallback className="rounded-md text-[0.6875rem] font-semibold">
        {workspace.name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}

/**
 * Workspace list for inline use (a sheet, a sidebar panel): the active one with a manage button, the others as switch targets,
 * then "Create workspace". Use `WorkspaceSwitcher` for the dropdown version.
 */
export function WorkspaceList({
  workspaces,
  activeId,
  createLabel = "Create workspace",
  manageLabel = "Manage",
  onSwitch,
  onManage,
  onCreate,
  labels,
  className,
}: {
  workspaces: Workspace[]
  activeId: string
  createLabel?: string
  manageLabel?: string
  onSwitch?: (id: string) => void
  /** Omit to hide the manage button. */
  onManage?: (id: string) => void
  /** Omit to hide the create row. */
  onCreate?: () => void
  /** Translations of the built-in strings (English by default). */
  labels?: Partial<WorkspaceSwitcherLabels>
  className?: string
}) {
  const t = { ...workspaceSwitcherLabels, ...labels }
  const active = workspaces.find((w) => w.id === activeId)
  const others = workspaces.filter((w) => w.id !== activeId)
  return (
    <div data-slot="workspace-list" className={cn("flex flex-col", className)}>
      {active && (
        <div className="flex items-center gap-3 border-b border-edge/6 px-4 py-3.5">
          <WorkspaceAvatar workspace={active} className="size-9" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm/[1.125rem] font-medium text-foreground">{active.name}</div>
            {active.role && <div className="text-[0.8125rem]/[1.125rem] text-muted-foreground">{active.role}</div>}
          </div>
          {onManage && (
            <Button variant="elevated" size="compact-sm" onClick={() => onManage(active.id)}>
              <SettingsIcon className="size-3.5" aria-hidden="true" />
              {manageLabel}
            </Button>
          )}
        </div>
      )}
      {others.length > 0 && (
        <ul className="flex flex-col border-b border-edge/6 p-1" aria-label={t.switchWorkspace}>
          {others.map((w) => (
            <li key={w.id}>
              <button
                type="button"
                onClick={() => onSwitch?.(w.id)}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left outline-none hover:bg-surface-muted focus-visible:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[--tw-outline-style:solid] focus-visible:outline-ring"
              >
                <WorkspaceAvatar workspace={w} className="size-9" />
                <span className="min-w-0">
                  <span className="block truncate text-sm/[1.125rem] font-medium text-foreground">{w.name}</span>
                  {w.role && <span className="block text-[0.8125rem]/[1.125rem] text-muted-foreground">{w.role}</span>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {onCreate && (
        <div className="p-1">
          <button
            type="button"
            onClick={onCreate}
            className="flex h-12 w-full items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground outline-none hover:bg-surface-muted hover:text-foreground focus-visible:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[--tw-outline-style:solid] focus-visible:outline-ring"
          >
            <span className="flex w-9 justify-center">
              <span className="grid size-6 place-items-center rounded-full border border-dashed border-edge/20 bg-surface-muted">
                <PlusIcon className="size-3" aria-hidden="true" />
              </span>
            </span>
            {createLabel}
          </button>
        </div>
      )}
    </div>
  )
}

/**
 * Workspace switcher: a compact trigger showing the active workspace that opens a dropdown menu. Workspaces are radio items
 * (arrow keys move, Enter selects), followed by optional "Workspace settings" and "Create workspace" actions.
 */
export function WorkspaceSwitcher({
  workspaces,
  activeId,
  defaultActiveId,
  defaultOpen,
  onSwitch,
  onManage,
  onCreate,
  label = "Workspaces",
  placeholder = "Select workspace",
  manageLabel = "Workspace settings",
  createLabel = "Create workspace",
  align = "start",
  labels,
  className,
}: {
  workspaces: Workspace[]
  /** Controlled active workspace id. */
  activeId?: string
  defaultActiveId?: string
  defaultOpen?: boolean
  onSwitch?: (id: string) => void
  /** Omit to hide the settings action. Called with the active workspace id. */
  onManage?: (id: string) => void
  /** Omit to hide the create action. */
  onCreate?: () => void
  /** Heading above the workspace list. */
  label?: string
  /** Trigger text when no workspace is active. */
  placeholder?: string
  manageLabel?: string
  createLabel?: string
  align?: "start" | "center" | "end"
  /** Translations of the built-in strings (English by default). */
  labels?: Partial<WorkspaceSwitcherLabels>
  className?: string
}) {
  const t = { ...workspaceSwitcherLabels, ...labels }
  const [internal, setInternal] = React.useState(defaultActiveId ?? workspaces[0]?.id ?? "")
  const current = activeId ?? internal
  const active = workspaces.find((w) => w.id === current)
  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger
        render={<Button variant="elevated" size="compact" className={cn("max-w-64 gap-2 pr-1.5 pl-1.5", className)} />}
        aria-label={active ? t.switchWorkspaceCurrent(active.name) : t.switchWorkspace}
      >
        {active && <WorkspaceAvatar workspace={active} className="size-5" />}
        <span className="truncate">{active?.name ?? placeholder}</span>
        <ChevronsUpDownIcon className="size-3.5 text-subtle" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} sideOffset={6} className="w-72 max-w-[calc(100vw-2rem)]">
        {workspaces.length > 0 && (
          <DropdownMenuGroup>
            <DropdownMenuLabel>{label}</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={current}
              onValueChange={(id: string) => {
                if (id === current) return
                setInternal(id)
                onSwitch?.(id)
              }}
            >
              {workspaces.map((w) => (
                <DropdownMenuRadioItem key={w.id} value={w.id} closeOnClick className="gap-2.5 py-1.5">
                  <WorkspaceAvatar workspace={w} className="size-7" />
                  <span className="min-w-0">
                    <span className="block truncate text-[0.8125rem]/[1.125rem] font-medium">{w.name}</span>
                    {w.role && <span className="block text-xs text-muted-foreground">{w.role}</span>}
                  </span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
        )}
        {((onManage && active) || onCreate) && (
          <>
            {workspaces.length > 0 && <DropdownMenuSeparator />}
            <DropdownMenuGroup>
              {onManage && active && (
                <DropdownMenuItem onClick={() => onManage(active.id)}>
                  <SettingsIcon aria-hidden="true" />
                  {manageLabel}
                </DropdownMenuItem>
              )}
              {onCreate && (
                <DropdownMenuItem onClick={onCreate}>
                  <PlusIcon aria-hidden="true" />
                  {createLabel}
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/** Create-workspace form: logo upload, name and a URL slug that follows the name until edited. */
export function CreateWorkspaceForm({
  title = "Create workspace",
  submitLabel = "Create workspace",
  slugPrefix,
  maxLogoSizeMb = 10,
  onSubmit,
  onCancel,
  labels,
  className,
}: {
  title?: string
  submitLabel?: string
  /** Shown before the slug field, e.g. "app.example.com/". Omit to hide. */
  slugPrefix?: string
  maxLogoSizeMb?: number
  onSubmit?: (values: { name: string; slug: string; logo?: File }) => void | Promise<void>
  onCancel?: () => void
  /** Translations of the built-in strings (English by default). */
  labels?: Partial<WorkspaceSwitcherLabels>
  className?: string
}) {
  const t = { ...workspaceSwitcherLabels, ...labels }
  const id = React.useId()
  const fileRef = React.useRef<HTMLInputElement>(null)
  const [name, setName] = React.useState("")
  const [slug, setSlug] = React.useState("")
  const [slugEdited, setSlugEdited] = React.useState(false)
  const [logo, setLogo] = React.useState<{ file: File; url: string } | null>(null)
  const [logoError, setLogoError] = React.useState<string | null>(null)
  const [pending, setPending] = React.useState(false)

  React.useEffect(() => () => {
    if (logo) URL.revokeObjectURL(logo.url)
  }, [logo])

  const effectiveSlug = slugEdited ? slug : slugify(name)
  const canSubmit = name.trim().length > 0 && effectiveSlug.length > 0 && !pending

  return (
    <form
      data-slot="create-workspace-form"
      className={cn("w-full max-w-100 rounded-xl bg-surface-muted shadow-dialog ring-1 ring-edge/6", className)}
      onSubmit={async (e) => {
        e.preventDefault()
        if (!canSubmit) return
        setPending(true)
        try {
          await onSubmit?.({ name: name.trim(), slug: effectiveSlug, logo: logo?.file })
        } finally {
          setPending(false)
        }
      }}
    >
      <div className="flex flex-col gap-6 rounded-xl bg-surface p-6 shadow-surface ring-1 ring-edge/4 sm:p-8">
        <h2 className="text-[1.0625rem]/6 font-bold tracking-[-0.01em] text-foreground">{title}</h2>
        <div className="flex items-center gap-4">
          <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-md border border-dashed border-edge/20 bg-surface-muted text-subtle">
            {logo ? (
              <WorkspaceAvatar workspace={{ name: name || "W", imageUrl: logo.url }} className="size-full rounded-none" />
            ) : (
              <UploadIcon className="size-5" aria-hidden="true" />
            )}
          </span>
          <div className="flex flex-col items-start gap-2">
            <div className="flex gap-2">
              <Button type="button" variant="elevated" size="compact" aria-describedby={`${id}-logo-hint`} onClick={() => fileRef.current?.click()}>
                {t.uploadLogo}
              </Button>
              {logo && (
                <Button type="button" variant="ghost" size="compact" onClick={() => setLogo(null)}>
                  {t.remove}
                </Button>
              )}
            </div>
            <p id={`${id}-logo-hint`} aria-live="polite" className={cn("text-xs", logoError ? "text-destructive-text" : "text-subtle")}>
              {logoError ?? t.logoHint(maxLogoSizeMb)}
            </p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="sr-only"
              tabIndex={-1}
              aria-label={t.workspaceLogo}
              aria-describedby={`${id}-logo-hint`}
              onChange={(e) => {
                const file = e.target.files?.[0]
                e.target.value = ""
                if (!file) return
                if (file.size > maxLogoSizeMb * 1024 * 1024) {
                  setLogoError(t.logoTooLarge(maxLogoSizeMb))
                  return
                }
                setLogoError(null)
                setLogo({ file, url: URL.createObjectURL(file) })
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${id}-name`} className="text-[0.8125rem]">
            {t.name}
          </Label>
          <Input id={`${id}-name`} variant="compact" placeholder={t.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} required autoComplete="organization" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${id}-slug`} className="text-[0.8125rem]">
            {t.url}
          </Label>
          <div className="flex items-center rounded-md">
            {slugPrefix && (
              <span id={`${id}-slug-prefix`} className="flex h-8 items-center rounded-l-md bg-surface-muted px-2.5 text-sm text-subtle ring-1 ring-edge/12">
                {slugPrefix}
              </span>
            )}
            <Input
              id={`${id}-slug`}
              variant="compact"
              placeholder={t.slugPlaceholder}
              className={cn(slugPrefix && "rounded-l-none")}
              aria-describedby={slugPrefix ? `${id}-slug-prefix` : undefined}
              value={effectiveSlug}
              onChange={(e) => {
                setSlugEdited(true)
                setSlug(slugify(e.target.value))
              }}
              required
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 p-4">
        {onCancel && (
          <Button type="button" variant="elevated" size="compact" onClick={onCancel}>
            {t.cancel}
          </Button>
        )}
        <Button type="submit" variant="primary" size="compact" disabled={!canSubmit}>
          {pending && <Spinner className="size-3.5" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
