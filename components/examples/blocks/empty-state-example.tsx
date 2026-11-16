"use client"

import { EmptyState } from "@/components/blocks/empty-state"
import { Button } from "@/components/ui/button"

export default function EmptyStateExample() {
  return (
    <div className="mx-auto max-w-2xl p-10">
      <div className="rounded-xl bg-surface shadow-card">
        <EmptyState
          title="No users yet"
          description="Create a user or import existing ones to get started."
          actions={
            <>
              <Button variant="elevated" size="compact" onClick={() => console.info("Import")}>
                Import
              </Button>
              <Button variant="primary" size="compact" onClick={() => console.info("Create user")}>
                Create user
              </Button>
            </>
          }
        />
      </div>
    </div>
  )
}
