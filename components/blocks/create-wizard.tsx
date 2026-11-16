"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeftIcon, Building2Icon, FingerprintIcon, MailIcon, PhoneIcon, SettingsIcon, UserRoundIcon } from "lucide-react"
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
  /** "identifier" options become the preview's text field; the rest render as provider buttons. */
  kind?: "identifier" | "provider"
  /** Lowercase noun for the preview field ("email address"); defaults to the label. */
  fieldLabel?: string
}

export type WizardValues = { type: string; name: string; enabled: string[] }

/* ------------------------------- Demo data --------------------------------- */

/** Original letter glyph for third-party providers; never a trademark path. */
function Glyph({ letter }: { letter: string }) {
  return (
    <span aria-hidden="true" className="grid size-4 place-items-center rounded-full bg-current">
      <span className="text-[0.5625rem] leading-none font-bold text-background">{letter}</span>
    </span>
  )
}

const demoTypes: WizardTypeOption[] = [
  { value: "consumer", label: "Consumer", description: "Each user signs in to their own personal account. You can add workspaces anytime.", icon: <FingerprintIcon aria-hidden="true" strokeWidth={1.5} className="mt-0.5 size-5 shrink-0 text-subtle" /> },
  { value: "b2b", label: "B2B", description: "People collaborate in shared workspaces. We'll turn on workspaces for you.", icon: <Building2Icon aria-hidden="true" strokeWidth={1.5} className="mt-0.5 size-5 shrink-0 text-subtle" /> },
]

const demoOptions: WizardToggleOption[] = [
  { id: "email", label: "Email", kind: "identifier", fieldLabel: "email address", icon: <MailIcon className="size-4" /> },
  { id: "phone", label: "Phone number", kind: "identifier", icon: <PhoneIcon className="size-4" /> },
  { id: "username", label: "Username", kind: "identifier", icon: <UserRoundIcon className="size-4" /> },
  { id: "google", label: "Google", icon: <Glyph letter="G" /> },
  { id: "github", label: "GitHub", icon: <Glyph letter="H" /> },
  { id: "apple", label: "Apple", icon: <Glyph letter="A" /> },
  { id: "microsoft", label: "Microsoft", icon: <Glyph letter="M" /> },
  { id: "discord", label: "Discord", icon: <Glyph letter="D" /> },
  { id: "gitlab", label: "GitLab", icon: <Glyph letter="L" /> },
  { id: "slack", label: "Slack", icon: <Glyph letter="S" /> },
  { id: "linear", label: "Linear", icon: <Glyph letter="N" /> },
]

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

/** Inert sign-in card that reflects the wizard's name and enabled options. */
export function SignInPreview({ name, enabled, options }: { name: string; enabled: string[]; options: WizardToggleOption[] }) {
  const on = (o: WizardToggleOption) => enabled.includes(o.id)
  const providers = options.filter((o) => o.kind !== "identifier" && on(o))
  const ids = options.filter((o) => o.kind === "identifier" && on(o)).map((o) => o.fieldLabel ?? o.label.toLowerCase())
  const cols = providers.length <= 1 ? 1 : providers.length <= 2 ? 2 : Math.min(providers.length, 6)
  const iconOnly = providers.length > 2
  const field = ids.length ? ids.join(" or ") : null

  return (
    <div inert className="flex min-h-120 w-104 max-w-full flex-col overflow-hidden rounded-xl bg-surface-muted shadow-card ring-1 ring-hairline">
      <div className="flex flex-1 flex-col rounded-b-lg bg-surface ring-1 ring-edge/6">
        <div className="flex flex-col gap-8 p-9">
          <header className="flex flex-col gap-2 text-center">
            <h3 className="text-xl font-bold break-words text-foreground">Sign in to {name || "My Application"}</h3>
            <p className="text-[0.8125rem]/4.5 text-subtle">Welcome back! Please sign in to continue</p>
          </header>
          {providers.length > 0 && (
            <div className="grid w-full gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
              {providers.map((o) => (
                <span key={o.id} className="inline-flex min-h-8 min-w-0 items-center justify-center gap-3 rounded-md p-2 text-[0.8125rem]/4.5 font-medium text-foreground shadow-[0_1px_0_rgb(0_0_0/0.02),0_2px_3px_-1px_rgb(0_0_0/0.08)] ring-1 ring-edge/8">
                  <span className="size-4 select-none">{o.icon}</span>
                  {!iconOnly && <span className="truncate">{providers.length === 1 ? `Continue with ${o.label}` : o.label}</span>}
                </span>
              ))}
            </div>
          )}
          {providers.length > 0 && field && (
            <div className="relative">
              <hr className="border-border" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+1px)] bg-surface px-4 py-0.5 text-[0.8125rem]/4.5 text-subtle">or</span>
            </div>
          )}
          {field && (
            <div className="flex flex-col gap-8">
              <span className="flex w-full flex-col gap-2">
                <span className="text-[0.8125rem]/4.5 font-medium text-foreground first-letter:capitalize">{field}</span>
                <span className="w-full rounded-md bg-field px-3 py-1.5 text-[0.8125rem]/4.5 text-placeholder ring-1 ring-field-ring">Enter your {field}</span>
              </span>
              <span className="inline-flex min-h-8 items-center justify-center rounded-md bg-brand p-2 text-[0.8125rem]/4.5 font-medium text-brand-foreground ring-1 ring-brand-edge">Continue</span>
            </div>
          )}
          {!field && providers.length === 0 && <p className="text-center text-[0.8125rem]/4.5 text-subtle">Turn on at least one sign-in option.</p>}
        </div>
      </div>
      <div className="py-4 text-center text-[0.8125rem]/4.5 text-subtle">
        Don&apos;t have an account? <span className="text-brand">Sign up</span>
      </div>
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

/**
 * Two-step create flow (type cards and name, then toggleable options) with a live preview on the right.
 * Create shows a pending state; Back aborts the pending request through the AbortSignal passed to `onCreate`.
 */
export function CreateWizard({
  types = demoTypes,
  options = demoOptions,
  defaultType = types[0]?.value ?? "",
  defaultName = "My Application",
  defaultEnabled = ["email", "google"],
  steps = ["Application", "Authentication"],
  typeTitle = "What type of application are you building?",
  typeDescription = "Pick the type that best fits your use case:",
  nameTitle = "Application name",
  nameDescription = "We generated one for you. Change it anytime.",
  optionsTitle = "Customize options",
  optionsLabel = "Sign in options",
  optionsDescription = "You can change these anytime in the dashboard.",
  createLabel = "Create application",
  pendingLabel = "Creating…",
  backHref = "#",
  renderPreview = (v) => <SignInPreview name={v.name} enabled={v.enabled} options={options} />,
  onCreate,
}: {
  types?: WizardTypeOption[]
  options?: WizardToggleOption[]
  defaultType?: string
  defaultName?: string
  defaultEnabled?: string[]
  steps?: [string, string]
  typeTitle?: string
  typeDescription?: string
  nameTitle?: string
  nameDescription?: string
  optionsTitle?: string
  optionsLabel?: string
  optionsDescription?: string
  createLabel?: string
  pendingLabel?: string
  /** Where the step-one Back link goes. */
  backHref?: string
  renderPreview?: (values: WizardValues) => React.ReactNode
  /** Called on Create. Resolve when done; abort means the user pressed Back. */
  onCreate?: (values: WizardValues, signal: AbortSignal) => Promise<void> | void
}) {
  const [step, setStep] = useState<1 | 2>(1)
  const [type, setType] = useState(defaultType)
  const [name, setName] = useState(defaultName)
  const [enabled, setEnabled] = useState<string[]>(defaultEnabled)
  const [creating, setCreating] = useState(false)
  const pending = useRef<AbortController | null>(null)

  useEffect(() => () => pending.current?.abort(), [])

  const values: WizardValues = { type, name, enabled }

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
          {step === 1 && (
            <a href={backHref} className="-ml-1.5 inline-flex h-7 items-center gap-1 rounded-md px-1.5 text-[0.8125rem]/4 font-medium text-subtle outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand/40">
              <ArrowLeftIcon aria-hidden="true" className="size-4" />
              Back
            </a>
          )}
          <form
            className="w-full [--rail-gap:1.5rem] lg:w-94"
            onSubmit={(e) => {
              e.preventDefault()
              if (step === 1) {
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
                      <Input variant="compact" aria-label={nameTitle} autoComplete="off" maxLength={50} placeholder="My Application" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!name.trim() || undefined} />
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
                  <Button type="button" variant="elevated" size="compact" className="w-full justify-center" onClick={back}>Back</Button>
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
            <figcaption className="text-center text-base text-subtle">This is a preview</figcaption>
          </div>
        </figure>
      </div>
    </div>
  )
}

export default function CreateWizardDemo() {
  return (
    <CreateWizard
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
