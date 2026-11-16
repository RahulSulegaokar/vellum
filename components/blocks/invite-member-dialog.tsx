"use client"

import { useId, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogPanel, DialogSection, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type MemberRole = { value: string; label: string }

const defaultRoles: MemberRole[] = [
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" },
  { value: "viewer", label: "Viewer" },
]

const labelClass = "mb-2 flex items-center gap-2 text-[0.8125rem]/4 font-medium text-foreground"
const errorClass = "mt-1.5 text-[0.8125rem]/[1.125rem] text-destructive"
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

/** Invite-member dialog: email and role fields with inline validation, Cancel / Invite footer. */
export function InviteMemberDialog({
  roles = defaultRoles,
  defaultRole = null,
  onInvite,
  trigger = <Button variant="primary" size="compact">Invite</Button>,
  title = "Invite member",
  description = "Invite someone to your workspace by email",
  emailPlaceholder = "name@example.com",
  submitLabel = "Invite",
}: {
  roles?: MemberRole[]
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
}) {
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
                  <label htmlFor={emailId} className={labelClass}>Email</label>
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
                  {emailInvalid && <p id={emailErrId} className={errorClass}>Enter a valid email address</p>}
                </div>
                <div>
                  <span id={roleLabelId} className={labelClass}>Role</span>
                  <Select name="role" value={role} onValueChange={(v) => setRole(v as string | null)} items={roles}>
                    <SelectTrigger
                      variant="elevated"
                      aria-labelledby={roleLabelId}
                      aria-invalid={roleInvalid || undefined}
                      aria-describedby={roleInvalid ? roleErrId : undefined}
                      className="aria-invalid:[--btn-ring:var(--color-red-500)]"
                    >
                      <SelectValue placeholder="Select a role" className="text-foreground data-placeholder:text-foreground" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {roleInvalid && <p id={roleErrId} className={errorClass}>Choose a role</p>}
                </div>
              </div>
            </DialogSection>
          </DialogPanel>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="elevated" size="compact" />}>Cancel</DialogClose>
            <Button type="submit" variant="primary" size="compact">{submitLabel}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

type PendingInvite = { id: string; email: string; role: string }

export default function InviteMemberDialogDemo() {
  const [invites, setInvites] = useState<PendingInvite[]>([])
  const nextId = useRef(1)

  return (
    <div className="mx-auto max-w-2xl p-6 sm:p-10">
      <div className="rounded-xl bg-surface shadow-card ring-1 ring-edge/4">
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div>
            <h2 className="text-[0.9375rem]/5 font-semibold tracking-[-0.01em] text-foreground">Members</h2>
            <p className="text-[0.8125rem]/[1.125rem] text-subtle">People with access to this workspace</p>
          </div>
          <InviteMemberDialog
            onInvite={(email, role) => {
              const id = `invite-${nextId.current++}`
              setInvites((list) => [{ id, email, role: role.label }, ...list])
            }}
          />
        </div>
        <ul aria-label="Pending invitations" className="border-t border-edge/6 text-[0.8125rem]/5">
          {invites.length === 0 ? (
            <li className="px-5 py-6 text-center text-subtle">No pending invitations</li>
          ) : (
            invites.map((invite) => (
              <li key={invite.id} className="flex items-center justify-between gap-4 border-b border-edge/6 px-5 py-3 last:border-0">
                <span className="min-w-0 truncate font-medium text-foreground">{invite.email}</span>
                <span className="flex-none text-subtle">{invite.role} · Invited</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}
