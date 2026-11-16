"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeftIcon, SettingsIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioCard, RadioGroup } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

/* --------------------------------- Types ----------------------------------- */

export type WizardTypeOption = { value: string; label: string; description: string; icon: React.ReactNode }

export type WizardToggleOption = {
  id: string
  label: string
  icon: React.ReactNode
}

export type WizardValues = { type: string; name: string; enabled: string[] }

/* ------------------------------- Small pieces ------------------------------ */

function StepHeader({ title, description }: { title: string; description: string }) {
  return (
    <header className="space-y-1">
      <h2 className="text-[0.8125rem]/4 font-semibold text-foreground">{title}</h2>
      <p className="text-sm/5 text-subtle">{description}</p>
    </header>
  )
}

function StepDots({ steps, step }: { steps: string[]; step: number }) {
  return (
    <ol aria-label="Progress" className="flex h-5 items-center justify-center gap-1.5">
      {steps.map((s, i) => (
        <li key={s} aria-current={i + 1 === step ? "step" : undefined} className={cn("h-0.75 w-12 rounded-full transition-colors duration-200", i + 1 <= step ? "bg-brand" : "bg-border")}>
          <span className="sr-only">Step {i + 1} of {steps.length}: {s}{i + 1 > step ? ", not completed" : ""}</span>
        </li>
      ))}
    </ol>
  )
}

/** Dashed 1px edge that bleeds 3.25rem past the preview frame and fades out. */
function DashEdge({ side }: { side: "top" | "bottom" | "left" | "right" }) {
  const h = side === "top" || side === "bottom"
  const pos = { top: "inset-x-0 h-px -top-px", bottom: "inset-x-0 h-px -bottom-px", left: "inset-y-0 w-px -left-px", right: "inset-y-0 w-px -right-px" }[side]
  const mask = `linear-gradient(${h ? "to right" : "to bottom"}, transparent, var(--foreground) 3.25rem, var(--foreground) calc(100% - 3.25rem), transparent)`
  return (
    <div
      aria-hidden="true"
      className={cn("absolute", pos, h ? "-mx-13 bg-[repeating-linear-gradient(to_right,var(--border)_0_4px,transparent_4px_8px)]" : "-my-13 bg-[repeating-linear-gradient(to_bottom,var(--border)_0_4px,transparent_4px_8px)]")}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    />
  )
}

/* --------------------------------- Preview --------------------------------- */

/** Inert summary card that reflects the wizard's type, name and enabled options. */
export function WizardPreview({
  values,
  types,
  options,
  untitledLabel = "Untitled",
  emptyLabel = "No options turned on yet.",
}: {
  values: WizardValues
  types: WizardTypeOption[]
  options: WizardToggleOption[]
  untitledLabel?: string
  emptyLabel?: string
}) {
  const type = types.find((t) => t.value === values.type)
  const on = options.filter((o) => values.enabled.includes(o.id))
  const name = values.name.trim() || untitledLabel

  return (
    <div inert className="flex w-104 max-w-full flex-col overflow-hidden rounded-xl bg-surface shadow-card ring-1 ring-hairline">
      <header className="flex items-center gap-3 border-b border-edge/6 p-5">
        <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted text-sm font-semibold text-muted-foreground uppercase">
          {name.slice(0, 1)}
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-[0.9375rem]/5 font-semibold text-foreground">{name}</h3>
          {type && <p className="truncate text-[0.8125rem]/[1.125rem] text-subtle">{type.label}</p>}
        </div>
      </header>
      {on.length > 0 ? (
        <ul className="divide-y divide-edge/6">
          {on.map((o) => (
            <li key={o.id} className="flex items-center gap-3 px-5 py-2.5 text-[0.8125rem]/5 text-foreground">
              <span className="size-4 text-subtle select-none">{o.icon}</span>
              <span className="min-w-0 flex-1 truncate">{o.label}</span>
              <span className="size-1.5 rounded-full bg-brand" />
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-5 py-6 text-center text-[0.8125rem]/[1.125rem] text-subtle">{emptyLabel}</p>
      )}
    </div>
  )
}

/* --------------------------------- Options --------------------------------- */

function OptionsCard({
  title,
  label,
  description,
  options,
  enabled,
  toggle,
}: {
  title: string
  label: string
  description: string
  options: WizardToggleOption[]
  enabled: string[]
  toggle: (id: string, on: boolean) => void
}) {
  const scroller = useRef<HTMLDivElement>(null)
  const [fade, setFade] = useState({ top: false, bottom: true })
  const onScroll = () => {
    const el = scroller.current
    if (!el) return
    setFade({ top: el.scrollTop > 2, bottom: el.scrollTop + el.clientHeight < el.scrollHeight - 2 })
  }
  return (
    <section className="flex flex-col rounded-2xl bg-surface-muted py-1">
      <header className="flex items-center gap-2 px-6 py-4">
        <SettingsIcon aria-hidden="true" strokeWidth={1.5} className="size-5 text-subtle" />
        <h2 className="text-sm/5 font-medium text-foreground">{title}</h2>
      </header>
      <div className="mx-1 overflow-hidden rounded-xl bg-surface shadow-card ring-1 ring-edge/4">
        <p className="px-5 pt-4 text-[0.8125rem]/4 font-medium text-foreground">{label}</p>
        <p className="border-b border-edge/6 px-5 pt-0.5 pb-3 text-[0.8125rem]/[1.125rem] text-subtle">{description}</p>
        <div className="relative overflow-clip rounded-b-xl">
          <span aria-hidden="true" className={cn("pointer-events-none absolute top-0 left-0 z-1 h-12 w-full bg-linear-to-b from-surface to-transparent transition-opacity", fade.top ? "opacity-100" : "opacity-0")} />
          <span aria-hidden="true" className={cn("pointer-events-none absolute bottom-0 left-0 z-1 h-12 w-full bg-linear-to-t from-surface to-transparent transition-opacity", fade.bottom ? "opacity-100" : "opacity-0")} />
          <div ref={scroller} onScroll={onScroll} className="relative max-h-64 scroll-pb-2 overflow-y-auto pb-2">
            <ul className="divide-y divide-edge/6">
              {options.map((o) => {
                const on = enabled.includes(o.id)
                return (
                  <li key={o.id}>
                    <label className={cn("flex cursor-pointer items-center gap-4 px-6 py-3 text-sm/5 transition-colors hover:bg-accent hover:text-foreground", on ? "text-foreground" : "text-muted-foreground")}>
                      <span className="size-4 select-none">{o.icon}</span>
                      <span className="flex-1 select-none">{o.label}</span>
                      <Switch checked={on} onCheckedChange={(v) => toggle(o.id, v)} aria-label={o.label} />
                    </label>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------- Wizard ---------------------------------- */

const backClass =
  "-ml-1.5 inline-flex h-7 items-center gap-1 rounded-md px-1.5 text-[0.8125rem]/4 font-medium text-subtle outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand/40"

/**
 * Two-step create flow (type cards and name, then toggleable options) with a live preview on the right.
 * Create shows a pending state; Back aborts the pending request through the AbortSignal passed to `onCreate`.
 *
 * The step-one Back control renders as a link when `backHref` is set (through `linkComponent`, which defaults
 * to a plain `<a>`; pass your router's `Link`, e.g. Inertia's), as a button when only `onBack` is set, and is
 * hidden otherwise. Replace the default summary preview with `renderPreview`.
 */
export function CreateWizard({
  types,
  options,
  defaultType = types[0]?.value ?? "",
  defaultName = "",
  defaultEnabled = [],
  steps = ["Details", "Options"],
  typeTitle = "Choose a type",
  typeDescription = "Pick the one that fits best.",
  nameTitle = "Name",
  nameDescription = "You can change this later.",
  namePlaceholder,
  optionsTitle = "Customize options",
  optionsLabel = "Options",
  optionsDescription = "You can change these later in settings.",
  createLabel = "Create",
  pendingLabel = "Creating…",
  backLabel = "Back",
  backHref,
  onBack,
  linkComponent,
  previewCaption = "Preview",
  renderPreview = (v) => <WizardPreview values={v} types={types} options={options} />,
  onCreate,
}: {
  /** Choices for step one, shown as radio cards. */
  types: WizardTypeOption[]
  /** Toggleable options for step two. */
  options: WizardToggleOption[]
  defaultType?: string
  defaultName?: string
  defaultEnabled?: string[]
  steps?: [string, string]
  typeTitle?: string
  typeDescription?: string
  nameTitle?: string
  nameDescription?: string
  namePlaceholder?: string
  optionsTitle?: string
  optionsLabel?: string
  optionsDescription?: string
  createLabel?: string
  pendingLabel?: string
  backLabel?: string
  /** Where the step-one Back link goes. */
  backHref?: string
  /** Step-one Back handler, used when there is no `backHref`. */
  onBack?: () => void
  /** Component used for links; defaults to `"a"`. Pass your router's `Link`. */
  linkComponent?: React.ElementType
  previewCaption?: React.ReactNode
  renderPreview?: (values: WizardValues) => React.ReactNode
  /** Called on Create. Resolve when done; abort means the user pressed Back. */
  onCreate?: (values: WizardValues, signal: AbortSignal) => Promise<void> | void
}) {
  const [step, setStep] = useState<1 | 2>(1)
  const [type, setType] = useState(defaultType)
  const [name, setName] = useState(defaultName)
  const [enabled, setEnabled] = useState<string[]>(defaultEnabled)
  const [creating, setCreating] = useState(false)
  const [nameTouched, setNameTouched] = useState(false)
  const pending = useRef<AbortController | null>(null)

  useEffect(() => () => pending.current?.abort(), [])

  const values: WizardValues = { type, name, enabled }
  const Link = linkComponent ?? "a"

  const toggle = (id: string, on: boolean) => setEnabled((prev) => (on ? [...prev.filter((x) => x !== id), id] : prev.filter((x) => x !== id)))

  const create = async () => {
    const controller = new AbortController()
    pending.current = controller
    setCreating(true)
    try {
      await onCreate?.(values, controller.signal)
    } catch {
      // Aborted or failed: fall through and clear the pending state.
    } finally {
      if (pending.current === controller) {
        pending.current = null
        setCreating(false)
      }
    }
  }

  const back = () => {
    pending.current?.abort()
    pending.current = null
    setCreating(false)
    setStep(1)
  }

  return (
    <div className="relative grid min-h-dvh grid-cols-1 bg-surface md:grid-cols-2">
      <div className="relative grid items-center px-8 lg:justify-center lg:pr-24">
        <div className="absolute inset-x-0 top-8 px-8 lg:pr-24">
          <StepDots steps={steps} step={step} />
        </div>
        <div className="space-y-8 pt-20 pb-8">
          {step === 1 && backHref !== undefined && (
            <Link href={backHref} className={backClass}>
              <ArrowLeftIcon aria-hidden="true" className="size-4" />
              {backLabel}
            </Link>
          )}
          {step === 1 && backHref === undefined && onBack && (
            <button type="button" onClick={onBack} className={backClass}>
              <ArrowLeftIcon aria-hidden="true" className="size-4" />
              {backLabel}
            </button>
          )}
          <form
            className="w-full [--rail-gap:1.5rem] lg:w-94"
            onSubmit={(e) => {
              e.preventDefault()
              if (step === 1) {
                setNameTouched(true)
                if (name.trim()) setStep(2)
              } else if (enabled.length > 0 && !creating) void create()
            }}
          >
            {step === 1 ? (
              <>
                <ol className="space-y-12">
                  <li className="relative grid grid-cols-[1.25rem_1fr] gap-x-(--rail-gap)">
                    <span aria-hidden="true" className="absolute top-2.5 -bottom-14.5 left-2.5 w-px bg-border" />
                    <div aria-hidden="true" className="relative grid size-5 place-content-center rounded-full bg-solid text-[0.6875rem] font-medium text-solid-foreground">1</div>
                    <div className="space-y-4">
                      <StepHeader title={typeTitle} description={typeDescription} />
                      <RadioGroup value={type} onValueChange={(v) => setType(v as string)} aria-label={typeTitle} className="gap-2">
                        {types.map((t) => (
                          <RadioCard key={t.value} value={t.value}>
                            {t.icon}
                            <span className="space-y-0.5">
                              <span className="block text-[0.8125rem]/4 font-medium text-foreground">{t.label}</span>
                              <span className="block text-[0.8125rem]/[1.125rem] text-subtle">{t.description}</span>
                            </span>
                          </RadioCard>
                        ))}
                      </RadioGroup>
                    </div>
                  </li>
                  <li className="relative grid grid-cols-[1.25rem_1fr] gap-x-(--rail-gap)">
                    <div aria-hidden="true" className="relative grid size-5 place-content-center rounded-full bg-solid text-[0.6875rem] font-medium text-solid-foreground">2</div>
                    <div className="space-y-4">
                      <StepHeader title={nameTitle} description={nameDescription} />
                      <Input
                        variant="compact"
                        aria-label={nameTitle}
                        autoComplete="off"
                        maxLength={50}
                        placeholder={namePlaceholder}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={() => setNameTouched(true)}
                        aria-invalid={(nameTouched && !name.trim()) || undefined}
                      />
                    </div>
                  </li>
                </ol>
                <div className="mt-8 pl-[calc(1.25rem+var(--rail-gap))]">
                  <Button type="submit" variant="primary" size="compact" className="w-full justify-center">Next</Button>
                </div>
              </>
            ) : (
              <>
                <OptionsCard title={optionsTitle} label={optionsLabel} description={optionsDescription} options={options} enabled={enabled} toggle={toggle} />
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button type="button" variant="elevated" size="compact" className="w-full justify-center" onClick={back}>{backLabel}</Button>
                  <Button type="submit" variant="primary" size="compact" className="w-full justify-center" disabled={creating || enabled.length === 0} aria-busy={creating || undefined}>
                    {creating ? pendingLabel : createLabel}
                  </Button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
      <div className="hidden flex-col items-center justify-center overflow-hidden border-l border-edge/6 bg-surface-muted py-8 md:flex">
        <figure className="relative w-fit shrink-0 bg-subtle/4 py-10">
          <span aria-hidden="true" className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,var(--border),var(--border)_1px,transparent_1px,transparent_8px)] opacity-60" />
          {(["left", "right", "bottom", "top"] as const).map((s) => <DashEdge key={s} side={s} />)}
          <div className="relative flex w-132 max-w-[calc(50vw-2rem)] flex-col items-center justify-center gap-5 px-4">
            {renderPreview(values)}
            {previewCaption && <figcaption className="text-center text-base text-subtle">{previewCaption}</figcaption>}
          </div>
        </figure>
      </div>
    </div>
  )
}
