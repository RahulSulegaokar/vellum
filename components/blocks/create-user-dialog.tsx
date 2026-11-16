"use client"

import { useId, useState } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogPanel, DialogSection, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export type NewUser = {
  firstName: string
  lastName: string
  email: string
  password: string
  /** True when the length rule was skipped for this password. */
  skipPasswordCheck: boolean
  sendWelcomeEmail: boolean
}

type Tab = "create" | "invite"

const labelClass = "mb-2 flex items-center gap-2 text-[0.8125rem]/4 font-medium text-foreground"
const hintClass = "mt-1 block text-[0.8125rem]/[1.125rem] text-subtle"
const errorClass = "mt-1.5 text-[0.8125rem]/[1.125rem] text-destructive-text"
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
const emptyForm = { firstName: "", lastName: "", email: "", password: "", inviteEmail: "" }

function Field({ id, label, optional, error, children }: { id: string; label: string; optional?: boolean; error?: string | false; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        {optional && <Badge variant="subtle" className="ms-auto">Optional</Badge>}
      </label>
      {children}
      {error && <p id={`${id}-error`} className={errorClass}>{error}</p>}
    </div>
  )
}

function CheckField({ checked, onChange, title, description }: { checked: boolean; onChange: (v: boolean) => void; title: string; description: string }) {
  const id = useId()
  const descId = useId()
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-baseline gap-2">
        <Checkbox id={id} checked={checked} onCheckedChange={onChange} aria-describedby={descId} className="top-0.5" />
        <span className="flex-1 text-[0.8125rem]/4 font-medium text-foreground">{title}</span>
      </label>
      <small id={descId} className={cn(hintClass, "pl-5.5")}>{description}</small>
    </div>
  )
}

/** "Create new user" dialog with Create / Invite tabs, optional name fields, password visibility toggle and inline validation. */
export function CreateUserDialog({
  open,
  defaultOpen = false,
  onOpenChange,
  onCreate,
  onInvite,
  trigger,
  title = "Create new user",
  badge,
  minPasswordLength = 8,
  inviteNote = "We'll email an invitation link. It expires after 30 days.",
}: {
  /** Controlled open state. Leave undefined to let the dialog manage itself. */
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onCreate?: (user: NewUser) => void
  onInvite?: (email: string) => void
  /** Element that opens the dialog, e.g. a `<Button />`. Omit when you control `open` yourself. */
  trigger?: React.ReactElement
  title?: string
  /** Optional tag next to the title, e.g. an environment name. Nothing is shown by default. */
  badge?: React.ReactNode
  minPasswordLength?: number
  inviteNote?: React.ReactNode
}) {
  const [innerOpen, setInnerOpen] = useState(defaultOpen)
  const isOpen = open ?? innerOpen
  const [tab, setTab] = useState<Tab>("create")
  const [form, setForm] = useState(emptyForm)
  const [showPassword, setShowPassword] = useState(false)
  const [skipCheck, setSkipCheck] = useState(false)
  const [welcomeEmail, setWelcomeEmail] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const formId = useId()
  const ids = { first: useId(), last: useId(), email: useId(), password: useId(), invite: useId() }

  const set = (k: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const passwordTooShort = !skipCheck && form.password.length < minPasswordLength
  const emailErr = submitted && !emailOk(form.email) && "Enter a valid email address"
  const passwordErr = submitted && passwordTooShort && `Use at least ${minPasswordLength} characters, or skip the strength check`
  const inviteErr = submitted && !emailOk(form.inviteEmail) && "Enter a valid email address"

  const reset = () => {
    setForm(emptyForm)
    setShowPassword(false)
    setSkipCheck(false)
    setWelcomeEmail(false)
    setSubmitted(false)
    setTab("create")
  }

  const setOpen = (next: boolean) => {
    if (open === undefined) setInnerOpen(next)
    onOpenChange?.(next)
    if (!next) reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className="max-w-xl" showCloseButton={false}>
        <DialogPanel>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {title}
              {badge && <Badge variant="subtle-warning">{badge}</Badge>}
            </DialogTitle>
          </DialogHeader>
          <DialogSection className="pt-2">
            <Tabs
              value={tab}
              onValueChange={(v) => {
                setTab(v as Tab)
                setSubmitted(false)
              }}
              className="gap-6"
            >
              <TabsList variant="underline">
                <TabsTrigger value="create">Create user</TabsTrigger>
                <TabsTrigger value="invite">Invite user</TabsTrigger>
              </TabsList>

              <form
                id={formId}
                autoComplete="off"
                noValidate
                onSubmit={(e) => {
                  e.preventDefault()
                  setSubmitted(true)
                  if (tab === "create") {
                    if (!emailOk(form.email) || passwordTooShort) return
                    onCreate?.({
                      firstName: form.firstName.trim(),
                      lastName: form.lastName.trim(),
                      email: form.email.trim(),
                      password: form.password,
                      skipPasswordCheck: skipCheck,
                      sendWelcomeEmail: welcomeEmail,
                    })
                  } else {
                    if (!emailOk(form.inviteEmail)) return
                    onInvite?.(form.inviteEmail.trim())
                  }
                  setOpen(false)
                }}
              >
                <TabsContent value="create" className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id={ids.first} label="First name" optional>
                      <Input id={ids.first} variant="compact" name="first_name" value={form.firstName} onChange={set("firstName")} />
                    </Field>
                    <Field id={ids.last} label="Last name" optional>
                      <Input id={ids.last} variant="compact" name="last_name" value={form.lastName} onChange={set("lastName")} />
                    </Field>
                  </div>
                  <Field id={ids.email} label="Email" error={emailErr}>
                    <Input id={ids.email} variant="compact" name="email_address" inputMode="email" placeholder="name@example.com" value={form.email} onChange={set("email")} aria-invalid={!!emailErr || undefined} aria-describedby={emailErr ? `${ids.email}-error` : undefined} />
                  </Field>
                  <Field id={ids.password} label="Password" error={passwordErr}>
                    <div className="relative">
                      <Input id={ids.password} variant="compact" name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={set("password")} className="pr-9" aria-invalid={!!passwordErr || undefined} aria-describedby={passwordErr ? `${ids.password}-error` : undefined} />
                      <button
                        type="button"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        aria-pressed={showPassword}
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2.5 text-subtle transition-colors outline-none hover:text-foreground focus-visible:text-foreground"
                      >
                        {showPassword ? <EyeOffIcon className="size-4" aria-hidden="true" /> : <EyeIcon className="size-4" aria-hidden="true" />}
                      </button>
                    </div>
                  </Field>
                  <CheckField
                    checked={skipCheck}
                    onChange={setSkipCheck}
                    title="Skip password strength check"
                    description={`Accept this password even if it's shorter than ${minPasswordLength} characters.`}
                  />
                  <CheckField checked={welcomeEmail} onChange={setWelcomeEmail} title="Send a welcome email" description="Email the new user a link to sign in." />
                </TabsContent>

                <TabsContent value="invite" className="space-y-5">
                  <Field id={ids.invite} label="Email" error={inviteErr}>
                    <Input id={ids.invite} variant="compact" name="invite_email" inputMode="email" placeholder="name@example.com" value={form.inviteEmail} onChange={set("inviteEmail")} aria-invalid={!!inviteErr || undefined} aria-describedby={inviteErr ? `${ids.invite}-error` : undefined} />
                  </Field>
                  {inviteNote && <p className="text-[0.8125rem]/[1.125rem] text-subtle">{inviteNote}</p>}
                </TabsContent>
              </form>
            </Tabs>
          </DialogSection>
        </DialogPanel>
        <DialogFooter>
          <DialogClose render={<Button type="button" variant="elevated" size="compact" />}>Cancel</DialogClose>
          <Button type="submit" form={formId} variant="primary" size="compact">
            {tab === "create" ? "Create user" : "Send invitation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
