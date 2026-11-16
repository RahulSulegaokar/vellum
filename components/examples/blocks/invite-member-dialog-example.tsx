"use client"

import { useRef, useState } from "react"
import { InviteMemberDialog, type MemberRole } from "@/components/blocks/invite-member-dialog"

const roles: MemberRole[] = [
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" },
  { value: "viewer", label: "Viewer" },
]

type PendingInvite = { id: string; email: string; role: string }

export default function InviteMemberDialogExample() {
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
            roles={roles}
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
