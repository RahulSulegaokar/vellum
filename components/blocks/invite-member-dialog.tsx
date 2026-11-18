"use client"

import { useId, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogPanel, DialogSection, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type MemberRole = { value: string; label: string }

const labelClass = "mb-2 flex items-center gap-2 text-[0.8125rem]/4 font-medium text-foreground"
const errorClass = "mt-1.5 text-[0.8125rem]/[1.125rem] text-destructive-text"
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

/** Built-in strings of InviteMemberDialog; pass `labels` to translate them. */
export const inviteMemberDialogLabels = {
  email: "Email",
  invalidEmail: "Enter a valid email address",
  role: "Role",
  selectRole: "Select a role",
  chooseRole: "Choose a role",
  cancel: "Cancel",
}
export type InviteMemberDialogLabels = typeof inviteMemberDialogLabels

/** Invite-member dialog: email and role fields with inline validation, Cancel / Invite footer. */
export function InviteMemberDialog({
  roles,
  defaultRole = null,
  onInvite,
  trigger = <Button variant="primary" size="compact">Invite</Button>,
  title = "Invite member",
  description = "Invite someone to your workspace by email",
  emailPlaceholder = "name@example.com",
  submitLabel = "Invite",
  labels,
}: {
  /** Roles offered in the select. */
  roles: MemberRole[]
  /** Role value preselected when the dialog opens; `null` forces a choice. */
  defaultRole?: string | null
  /** Called with the trimmed email and the chosen role. */
  onInvite?: (email: string, role: MemberRole) => void
  /** Element that opens the dialog. */
  trigger?: React.ReactElement
  title?: React.ReactNode
  description?: React.ReactNode
  emailPlaceholder?: string
  submitLabel?: string
  /** Translations of the built-in strings (English by default). */
  labels?: Partial<InviteMemberDialogLabels>
}) {
  const t = { ...inviteMemberDialogLabels, ...labels }
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<string | null>(defaultRole)
  const [touched, setTouched] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const formId = useId()
  const emailId = useId()
  const emailErrId = useId()
  const roleLabelId = useId()
  const roleErrId = useId()
  const emailInvalid = touched && !emailOk(email)
  const roleInvalid = submitted && !role

  const reset = () => {
    setEmail("")
    setRole(defaultRole)
    setTouched(false)
    setSubmitted(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) reset()
      }}
    >
      <DialogTrigger render={trigger} />
      <DialogContent showCloseButton={false}>
        <form
          id={formId}
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            setTouched(true)
            setSubmitted(true)
            const picked = roles.find((r) => r.value === role)
            if (!emailOk(email) || !picked) return
            onInvite?.(email.trim(), picked)
            setOpen(false)
            reset()
          }}
        >
          <DialogPanel>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              {description && <DialogDescription>{description}</DialogDescription>}
            </DialogHeader>
            <DialogSection>
              <div className="flex flex-col gap-4">
                <div>
                  <label htmlFor={emailId} className={labelClass}>{t.email}</label>
                  <Input
                    id={emailId}
                    variant="compact"
                    name="email"
                    inputMode="email"
                    autoComplete="off"
                    placeholder={emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => email && setTouched(true)}
                    aria-invalid={emailInvalid || undefined}
                    aria-describedby={emailInvalid ? emailErrId : undefined}
                  />
                  {emailInvalid && <p id={emailErrId} className={errorClass}>{t.invalidEmail}</p>}
                </div>
                <div>
                  <span id={roleLabelId} className={labelClass}>{t.role}</span>
                  <Select name="role" value={role} onValueChange={(v) => setRole(v as string | null)} items={roles}>
                    <SelectTrigger
                      variant="elevated"
                      aria-labelledby={roleLabelId}
                      aria-invalid={roleInvalid || undefined}
                      aria-describedby={roleInvalid ? roleErrId : undefined}
                      className="aria-invalid:[--btn-ring:var(--color-destructive)]"
                    >
                      <SelectValue placeholder={t.selectRole} className="text-foreground data-placeholder:text-foreground" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {roleInvalid && <p id={roleErrId} className={errorClass}>{t.chooseRole}</p>}
                </div>
              </div>
            </DialogSection>
          </DialogPanel>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="elevated" size="compact" />}>{t.cancel}</DialogClose>
            <Button type="submit" variant="primary" size="compact">{submitLabel}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
