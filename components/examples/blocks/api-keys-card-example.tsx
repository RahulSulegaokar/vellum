"use client"

import { ApiKeysCard, type ApiKey, type CreatedApiKey } from "@/components/blocks/api-keys-card"

const keys: ApiKey[] = [
  { id: "key_01", name: "Production", prefix: "key_live_", last4: "3f9a", environment: "live", createdAt: "2026-06-02T00:00:00Z", lastUsedAt: "2026-11-16T00:00:00Z" },
  { id: "key_02", name: "Staging", prefix: "key_test_", last4: "b21c", environment: "test", createdAt: "2026-08-19T00:00:00Z", lastUsedAt: "2026-11-14T00:00:00Z" },
  { id: "key_03", name: "CI runner", prefix: "key_test_", last4: "77e0", environment: "test", createdAt: "2026-10-01T00:00:00Z" },
]

/** Demo-only key factory; runs in the click handler, never during render. */
async function createKey(name: string): Promise<CreatedApiKey> {
  await new Promise((r) => setTimeout(r, 600))
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")
  return {
    id: `key_${hex.slice(0, 8)}`,
    name,
    prefix: "key_test_",
    last4: hex.slice(-4),
    environment: "test",
    createdAt: new Date().toISOString(),
    secret: `key_test_${hex}`,
  }
}

export default function ApiKeysCardExample() {
  return (
    <div className="mx-auto max-w-3xl p-6 sm:p-10">
      <ApiKeysCard keys={keys} onCreate={createKey} />
    </div>
  )
}
