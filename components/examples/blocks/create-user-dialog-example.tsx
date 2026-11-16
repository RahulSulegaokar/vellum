"use client"

import { useState } from "react"
import { PlusIcon } from "lucide-react"
import { CreateUserDialog } from "@/components/blocks/create-user-dialog"
import { Button } from "@/components/ui/button"

export default function CreateUserDialogExample() {
  const [last, setLast] = useState<string | null>(null)
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 p-10">
      <CreateUserDialog
        badge="Sandbox"
        trigger={
          <Button variant="primary" size="compact" className="gap-1 pl-2">
            <PlusIcon aria-hidden="true" />
            Create user
          </Button>
        }
        onCreate={(u) => setLast(`Created ${u.email}`)}
        onInvite={(email) => setLast(`Invited ${email}`)}
      />
      <p role="status" className="min-h-5 text-[0.8125rem]/5 text-subtle">{last}</p>
    </div>
  )
}
