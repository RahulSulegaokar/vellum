"use client"

import * as React from "react"
import { CheckIcon, CopyIcon, KeyRoundIcon, PlusIcon, TriangleAlertIcon } from "lucide-react"
import { EmptyState } from "@/components/blocks/empty-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogSection,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

export type ApiKey = {
  id: string
  name: string
  /** Visible prefix, e.g. "key_live_". Use "" for none. */
  prefix: string
  /** Last four characters; the rest is masked. */
  last4: string
  /** Optional environment tag ("Live", "Test"). */
  environment?: "live" | "test"
  /** ISO dates, formatted deterministically. */
  createdAt: string
  lastUsedAt?: string
}

/** What `onCreate` resolves to: the stored key plus its full secret, shown once. */
export type CreatedApiKey = ApiKey & { secret: string }

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
const formatDate = (iso: string) => dateFormat.format(new Date(iso))

export const maskKey = (k: Pick<ApiKey, "prefix" | "last4">) => `${k.prefix}••••${k.last4}`

/** Built-in strings of ApiKeysCard; pass `labels` to translate them. */
export const apiKeysCardLabels = {
  copied: "Copied",
  copyNewKeyTitle: "Copy your new key",
  copyNewKeyDescription: "For security, you won't be able to see this key again after closing this dialog.",
  copyApiKey: "Copy API key",
  storeSafely: "Store it somewhere safe, like a secrets manager or environment variable.",
  done: "Done",
  createError: "Couldn't create the key. Try again.",
  createApiKeyTitle: "Create API key",
  createApiKeyDescription: "Give the key a name so you can recognise it later.",
  name: "Name",
  namePlaceholder: "e.g. Production server",
  cancel: "Cancel",
  createKey: "Create key",
  revokeTitle: (name: React.ReactNode): React.ReactNode => <>Revoke “{name}”?</>,
  revokeDescription: (key: React.ReactNode): React.ReactNode => (
    <>
      Requests using {key} will start failing immediately. This can&apos;t be undone.
    </>
  ),
  revokeKey: "Revoke key",
  noKeysTitle: "No API keys yet",
  noKeysDescription: "Create a key to start calling the API from your servers.",
  live: "Live",
  test: "Test",
  keyEndingIn: (last4: string) => `Key ending in ${last4}`,
  created: (date: React.ReactNode): React.ReactNode => <>Created {date}</>,
  lastUsed: (date: string) => `Last used ${date}`,
  neverUsed: "Never used",
  copyKeyIdFor: (name: string) => `Copy key ID for ${name}`,
  revokeKeyFor: (name: string) => `Revoke ${name}`,
  revoke: "Revoke",
}
export type ApiKeysCardLabels = typeof apiKeysCardLabels

function CopyButton({ value, label, copiedLabel }: { value: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = React.useState(false)
  React.useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(t)
  }, [copied])
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-compact"
      aria-label={copied ? copiedLabel : label}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value)
          setCopied(true)
        } catch {
          setCopied(false)
        }
      }}
    >
      {copied ? <CheckIcon className="text-success" /> : <CopyIcon />}
    </Button>
  )
}

function CreateKeyDialog({
  open,
  onOpenChange,
  onCreate,
  t,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (name: string) => Promise<CreatedApiKey>
  t: ApiKeysCardLabels
}) {
  const id = React.useId()
  const [name, setName] = React.useState("")
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [created, setCreated] = React.useState<CreatedApiKey | null>(null)

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) {
          setName("")
          setError(null)
          setCreated(null)
        }
      }}
    >
      <DialogContent className="max-w-md">
        {created ? (
          <>
            <DialogPanel>
              <DialogHeader>
                <DialogTitle>{t.copyNewKeyTitle}</DialogTitle>
                <DialogDescription>{t.copyNewKeyDescription}</DialogDescription>
              </DialogHeader>
              <DialogSection className="flex flex-col gap-3">
                <div className="flex items-center gap-1 rounded-md bg-surface-muted py-1 pr-1 pl-3 ring-1 ring-edge/6">
                  <code className="min-w-0 flex-1 truncate font-mono text-xs text-foreground">{created.secret}</code>
                  <CopyButton value={created.secret} label={t.copyApiKey} copiedLabel={t.copied} />
                </div>
                <p className="flex items-start gap-2 text-[0.8125rem]/[1.125rem] text-subtle">
                  <TriangleAlertIcon className="mt-0.5 size-3.5 shrink-0 text-warning" aria-hidden="true" />
                  {t.storeSafely}
                </p>
              </DialogSection>
            </DialogPanel>
            <DialogFooter>
              <DialogClose render={<Button type="button" variant="primary" size="compact" />}>{t.done}</DialogClose>
            </DialogFooter>
          </>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              if (!name.trim()) return
              setPending(true)
              setError(null)
              try {
                setCreated(await onCreate(name.trim()))
              } catch (err) {
                setError(err instanceof Error ? err.message : t.createError)
              } finally {
                setPending(false)
              }
            }}
          >
            <DialogPanel>
              <DialogHeader>
                <DialogTitle>{t.createApiKeyTitle}</DialogTitle>
                <DialogDescription>{t.createApiKeyDescription}</DialogDescription>
              </DialogHeader>
              <DialogSection className="flex flex-col gap-1.5">
                <Label htmlFor={`${id}-name`} className="text-[0.8125rem]">
                  {t.name}
                </Label>
                <Input
                  id={`${id}-name`}
                  variant="compact"
                  placeholder={t.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? `${id}-error` : undefined}
                  autoComplete="off"
                  required
                />
                {error && (
                  <p id={`${id}-error`} className="text-[0.8125rem] text-destructive-text">
                    {error}
                  </p>
                )}
              </DialogSection>
            </DialogPanel>
            <DialogFooter>
              <DialogClose render={<Button type="button" variant="elevated" size="compact" />}>{t.cancel}</DialogClose>
              <Button type="submit" variant="primary" size="compact" disabled={pending || !name.trim()}>
                {pending && <Spinner className="size-3.5" />}
                {t.createKey}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

function RevokeKeyDialog({
  apiKey,
  onOpenChange,
  onConfirm,
  t,
}: {
  apiKey: ApiKey | null
  onOpenChange: (open: boolean) => void
  onConfirm: (key: ApiKey) => void
  t: ApiKeysCardLabels
}) {
  // Keep the last key so the copy doesn't blank out while the dialog animates out.
  const [last, setLast] = React.useState(apiKey)
  if (apiKey && apiKey !== last) setLast(apiKey)
  const shown = apiKey ?? last
  return (
    <Dialog open={apiKey !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogPanel>
          <DialogHeader>
            <DialogTitle>{t.revokeTitle(shown?.name)}</DialogTitle>
            <DialogDescription>{t.revokeDescription(<code className="font-mono text-foreground">{shown ? maskKey(shown) : ""}</code>)}</DialogDescription>
          </DialogHeader>
        </DialogPanel>
        <DialogFooter>
          <DialogClose render={<Button type="button" variant="elevated" size="compact" />}>{t.cancel}</DialogClose>
          <Button type="button" variant="destructive" size="compact" onClick={() => apiKey && onConfirm(apiKey)}>
            {t.revokeKey}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/** API keys list with masked values, copy, revoke (with confirmation) and a create dialog that reveals the new secret once. */
export function ApiKeysCard({
  title = "API keys",
  description = "Keys authenticate requests from your servers. Keep them secret.",
  keys: keysProp,
  onCreate,
  onRevoke,
  labels,
  className,
}: {
  title?: string
  description?: React.ReactNode
  keys: ApiKey[]
  /** Create the key on your backend and resolve with it, including the full secret. Omit to hide "Create key". */
  onCreate?: (name: string) => Promise<CreatedApiKey>
  onRevoke?: (id: string) => void | Promise<void>
  /** Translations of the built-in strings (English by default). */
  labels?: Partial<ApiKeysCardLabels>
  className?: string
}) {
  const t = { ...apiKeysCardLabels, ...labels }
  // Local copy so the list reflects creates and revokes; your callbacks persist them.
  const [keys, setKeys] = React.useState(keysProp)
  const [createOpen, setCreateOpen] = React.useState(false)
  const [revoking, setRevoking] = React.useState<ApiKey | null>(null)
  const titleId = React.useId()

  return (
    <section data-slot="api-keys-card" aria-labelledby={titleId} className={cn("rounded-xl bg-surface p-5 shadow-card sm:p-6 dark:shadow-card-dark", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 id={titleId} className="text-[0.9375rem]/5 font-semibold text-foreground">
            {title}
          </h2>
          {description && <p className="mt-0.5 text-[0.8125rem]/[1.125rem] text-subtle">{description}</p>}
        </div>
        {onCreate && (
          <Button variant="primary" size="compact" onClick={() => setCreateOpen(true)}>
            <PlusIcon aria-hidden="true" />
            {t.createKey}
          </Button>
        )}
      </div>
      <div className="mt-4 rounded-lg ring-1 ring-edge/6">
        {keys.length === 0 ? (
          <EmptyState
            className="p-8"
            icon={<KeyRoundIcon className="size-5 text-subtle" />}
            title={t.noKeysTitle}
            description={t.noKeysDescription}
          />
        ) : (
          <ul>
            {keys.map((k) => (
              <li key={k.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-edge/6 px-3 py-3 last:border-0 sm:flex-nowrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-[0.8125rem] font-medium text-foreground">
                    <span className="truncate">{k.name}</span>
                    {k.environment === "live" && <Badge variant="subtle-info">{t.live}</Badge>}
                    {k.environment === "test" && <Badge variant="subtle-warning">{t.test}</Badge>}
                  </div>
                  <code className="mt-0.5 block truncate font-mono text-xs text-subtle" aria-label={t.keyEndingIn(k.last4)}>
                    {maskKey(k)}
                  </code>
                </div>
                <div className="text-xs text-subtle tabular-nums sm:text-right">
                  <div>{t.created(formatDate(k.createdAt))}</div>
                  <div>{k.lastUsedAt ? t.lastUsed(formatDate(k.lastUsedAt)) : t.neverUsed}</div>
                </div>
                <div className="flex items-center gap-1">
                  <CopyButton value={k.id} label={t.copyKeyIdFor(k.name)} copiedLabel={t.copied} />
                  <Button variant="ghost" size="compact-sm" className="text-destructive-text hover:text-destructive-text" aria-label={t.revokeKeyFor(k.name)} onClick={() => setRevoking(k)}>
                    {t.revoke}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {onCreate && (
        <CreateKeyDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          t={t}
          onCreate={async (name) => {
            const created = await onCreate(name)
            setKeys((list) => [created, ...list])
            return created
          }}
        />
      )}
      <RevokeKeyDialog
        apiKey={revoking}
        onOpenChange={(open) => !open && setRevoking(null)}
        t={t}
        onConfirm={async (k) => {
          setRevoking(null)
          setKeys((list) => list.filter((x) => x.id !== k.id))
          await onRevoke?.(k.id)
        }}
      />
    </section>
  )
}
