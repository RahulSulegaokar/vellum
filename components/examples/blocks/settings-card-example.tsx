"use client"

import { useMemo, useState } from "react"
import { ChevronDownIcon } from "lucide-react"
import {
  SettingsCard,
  SettingsCheckboxGroup,
  SettingsCollapse,
  SettingsPage,
  SettingsSaveBar,
  SettingsSwitchRow,
  type SettingsOption,
  type SettingsTab,
} from "@/components/blocks/settings-card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type State = Record<string, boolean>

const defaults: State = {
  "product.on": true,
  "product.digest": true,
  "product.releases": false,
  "billing.on": true,
  "billing.invoices": true,
  "billing.failures": true,
  "push.on": false,
  "push.mentions": true,
  "push.messages": false,
  "security.on": true,
  "security.newDevice": true,
  "security.apiKeys": false,
}

const digestOptions: SettingsOption[] = [
  { value: "usage", label: "Usage summary", description: "Requests, storage and seats used this week" },
  { value: "activity", label: "Team activity", description: "New members, comments and shared projects" },
]

export default function SettingsCardExample() {
  const [saved, setSaved] = useState({ state: defaults, digest: ["usage"] })
  const [state, setState] = useState(defaults)
  const [digest, setDigest] = useState(["usage"])
  const set = (key: string) => (v: boolean) => setState((s) => ({ ...s, [key]: v }))
  const row = (key: string) => ({ checked: state[key], onCheckedChange: set(key) })
  const dirty = useMemo(
    () => Object.keys(state).some((k) => state[k] !== saved.state[k]) || [...digest].sort().join() !== [...saved.digest].sort().join(),
    [state, digest, saved]
  )

  const tabs: SettingsTab[] = [
    {
      value: "email",
      label: "Email",
      enabled: state["product.on"] || state["billing.on"],
      content: (
        <>
          <SettingsCard title="Product updates" description="News about your workspace and the features you use" {...row("product.on")}>
            <SettingsSwitchRow title="Weekly digest" badge="Recommended" description="A Monday summary of what happened last week" {...row("product.digest")}>
              <SettingsCollapse open={state["product.digest"]}>
                <SettingsCheckboxGroup
                  label="Include in the digest"
                  description="Pick at least one section"
                  options={digestOptions}
                  value={digest}
                  onValueChange={setDigest}
                />
              </SettingsCollapse>
            </SettingsSwitchRow>
            <SettingsSwitchRow title="Release announcements" description="An email when we ship something new" {...row("product.releases")} />
          </SettingsCard>
          <SettingsCard title="Billing" description="Receipts and payment notices for workspace owners" {...row("billing.on")}>
            <SettingsSwitchRow title="Invoices" description="A copy of each invoice when it's issued" {...row("billing.invoices")} />
            <SettingsSwitchRow title="Payment problems" description="Tell me when a charge fails or a card is about to expire" {...row("billing.failures")} />
          </SettingsCard>
        </>
      ),
    },
    {
      value: "push",
      label: "Push",
      enabled: state["push.on"],
      content: (
        <SettingsCard title="Mobile push" description="Notifications on the devices where you're signed in" {...row("push.on")}>
          <SettingsSwitchRow title="Mentions" description="When someone mentions you in a comment" {...row("push.mentions")} />
          <SettingsSwitchRow title="Direct messages" description="When someone sends you a message" {...row("push.messages")} />
        </SettingsCard>
      ),
    },
    {
      value: "security",
      label: "Security",
      enabled: state["security.on"],
      content: (
        <SettingsCard title="Security alerts" description="Activity on your account that you may want to check" {...row("security.on")}>
          <SettingsSwitchRow title="New device" badge="Recommended" description="An email when your account is used from a new device" {...row("security.newDevice")} />
          <SettingsSwitchRow title="API key created" description="An email when anyone in the workspace creates a key" {...row("security.apiKeys")} />
        </SettingsCard>
      ),
    },
  ]

  return (
    <div className="mx-auto w-[calc(100%-2.5rem)] max-w-3xl pt-8 pb-24 lg:pt-10">
      <SettingsPage
        title="Notifications"
        defaultValue="email"
        tabs={tabs}
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="elevated" size="compact" className="group/preview gap-1 pr-1.5" />}>
              Send test
              <ChevronDownIcon aria-hidden="true" className="text-subtle transition-transform group-data-popup-open/preview:rotate-180" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={6} className="w-44">
              <DropdownMenuItem className="text-[0.8125rem]/5 font-medium" onClick={() => console.info("Send test email")}>
                Test email
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[0.8125rem]/5 font-medium" onClick={() => console.info("Send test push")}>
                Test push
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />
      <SettingsSaveBar
        open={dirty}
        onDiscard={() => {
          setState(saved.state)
          setDigest(saved.digest)
        }}
        onSave={() => setSaved({ state, digest })}
      />
    </div>
  )
}
