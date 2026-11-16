"use client"

import { CreateWorkspaceForm, WorkspaceSwitcher, type Workspace } from "@/components/blocks/workspace-switcher"

const workspaces: Workspace[] = [
  { id: "1", name: "Northwind", role: "Admin" },
  { id: "2", name: "Personal workspace" },
  { id: "3", name: "Globex", role: "Member" },
]

export default function WorkspaceSwitcherExample() {
  return (
    <div className="mx-auto grid max-w-5xl items-start gap-10 p-6 sm:p-10 md:grid-cols-2">
      <div className="min-h-80">
        <WorkspaceSwitcher workspaces={workspaces} onManage={() => {}} onCreate={() => {}} />
      </div>
      <CreateWorkspaceForm slugPrefix="acme.app/" onCancel={() => {}} onSubmit={() => new Promise((r) => setTimeout(r, 800))} />
    </div>
  )
}
