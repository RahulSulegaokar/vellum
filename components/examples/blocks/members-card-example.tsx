"use client"

import { useState } from "react"
import { MembersCard, RolesCard, type Invitation, type Member, type Role } from "@/components/blocks/members-card"

const members: Member[] = [
  { id: "usr_01", name: "Ada Park", email: "ada.park@example.com", role: "Admin", joinedAt: "2026-01-04T00:00:00Z" },
  { id: "usr_02", name: "Ben Ortiz", email: "ben.ortiz@example.com", role: "Member", joinedAt: "2026-02-12T00:00:00Z" },
  { id: "usr_03", name: "Cleo Ng", email: "cleo.ng@example.com", role: "Member", joinedAt: "2026-03-02T00:00:00Z" },
]

const invitations: Invitation[] = [{ id: "inv_01", email: "dev.rao@example.com", role: "Member", invitedAt: "2026-11-10T00:00:00Z" }]

const roles: Role[] = [
  { name: "Member", key: "member", permissions: 2, description: "Read access to workspace resources" },
  { name: "Admin", key: "admin", permissions: 9, description: "Full access, including members and billing" },
  { name: "Billing manager", key: "billing", permissions: 4 },
]

export default function MembersCardExample() {
  const [note, setNote] = useState("")
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 p-6 sm:p-10">
      <MembersCard members={members} invitations={invitations} roles={["Admin", "Member"]} currentUserId="usr_01" />
      <RolesCard roles={roles} onCreateRole={() => setNote("Open your create-role flow here.")} onSelectRole={(key) => setNote(`Selected role: ${key}`)} />
      <p role="status" className="min-h-5 text-[0.8125rem]/5 text-subtle">{note}</p>
    </div>
  )
}
