"use client"

import * as React from "react"
import type { DateRange } from "react-day-picker"
import { AtSignIcon, CopyIcon, MailIcon, PaperclipIcon, SearchIcon, SendIcon, SmartphoneIcon, MessageSquareIcon, UsersIcon } from "lucide-react"

import { Demo, Showcase } from "@/components/showcase/frame"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { Kbd } from "@/components/ui/kbd"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from "@/components/ui/native-select"
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"
import { RadioCard, RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

/* ------------------------------------------------------------------------------------------------
 * Fixed data (no Date.now / Math.random during render)
 * ---------------------------------------------------------------------------------------------- */

const TODAY = new Date(2026, 10, 18)
const CAMPAIGN_DAY = new Date(2026, 10, 24)
const RANGE_START = new Date(2026, 10, 9)
const RANGE_END = new Date(2026, 10, 15)
const MONTH = new Date(2026, 10, 1)
const BLACKOUT_FROM = new Date(2026, 10, 26)
const BLACKOUT_TO = new Date(2026, 10, 27)
const FIRST_MONTH = new Date(2025, 0)
const LAST_MONTH = new Date(2027, 11)

const contacts = ["Priya Nair", "Tomás Ortega", "Amara Okafor", "Lena Fischer", "Kenji Watanabe", "Sofia Marchetti", "Dev Malhotra"]
const tags = ["VIP", "Wholesale", "Newsletter", "Opted out", "Pending review", "Returning", "Trial"]
const inboxGroups = [
  { value: "Shared inboxes", items: ["Support", "Sales", "Bookings"] },
  { value: "Channels", items: ["WhatsApp", "SMS", "Email"] },
] as const

const channelItems = [
  { label: "Pick a channel", value: null },
  { label: "WhatsApp", value: "whatsapp" },
  { label: "SMS", value: "sms" },
  { label: "Email", value: "email" },
]
const teammateItems = [
  { label: "Unassigned", value: null },
  { label: "Priya Nair", value: "priya" },
  { label: "Tomás Ortega", value: "tomas" },
  { label: "Amara Okafor", value: "amara" },
  { label: "Lena Fischer (away)", value: "lena" },
]
const categoryItems = [
  { label: "Utility", value: "utility" },
  { label: "Marketing", value: "marketing" },
]
const sortItems = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "Unread first", value: "unread" },
]

/* ------------------------------------------------------------------------------------------------
 * Shared helpers
 * ---------------------------------------------------------------------------------------------- */

/** Label + control pair with a generated id (children render twice, so ids must be unique). */
function Labelled({
  label,
  className,
  children,
  optional,
}: {
  label: string
  className?: string
  optional?: boolean
  children: (id: string) => React.ReactNode
}) {
  const id = React.useId()
  return (
    <div className={className ?? "flex w-full flex-col gap-1.5 sm:w-56"}>
      <Label htmlFor={id} optional={optional}>
        {label}
      </Label>
      {children(id)}
    </div>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Input
 * ---------------------------------------------------------------------------------------------- */

function InputShowcase() {
  return (
    <Showcase
      id="input"
      title="Input"
      summary="Single-line text entry. Use the default field variant in forms; the compact variant suits dense toolbars and dashboard filters."
      covers={[
        "variant: field",
        "variant: compact",
        "placeholder",
        "filled",
        "disabled",
        "read-only",
        "invalid",
        "type: email",
        "type: password",
        "type: number",
        "type: search",
      ]}
    >
      <Demo label="Variants">
        <Labelled label="Business name">{(id) => <Input id={id} placeholder="Harbor Street Bakery" />}</Labelled>
        <Labelled label="Filter contacts">{(id) => <Input id={id} variant="compact" placeholder="Search by name or phone" />}</Labelled>
      </Demo>
      <Demo label="States (field)">
        <Input aria-label="Empty" placeholder="Placeholder" className="sm:w-44" />
        <Input aria-label="Filled" defaultValue="priya@harborbakery.co" className="sm:w-44" />
        <Input aria-label="Disabled" disabled defaultValue="Disabled" className="sm:w-44" />
        <Input aria-label="Read-only" readOnly defaultValue="acct_48213" className="sm:w-44" />
        <Input aria-label="Invalid" aria-invalid defaultValue="priya@harbor" className="sm:w-44" />
      </Demo>
      <Demo label="States (compact)">
        <Input variant="compact" aria-label="Empty compact" placeholder="Placeholder" className="sm:w-44" />
        <Input variant="compact" aria-label="Filled compact" defaultValue="Opted out" className="sm:w-44" />
        <Input variant="compact" aria-label="Disabled compact" disabled defaultValue="Disabled" className="sm:w-44" />
        <Input variant="compact" aria-label="Read-only compact" readOnly defaultValue="+1 415 555 0142" className="sm:w-44" />
        <Input variant="compact" aria-label="Invalid compact" aria-invalid defaultValue="+1 415" className="sm:w-44" />
      </Demo>
      <Demo label="Types">
        <Input type="email" aria-label="Email" placeholder="you@business.com" className="sm:w-44" />
        <Input type="password" aria-label="Password" defaultValue="relay-demo-pass" className="sm:w-44" />
        <Input type="number" aria-label="Daily send limit" defaultValue={500} className="sm:w-28" />
        <Input type="search" aria-label="Search" placeholder="Search templates" className="sm:w-44" />
      </Demo>
      <Demo label="In context">
        <InputInContext />
      </Demo>
    </Showcase>
  )
}

function InputInContext() {
  const id = React.useId()
  const [value, setValue] = React.useState("Harbor Street Bakery")
  return (
    <div className="flex w-full max-w-md flex-col gap-1.5">
      <Label htmlFor={id}>Sender name</Label>
      <div className="flex gap-2">
        <Input id={id} value={value} onChange={(e) => setValue(e.target.value)} />
        <Button variant="primary">Save</Button>
      </div>
      <p className="text-[0.8125rem]/5 text-subtle">Shown above every WhatsApp and SMS message. {value.length}/40</p>
    </div>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Textarea
 * ---------------------------------------------------------------------------------------------- */

function TextareaShowcase() {
  return (
    <Showcase
      id="textarea"
      title="Textarea"
      summary="Multi-line text such as message bodies, notes and template content. It shares the field surface with Input."
      covers={["placeholder", "filled", "disabled", "read-only", "invalid", "custom height"]}
    >
      <Demo label="States" className="grid sm:grid-cols-2">
        <Textarea aria-label="Empty" placeholder="Write a reply to Priya…" />
        <Textarea aria-label="Filled" defaultValue={"Hi Tomás, your order #4821 is ready for pickup at our Harbor Street store until 6pm."} />
        <Textarea aria-label="Disabled" disabled defaultValue="Conversation closed by Amara Okafor." />
        <Textarea aria-label="Read-only" readOnly defaultValue="Approved template: Your appointment is confirmed for {{date}}." />
        <Textarea aria-label="Invalid" aria-invalid defaultValue="Use {{first_name} to personalise" />
        <Textarea aria-label="Short" placeholder="Internal note (min-h-16)" className="min-h-16" />
      </Demo>
      <Demo label="In context">
        <TextareaInContext />
      </Demo>
    </Showcase>
  )
}

function TextareaInContext() {
  const id = React.useId()
  const [value, setValue] = React.useState("Hi {{first_name}}, thanks for shopping with us! Reply STOP to opt out.")
  const over = value.length > 160
  return (
    <div className="flex w-full flex-col gap-1.5">
      <Label htmlFor={id}>SMS template</Label>
      <Textarea id={id} value={value} aria-invalid={over || undefined} onChange={(e) => setValue(e.target.value)} />
      <div className="flex justify-between text-[0.8125rem]/5">
        <span className={over ? "text-destructive-text" : "text-subtle"}>{over ? "Over one SMS segment" : "Fits in one SMS segment"}</span>
        <span className="text-subtle tabular-nums">{value.length}/160</span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Label
 * ---------------------------------------------------------------------------------------------- */

function LabelShowcase() {
  return (
    <Showcase
      id="label"
      title="Label"
      summary="Names a control. Pass optional to add the Optional tag, and it dims itself when its peer control is disabled."
      covers={["default", "optional", "optionalLabel", "with checkbox", "peer disabled", "in disabled field"]}
    >
      <Demo label="Variants">
        <Labelled label="Display name">{(id) => <Input id={id} placeholder="Priya Nair" />}</Labelled>
        <Labelled label="Job title" optional>
          {(id) => <Input id={id} placeholder="Store manager" />}
        </Labelled>
        <LabelCustomOptional />
      </Demo>
      <Demo label="States">
        <LabelWithCheckbox />
        <LabelDisabledPeer />
        <LabelInDisabledField />
      </Demo>
    </Showcase>
  )
}

function LabelCustomOptional() {
  const id = React.useId()
  return (
    <div className="flex w-full flex-col gap-1.5 sm:w-56">
      <Label htmlFor={id} optional optionalLabel="Facultatif">
        Surnom
      </Label>
      <Input id={id} placeholder="Tomi" />
    </div>
  )
}

function LabelWithCheckbox() {
  const id = React.useId()
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={id} defaultChecked />
      <Label htmlFor={id}>Send read receipts</Label>
    </div>
  )
}

function LabelDisabledPeer() {
  const id = React.useId()
  return (
    <div className="flex items-center gap-2">
      <input id={id} type="checkbox" disabled className="peer sr-only" />
      <Label htmlFor={id}>Peer disabled (dimmed)</Label>
    </div>
  )
}

function LabelInDisabledField() {
  const id = React.useId()
  return (
    <div className="group flex w-full flex-col gap-1.5 sm:w-56" data-disabled="true">
      <Label htmlFor={id}>API webhook URL</Label>
      <Input id={id} disabled defaultValue="https://hooks.relay.example/…" />
    </div>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Field
 * ---------------------------------------------------------------------------------------------- */

function FieldShowcase() {
  return (
    <Showcase
      id="field"
      title="Field"
      summary="Layout primitives for labelled controls: Field, FieldSet with a legend, groups, descriptions, errors and separators."
      covers={[
        "orientation: vertical",
        "orientation: horizontal",
        "orientation: responsive",
        "FieldSet",
        "FieldLegend: legend",
        "FieldLegend: label",
        "FieldDescription",
        "FieldError (single)",
        "FieldError (list)",
        "FieldSeparator",
        "FieldTitle / FieldContent",
        "choice card",
        "invalid",
        "disabled",
      ]}
    >
      <Demo label="Orientation: vertical">
        <FieldVertical />
      </Demo>
      <Demo label="Orientation: horizontal">
        <FieldHorizontal />
      </Demo>
      <Demo label="Orientation: responsive (row from @md container)">
        <FieldResponsive />
      </Demo>
      <Demo label="States">
        <FieldStates />
      </Demo>
      <Demo label="FieldSet and FieldLegend">
        <FieldSetDemo />
      </Demo>
      <Demo label="In context">
        <FieldChoiceCards />
      </Demo>
    </Showcase>
  )
}

function FieldVertical() {
  const id = React.useId()
  return (
    <FieldGroup className="max-w-sm">
      <Field>
        <FieldLabel htmlFor={id}>Workspace name</FieldLabel>
        <Input id={id} defaultValue="Harbor Street Bakery" />
        <FieldDescription>Customers see this on email receipts.</FieldDescription>
      </Field>
    </FieldGroup>
  )
}

function FieldHorizontal() {
  const a = React.useId()
  const b = React.useId()
  return (
    <FieldGroup className="max-w-sm">
      <Field orientation="horizontal">
        <Switch id={a} defaultChecked />
        <FieldLabel htmlFor={a}>Auto-assign new conversations</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Checkbox id={b} />
        <FieldContent>
          <FieldLabel htmlFor={b}>Mark as resolved after reply</FieldLabel>
          <FieldDescription>Reopens when the customer writes back.</FieldDescription>
        </FieldContent>
      </Field>
    </FieldGroup>
  )
}

function FieldResponsive() {
  const a = React.useId()
  const b = React.useId()
  return (
    <FieldGroup>
      <Field orientation="responsive">
        <FieldContent>
          <FieldLabel htmlFor={a}>Reply-to address</FieldLabel>
          <FieldDescription>Where email replies land.</FieldDescription>
        </FieldContent>
        <Input id={a} defaultValue="hello@harborbakery.co" className="@md/field-group:w-56" />
      </Field>
      <FieldSeparator />
      <Field orientation="responsive">
        <FieldContent>
          <FieldLabel htmlFor={b}>Business hours</FieldLabel>
          <FieldDescription>Auto-replies run outside them.</FieldDescription>
        </FieldContent>
        <NativeSelect id={b} defaultValue="9-6">
          <NativeSelectOption value="9-5">9am – 5pm</NativeSelectOption>
          <NativeSelectOption value="9-6">9am – 6pm</NativeSelectOption>
          <NativeSelectOption value="24">Always open</NativeSelectOption>
        </NativeSelect>
      </Field>
    </FieldGroup>
  )
}

function FieldStates() {
  const a = React.useId()
  const b = React.useId()
  return (
    <FieldGroup className="max-w-sm">
      <Field data-invalid>
        <FieldLabel htmlFor={a}>Phone number</FieldLabel>
        <Input id={a} aria-invalid defaultValue="+1 415 55" />
        <FieldDescription>Include the country code.</FieldDescription>
        <FieldError>Enter a full phone number, for example +1 415 555 0142.</FieldError>
      </Field>
      <Field data-invalid>
        <FieldLabel htmlFor={b}>Template name</FieldLabel>
        <Input id={b} aria-invalid defaultValue="Order Ready!" />
        <FieldError errors={[{ message: "Use lowercase letters and underscores only." }, { message: "Must be 3 to 32 characters." }]} />
      </Field>
      <Field data-disabled="true">
        <FieldLabel>Account ID</FieldLabel>
        <Input disabled aria-label="Account ID" defaultValue="acct_48213" />
        <FieldDescription>Contact support to change it.</FieldDescription>
      </Field>
    </FieldGroup>
  )
}

function FieldSetDemo() {
  const ids = [React.useId(), React.useId(), React.useId()]
  const r = [React.useId(), React.useId()]
  return (
    <div className="grid w-full gap-6 sm:grid-cols-2">
      <FieldSet>
        <FieldLegend>Notifications</FieldLegend>
        <FieldDescription>Choose what pings your phone.</FieldDescription>
        <FieldGroup data-slot="checkbox-group">
          {["New conversation", "Mention by a teammate", "Campaign finished"].map((label, i) => (
            <Field key={label} orientation="horizontal">
              <Checkbox id={ids[i]} defaultChecked={i < 2} />
              <FieldLabel htmlFor={ids[i]} className="font-normal">
                {label}
              </FieldLabel>
            </Field>
          ))}
        </FieldGroup>
      </FieldSet>
      <FieldSet>
        <FieldLegend variant="label">Default channel</FieldLegend>
        <RadioGroup defaultValue="whatsapp">
          {[
            ["whatsapp", "WhatsApp"],
            ["sms", "SMS"],
          ].map(([value, label], i) => (
            <Field key={value} orientation="horizontal">
              <RadioGroupItem value={value} id={r[i]} />
              <FieldLabel htmlFor={r[i]} className="font-normal">
                {label}
              </FieldLabel>
            </Field>
          ))}
        </RadioGroup>
      </FieldSet>
    </div>
  )
}

function FieldChoiceCards() {
  const a = React.useId()
  const b = React.useId()
  return (
    <FieldSet className="w-full">
      <FieldLegend variant="label">Message channels</FieldLegend>
      <FieldGroup className="gap-3">
        <FieldLabel htmlFor={a}>
          <Field orientation="horizontal">
            <Checkbox id={a} defaultChecked />
            <FieldContent>
              <FieldTitle>WhatsApp Business</FieldTitle>
              <FieldDescription>Connected to +1 415 555 0142</FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>
        <FieldLabel htmlFor={b}>
          <Field orientation="horizontal">
            <Checkbox id={b} />
            <FieldContent>
              <FieldTitle>SMS</FieldTitle>
              <FieldDescription>$0.0079 per segment in the US</FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>
      </FieldGroup>
      <FieldSeparator>or</FieldSeparator>
      <Button variant="outline" className="self-start">
        Connect an email inbox
      </Button>
    </FieldSet>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Form
 * ---------------------------------------------------------------------------------------------- */

function FormShowcase() {
  return (
    <Showcase
      id="form"
      title="Form"
      summary="Accessible form fields without a form library: FormItem takes the error, FormControl wires id, aria-describedby and aria-invalid onto its child."
      covers={["FormItem", "FormLabel", "FormControl", "FormDescription", "FormMessage", "valid", "invalid (error)", "with Textarea", "with SelectTrigger", "submit validation"]}
    >
      <Demo label="States" className="grid sm:grid-cols-2">
        <FormItem>
          <FormLabel>Contact email</FormLabel>
          <FormControl>
            <Input type="email" defaultValue="amara@okafor.studio" />
          </FormControl>
          <FormDescription>Used for receipts and campaign replies.</FormDescription>
        </FormItem>
        <FormItem error="This number already belongs to Tomás Ortega.">
          <FormLabel>Phone</FormLabel>
          <FormControl>
            <Input defaultValue="+34 612 345 678" />
          </FormControl>
          <FormDescription>Include the country code.</FormDescription>
          <FormMessage />
        </FormItem>
      </Demo>
      <Demo label="In context">
        <FormInContext />
      </Demo>
    </Showcase>
  )
}

function FormInContext() {
  const [errors, setErrors] = React.useState<{ name?: string; message?: string }>({})
  const [sent, setSent] = React.useState(false)
  return (
    <form
      className="flex w-full flex-col gap-4"
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        const next: typeof errors = {}
        if (!String(data.get("name") ?? "").trim()) next.name = "Give the template a name."
        if (String(data.get("message") ?? "").trim().length < 10) next.message = "Write at least 10 characters."
        setErrors(next)
        setSent(Object.keys(next).length === 0)
      }}
    >
      <FormItem error={errors.name}>
        <FormLabel>Template name</FormLabel>
        <FormControl>
          <Input name="name" placeholder="order_ready" />
        </FormControl>
        <FormMessage />
      </FormItem>
      <FormItem>
        <FormLabel>Category</FormLabel>
        <Select items={categoryItems} defaultValue="utility">
          <FormControl>
            <SelectTrigger className="sm:w-48">
              <SelectValue />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="utility">Utility</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
          </SelectContent>
        </Select>
        <FormDescription>Marketing templates need opt-in.</FormDescription>
      </FormItem>
      <FormItem error={errors.message}>
        <FormLabel>Message</FormLabel>
        <FormControl>
          <Textarea name="message" placeholder="Hi {{first_name}}, your order is ready." className="min-h-20" />
        </FormControl>
        <FormMessage />
      </FormItem>
      <div className="flex items-center gap-3">
        <Button type="submit" variant="primary">
          Save template
        </Button>
        {sent && <span className="text-sm text-success-text">Sent for review</span>}
      </div>
    </form>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Input group
 * ---------------------------------------------------------------------------------------------- */

function InputGroupShowcase() {
  return (
    <Showcase
      id="input-group"
      title="Input group"
      summary="A field with icons, text, buttons or a toolbar attached inside the same frame: search boxes, prefixed URLs, composers."
      covers={[
        "addon: inline-start",
        "addon: inline-end",
        "addon: block-start",
        "addon: block-end",
        "button size: xs",
        "button size: sm",
        "button size: icon-xs",
        "button size: icon-sm",
        "InputGroupText",
        "InputGroupTextarea",
        "with Kbd",
        "loading",
        "disabled",
        "invalid",
      ]}
    >
      <Demo label="Addon align" className="grid sm:grid-cols-2">
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput aria-label="Search conversations" placeholder="Search conversations" />
        </InputGroup>
        <InputGroup>
          <InputGroupInput aria-label="Domain" defaultValue="harborbakery" />
          <InputGroupAddon align="inline-end">
            <InputGroupText>.relay.chat</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupAddon align="block-start" className="border-b">
            <InputGroupText>
              <MailIcon /> Subject
            </InputGroupText>
          </InputGroupAddon>
          <InputGroupInput aria-label="Subject" placeholder="Your November order" />
        </InputGroup>
        <InputGroup>
          <InputGroupInput aria-label="Campaign name" defaultValue="Black Friday early access" />
          <InputGroupAddon align="block-end" className="border-t">
            <InputGroupText>24/60 characters</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </Demo>
      <Demo label="Button sizes" className="grid sm:grid-cols-2">
        <InputGroup>
          <InputGroupInput aria-label="Invite link" readOnly defaultValue="relay.chat/i/7KQ2" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="xs">Copy</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput aria-label="Coupon code" placeholder="Coupon code" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="sm" variant="secondary">
              Apply
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput aria-label="API key" readOnly defaultValue="rl_test_••••••••3f9a" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-xs" aria-label="Copy API key">
              <CopyIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupAddon>
            <AtSignIcon />
          </InputGroupAddon>
          <InputGroupInput aria-label="Mention" placeholder="Mention a teammate" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-sm" aria-label="Send">
              <SendIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Demo>
      <Demo label="States" className="grid sm:grid-cols-2">
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput aria-label="Search" placeholder="Search contacts" />
          <InputGroupAddon align="inline-end">
            <Kbd>⌘K</Kbd>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput aria-label="Searching" defaultValue="Tomás" />
          <InputGroupAddon align="inline-end">
            <Spinner />
          </InputGroupAddon>
        </InputGroup>
        <InputGroup data-disabled="true">
          <InputGroupAddon>
            <SmartphoneIcon />
          </InputGroupAddon>
          <InputGroupInput aria-label="Disabled" disabled defaultValue="+1 415 555 0142" />
        </InputGroup>
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput aria-label="Invalid webhook" aria-invalid defaultValue="hooks harbor bakery" />
        </InputGroup>
      </Demo>
      <Demo label="In context">
        <InputGroupComposer />
      </Demo>
    </Showcase>
  )
}

function InputGroupComposer() {
  const [text, setText] = React.useState("")
  return (
    <InputGroup>
      <InputGroupTextarea aria-label="Reply" placeholder="Reply to Priya on WhatsApp…" value={text} onChange={(e) => setText(e.target.value)} />
      <InputGroupAddon align="block-end">
        <InputGroupButton size="icon-xs" aria-label="Attach file">
          <PaperclipIcon />
        </InputGroupButton>
        <InputGroupText className="ml-auto tabular-nums">{text.length}/1024</InputGroupText>
        <InputGroupButton size="sm" variant="default" disabled={!text.trim()}>
          Send message
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Input OTP
 * ---------------------------------------------------------------------------------------------- */

function InputOTPShowcase() {
  return (
    <Showcase
      id="input-otp"
      title="Input OTP"
      summary="One-time codes split into slots, for two-factor sign-in and phone number verification."
      covers={["6 slots", "grouped with separator", "4 digits", "digits-only pattern", "filled", "disabled", "invalid"]}
    >
      <Demo label="Layouts">
        <InputOTP maxLength={6} aria-label="Verification code">
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>
        <InputOTP maxLength={6} pattern="^[0-9]*$" aria-label="Grouped code">
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <InputOTP maxLength={4} pattern="^[0-9]*$" aria-label="PIN">
          <InputOTPGroup>
            {[0, 1, 2, 3].map((i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </Demo>
      <Demo label="States">
        <InputOTP maxLength={6} value="482193" onChange={() => {}} aria-label="Filled code">
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>
        <InputOTP maxLength={6} disabled value="482193" aria-label="Disabled code">
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>
        <InputOTP maxLength={6} value="000000" onChange={() => {}} aria-label="Invalid code">
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot key={i} index={i} aria-invalid />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </Demo>
      <Demo label="In context">
        <OTPInContext />
      </Demo>
    </Showcase>
  )
}

function OTPInContext() {
  const [value, setValue] = React.useState("")
  const wrong = value.length === 6 && value !== "123456"
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium">Verify +1 415 555 0142</p>
      <p className="text-[0.8125rem]/5 text-subtle">Enter the 6-digit code we texted you (try 123456).</p>
      <InputOTP maxLength={6} pattern="^[0-9]*$" value={value} onChange={setValue} aria-label="SMS code">
        <InputOTPGroup>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <InputOTPSlot key={i} index={i} aria-invalid={wrong || undefined} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      {wrong && <p className="text-[0.8125rem]/5 text-destructive-text">That code didn&apos;t match. Request a new one.</p>}
      {value === "123456" && <p className="text-[0.8125rem]/5 text-success-text">Number verified.</p>}
    </div>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Native select
 * ---------------------------------------------------------------------------------------------- */

function NativeSelectShowcase() {
  return (
    <Showcase
      id="native-select"
      title="Native select"
      summary="The browser's own select with the field surface. Use it on mobile-heavy flows and for long, simple lists."
      covers={["size: default", "size: sm", "placeholder", "filled", "optgroup", "disabled option", "disabled", "invalid"]}
    >
      <Demo label="Sizes">
        <NativeSelect aria-label="Language" defaultValue="en">
          <NativeSelectOption value="en">English</NativeSelectOption>
          <NativeSelectOption value="es">Español</NativeSelectOption>
          <NativeSelectOption value="pt">Português</NativeSelectOption>
        </NativeSelect>
        <NativeSelect size="sm" aria-label="Rows per page" defaultValue="25">
          <NativeSelectOption value="25">25 rows</NativeSelectOption>
          <NativeSelectOption value="50">50 rows</NativeSelectOption>
          <NativeSelectOption value="100">100 rows</NativeSelectOption>
        </NativeSelect>
      </Demo>
      <Demo label="States">
        <NativeSelect aria-label="Country" defaultValue="">
          <NativeSelectOption value="" disabled>
            Choose a country
          </NativeSelectOption>
          <NativeSelectOptGroup label="Americas">
            <NativeSelectOption value="us">United States</NativeSelectOption>
            <NativeSelectOption value="mx">Mexico</NativeSelectOption>
          </NativeSelectOptGroup>
          <NativeSelectOptGroup label="Europe">
            <NativeSelectOption value="es">Spain</NativeSelectOption>
            <NativeSelectOption value="de">Germany</NativeSelectOption>
          </NativeSelectOptGroup>
        </NativeSelect>
        <NativeSelect aria-label="Plan" disabled defaultValue="growth">
          <NativeSelectOption value="growth">Growth plan</NativeSelectOption>
        </NativeSelect>
        <NativeSelect aria-label="Time zone" aria-invalid defaultValue="">
          <NativeSelectOption value="">Time zone required</NativeSelectOption>
          <NativeSelectOption value="pt">Pacific Time</NativeSelectOption>
        </NativeSelect>
      </Demo>
      <Demo label="In context">
        <Labelled label="Send campaign at" className="flex flex-col gap-1.5">
          {(id) => (
            <div className="flex gap-2">
              <NativeSelect id={id} defaultValue="09">
                <NativeSelectOption value="09">9:00 am</NativeSelectOption>
                <NativeSelectOption value="12">12:00 pm</NativeSelectOption>
                <NativeSelectOption value="18">6:00 pm</NativeSelectOption>
              </NativeSelect>
              <NativeSelect aria-label="Time zone" defaultValue="local">
                <NativeSelectOption value="local">Recipient&apos;s time zone</NativeSelectOption>
                <NativeSelectOption value="store">Store time zone</NativeSelectOption>
              </NativeSelect>
            </div>
          )}
        </Labelled>
      </Demo>
    </Showcase>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Select
 * ---------------------------------------------------------------------------------------------- */

function SelectShowcase() {
  return (
    <Showcase
      id="select"
      title="Select"
      summary="A styled listbox for picking one option. The field trigger sits in forms; the elevated trigger works as a toolbar control."
      covers={[
        "trigger variant: field",
        "trigger variant: elevated",
        "size: default",
        "size: sm",
        "placeholder",
        "selected",
        "groups + label + separator",
        "disabled item",
        "disabled",
        "invalid",
        "alignItemWithTrigger",
      ]}
    >
      <Demo label="Trigger variants">
        <Select items={channelItems}>
          <SelectTrigger aria-label="Channel" className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {channelItems.map((item) => (
              <SelectItem key={item.label} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select items={sortItems} defaultValue="newest">
          <SelectTrigger variant="elevated" aria-label="Sort" className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Demo>
      <Demo label="Sizes">
        <Select items={sortItems} defaultValue="unread">
          <SelectTrigger aria-label="Sort default" className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select items={sortItems} defaultValue="unread">
          <SelectTrigger size="sm" aria-label="Sort small" className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select items={sortItems} defaultValue="oldest">
          <SelectTrigger variant="elevated" size="sm" aria-label="Sort elevated small" className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger>
            {sortItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Demo>
      <Demo label="States">
        <Select items={teammateItems}>
          <SelectTrigger aria-label="Assign to" className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Online</SelectLabel>
              {teammateItems.slice(0, 4).map((item) => (
                <SelectItem key={item.label} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Away</SelectLabel>
              <SelectItem value="lena" disabled>
                Lena Fischer (away)
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select items={channelItems} defaultValue="sms" disabled>
          <SelectTrigger aria-label="Disabled channel" className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {channelItems.map((item) => (
              <SelectItem key={item.label} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select items={channelItems}>
          <SelectTrigger aria-label="Invalid channel" aria-invalid className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {channelItems.map((item) => (
              <SelectItem key={item.label} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Demo>
      <Demo label="In context">
        <SelectInContext />
      </Demo>
    </Showcase>
  )
}

function SelectInContext() {
  const [owner, setOwner] = React.useState<string | null>("priya")
  return (
    <div className="flex w-full items-center justify-between gap-3 rounded-lg bg-surface px-3 py-2 ring-1 ring-hairline">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">Tomás Ortega · Order #4821</p>
        <p className="text-xs text-subtle">{owner ? `Assigned to ${teammateItems.find((t) => t.value === owner)?.label}` : "Waiting for an owner"}</p>
      </div>
      <Select items={teammateItems} value={owner} onValueChange={(v) => setOwner(v as string | null)}>
        <SelectTrigger variant="elevated" aria-label="Assignee" className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {teammateItems.map((item) => (
            <SelectItem key={item.label} value={item.value} disabled={item.value === "lena"}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Combobox
 * ---------------------------------------------------------------------------------------------- */

function ComboboxShowcase() {
  return (
    <Showcase
      id="combobox"
      title="Combobox"
      summary="A searchable select. Use it when a list is too long to scan; the multiple mode shows picks as removable chips."
      covers={[
        "single",
        "single with value + clear",
        "groups + separator",
        "disabled item",
        "multiple with chips",
        "empty results",
        "disabled",
        "invalid",
        "chips invalid",
      ]}
    >
      <Demo label="Single" className="grid sm:grid-cols-2">
        <Combobox items={contacts}>
          <ComboboxInput placeholder="Find a contact" aria-label="Contact" />
          <ComboboxContent>
            <ComboboxEmpty>No contacts found.</ComboboxEmpty>
            <ComboboxList>
              {(item: string) => (
                <ComboboxItem key={item} value={item} disabled={item === "Dev Malhotra"}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <Combobox items={contacts} defaultValue={contacts[1]}>
          <ComboboxInput placeholder="Find a contact" aria-label="Contact with clear" showClear />
          <ComboboxContent>
            <ComboboxEmpty>No contacts found.</ComboboxEmpty>
            <ComboboxList>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <Combobox items={inboxGroups}>
          <ComboboxInput placeholder="Move to inbox" aria-label="Inbox" />
          <ComboboxContent>
            <ComboboxEmpty>No inboxes found.</ComboboxEmpty>
            <ComboboxList>
              {(group: (typeof inboxGroups)[number], index: number) => (
                <ComboboxGroup key={group.value} items={group.items}>
                  <ComboboxLabel>{group.value}</ComboboxLabel>
                  <ComboboxCollection>
                    {(item: string) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxCollection>
                  {index < inboxGroups.length - 1 && <ComboboxSeparator />}
                </ComboboxGroup>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <Combobox items={[] as string[]}>
          <ComboboxInput placeholder="Search archived contacts" aria-label="Archived contacts (empty)" />
          <ComboboxContent>
            <ComboboxEmpty>No archived contacts yet.</ComboboxEmpty>
            <ComboboxList>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Demo>
      <Demo label="States" className="grid sm:grid-cols-2">
        <Combobox items={contacts} defaultValue={contacts[0]}>
          <ComboboxInput aria-label="Disabled contact" disabled />
          <ComboboxContent>
            <ComboboxList>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <Combobox items={contacts}>
          <ComboboxInput placeholder="Owner is required" aria-label="Invalid contact" aria-invalid />
          <ComboboxContent>
            <ComboboxEmpty>No contacts found.</ComboboxEmpty>
            <ComboboxList>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Demo>
      <Demo label="Multiple with chips" className="grid sm:grid-cols-2">
        <TagCombobox defaultValue={["VIP", "Returning"]} />
        <TagCombobox defaultValue={["Opted out"]} invalid />
      </Demo>
      <Demo label="In context">
        <ComboboxInContext />
      </Demo>
    </Showcase>
  )
}

function TagCombobox({ defaultValue, invalid }: { defaultValue: string[]; invalid?: boolean }) {
  const anchor = useComboboxAnchor()
  return (
    <Combobox multiple autoHighlight items={tags} defaultValue={defaultValue}>
      <ComboboxChips ref={anchor}>
        <ComboboxValue>
          {(values: string[]) => (
            <>
              {values.map((value) => (
                <ComboboxChip key={value} removeLabel={`Remove ${value}`}>
                  {value}
                </ComboboxChip>
              ))}
              <ComboboxChipsInput placeholder={values.length ? "" : "Add tags"} aria-label="Tags" aria-invalid={invalid || undefined} />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No tags match.</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

function ComboboxInContext() {
  const anchor = useComboboxAnchor()
  const [recipients, setRecipients] = React.useState<string[]>(["Priya Nair", "Amara Okafor"])
  return (
    <div className="flex w-full flex-col gap-2">
      <p className="text-sm font-medium">Send “Holiday hours” to</p>
      <Combobox multiple items={contacts} value={recipients} onValueChange={(v) => setRecipients(v as string[])}>
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(values: string[]) => (
              <>
                {values.map((value) => (
                  <ComboboxChip key={value}>{value}</ComboboxChip>
                ))}
                <ComboboxChipsInput placeholder={values.length ? "" : "Add recipients"} aria-label="Recipients" />
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>No contacts found.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <div className="flex items-center justify-between">
        <span className="text-xs text-subtle tabular-nums">{recipients.length} recipients</span>
        <Button variant="primary" size="compact" disabled={recipients.length === 0}>
          <SendIcon data-icon="inline-start" />
          Send message
        </Button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Checkbox
 * ---------------------------------------------------------------------------------------------- */

function CheckboxShowcase() {
  return (
    <Showcase
      id="checkbox"
      title="Checkbox"
      summary="Independent on/off choices and multi-select lists. Indeterminate marks a partly selected parent."
      covers={["unchecked", "checked", "indeterminate", "disabled", "disabled checked", "invalid", "with description"]}
    >
      <Demo label="States">
        <CheckboxRow label="Unchecked" />
        <CheckboxRow label="Checked" defaultChecked />
        <CheckboxRow label="Indeterminate" indeterminate />
        <CheckboxRow label="Disabled" disabled />
        <CheckboxRow label="Disabled checked" disabled defaultChecked />
        <CheckboxRow label="Invalid" invalid />
      </Demo>
      <Demo label="With description">
        <CheckboxConsent />
      </Demo>
      <Demo label="In context">
        <CheckboxBulkSelect />
      </Demo>
    </Showcase>
  )
}

function CheckboxRow({
  label,
  defaultChecked,
  indeterminate,
  disabled,
  invalid,
}: {
  label: string
  defaultChecked?: boolean
  indeterminate?: boolean
  disabled?: boolean
  invalid?: boolean
}) {
  const id = React.useId()
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={id} defaultChecked={defaultChecked} indeterminate={indeterminate} disabled={disabled} aria-invalid={invalid || undefined} />
      <Label htmlFor={id} className="font-normal">
        {label}
      </Label>
    </div>
  )
}

function CheckboxConsent() {
  const id = React.useId()
  return (
    <Field orientation="horizontal" className="max-w-md">
      <Checkbox id={id} defaultChecked />
      <FieldContent>
        <FieldLabel htmlFor={id}>Customer gave marketing consent</FieldLabel>
        <FieldDescription>Required before sending promotional WhatsApp templates. Logged with today&apos;s date.</FieldDescription>
      </FieldContent>
    </Field>
  )
}

function CheckboxBulkSelect() {
  const rows = ["Priya Nair", "Tomás Ortega", "Kenji Watanabe"]
  const [selected, setSelected] = React.useState<string[]>(["Tomás Ortega"])
  const all = selected.length === rows.length
  const some = selected.length > 0 && !all
  return (
    <div className="w-full overflow-hidden rounded-lg bg-surface ring-1 ring-hairline">
      <div className="flex items-center gap-3 border-b border-border px-3 py-2">
        <Checkbox
          aria-label="Select all contacts"
          checked={all}
          indeterminate={some}
          onCheckedChange={() => setSelected(all ? [] : rows)}
        />
        <span className="text-xs font-medium text-subtle">{selected.length ? `${selected.length} selected` : "Contacts"}</span>
        {selected.length > 0 && (
          <Button variant="destructive" size="compact-sm" className="ml-auto">
            Delete contacts
          </Button>
        )}
      </div>
      {rows.map((name) => (
        <label key={name} className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-surface-muted">
          <Checkbox
            checked={selected.includes(name)}
            onCheckedChange={(c) => setSelected((s) => (c ? [...s, name] : s.filter((n) => n !== name)))}
          />
          {name}
        </label>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Radio group
 * ---------------------------------------------------------------------------------------------- */

function RadioGroupShowcase() {
  return (
    <Showcase
      id="radio-group"
      title="Radio group"
      summary="One choice from a short list. RadioCard turns each option into a whole clickable tile for plans and channels."
      covers={[
        "RadioGroupItem: unchecked",
        "RadioGroupItem: checked",
        "disabled item",
        "disabled group",
        "invalid",
        "vertical",
        "horizontal",
        "with description (choice card)",
        "RadioCard",
        "RadioCard selected",
        "RadioCard disabled",
      ]}
    >
      <Demo label="Orientation">
        <RadioList defaultValue="daily" options={[["instant", "Instant"], ["daily", "Daily digest"], ["off", "Off"]]} />
        <RadioList horizontal defaultValue="12h" options={[["12h", "12-hour"], ["24h", "24-hour"]]} />
      </Demo>
      <Demo label="States">
        <RadioList defaultValue="growth" options={[["starter", "Starter"], ["growth", "Growth"], ["scale", "Scale (contact sales)", true]]} />
        <RadioList disabled defaultValue="email" options={[["email", "Email"], ["sms", "SMS"]]} />
        <RadioList invalid options={[["yes", "Customer opted in"], ["no", "No consent recorded"]]} />
      </Demo>
      <Demo label="RadioCard">
        <RadioCardDemo />
      </Demo>
      <Demo label="In context">
        <RadioChoiceCards />
      </Demo>
    </Showcase>
  )
}

function RadioList({
  options,
  defaultValue,
  horizontal,
  disabled,
  invalid,
}: {
  options: (readonly [string, string] | readonly [string, string, boolean])[]
  defaultValue?: string
  horizontal?: boolean
  disabled?: boolean
  invalid?: boolean
}) {
  const base = React.useId()
  return (
    <RadioGroup defaultValue={defaultValue} disabled={disabled} className={horizontal ? "flex w-auto gap-4" : "w-auto"}>
      {options.map(([value, label, itemDisabled]) => (
        <Field key={value} orientation="horizontal" data-disabled={disabled || itemDisabled ? "true" : undefined}>
          <RadioGroupItem id={`${base}-${value}`} value={value} disabled={itemDisabled} aria-invalid={invalid || undefined} />
          <FieldLabel htmlFor={`${base}-${value}`} className="font-normal">
            {label}
          </FieldLabel>
        </Field>
      ))}
    </RadioGroup>
  )
}

function RadioCardDemo() {
  const [plan, setPlan] = React.useState("growth")
  const plans = [
    { value: "starter", title: "Starter", body: "1 inbox, 500 contacts", Icon: MessageSquareIcon },
    { value: "growth", title: "Growth", body: "5 inboxes, campaigns", Icon: UsersIcon },
    { value: "scale", title: "Scale", body: "Unlimited, SSO", Icon: SmartphoneIcon, disabled: true },
  ]
  return (
    <RadioGroup value={plan} onValueChange={(v) => setPlan(v as string)} className="grid gap-2 sm:grid-cols-3">
      {plans.map(({ value, title, body, Icon, disabled }) => (
        <RadioCard key={value} value={value} disabled={disabled}>
          <Icon className="mt-0.5 size-4 shrink-0 text-subtle" />
          <span className="flex flex-col">
            <span className="text-sm font-medium">{title}</span>
            <span className="text-xs text-subtle">{body}</span>
          </span>
        </RadioCard>
      ))}
    </RadioGroup>
  )
}

function RadioChoiceCards() {
  const a = React.useId()
  const b = React.useId()
  return (
    <FieldSet className="w-full">
      <FieldLegend variant="label">Who can reply to this campaign?</FieldLegend>
      <RadioGroup defaultValue="team">
        <FieldLabel htmlFor={a}>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>Whole support team</FieldTitle>
              <FieldDescription>Replies go to the shared Support inbox.</FieldDescription>
            </FieldContent>
            <RadioGroupItem value="team" id={a} />
          </Field>
        </FieldLabel>
        <FieldLabel htmlFor={b}>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>Only the sender</FieldTitle>
              <FieldDescription>Replies are assigned to Priya Nair.</FieldDescription>
            </FieldContent>
            <RadioGroupItem value="sender" id={b} />
          </Field>
        </FieldLabel>
      </RadioGroup>
    </FieldSet>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Switch
 * ---------------------------------------------------------------------------------------------- */

function SwitchShowcase() {
  return (
    <Showcase
      id="switch"
      title="Switch"
      summary="An immediate on/off setting. Use it where the change applies at once; use a checkbox inside forms that need saving."
      covers={["size: default", "size: sm", "off", "on", "disabled off", "disabled on"]}
    >
      <Demo label="Sizes">
        <SwitchRow label="Default" defaultChecked />
        <SwitchRow label="Small" size="sm" defaultChecked />
      </Demo>
      <Demo label="States">
        <SwitchRow label="Off" />
        <SwitchRow label="On" defaultChecked />
        <SwitchRow label="Disabled off" disabled />
        <SwitchRow label="Disabled on" disabled defaultChecked />
        <SwitchRow label="Small off" size="sm" />
        <SwitchRow label="Small disabled" size="sm" disabled defaultChecked />
      </Demo>
      <Demo label="In context">
        <SwitchSettings />
      </Demo>
    </Showcase>
  )
}

function SwitchRow({ label, size, defaultChecked, disabled }: { label: string; size?: "sm" | "default"; defaultChecked?: boolean; disabled?: boolean }) {
  const id = React.useId()
  return (
    <div className="flex items-center gap-2">
      <Switch id={id} size={size} defaultChecked={defaultChecked} disabled={disabled} />
      <Label htmlFor={id} className="font-normal">
        {label}
      </Label>
    </div>
  )
}

function SwitchSettings() {
  const [away, setAway] = React.useState(false)
  const ids = [React.useId(), React.useId()]
  return (
    <div className="w-full divide-y divide-border rounded-lg bg-surface ring-1 ring-hairline">
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <div>
          <Label htmlFor={ids[0]}>Away mode</Label>
          <p className="text-xs text-subtle">{away ? "Auto-reply is on: “We're closed until Monday.”" : "New chats are routed to you."}</p>
        </div>
        <Switch id={ids[0]} checked={away} onCheckedChange={setAway} />
      </div>
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <div>
          <Label htmlFor={ids[1]}>Sound on new message</Label>
          <p className="text-xs text-subtle">Plays in this browser only.</p>
        </div>
        <Switch id={ids[1]} size="sm" defaultChecked />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Slider
 * ---------------------------------------------------------------------------------------------- */

function SliderShowcase() {
  return (
    <Showcase
      id="slider"
      title="Slider"
      summary="Pick a value or a range on a scale, such as a send rate or a price band."
      covers={["single", "range", "multiple thumbs", "step", "orientation: horizontal", "orientation: vertical", "disabled", "controlled"]}
    >
      <Demo label="Values" className="grid sm:grid-cols-3">
        <Slider defaultValue={[40]} aria-label="Single" />
        <Slider defaultValue={[20, 70]} step={5} aria-label="Range" />
        <Slider defaultValue={[10, 40, 80]} step={10} aria-label="Three thumbs" />
      </Demo>
      <Demo label="Orientation and states">
        <div className="flex h-40 gap-6">
          <Slider orientation="vertical" defaultValue={[60]} aria-label="Vertical" />
          <Slider orientation="vertical" defaultValue={[25, 75]} aria-label="Vertical range" />
        </div>
        <div className="w-full sm:w-48">
          <Slider disabled defaultValue={[30]} aria-label="Disabled" />
        </div>
      </Demo>
      <Demo label="In context">
        <SliderInContext />
      </Demo>
    </Showcase>
  )
}

function SliderInContext() {
  const [rate, setRate] = React.useState([120])
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium">Campaign send rate</span>
        <span className="text-sm text-subtle tabular-nums">{rate[0]} messages / min</span>
      </div>
      <Slider value={rate} onValueChange={(v) => setRate(Array.isArray(v) ? [...v] : [v])} min={10} max={300} step={10} aria-label="Send rate" />
      <p className="text-xs text-subtle">Slower rates reduce the chance of carrier filtering.</p>
    </div>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Calendar
 * ---------------------------------------------------------------------------------------------- */

function CalendarShowcase() {
  return (
    <Showcase
      id="calendar"
      title="Calendar"
      summary="A month grid for picking a date or a date range, for scheduling campaigns and filtering reports."
      covers={["mode: single", "mode: range", "today", "outside days", "disabled dates", "captionLayout: dropdown", "week numbers"]}
    >
      <Demo label="Single and range" className="items-start">
        <CalendarSingle />
        <CalendarRange />
      </Demo>
      <Demo label="Options" className="items-start">
        <Calendar
          mode="single"
          today={TODAY}
          defaultMonth={MONTH}
          captionLayout="dropdown"
          startMonth={FIRST_MONTH}
          endMonth={LAST_MONTH}
          className="rounded-lg ring-1 ring-hairline"
        />
        <Calendar mode="single" today={TODAY} defaultMonth={MONTH} showWeekNumber showOutsideDays={false} className="rounded-lg ring-1 ring-hairline" />
      </Demo>
    </Showcase>
  )
}

function CalendarSingle() {
  const [date, setDate] = React.useState<Date | undefined>(CAMPAIGN_DAY)
  return (
    <div className="flex flex-col gap-2">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        today={TODAY}
        defaultMonth={MONTH}
        disabled={[{ before: TODAY }, { from: BLACKOUT_FROM, to: BLACKOUT_TO }]}
        className="rounded-lg ring-1 ring-hairline"
      />
      <p className="text-xs text-subtle">
        {date ? `Campaign sends ${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : "Pick a send date"}
      </p>
    </div>
  )
}

function CalendarRange() {
  const [range, setRange] = React.useState<DateRange | undefined>({ from: RANGE_START, to: RANGE_END })
  return (
    <div className="flex flex-col gap-2">
      <Calendar mode="range" selected={range} onSelect={setRange} today={TODAY} defaultMonth={MONTH} className="rounded-lg ring-1 ring-hairline" />
      <p className="text-xs text-subtle">
        {range?.from && range.to
          ? `Report: ${range.from.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${range.to.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
          : "Pick a report range"}
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Questionnaire
 * ---------------------------------------------------------------------------------------------- */

const onboardingItems = [
  { name: "goal", required: true, choices: [{ value: "support" }, { value: "marketing" }, { value: "both" }] },
  { name: "channels", choices: [{ value: "whatsapp" }, { value: "sms" }, { value: "email" }] },
  { name: "team", required: true, choices: [{ value: "solo" }, { value: "small" }, { value: "large", disabled: true }] },
] as const

function QuestionnaireShowcase() {
  return (
    <Showcase
      id="questionnaire"
      title="Questionnaire"
      summary="A step-by-step set of questions with single or multiple choices, a free-text answer, keyboard shortcuts and progress."
      covers={[
        "single choice (radio)",
        "multiple choice (checkbox)",
        "free-text input",
        "required (error on Next)",
        "disabled choice",
        "with description",
        "shortcuts: letters",
        "progress",
        "previous / skip / next / submit",
      ]}
    >
      <Demo label="In context">
        <QuestionnaireOnboarding />
      </Demo>
    </Showcase>
  )
}

function QuestionnaireOnboarding() {
  const [done, setDone] = React.useState<string | null>(null)
  if (done) {
    return (
      <div className="flex w-full flex-col items-start gap-3">
        <p className="text-sm text-success-text">Workspace set up: {done}</p>
        <Button variant="outline" size="compact" onClick={() => setDone(null)}>
          Start again
        </Button>
      </div>
    )
  }
  return (
    <Questionnaire
      defaultItem="goal"
      items={onboardingItems}
      shortcuts="letters"
      onSubmit={(e) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        setDone(`${data.get("goal") ?? "—"} · ${data.getAll("channels").join(", ") || "no channels"} · ${data.get("team") ?? "—"}`)
      }}
    >
      <QuestionnaireProgress />
      <QuestionnaireItem name="goal" required>
        <QuestionnaireTitle>What will you use Relay for first?</QuestionnaireTitle>
        <QuestionnaireDescription>Pick one, or tell us in your own words.</QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="support">
            <span className="font-medium">Customer support</span>
            <QuestionnaireChoiceDescription>Answer questions from one shared inbox.</QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
          <QuestionnaireChoice value="marketing">
            <span className="font-medium">Campaigns</span>
            <QuestionnaireChoiceDescription>Send offers to opted-in contacts.</QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
          <QuestionnaireChoice value="both">
            <span className="font-medium">Both</span>
            <QuestionnaireChoiceDescription>Support and campaigns together.</QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
          <QuestionnaireInput aria-label="Something else" placeholder="Something else…" />
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="channels" multiple>
        <QuestionnaireTitle>Which channels should we connect?</QuestionnaireTitle>
        <QuestionnaireDescription>Select all that apply, or skip for now.</QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="whatsapp">WhatsApp</QuestionnaireChoice>
          <QuestionnaireChoice value="sms">SMS</QuestionnaireChoice>
          <QuestionnaireChoice value="email">Email</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="team" required>
        <QuestionnaireTitle>How many teammates will answer messages?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="solo">Just me</QuestionnaireChoice>
          <QuestionnaireChoice value="small">2 to 10</QuestionnaireChoice>
          <QuestionnaireChoice value="large" disabled>
            More than 10 (Scale plan)
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireSkip />
        <QuestionnaireNext />
        <QuestionnaireSubmit>Create workspace</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Group
 * ---------------------------------------------------------------------------------------------- */

export function FormsShowcase() {
  return (
    <>
      <InputShowcase />
      <TextareaShowcase />
      <LabelShowcase />
      <FieldShowcase />
      <FormShowcase />
      <InputGroupShowcase />
      <InputOTPShowcase />
      <NativeSelectShowcase />
      <SelectShowcase />
      <ComboboxShowcase />
      <CheckboxShowcase />
      <RadioGroupShowcase />
      <SwitchShowcase />
      <SliderShowcase />
      <CalendarShowcase />
      <QuestionnaireShowcase />
    </>
  )
}
