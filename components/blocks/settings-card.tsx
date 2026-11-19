"use client"

import { useId } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

/** Built-in strings of SettingsPage and SettingsSaveBar; pass `labels` to translate them. */
export const settingsCardLabels = {
  on: "(on)",
  unsavedChanges: "Unsaved changes",
  discard: "Discard",
  saveChanges: "Save changes",
}
export type SettingsCardLabels = typeof settingsCardLabels

/* -------------------------------- Collapse --------------------------------- */

/** Height-animated disclosure region; content is `inert` while closed. */
export function SettingsCollapse({ open, className, children }: { open: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        className
      )}
      inert={!open}
    >
      <div className="-m-2 min-h-0 overflow-hidden p-2">{children}</div>
    </div>
  )
}

/* ------------------------------- Switch row -------------------------------- */

/** Option row inside a settings card: switch, label, optional badge and description, with nested detail below. */
export function SettingsSwitchRow({
  title,
  description,
  badge,
  checked,
  onCheckedChange,
  disabled,
  children,
}: {
  title: string
  description?: React.ReactNode
  badge?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  /** Nested detail, e.g. a `SettingsCollapse` that opens while the row is on. */
  children?: React.ReactNode
}) {
  const id = useId()
  const descId = `${id}-description`
  return (
    <div data-slot="settings-switch-row" className="border-t border-edge/6 px-5 py-6 first:border-none">
      <label htmlFor={id} className="flex w-fit cursor-pointer items-baseline">
        <Switch
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          aria-describedby={description ? descId : undefined}
          className="top-px mr-2"
        />
        <span className="flex flex-1 items-center gap-2 text-[0.8125rem]/5 font-medium text-foreground">
          {title}
          {badge && <Badge variant="subtle-info">{badge}</Badge>}
        </span>
      </label>
      <div className="pl-8">
        {description && (
          <small id={descId} className="mt-1 block text-xs/4 text-pretty text-subtle">
            {description}
          </small>
        )}
        {children}
      </div>
    </div>
  )
}

/* ----------------------------- Checkbox group ------------------------------ */

export type SettingsOption = { value: string; label: string; description?: string }

/** Nested multi-select under a switch row ("Include in the digest"); keeps at least `min` options selected. */
export function SettingsCheckboxGroup({
  label,
  description,
  options,
  value,
  onValueChange,
  min = 1,
}: {
  label: string
  description?: string
  options: SettingsOption[]
  value: string[]
  onValueChange: (value: string[]) => void
  min?: number
}) {
  const id = useId()
  return (
    <div role="group" aria-labelledby={`${id}-l`} aria-describedby={description ? `${id}-d` : undefined} className="pt-4">
      <div className="mb-2 space-y-0.5">
        <span id={`${id}-l`} className="block text-[0.8125rem]/5 font-medium text-foreground">
          {label}
        </span>
        {description && (
          <span id={`${id}-d`} className="block text-xs/4 text-subtle">
            {description}
          </span>
        )}
      </div>
      <div className="space-y-3">
        {options.map((o) => {
          const checked = value.includes(o.value)
          const locked = checked && value.length <= min
          return (
            <div key={o.value}>
              <label className="flex cursor-pointer items-baseline gap-2">
                <Checkbox
                  checked={checked}
                  onCheckedChange={(c) => {
                    if (c) onValueChange([...value, o.value])
                    else if (!locked) onValueChange(value.filter((v) => v !== o.value))
                  }}
                  aria-describedby={o.description ? `${id}-${o.value}-d` : undefined}
                  className="top-0.5"
                />
                <span className="flex-1 text-[0.8125rem]/5 font-medium text-foreground">{o.label}</span>
              </label>
              {o.description && (
                <small id={`${id}-${o.value}-d`} className="mt-1 block pl-5.5 text-xs/4 text-subtle">
                  {o.description}
                </small>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ---------------------------------- Card ----------------------------------- */

/** Settings card: a switch-led header (title, description, optional badge) over a white panel of option rows that collapses while off. */
export function SettingsCard({
  title,
  description,
  badge,
  checked,
  onCheckedChange,
  className,
  children,
}: {
  title: string
  description?: React.ReactNode
  badge?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  className?: string
  /** `SettingsSwitchRow`s (or any rows) shown in the inner panel while the card is on. */
  children?: React.ReactNode
}) {
  const id = useId()
  return (
    <section
      data-slot="settings-card"
      aria-labelledby={`${id}-title`}
      className={cn("flex flex-col rounded-2xl bg-subtle/4 py-1 ring-1 ring-edge/4 ring-inset", className)}
    >
      <header className="px-6 py-4">
        <label htmlFor={id} className="flex w-fit cursor-pointer items-baseline">
          <Switch
            id={id}
            checked={checked}
            onCheckedChange={onCheckedChange}
            aria-describedby={description ? `${id}-description` : undefined}
            className="top-px"
          />
          <span id={`${id}-title`} className="ml-2 flex items-center gap-2 text-sm/5 font-medium text-foreground">
            {title}
            {badge && <Badge variant="subtle-info">{badge}</Badge>}
          </span>
        </label>
        {description && (
          <p id={`${id}-description`} className="mt-0.5 pl-8 text-xs/4 text-pretty text-subtle">
            {description}
          </p>
        )}
      </header>
      {children && (
        <SettingsCollapse open={checked}>
          <div className="mx-1 overflow-hidden rounded-xl bg-surface shadow-surface ring-1 ring-edge/4">{children}</div>
        </SettingsCollapse>
      )}
    </section>
  )
}

/* ---------------------------------- Page ----------------------------------- */

export type SettingsTab = {
  value: string
  label: string
  /** Show a green dot before the label when this section is turned on. */
  enabled?: boolean
  content: React.ReactNode
}

/** Settings page body: title row with actions, then underline tabs whose panels stack settings cards. */
export function SettingsPage({
  title,
  actions,
  tabs,
  value,
  defaultValue,
  onValueChange,
  labels,
  className,
}: {
  title: string
  actions?: React.ReactNode
  tabs: SettingsTab[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Translations of the built-in strings (English by default). */
  labels?: Partial<SettingsCardLabels>
  className?: string
}) {
  const t = { ...settingsCardLabels, ...labels }
  return (
    <article data-slot="settings-page" className={cn("min-w-0", className)}>
      <header className="flex w-full flex-col gap-4 pb-6">
        <div className="flex justify-between gap-x-8 gap-y-5 max-sm:flex-col sm:items-center">
          <h1 className="min-w-0 truncate text-xl/7 font-semibold tracking-[-0.015em] text-foreground">{title}</h1>
          {actions && <div className="flex gap-3 max-sm:*:flex-1 max-sm:*:justify-center">{actions}</div>}
        </div>
      </header>
      <Tabs
        value={value}
        defaultValue={defaultValue ?? tabs[0]?.value}
        onValueChange={(v) => onValueChange?.(v as string)}
        className="gap-8"
      >
        <TabsList variant="underline" className="max-w-full overflow-x-auto [scrollbar-width:none]">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5">
              {tab.enabled && (
                <span aria-hidden="true" className="size-1.5 rounded-full bg-success" />
              )}
              {tab.label}
              {tab.enabled && <span className="sr-only">{t.on}</span>}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="space-y-6">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </article>
  )
}

/** Floating "unsaved changes" bar with Discard and Save; slides in while `open`. */
export function SettingsSaveBar({
  open,
  onDiscard,
  onSave,
  message = "You have unsaved changes",
  labels,
  className,
}: {
  open: boolean
  onDiscard: () => void
  onSave: () => void
  message?: string
  /** Translations of the built-in strings (English by default). */
  labels?: Partial<SettingsCardLabels>
  className?: string
}) {
  const t = { ...settingsCardLabels, ...labels }
  return (
    <div
      role="region"
      aria-label={t.unsavedChanges}
      inert={!open}
      className={cn(
        "fixed inset-x-0 bottom-6 z-40 mx-auto flex w-[calc(100%-2rem)] max-w-md items-center justify-between gap-3 rounded-xl bg-foreground py-2 pr-2 pl-4 text-[0.8125rem] text-background shadow-popover transition-[opacity,translate] duration-200 motion-reduce:transition-none",
        open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        className
      )}
    >
      <span>{message}</span>
      <div className="flex gap-2">
        <Button variant="elevated" size="compact-sm" onClick={onDiscard}>
          {t.discard}
        </Button>
        <Button variant="primary" size="compact-sm" onClick={onSave}>
          {t.saveChanges}
        </Button>
      </div>
    </div>
  )
}
