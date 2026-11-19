"use client"

import * as React from "react"
import {
  AlertCircleIcon,
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  ArchiveIcon,
  ArrowRightIcon,
  BellIcon,
  BoldIcon,
  CheckCircle2Icon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  DownloadIcon,
  FileTextIcon,
  ImageIcon,
  InboxIcon,
  ItalicIcon,
  MailIcon,
  MegaphoneIcon,
  MessageSquareIcon,
  MoreHorizontalIcon,
  PinIcon,
  PlusIcon,
  SearchIcon,
  SendIcon,
  SparklesIcon,
  StarIcon,
  TrashIcon,
  UnderlineIcon,
  UserPlusIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react"

import { Demo, Showcase } from "@/components/showcase/frame"
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@/components/ui/button-group"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import { SegmentedControl, SegmentedControlItem } from "@/components/ui/segmented-control"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

/** Inline stand-in photo for the loaded-image avatar state (the repo ships no image assets). */
const AVATAR_PHOTO =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c9bcff"/><stop offset="1" stop-color="#7c5cff"/></linearGradient></defs><rect width="64" height="64" fill="url(#g)"/><circle cx="32" cy="26" r="11" fill="#f4f1ff"/><path d="M12 60c2-12 10-18 20-18s18 6 20 18z" fill="#f4f1ff"/></svg>`
  )

export function ActionsShowcase() {
  return (
    <>
      <ButtonShowcase />
      <ButtonGroupShowcase />
      <ToggleShowcase />
      <ToggleGroupShowcase />
      <SegmentedControlShowcase />
      <BadgeShowcase />
      <KbdShowcase />
      <AvatarShowcase />
      <SpinnerShowcase />
      <SkeletonShowcase />
      <ProgressShowcase />
      <SeparatorShowcase />
      <AspectRatioShowcase />
      <CardShowcase />
      <ItemShowcase />
      <EmptyShowcase />
      <AlertShowcase />
      <MarkerShowcase />
    </>
  )
}

/* ------------------------------------------------------------------ Button */

function ButtonShowcase() {
  return (
    <Showcase
      id="button"
      title="Button"
      summary="Triggers an action. Use primary for the one main action in a view, elevated for actions beside it, ghost for low-emphasis icon actions and gloss pills only on marketing pages."
      covers={[
        "variant: default",
        "variant: primary",
        "variant: elevated",
        "variant: outline",
        "variant: secondary",
        "variant: ghost",
        "variant: destructive",
        "variant: link",
        "variant: gloss",
        "variant: gloss-solid",
        "size: xs",
        "size: sm",
        "size: default",
        "size: lg",
        "size: pill",
        "size: compact-sm",
        "size: compact",
        "size: compact-md",
        "size: icon-xs",
        "size: icon-sm",
        "size: icon",
        "size: icon-lg",
        "size: icon-compact-sm",
        "size: icon-compact",
        "size: icon-compact-md",
        "icon start",
        "icon end",
        "loading",
        "disabled",
        "invalid",
        "as link",
      ]}
    >
      <Demo label="Variants">
        <Button>Start free trial</Button>
        <Button variant="primary">Send message</Button>
        <Button variant="elevated">Save template</Button>
        <Button variant="outline">Export CSV</Button>
        <Button variant="secondary">Duplicate</Button>
        <Button variant="ghost">Cancel</Button>
        <Button variant="destructive">Delete contact</Button>
        <Button variant="link">View delivery report</Button>
      </Demo>
      <Demo label="Gloss (size pill)">
        <Button variant="gloss" size="pill">
          Start free trial
        </Button>
        <Button variant="gloss-solid" size="pill">
          Talk to sales
        </Button>
      </Demo>
      <Demo label="Sizes">
        <Button variant="elevated" size="xs">
          xs
        </Button>
        <Button variant="elevated" size="sm">
          sm
        </Button>
        <Button variant="elevated">default</Button>
        <Button variant="elevated" size="lg">
          lg
        </Button>
        <Button variant="elevated" size="pill">
          pill
        </Button>
      </Demo>
      <Demo label="Compact sizes (dashboards)">
        <Button variant="elevated" size="compact-sm">
          compact-sm
        </Button>
        <Button variant="elevated" size="compact">
          compact
        </Button>
        <Button variant="elevated" size="compact-md">
          compact-md
        </Button>
      </Demo>
      <Demo label="Icon sizes">
        <Button variant="elevated" size="icon-xs" aria-label="Pin conversation (icon-xs)">
          <PinIcon />
        </Button>
        <Button variant="elevated" size="icon-sm" aria-label="Pin conversation (icon-sm)">
          <PinIcon />
        </Button>
        <Button variant="elevated" size="icon" aria-label="Pin conversation (icon)">
          <PinIcon />
        </Button>
        <Button variant="elevated" size="icon-lg" aria-label="Pin conversation (icon-lg)">
          <PinIcon />
        </Button>
        <Separator orientation="vertical" className="h-6 self-center" />
        <Button variant="ghost" size="icon-compact-sm" aria-label="More actions (icon-compact-sm)">
          <MoreHorizontalIcon />
        </Button>
        <Button variant="ghost" size="icon-compact" aria-label="More actions (icon-compact)">
          <MoreHorizontalIcon />
        </Button>
        <Button variant="ghost" size="icon-compact-md" aria-label="More actions (icon-compact-md)">
          <MoreHorizontalIcon />
        </Button>
      </Demo>
      <Demo label="With icon">
        <Button variant="primary">
          <SendIcon data-icon="inline-start" />
          Send message
        </Button>
        <Button variant="elevated">
          Next step
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
        <Button variant="outline" size="sm">
          <DownloadIcon data-icon="inline-start" />
          Export CSV
        </Button>
        <Button variant="destructive" size="compact">
          <TrashIcon data-icon="inline-start" />
          Delete contact
        </Button>
      </Demo>
      <Demo label="States">
        <LoadingButton />
        <Button variant="primary" disabled>
          <Spinner data-icon="inline-start" />
          Sending…
        </Button>
        <Button variant="elevated" disabled>
          Save template
        </Button>
        <Button variant="outline" aria-invalid="true">
          Choose sender number
        </Button>
        <Button variant="link" render={<a href="#button" />} nativeButton={false}>
          Open billing
        </Button>
      </Demo>
      <Demo label="In context">
        <div className="flex w-full items-center justify-between gap-3 rounded-lg bg-surface p-3 shadow-card dark:shadow-card-dark">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Spring sale reminder</p>
            <p className="text-xs text-subtle">Draft · 1,248 recipients</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="elevated" size="compact">
              Preview
            </Button>
            <Button variant="primary" size="compact">
              Schedule campaign
            </Button>
          </div>
        </div>
      </Demo>
    </Showcase>
  )
}

function LoadingButton() {
  const [loading, setLoading] = React.useState(false)
  React.useEffect(() => {
    if (!loading) return
    const t = setTimeout(() => setLoading(false), 1800)
    return () => clearTimeout(t)
  }, [loading])
  return (
    <Button variant="primary" disabled={loading} onClick={() => setLoading(true)}>
      {loading ? <Spinner data-icon="inline-start" /> : <CheckIcon data-icon="inline-start" />}
      {loading ? "Saving…" : "Save (click me)"}
    </Button>
  )
}

/* ------------------------------------------------------------ Button group */

function ButtonGroupShowcase() {
  return (
    <Showcase
      id="button-group"
      title="Button group"
      summary="Joins related buttons into one control, such as pagination, a split action or a set of formatting tools."
      covers={["orientation: horizontal", "orientation: vertical", "ButtonGroupText", "ButtonGroupSeparator", "nested groups", "split button", "disabled"]}
    >
      <Demo label="Horizontal">
        <ButtonGroup>
          <Button variant="outline">Inbox</Button>
          <Button variant="outline">Assigned to me</Button>
          <Button variant="outline">Unassigned</Button>
        </ButtonGroup>
      </Demo>
      <Demo label="Vertical">
        <ButtonGroup orientation="vertical" aria-label="Zoom">
          <Button variant="outline" size="icon" aria-label="Zoom in">
            <PlusIcon />
          </Button>
          <Button variant="outline" size="icon" aria-label="Zoom out">
            <span className="text-base leading-none">−</span>
          </Button>
        </ButtonGroup>
        <ButtonGroup orientation="vertical">
          <Button variant="outline" size="sm">Today</Button>
          <Button variant="outline" size="sm">This week</Button>
          <Button variant="outline" size="sm">This month</Button>
        </ButtonGroup>
      </Demo>
      <Demo label="Text and separator">
        <ButtonGroup>
          <ButtonGroupText>
            <UsersIcon />
            Seats
          </ButtonGroupText>
          <Button variant="outline">5 of 10 used</Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="secondary">
            <SendIcon data-icon="inline-start" />
            Send now
          </Button>
          <ButtonGroupSeparator />
          <Button variant="secondary" size="icon" aria-label="More send options">
            <ChevronDownIcon />
          </Button>
        </ButtonGroup>
      </Demo>
      <Demo label="States">
        <ButtonGroup>
          <Button variant="outline" size="sm" disabled>
            <ChevronLeftIcon data-icon="inline-start" />
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
            <ChevronRightIcon data-icon="inline-end" />
          </Button>
        </ButtonGroup>
      </Demo>
      <Demo label="In context (nested toolbar)">
        <ButtonGroup>
          <ButtonGroup>
            <Button variant="outline" size="sm" aria-label="Archive">
              <ArchiveIcon />
            </Button>
            <Button variant="outline" size="sm" aria-label="Copy link">
              <CopyIcon />
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="outline" size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
          </ButtonGroup>
        </ButtonGroup>
      </Demo>
    </Showcase>
  )
}

/* ------------------------------------------------------------------ Toggle */

function ToggleShowcase() {
  const [starred, setStarred] = React.useState(true)
  const [bold, setBold] = React.useState(false)
  return (
    <Showcase
      id="toggle"
      title="Toggle"
      summary="A two-state button that stays pressed, for on/off tools such as bold text or starring a conversation."
      covers={["variant: default", "variant: outline", "size: sm", "size: default", "size: lg", "pressed", "unpressed", "with text", "disabled"]}
    >
      <Demo label="Variants">
        <Toggle aria-label="Bold" pressed={bold} onPressedChange={setBold}>
          <BoldIcon />
        </Toggle>
        <Toggle variant="outline" aria-label="Italic">
          <ItalicIcon />
        </Toggle>
      </Demo>
      <Demo label="Sizes">
        <Toggle variant="outline" size="sm" aria-label="Underline (sm)">
          <UnderlineIcon />
        </Toggle>
        <Toggle variant="outline" aria-label="Underline (default)">
          <UnderlineIcon />
        </Toggle>
        <Toggle variant="outline" size="lg" aria-label="Underline (lg)">
          <UnderlineIcon />
        </Toggle>
      </Demo>
      <Demo label="States">
        <Toggle variant="outline" defaultPressed aria-label="Bold, pressed">
          <BoldIcon />
        </Toggle>
        <Toggle variant="outline" aria-label="Bold, not pressed">
          <BoldIcon />
        </Toggle>
        <Toggle variant="outline" disabled aria-label="Bold, disabled">
          <BoldIcon />
        </Toggle>
        <Toggle variant="outline" disabled defaultPressed aria-label="Italic, pressed and disabled">
          <ItalicIcon />
        </Toggle>
      </Demo>
      <Demo label="In context">
        <Toggle variant="outline" pressed={starred} onPressedChange={setStarred}>
          <StarIcon data-icon="inline-start" className={starred ? "fill-current" : undefined} />
          {starred ? "Starred" : "Star conversation"}
        </Toggle>
        <Toggle variant="outline" size="sm">
          <BellIcon data-icon="inline-start" />
          Notify me
        </Toggle>
      </Demo>
    </Showcase>
  )
}

/* ------------------------------------------------------------ Toggle group */

function ToggleGroupShowcase() {
  const [align, setAlign] = React.useState<string[]>(["left"])
  const [format, setFormat] = React.useState<string[]>(["bold"])
  return (
    <Showcase
      id="toggle-group"
      title="Toggle group"
      summary="A set of toggles where one or several can be on, such as text alignment or channel filters."
      covers={[
        "variant: default",
        "variant: outline",
        "size: sm",
        "size: default",
        "size: lg",
        "single",
        "multiple",
        "spacing: 0",
        "spacing: 2",
        "orientation: horizontal",
        "orientation: vertical",
        "disabled",
      ]}
    >
      <Demo label="Single (default variant)">
        <ToggleGroup value={align} onValueChange={(v) => setAlign(v as string[])} aria-label="Text alignment">
          <ToggleGroupItem value="left" aria-label="Align left">
            <AlignLeftIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Align center">
            <AlignCenterIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Align right">
            <AlignRightIcon />
          </ToggleGroupItem>
        </ToggleGroup>
      </Demo>
      <Demo label="Multiple (outline, spacing 0)">
        <ToggleGroup
          multiple
          variant="outline"
          spacing={0}
          value={format}
          onValueChange={(v) => setFormat(v as string[])}
          aria-label="Formatting"
        >
          <ToggleGroupItem value="bold" aria-label="Bold">
            <BoldIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            <ItalicIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline">
            <UnderlineIcon />
          </ToggleGroupItem>
        </ToggleGroup>
      </Demo>
      <Demo label="Sizes">
        {(["sm", "default", "lg"] as const).map((size) => (
          <ToggleGroup key={size} variant="outline" size={size} spacing={0} defaultValue={["sms"]} aria-label={`Channel (${size})`}>
            <ToggleGroupItem value="sms">SMS</ToggleGroupItem>
            <ToggleGroupItem value="email">Email</ToggleGroupItem>
          </ToggleGroup>
        ))}
      </Demo>
      <Demo label="Vertical and disabled">
        <ToggleGroup orientation="vertical" variant="outline" spacing={0} defaultValue={["all"]} aria-label="Inbox filter">
          <ToggleGroupItem value="all">All</ToggleGroupItem>
          <ToggleGroupItem value="unread">Unread</ToggleGroupItem>
          <ToggleGroupItem value="mentions">Mentions</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup variant="outline" disabled defaultValue={["week"]} aria-label="Range (disabled)">
          <ToggleGroupItem value="week">Week</ToggleGroupItem>
          <ToggleGroupItem value="month">Month</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup variant="outline" defaultValue={["whatsapp"]} aria-label="Channels with one disabled">
          <ToggleGroupItem value="whatsapp">WhatsApp</ToggleGroupItem>
          <ToggleGroupItem value="voice" disabled>
            Voice
          </ToggleGroupItem>
        </ToggleGroup>
      </Demo>
      <Demo label="In context">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Show</span>
          <ToggleGroup multiple variant="outline" size="sm" defaultValue={["whatsapp", "sms"]} aria-label="Channels">
            <ToggleGroupItem value="whatsapp">
              <MessageSquareIcon data-icon="inline-start" />
              WhatsApp
            </ToggleGroupItem>
            <ToggleGroupItem value="sms">SMS</ToggleGroupItem>
            <ToggleGroupItem value="email">
              <MailIcon data-icon="inline-start" />
              Email
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </Demo>
    </Showcase>
  )
}

/* -------------------------------------------------------- Segmented control */

function SegmentedControlShowcase() {
  const [range, setRange] = React.useState("7d")
  const [view, setView] = React.useState("list")
  const [status, setStatus] = React.useState("sent")
  return (
    <Showcase
      id="segmented-control"
      title="Segmented control"
      summary="Two to four mutually exclusive options in a toolbar. Always one segment is selected; clicking it again does nothing."
      covers={["selected", "unselected", "two segments", "four segments", "disabled segment", "in context"]}
    >
      <Demo label="Four segments">
        <SegmentedControl value={range} onValueChange={setRange} aria-label="Date range">
          <SegmentedControlItem value="24h">24h</SegmentedControlItem>
          <SegmentedControlItem value="7d">7 days</SegmentedControlItem>
          <SegmentedControlItem value="30d">30 days</SegmentedControlItem>
          <SegmentedControlItem value="90d">90 days</SegmentedControlItem>
        </SegmentedControl>
      </Demo>
      <Demo label="States">
        <SegmentedControl value={view} onValueChange={setView} aria-label="Template view">
          <SegmentedControlItem value="list">List</SegmentedControlItem>
          <SegmentedControlItem value="grid">Grid</SegmentedControlItem>
        </SegmentedControl>
        <SegmentedControl value={status} onValueChange={setStatus} aria-label="Campaign status">
          <SegmentedControlItem value="sent">Sent</SegmentedControlItem>
          <SegmentedControlItem value="scheduled">Scheduled</SegmentedControlItem>
          <SegmentedControlItem value="archived" disabled>
            Archived
          </SegmentedControlItem>
        </SegmentedControl>
      </Demo>
      <Demo label="In context">
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium">Messages delivered</p>
          <SegmentedControl value={range} onValueChange={setRange} aria-label="Chart range">
            <SegmentedControlItem value="24h">24h</SegmentedControlItem>
            <SegmentedControlItem value="7d">7d</SegmentedControlItem>
            <SegmentedControlItem value="30d">30d</SegmentedControlItem>
          </SegmentedControl>
        </div>
      </Demo>
    </Showcase>
  )
}

/* ------------------------------------------------------------------- Badge */

function BadgeShowcase() {
  return (
    <Showcase
      id="badge"
      title="Badge"
      summary="A short label for status or category. Use the subtle tags in product UI: subtle for neutral, subtle-info for recommendations, subtle-warning for attention."
      covers={[
        "variant: default",
        "variant: secondary",
        "variant: destructive",
        "variant: outline",
        "variant: ghost",
        "variant: link",
        "variant: subtle",
        "variant: subtle-info",
        "variant: subtle-warning",
        "icon start",
        "icon end",
        "as link",
        "invalid",
      ]}
    >
      <Demo label="Variants">
        <Badge>Approved</Badge>
        <Badge variant="secondary">Draft</Badge>
        <Badge variant="destructive">Opted out</Badge>
        <Badge variant="outline">Pending review</Badge>
        <Badge variant="ghost">Archived</Badge>
        <Badge variant="link" render={<a href="#badge" />}>
          View template
        </Badge>
      </Demo>
      <Demo label="Subtle tags">
        <Badge variant="subtle">Optional</Badge>
        <Badge variant="subtle-info">Recommended</Badge>
        <Badge variant="subtle-warning">Sandbox</Badge>
      </Demo>
      <Demo label="With icon and states">
        <Badge variant="secondary">
          <CheckCircle2Icon data-icon="inline-start" />
          Delivered
        </Badge>
        <Badge variant="outline">
          Marketing
          <ChevronDownIcon data-icon="inline-end" />
        </Badge>
        <Badge variant="outline" render={<a href="#badge" />}>
          Growth plan
          <ArrowRightIcon data-icon="inline-end" />
        </Badge>
        <Badge variant="outline" aria-invalid="true">
          Missing variable
        </Badge>
      </Demo>
      <Demo label="In context">
        <div className="flex w-full items-center justify-between gap-3 rounded-lg bg-surface px-3 py-2 ring-1 ring-hairline">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-sm font-medium">order_shipped_v2</span>
            <Badge variant="subtle">Utility</Badge>
          </div>
          <Badge variant="subtle-warning">Pending review</Badge>
        </div>
      </Demo>
    </Showcase>
  )
}

/* --------------------------------------------------------------------- Kbd */

function KbdShowcase() {
  return (
    <Showcase
      id="kbd"
      title="Kbd"
      summary="Shows a keyboard key or shortcut, in menus, tooltips, hints and docs."
      covers={["single key", "KbdGroup", "with icon", "in a button", "inline in text"]}
    >
      <Demo label="Keys">
        <Kbd>⌘</Kbd>
        <Kbd>Shift</Kbd>
        <Kbd>Esc</Kbd>
        <Kbd>Enter</Kbd>
        <Kbd>
          <SearchIcon />
        </Kbd>
      </Demo>
      <Demo label="Groups">
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <span className="text-xs text-subtle">+</span>
          <Kbd>Enter</Kbd>
        </KbdGroup>
      </Demo>
      <Demo label="In context">
        <Button variant="elevated" size="compact">
          <SearchIcon data-icon="inline-start" />
          Search contacts
          <Kbd className="ml-1">/</Kbd>
        </Button>
        <p className="text-sm text-muted-foreground">
          Press{" "}
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>Enter</Kbd>
          </KbdGroup>{" "}
          to send the reply.
        </p>
      </Demo>
    </Showcase>
  )
}

/* ------------------------------------------------------------------ Avatar */

function AvatarShowcase() {
  return (
    <Showcase
      id="avatar"
      title="Avatar"
      summary="A person's photo with initials as the fallback, alone, with a status badge or stacked in a group."
      covers={["size: sm", "size: default", "size: lg", "image", "fallback (initials)", "AvatarBadge", "badge with icon", "AvatarGroup", "AvatarGroupCount"]}
    >
      <Demo label="Sizes (image)">
        <Avatar size="sm">
          <AvatarImage src={AVATAR_PHOTO} alt="Priya Nair" />
          <AvatarFallback>PN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src={AVATAR_PHOTO} alt="Priya Nair" />
          <AvatarFallback>PN</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage src={AVATAR_PHOTO} alt="Priya Nair" />
          <AvatarFallback>PN</AvatarFallback>
        </Avatar>
      </Demo>
      <Demo label="Fallback (initials)">
        <Avatar size="sm">
          <AvatarFallback>TO</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>TO</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarFallback>TO</AvatarFallback>
        </Avatar>
      </Demo>
      <Demo label="With badge">
        <Avatar size="sm">
          <AvatarFallback>AK</AvatarFallback>
          <AvatarBadge />
        </Avatar>
        <Avatar>
          <AvatarFallback>AK</AvatarFallback>
          <AvatarBadge />
        </Avatar>
        <Avatar size="lg">
          <AvatarImage src={AVATAR_PHOTO} alt="Amara Kole" />
          <AvatarFallback>AK</AvatarFallback>
          <AvatarBadge>
            <CheckIcon />
          </AvatarBadge>
        </Avatar>
      </Demo>
      <Demo label="Groups">
        <AvatarGroup>
          <Avatar>
            <AvatarFallback>PN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>TO</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>LM</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+4</AvatarGroupCount>
        </AvatarGroup>
        <AvatarGroup>
          <Avatar size="lg">
            <AvatarImage src={AVATAR_PHOTO} alt="Priya Nair" />
            <AvatarFallback>PN</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback>TO</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>
            <PlusIcon />
          </AvatarGroupCount>
        </AvatarGroup>
        <AvatarGroup>
          <Avatar size="sm">
            <AvatarFallback>PN</AvatarFallback>
          </Avatar>
          <Avatar size="sm">
            <AvatarFallback>TO</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+9</AvatarGroupCount>
        </AvatarGroup>
      </Demo>
      <Demo label="In context">
        <div className="flex w-full items-center gap-3 rounded-lg bg-surface p-3 ring-1 ring-hairline">
          <Avatar>
            <AvatarFallback>TO</AvatarFallback>
            <AvatarBadge />
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">Tomás Ortega</p>
            <p className="truncate text-xs text-subtle">Support · online</p>
          </div>
          <Button variant="elevated" size="compact">
            Assign
          </Button>
        </div>
      </Demo>
    </Showcase>
  )
}

/* ----------------------------------------------------------------- Spinner */

function SpinnerShowcase() {
  return (
    <Showcase
      id="spinner"
      title="Spinner"
      summary="An indeterminate loading indicator for short waits, inside buttons, fields and inline status lines."
      covers={["sizes (size-3 to size-6)", "in a button", "in a badge", "inline status"]}
    >
      <Demo label="Sizes">
        <Spinner className="size-3" />
        <Spinner />
        <Spinner className="size-5" />
        <Spinner className="size-6 text-muted-foreground" />
      </Demo>
      <Demo label="In context">
        <Button variant="primary" disabled>
          <Spinner data-icon="inline-start" />
          Importing contacts…
        </Button>
        <Badge variant="secondary">
          <Spinner data-icon="inline-start" />
          Syncing
        </Badge>
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner />
          Loading conversations
        </span>
      </Demo>
    </Showcase>
  )
}

/* ---------------------------------------------------------------- Skeleton */

function SkeletonShowcase() {
  return (
    <Showcase
      id="skeleton"
      title="Skeleton"
      summary="A placeholder in the shape of content that is still loading, so the layout doesn't jump when it arrives."
      covers={["text lines", "avatar (round)", "card", "list row"]}
    >
      <Demo label="Shapes">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-8 w-24" />
      </Demo>
      <Demo label="In context (loading contact list)">
        <div className="flex w-full flex-col gap-3 rounded-lg bg-surface p-3 ring-1 ring-hairline" aria-busy="true" aria-label="Loading contacts">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-full" />
              <div className="flex flex-1 flex-col gap-1.5">
                <Skeleton className="h-3.5 w-1/3" />
                <Skeleton className="h-3 w-2/3" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </Demo>
    </Showcase>
  )
}

/* ---------------------------------------------------------------- Progress */

function ProgressShowcase() {
  const [value, setValue] = React.useState(40)
  return (
    <Showcase
      id="progress"
      title="Progress"
      summary="Shows how far a task has got, such as a contact import or a monthly message quota."
      covers={["0%", "25%", "60%", "100%", "indeterminate", "with label and value", "interactive"]}
    >
      <Demo label="Values" className="flex-col items-stretch">
        <Progress value={0} aria-label="0 percent" />
        <Progress value={25} aria-label="25 percent" />
        <Progress value={60} aria-label="60 percent" />
        <Progress value={100} aria-label="100 percent" />
      </Demo>
      <Demo label="Indeterminate" className="flex-col items-stretch">
        <Progress value={null}>
          <ProgressLabel>Preparing export…</ProgressLabel>
        </Progress>
      </Demo>
      <Demo label="With label and value" className="flex-col items-stretch">
        <Progress value={value}>
          <ProgressLabel>Importing contacts.csv</ProgressLabel>
          <ProgressValue />
        </Progress>
        <div className="flex gap-2">
          <Button variant="elevated" size="compact-sm" onClick={() => setValue((v) => Math.max(0, v - 20))}>
            −20%
          </Button>
          <Button variant="elevated" size="compact-sm" onClick={() => setValue((v) => Math.min(100, v + 20))}>
            +20%
          </Button>
        </div>
      </Demo>
      <Demo label="In context">
        <div className="w-full rounded-lg bg-surface p-3 ring-1 ring-hairline">
          <Progress value={82}>
            <ProgressLabel className="text-[0.8125rem]">Messages this month</ProgressLabel>
            <ProgressValue>{() => "8,200 of 10,000"}</ProgressValue>
          </Progress>
          <p className="mt-2 text-xs text-subtle">Resets on Dec 1. Upgrade to Growth for 50,000.</p>
        </div>
      </Demo>
    </Showcase>
  )
}

/* --------------------------------------------------------------- Separator */

function SeparatorShowcase() {
  return (
    <Showcase
      id="separator"
      title="Separator"
      summary="A hairline that divides content, horizontally between sections or vertically between inline items."
      covers={["orientation: horizontal", "orientation: vertical"]}
    >
      <Demo label="Horizontal" className="flex-col items-stretch">
        <div>
          <p className="text-sm font-medium">Workspace</p>
          <p className="text-sm text-muted-foreground">Relay · Ortega Bakery</p>
        </div>
        <Separator />
        <div>
          <p className="text-sm font-medium">Plan</p>
          <p className="text-sm text-muted-foreground">Growth, billed monthly</p>
        </div>
      </Demo>
      <Demo label="Vertical">
        <div className="flex h-5 items-center gap-3 text-sm">
          <span>Inbox</span>
          <Separator orientation="vertical" />
          <span>Contacts</span>
          <Separator orientation="vertical" />
          <span>Templates</span>
          <Separator orientation="vertical" />
          <span>Campaigns</span>
        </div>
      </Demo>
    </Showcase>
  )
}

/* ------------------------------------------------------------ Aspect ratio */

function AspectRatioShowcase() {
  return (
    <Showcase
      id="aspect-ratio"
      title="Aspect ratio"
      summary="Keeps media at a fixed ratio as its width changes, for image headers, video previews and thumbnails."
      covers={["ratio: 16/9", "ratio: 4/3", "ratio: 1"]}
    >
      <Demo label="Ratios" className="grid grid-cols-3 items-start">
        {[
          { r: 16 / 9, label: "16 : 9" },
          { r: 4 / 3, label: "4 : 3" },
          { r: 1, label: "1 : 1" },
        ].map(({ r, label }) => (
          <AspectRatio key={label} ratio={r} className="overflow-hidden rounded-lg bg-muted ring-1 ring-hairline">
            <div className="flex size-full flex-col items-center justify-center gap-1 text-muted-foreground">
              <ImageIcon className="size-5" />
              <span className="text-xs">{label}</span>
            </div>
          </AspectRatio>
        ))}
      </Demo>
      <Demo label="In context (template header image)">
        <div className="w-full max-w-xs overflow-hidden rounded-lg bg-surface shadow-card dark:shadow-card-dark">
          <AspectRatio ratio={16 / 9} className="bg-linear-to-br from-brand/25 to-info/15">
            <div className="absolute inset-0 flex items-center justify-center">
              <MegaphoneIcon className="size-8 text-brand-text" />
            </div>
          </AspectRatio>
          <div className="p-3">
            <p className="text-sm font-medium">Black Friday: 30% off</p>
            <p className="text-xs text-subtle">WhatsApp · Marketing template</p>
          </div>
        </div>
      </Demo>
    </Showcase>
  )
}

/* -------------------------------------------------------------------- Card */

function CardShowcase() {
  return (
    <Showcase
      id="card"
      title="Card"
      summary="A raised surface grouping related content, with an optional header, action and footer."
      covers={["size: default", "size: sm", "CardHeader", "CardTitle", "CardDescription", "CardAction", "CardContent", "CardFooter", "header with border"]}
    >
      <Demo label="Default size" className="items-stretch">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Message templates</CardTitle>
            <CardDescription>Approved templates you can send outside the 24-hour window.</CardDescription>
            <CardAction>
              <Button variant="elevated" size="compact">
                <PlusIcon data-icon="inline-start" />
                New template
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold tabular-nums">12</span>
              <span className="text-sm text-muted-foreground">approved · 2 pending review</span>
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button variant="ghost" size="compact">
              View all
            </Button>
          </CardFooter>
        </Card>
      </Demo>
      <Demo label="Size sm and bordered header" className="grid grid-cols-1 items-stretch sm:grid-cols-2">
        <Card size="sm">
          <CardHeader>
            <CardTitle>Delivery rate</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold tabular-nums">98.4%</p>
            <p className="text-xs text-success-text">+1.2% vs previous week</p>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardHeader className="border-b">
            <CardTitle>Billing</CardTitle>
            <CardDescription>Growth plan</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Next invoice $49.00 on Dec 1, 2026.</p>
          </CardContent>
        </Card>
      </Demo>
    </Showcase>
  )
}

/* -------------------------------------------------------------------- Item */

function ItemShowcase() {
  return (
    <Showcase
      id="item"
      title="Item"
      summary="A flexible row with media, title, description and actions, for lists of contacts, files, integrations or settings."
      covers={[
        "variant: default",
        "variant: outline",
        "variant: muted",
        "size: default",
        "size: sm",
        "size: xs",
        "media: icon",
        "media: image",
        "media: default (avatar)",
        "ItemHeader",
        "ItemFooter",
        "ItemGroup",
        "ItemSeparator",
        "as link",
      ]}
    >
      <Demo label="Variants" className="flex-col items-stretch">
        <Item>
          <ItemMedia variant="icon">
            <InboxIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Shared inbox</ItemTitle>
            <ItemDescription>Default variant, no border.</ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="outline">
          <ItemMedia variant="icon">
            <MessageSquareIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>WhatsApp Business</ItemTitle>
            <ItemDescription>Connected · +1 415 555 0142</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="elevated" size="compact">
              Manage
            </Button>
          </ItemActions>
        </Item>
        <Item variant="muted">
          <ItemMedia variant="icon">
            <MailIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Email channel</ItemTitle>
            <ItemDescription>Not connected yet.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="primary" size="compact">
              Connect
            </Button>
          </ItemActions>
        </Item>
      </Demo>
      <Demo label="Sizes" className="flex-col items-stretch">
        {(["default", "sm", "xs"] as const).map((size) => (
          <Item key={size} variant="outline" size={size}>
            <ItemMedia variant="image">
              <div className="flex size-full items-center justify-center bg-muted text-muted-foreground">
                <FileTextIcon className="size-4" />
              </div>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>contacts-november.csv</ItemTitle>
              <ItemDescription>size {size} · 2,314 rows</ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </Demo>
      <Demo label="Header, footer and link" className="flex-col items-stretch">
        <Item variant="outline">
          <ItemHeader>
            <Badge variant="subtle-info">Recommended</Badge>
            <span className="text-xs text-subtle">Updated Nov 18</span>
          </ItemHeader>
          <ItemMedia>
            <Avatar size="sm">
              <AvatarFallback>LM</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Welcome series</ItemTitle>
            <ItemDescription>Three messages over the first week, written by Lena Mbeki.</ItemDescription>
          </ItemContent>
          <ItemFooter>
            <span className="text-xs text-muted-foreground">Open rate 64%</span>
            <Button variant="ghost" size="compact-sm">
              Duplicate
            </Button>
          </ItemFooter>
        </Item>
        <Item variant="outline" render={<a href="#item" />}>
          <ItemMedia variant="icon">
            <ZapIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Automations</ItemTitle>
            <ItemDescription>Rendered as a link: hover to see the wash.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <ChevronRightIcon className="size-4 text-muted-foreground" />
          </ItemActions>
        </Item>
      </Demo>
      <Demo label="In context (teammates list)" className="flex-col items-stretch">
        <div className="rounded-lg bg-surface p-1 ring-1 ring-hairline">
          <ItemGroup className="gap-0">
            {[
              { name: "Priya Nair", role: "Owner", initials: "PN" },
              { name: "Tomás Ortega", role: "Agent", initials: "TO" },
            ].map((p, i) => (
              <React.Fragment key={p.name}>
                {i > 0 && <ItemSeparator className="my-0" />}
                <Item size="sm" role="listitem">
                  <ItemMedia>
                    <Avatar size="sm">
                      <AvatarFallback>{p.initials}</AvatarFallback>
                    </Avatar>
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{p.name}</ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <Badge variant="subtle">{p.role}</Badge>
                  </ItemActions>
                </Item>
              </React.Fragment>
            ))}
          </ItemGroup>
        </div>
      </Demo>
    </Showcase>
  )
}

/* ------------------------------------------------------------------- Empty */

function EmptyShowcase() {
  return (
    <Showcase
      id="empty"
      title="Empty"
      summary="Fills a region that has nothing to show yet and points to the next step."
      covers={["media: default", "media: icon", "with border", "muted background", "with actions", "with link"]}
    >
      <Demo label="Icon media with actions" className="items-stretch">
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UsersIcon />
            </EmptyMedia>
            <EmptyTitle>No contacts yet</EmptyTitle>
            <EmptyDescription>Import a CSV or add people one by one to start messaging them.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Button variant="elevated" size="compact">
                <UserPlusIcon data-icon="inline-start" />
                Add contact
              </Button>
              <Button variant="primary" size="compact">
                Import CSV
              </Button>
            </div>
          </EmptyContent>
        </Empty>
      </Demo>
      <Demo label="Default media, muted background" className="items-stretch">
        <Empty className="bg-muted/50">
          <EmptyHeader>
            <EmptyMedia>
              <SearchIcon className="size-6 text-muted-foreground" />
            </EmptyMedia>
            <EmptyTitle>No conversations match “refund”</EmptyTitle>
            <EmptyDescription>
              Try another keyword or <a href="#empty">clear the filters</a>.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </Demo>
      <Demo label="In context (inbox zero)" className="items-stretch">
        <div className="w-full rounded-lg bg-surface ring-1 ring-hairline">
          <div className="border-b px-3 py-2 text-sm font-medium">Assigned to me</div>
          <Empty className="p-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SparklesIcon />
              </EmptyMedia>
              <EmptyTitle>You&apos;re all caught up</EmptyTitle>
              <EmptyDescription>New conversations assigned to you will appear here.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      </Demo>
    </Showcase>
  )
}

/* ------------------------------------------------------------------- Alert */

function AlertShowcase() {
  return (
    <Showcase
      id="alert"
      title="Alert"
      summary="An inline message about the page or a task, neutral or destructive, with an optional icon and action."
      covers={["variant: default", "variant: destructive", "with icon", "title only", "description only", "AlertAction", "with link"]}
    >
      <Demo label="Variants" className="flex-col items-stretch">
        <Alert>
          <CheckCircle2Icon />
          <AlertTitle>Template approved</AlertTitle>
          <AlertDescription>“order_shipped_v2” can now be sent to opted-in contacts.</AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Payment failed</AlertTitle>
          <AlertDescription>
            We couldn&apos;t charge the card ending 4242. <a href="#alert">Update billing</a> to keep sending.
          </AlertDescription>
        </Alert>
      </Demo>
      <Demo label="Without icon, title or description" className="flex-col items-stretch">
        <Alert>
          <AlertTitle>Scheduled maintenance on Nov 22, 02:00–03:00 UTC.</AlertTitle>
        </Alert>
        <Alert>
          <AlertDescription>SMS to Canada now supports sender IDs.</AlertDescription>
        </Alert>
      </Demo>
      <Demo label="With action" className="flex-col items-stretch">
        <Alert>
          <MegaphoneIcon />
          <AlertTitle>Campaign paused</AlertTitle>
          <AlertDescription>1,248 messages are waiting to send.</AlertDescription>
          <AlertAction>
            <Button variant="elevated" size="compact-sm">
              Resume
            </Button>
          </AlertAction>
        </Alert>
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>32 contacts opted out</AlertTitle>
          <AlertDescription>They were removed from “Spring sale”.</AlertDescription>
          <AlertAction>
            <Button variant="ghost" size="compact-sm">
              Review
            </Button>
          </AlertAction>
        </Alert>
      </Demo>
    </Showcase>
  )
}

/* ------------------------------------------------------------------ Marker */

function MarkerShowcase() {
  return (
    <Showcase
      id="marker"
      title="Marker"
      summary="A small inline note in a timeline or conversation: who joined, when a day starts, what is loading."
      covers={["variant: default", "variant: separator", "variant: border", "with icon", "with spinner", "icon start and end", "as link", "as button"]}
    >
      <Demo label="Variants" className="flex-col items-stretch">
        <Marker>
          <MarkerContent>Conversation opened by Priya Nair</MarkerContent>
        </Marker>
        <Marker variant="separator">
          <MarkerContent>Today</MarkerContent>
        </Marker>
        <Marker variant="border">
          <MarkerIcon>
            <InboxIcon />
          </MarkerIcon>
          <MarkerContent>Unassigned · 14 conversations</MarkerContent>
        </Marker>
      </Demo>
      <Demo label="With icon and states" className="flex-col items-stretch">
        <Marker>
          <MarkerIcon>
            <UserPlusIcon />
          </MarkerIcon>
          <MarkerContent>Tomás Ortega joined the conversation</MarkerContent>
        </Marker>
        <Marker role="status">
          <MarkerIcon>
            <Spinner />
          </MarkerIcon>
          <MarkerContent>Translating message…</MarkerContent>
        </Marker>
        <Marker render={<a href="#marker" />}>
          <MarkerIcon>
            <FileTextIcon />
          </MarkerIcon>
          <MarkerContent>invoice-2026-11.pdf attached</MarkerContent>
        </Marker>
        <Marker render={<button type="button" className="transition-colors hover:text-foreground" />}>
          <MarkerIcon>
            <MailIcon />
          </MarkerIcon>
          <MarkerContent className="flex-1">3 earlier emails</MarkerContent>
          <MarkerIcon>
            <ChevronRightIcon />
          </MarkerIcon>
        </Marker>
      </Demo>
      <Demo label="In context (conversation)" className="flex-col items-stretch">
        <div className="flex flex-col gap-3 rounded-lg bg-surface p-3 ring-1 ring-hairline">
          <Marker variant="separator">
            <MarkerContent>Tue, Nov 18</MarkerContent>
          </Marker>
          <p className="max-w-[80%] self-start rounded-lg bg-muted px-3 py-2 text-sm">Is my order shipping today?</p>
          <Marker className="justify-center">
            <MarkerContent>
              <strong className="font-medium">Amara Kole</strong> assigned this to Support
            </MarkerContent>
          </Marker>
          <p className="max-w-[80%] self-end rounded-lg bg-secondary px-3 py-2 text-sm">Yes, it leaves our warehouse at 4 pm.</p>
        </div>
      </Demo>
    </Showcase>
  )
}
