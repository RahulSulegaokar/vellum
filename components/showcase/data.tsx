"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts"
import {
  ArrowRightIcon,
  CheckIcon,
  DownloadIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  FileWarningIcon,
  FileCodeIcon,
  ImageIcon,
  LoaderIcon,
  MailIcon,
  MessageSquareIcon,
  RefreshCwIcon,
  SearchIcon,
  SendIcon,
  TerminalIcon,
  TriangleAlertIcon,
  UsersIcon,
  XIcon,
} from "lucide-react"

import { Demo, Showcase } from "@/components/showcase/frame"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/components/ui/attachment"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block"
import { DirectionProvider } from "@/components/ui/direction"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

export function DataShowcase() {
  return (
    <div className="flex flex-col gap-16">
      <TableShowcase />
      <ChartShowcase />
      <CarouselShowcase />
      <ScrollAreaShowcase />
      <ResizableShowcase />
      <CodeBlockShowcase />
      <AttachmentShowcase />
      <BubbleShowcase />
      <MessageShowcase />
      <MessageScrollerShowcase />
      <TraceShowcase />
      <DirectionShowcase />
    </div>
  )
}

/* ------------------------------------------------------------------ Table */

const campaigns = [
  { id: "c1", name: "Spring sale reminder", channel: "WhatsApp", status: "Approved", sent: "4,812", replies: "612" },
  { id: "c2", name: "Appointment follow-up", channel: "SMS", status: "Pending review", sent: "1,204", replies: "88" },
  { id: "c3", name: "Loyalty points update", channel: "Email", status: "Approved", sent: "9,330", replies: "241" },
  { id: "c4", name: "Win-back offer", channel: "WhatsApp", status: "Opted out", sent: "0", replies: "0" },
]

function statusBadge(status: string) {
  if (status === "Approved") return <Badge variant="subtle-info">{status}</Badge>
  if (status === "Opted out") return <Badge variant="destructive">{status}</Badge>
  return <Badge variant="subtle">{status}</Badge>
}

function CampaignTable() {
  const [selected, setSelected] = React.useState("c2")
  return (
    <Table>
      <TableCaption>Campaigns sent in November 2026. Click a row to select it.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Campaign</TableHead>
          <TableHead>Channel</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Sent</TableHead>
          <TableHead className="text-right">Replies</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns.map((c) => (
          <TableRow
            key={c.id}
            data-state={selected === c.id ? "selected" : undefined}
            aria-selected={selected === c.id}
            onClick={() => setSelected(c.id)}
            className="cursor-pointer"
          >
            <TableCell className="font-medium">{c.name}</TableCell>
            <TableCell>{c.channel}</TableCell>
            <TableCell>{statusBadge(c.status)}</TableCell>
            <TableCell className="text-right tabular-nums">{c.sent}</TableCell>
            <TableCell className="text-right tabular-nums">{c.replies}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right tabular-nums">15,346</TableCell>
          <TableCell className="text-right tabular-nums">941</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

const contacts = [
  { name: "Priya Nair", phone: "+44 7700 900412", email: "priya.nair@example.com", tag: "VIP", owner: "Tomás Ortega", last: "18 Nov 2026, 09:42", messages: "128" },
  { name: "Tomás Ortega", phone: "+34 612 345 678", email: "tomas.ortega@example.com", tag: "Lead", owner: "Amara Okafor", last: "17 Nov 2026, 16:05", messages: "42" },
  { name: "Lena Fischer", phone: "+49 1512 3456789", email: "lena.fischer@example.com", tag: "Opted out", owner: "Priya Nair", last: "02 Oct 2026, 11:20", messages: "7" },
]

function TableShowcase() {
  return (
    <Showcase
      id="table"
      title="Table"
      summary="Rows of records such as contacts or campaigns. When it is wider than its container it scrolls sideways and becomes a focusable, named region."
      covers={["header", "body", "caption", "footer", "row: selected", "row: hover", "overflow (wide, scrolls)", "label"]}
      stacked
    >
      <Demo label="In context" className="block">
        <CampaignTable />
      </Demo>
      <Demo label="Overflow" className="block">
        <div className="max-w-md rounded-lg ring-1 ring-hairline">
          <Table label="Contacts">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tag</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Last message</TableHead>
                <TableHead className="text-right">Messages</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((c) => (
                <TableRow key={c.email}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="tabular-nums">{c.phone}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{statusBadge(c.tag === "Opted out" ? c.tag : "Pending")}</TableCell>
                  <TableCell>{c.owner}</TableCell>
                  <TableCell className="tabular-nums">{c.last}</TableCell>
                  <TableCell className="text-right tabular-nums">{c.messages}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Demo>
    </Showcase>
  )
}

/* ------------------------------------------------------------------ Chart */

const volume = [
  { day: "Mon", whatsapp: 412, sms: 180, email: 96 },
  { day: "Tue", whatsapp: 538, sms: 214, email: 120 },
  { day: "Wed", whatsapp: 476, sms: 198, email: 143 },
  { day: "Thu", whatsapp: 620, sms: 251, email: 110 },
  { day: "Fri", whatsapp: 702, sms: 233, email: 158 },
  { day: "Sat", whatsapp: 344, sms: 120, email: 64 },
  { day: "Sun", whatsapp: 298, sms: 94, email: 51 },
]

const volumeConfig = {
  whatsapp: { label: "WhatsApp", color: "var(--chart-1)" },
  sms: { label: "SMS", color: "var(--chart-2)" },
  email: { label: "Email", color: "var(--chart-3)" },
} satisfies ChartConfig

const responseTime = [
  { week: "W41", median: 14, p90: 41 },
  { week: "W42", median: 12, p90: 38 },
  { week: "W43", median: 11, p90: 35 },
  { week: "W44", median: 13, p90: 44 },
  { week: "W45", median: 9, p90: 29 },
  { week: "W46", median: 8, p90: 26 },
]

const responseConfig = {
  median: { label: "Median (min)", color: "var(--chart-1)" },
  p90: { label: "90th percentile (min)", color: "var(--chart-4)" },
} satisfies ChartConfig

function ChartShowcase() {
  return (
    <Showcase
      id="chart"
      title="Chart"
      summary="Recharts wrapped with theme colours, a styled tooltip and legend. Use it for message volume, reply rates and other trends."
      covers={["area (stacked)", "bar (grouped)", "line", "tooltip: dot", "tooltip: line", "tooltip: dashed", "legend", "grid + axes"]}
      stacked
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <Demo label="Area · tooltip dot" className="block">
          <ChartContainer config={volumeConfig} className="aspect-auto h-52 w-full">
            <AreaChart data={volume} margin={{ left: 0, right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
              <Area dataKey="email" type="natural" stackId="a" fill="var(--color-email)" fillOpacity={0.3} stroke="var(--color-email)" />
              <Area dataKey="sms" type="natural" stackId="a" fill="var(--color-sms)" fillOpacity={0.3} stroke="var(--color-sms)" />
              <Area dataKey="whatsapp" type="natural" stackId="a" fill="var(--color-whatsapp)" fillOpacity={0.3} stroke="var(--color-whatsapp)" />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </Demo>
        <Demo label="Bar · tooltip line" className="block">
          <ChartContainer config={volumeConfig} className="aspect-auto h-52 w-full">
            <BarChart data={volume}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
              <Bar dataKey="whatsapp" fill="var(--color-whatsapp)" radius={4} />
              <Bar dataKey="sms" fill="var(--color-sms)" radius={4} />
              <ChartLegend content={<ChartLegendContent />} />
            </BarChart>
          </ChartContainer>
        </Demo>
        <Demo label="Line · tooltip dashed" className="block">
          <ChartContainer config={responseConfig} className="aspect-auto h-52 w-full">
            <LineChart data={responseTime} margin={{ left: -16, right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
              <Line dataKey="median" type="monotone" stroke="var(--color-median)" strokeWidth={2} dot={false} />
              <Line dataKey="p90" type="monotone" stroke="var(--color-p90)" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              <ChartLegend content={<ChartLegendContent />} />
            </LineChart>
          </ChartContainer>
        </Demo>
      </div>
    </Showcase>
  )
}

/* --------------------------------------------------------------- Carousel */

const templates = [
  { name: "Order shipped", body: "Hi {{first_name}}, your order #{{order}} is on its way.", tag: "Approved" },
  { name: "Appointment reminder", body: "See you tomorrow at {{time}}. Reply C to cancel.", tag: "Approved" },
  { name: "Review request", body: "Thanks for visiting! Could you leave us a quick review?", tag: "Pending review" },
  { name: "Win-back offer", body: "We miss you. Here is 15% off your next booking.", tag: "Pending review" },
  { name: "Payment received", body: "We received {{amount}}. Thank you!", tag: "Approved" },
]

function TemplateCard({ t }: { t: (typeof templates)[number] }) {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-medium">{t.name}</span>
          {statusBadge(t.tag)}
        </div>
        <p className="text-sm text-muted-foreground">{t.body}</p>
      </CardContent>
    </Card>
  )
}

function CarouselShowcase() {
  return (
    <Showcase
      id="carousel"
      title="Carousel"
      summary="A swipeable strip of slides with previous and next buttons and arrow-key support. Good for template galleries and onboarding tips."
      covers={["orientation: horizontal", "orientation: vertical", "one per view", "two per view", "prev/next disabled at the ends"]}
    >
      <Demo label="Horizontal · one per view" className="block px-12">
        <Carousel className="mx-auto max-w-xs">
          <CarouselContent>
            {templates.map((t) => (
              <CarouselItem key={t.name}>
                <TemplateCard t={t} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </Demo>
      <Demo label="Horizontal · two per view" className="block px-12">
        <Carousel opts={{ align: "start" }}>
          <CarouselContent>
            {templates.map((t) => (
              <CarouselItem key={t.name} className="basis-1/2">
                <TemplateCard t={t} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </Demo>
      <Demo label="Vertical" className="block py-12">
        <Carousel orientation="vertical" opts={{ align: "start" }} className="mx-auto max-w-xs">
          <CarouselContent className="-mt-4 h-60">
            {templates.map((t) => (
              <CarouselItem key={t.name} className="basis-1/2">
                <TemplateCard t={t} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </Demo>
    </Showcase>
  )
}

/* ------------------------------------------------------------ Scroll area */

const teammates = [
  "Priya Nair", "Tomás Ortega", "Amara Okafor", "Lena Fischer", "Kenji Watanabe", "Sofia Rossi",
  "Daniel Mensah", "Hana Kim", "Mateo Silva", "Noor Haddad", "Ivy Chen", "Oskar Lindqvist",
]

function ScrollAreaShowcase() {
  return (
    <Showcase
      id="scroll-area"
      title="Scroll area"
      summary="A scroll container with a thin custom scrollbar. Use it for long lists inside fixed-height panels such as a teammate picker."
      covers={["orientation: vertical", "orientation: horizontal", "keyboard focus ring"]}
    >
      <Demo label="Vertical">
        <ScrollArea className="h-56 w-56 rounded-lg ring-1 ring-hairline">
          <div className="p-3">
            <p className="mb-2 text-xs font-medium text-subtle">Teammates · 12</p>
            {teammates.map((name) => (
              <div key={name} className="flex items-center gap-2 border-b border-border py-2 text-sm last:border-0">
                <Avatar size="sm">
                  <AvatarFallback>{name.split(" ").map((p) => p[0]).join("")}</AvatarFallback>
                </Avatar>
                {name}
              </div>
            ))}
          </div>
        </ScrollArea>
      </Demo>
      <Demo label="Horizontal" className="block">
        <ScrollArea className="w-full max-w-md rounded-lg ring-1 ring-hairline">
          <div className="flex w-max gap-3 p-3">
            {templates.map((t) => (
              <div key={t.name} className="w-44 shrink-0">
                <TemplateCard t={t} />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Demo>
    </Showcase>
  )
}

/* -------------------------------------------------------------- Resizable */

function ResizableShowcase() {
  return (
    <Showcase
      id="resizable"
      title="Resizable"
      summary="Panels split by a draggable, keyboard-focusable handle. Use it for inbox layouts with a conversation list beside the thread."
      covers={["orientation: horizontal", "orientation: vertical", "withHandle", "handle without grip", "nested groups", "minSize"]}
      stacked
    >
      <Demo label="Horizontal · withHandle · nested vertical" className="block">
        <ResizablePanelGroup orientation="horizontal" className="min-h-64 rounded-lg ring-1 ring-hairline">
          <ResizablePanel defaultSize="30%" minSize="20%">
            <div className="flex h-full flex-col gap-1 p-3 text-sm">
              <span className="text-xs font-medium text-subtle">Inbox</span>
              <span className="font-medium">Priya Nair</span>
              <span className="text-muted-foreground">Tomás Ortega</span>
              <span className="text-muted-foreground">Lena Fischer</span>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="70%">
            <ResizablePanelGroup orientation="vertical">
              <ResizablePanel defaultSize="65%" minSize="30%">
                <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
                  Conversation with Priya Nair
                </div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize="35%" minSize="20%">
                <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
                  Reply composer
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Demo>
      <Demo label="Vertical · withHandle" className="block">
        <ResizablePanelGroup orientation="vertical" className="min-h-48 max-w-md rounded-lg ring-1 ring-hairline">
          <ResizablePanel defaultSize="50%">
            <div className="flex h-full items-center justify-center p-4 text-sm">Template editor</div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="50%">
            <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">Phone preview</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Demo>
    </Showcase>
  )
}

/* ------------------------------------------------------------- Code block */

const curl = `curl https://api.relay.example/v1/messages \\
  -H "Authorization: Bearer $RELAY_KEY" \\
  -d channel=whatsapp \\
  -d to=+447700900412 \\
  -d template=order_shipped`

const webhookError = `Error: webhook delivery failed (HTTP 502)
  at deliver (relay/webhooks.ts:84:11)
  retrying in 30s (attempt 3 of 5)`

function CodeBlockShowcase() {
  return (
    <Showcase
      id="code-block"
      title="Code block"
      summary="Monospaced code with an optional header, copy button, line numbers and diff lines. Use it for API snippets and logs."
      covers={[
        "variant: default",
        "variant: destructive",
        "size: default",
        "size: sm",
        "header + title + actions",
        "copy button",
        "floating actions (hover)",
        "lineNumbers",
        "startLine",
        "wrap",
        "footer",
        "line: added",
        "line: removed",
        "line: highlighted",
      ]}
    >
      <Demo label="Default · header · copy · line numbers" className="block">
        <CodeBlock>
          <CodeBlockHeader>
            <CodeBlockTitle>
              <TerminalIcon />
              Send a template message
            </CodeBlockTitle>
            <CodeBlockActions>
              <CodeBlockCopyButton value={curl} copyLabel="Copy command" />
            </CodeBlockActions>
          </CodeBlockHeader>
          <CodeBlockContent lineNumbers>{curl}</CodeBlockContent>
        </CodeBlock>
      </Demo>
      <Demo label="Diff lines · startLine · footer" className="block">
        <CodeBlock>
          <CodeBlockHeader>
            <CodeBlockTitle>
              <FileCodeIcon />
              relay.config.ts
            </CodeBlockTitle>
          </CodeBlockHeader>
          <CodeBlockContent lineNumbers startLine={12}>
            <CodeBlockLine>{"export default defineConfig({"}</CodeBlockLine>
            <CodeBlockLine variant="removed">{'  channel: "sms",'}</CodeBlockLine>
            <CodeBlockLine variant="added">{'  channel: "whatsapp",'}</CodeBlockLine>
            <CodeBlockLine variant="highlighted">{"  quietHours: { from: 21, to: 8 },"}</CodeBlockLine>
            <CodeBlockLine>{"})"}</CodeBlockLine>
          </CodeBlockContent>
          <CodeBlockFooter className="text-xs">1 removed · 1 added · 1 highlighted</CodeBlockFooter>
        </CodeBlock>
      </Demo>
      <Demo label="Floating actions · size sm · wrap" className="block">
        <CodeBlock size="sm">
          <CodeBlockActions>
            <CodeBlockCopyButton value="relay templates push --all --approve" />
          </CodeBlockActions>
          <CodeBlockContent wrap>relay templates push --all --approve --note &quot;November campaign templates for review by the WhatsApp team&quot;</CodeBlockContent>
        </CodeBlock>
      </Demo>
      <Demo label="Destructive" className="block">
        <CodeBlock variant="destructive" size="sm">
          <CodeBlockHeader>
            <CodeBlockTitle>
              <TriangleAlertIcon />
              Webhook log
            </CodeBlockTitle>
            <CodeBlockActions>
              <CodeBlockCopyButton value={webhookError} />
            </CodeBlockActions>
          </CodeBlockHeader>
          <CodeBlockContent>{webhookError}</CodeBlockContent>
        </CodeBlock>
      </Demo>
    </Showcase>
  )
}

/* ------------------------------------------------------------- Attachment */

function ImageThumb({ tone = "a" }: { tone?: "a" | "b" | "c" }) {
  const gradient =
    tone === "a"
      ? "from-chart-1 to-chart-3"
      : tone === "b"
        ? "from-chart-2 to-chart-4"
        : "from-chart-5 to-chart-1"
  return <div aria-hidden className={`aspect-square w-full bg-linear-to-br ${gradient}`} />
}

function AttachmentShowcase() {
  const sizes = ["default", "sm", "xs"] as const
  return (
    <Showcase
      id="attachment"
      title="Attachment"
      summary="A file or image attached to a message or campaign, with its upload state and actions such as remove or retry."
      covers={[
        "size: default",
        "size: sm",
        "size: xs",
        "orientation: horizontal",
        "orientation: vertical",
        "media: icon",
        "media: image",
        "state: idle",
        "state: uploading",
        "state: processing",
        "state: error",
        "state: done",
        "actions",
        "trigger (whole card clickable)",
        "group (scrolls)",
      ]}
    >
      <Demo label="Sizes · horizontal · icon">
        {sizes.map((size) => (
          <Attachment key={size} size={size}>
            <AttachmentMedia>
              <FileSpreadsheetIcon />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>contacts-nov.csv</AttachmentTitle>
              <AttachmentDescription>CSV · 18 KB · {size}</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label="Remove contacts-nov.csv">
                <XIcon />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
        ))}
      </Demo>
      <Demo label="Sizes · vertical · image" className="items-start">
        {sizes.map((size, i) => (
          <Attachment key={size} size={size} orientation="vertical">
            <AttachmentMedia variant="image">
              <ImageThumb tone={(["a", "b", "c"] as const)[i]} />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>storefront.jpg</AttachmentTitle>
              <AttachmentDescription>{size}</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
        ))}
        <Attachment orientation="vertical">
          <AttachmentMedia variant="image">
            <ImageThumb tone="b" />
          </AttachmentMedia>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove menu-photo.png">
              <XIcon />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
        <Attachment orientation="vertical">
          <AttachmentMedia>
            <FileTextIcon />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>terms.pdf</AttachmentTitle>
            <AttachmentDescription>PDF · 210 KB</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      </Demo>
      <Demo label="States" className="flex-col items-stretch">
        <Attachment state="idle" className="w-full">
          <AttachmentMedia>
            <ImageIcon />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>Drop a header image</AttachmentTitle>
            <AttachmentDescription>Idle · PNG or JPG up to 5 MB</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
        <Attachment state="uploading" className="w-full">
          <AttachmentMedia variant="image">
            <ImageThumb />
            <Spinner className="absolute" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>promo-banner.png</AttachmentTitle>
            <AttachmentDescription>Uploading · 62%</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Cancel upload">
              <XIcon />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
        <Attachment state="processing" className="w-full">
          <AttachmentMedia>
            <Spinner />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>price-list.pdf</AttachmentTitle>
            <AttachmentDescription>Processing · scanning for links</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
        <Attachment state="error" className="w-full">
          <AttachmentMedia>
            <FileWarningIcon />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>catalogue.zip</AttachmentTitle>
            <AttachmentDescription>File type not supported on WhatsApp</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Retry upload">
              <RefreshCwIcon />
            </AttachmentAction>
            <AttachmentAction aria-label="Remove catalogue.zip">
              <XIcon />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
        <Attachment state="done" className="w-full">
          <AttachmentMedia>
            <CheckIcon />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>invoice-0142.pdf</AttachmentTitle>
            <AttachmentDescription>Done · 96 KB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Download invoice-0142.pdf">
              <DownloadIcon />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      </Demo>
      <Demo label="In context · trigger · group" className="block">
        <AttachmentGroup>
          {["menu-autumn.pdf", "opening-hours.png", "loyalty-terms.pdf", "gift-card.png"].map((file, i) => (
            <Attachment key={file} size="sm">
              <AttachmentTrigger aria-label={`Preview ${file}`} />
              <AttachmentMedia variant={file.endsWith(".png") ? "image" : "icon"}>
                {file.endsWith(".png") ? <ImageThumb tone={i % 2 ? "c" : "a"} /> : <FileTextIcon />}
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>{file}</AttachmentTitle>
                <AttachmentDescription>Click to preview</AttachmentDescription>
              </AttachmentContent>
            </Attachment>
          ))}
        </AttachmentGroup>
      </Demo>
    </Showcase>
  )
}

/* ----------------------------------------------------------------- Bubble */

const bubbleVariants = [
  ["default", "Your order #4821 has shipped and should arrive Thursday."],
  ["secondary", "Thanks! Can I change the delivery address?"],
  ["muted", "Conversation assigned to Tomás Ortega."],
  ["tinted", "Sure, send me the new address and I will update it."],
  ["outline", "Template: Order shipped (approved)"],
  ["destructive", "Message failed: the contact has opted out of WhatsApp."],
  ["ghost", "Relay Assist: the customer asked to change the delivery address. Suggested reply drafted below."],
] as const

function ReactionPicker() {
  const [liked, setLiked] = React.useState(true)
  return (
    <Bubble variant="secondary">
      <BubbleContent>Could you resend the invoice?</BubbleContent>
      <BubbleReactions side="bottom" align="end">
        <Button
          variant="ghost"
          size="xs"
          className="rounded-full"
          aria-pressed={liked}
          onClick={() => setLiked((v) => !v)}
        >
          👍 {liked ? 2 : 1}
        </Button>
      </BubbleReactions>
    </Bubble>
  )
}

function BubbleShowcase() {
  return (
    <Showcase
      id="bubble"
      title="Bubble"
      summary="One chat message's body. Pick the variant by who is speaking: default for your team, secondary for the customer, muted for system notes."
      covers={[
        "variant: default",
        "variant: secondary",
        "variant: muted",
        "variant: tinted",
        "variant: outline",
        "variant: ghost",
        "variant: destructive",
        "align: start",
        "align: end",
        "reactions: side top / bottom",
        "reactions: align start / end",
        "reactions: button (pressed)",
        "content as button",
        "group",
      ]}
    >
      <Demo label="Variants" className="flex-col items-stretch">
        {bubbleVariants.map(([variant, text]) => (
          <Bubble key={variant} variant={variant}>
            <BubbleContent>{text}</BubbleContent>
          </Bubble>
        ))}
      </Demo>
      <Demo label="Align" className="flex-col items-stretch">
        <Bubble variant="secondary" align="start">
          <BubbleContent>align start: the customer</BubbleContent>
        </Bubble>
        <Bubble align="end">
          <BubbleContent>align end: your team</BubbleContent>
        </Bubble>
      </Demo>
      <Demo label="Reactions" className="flex-col items-stretch gap-10 py-4">
        <Bubble variant="secondary">
          <BubbleContent>side bottom, align end</BubbleContent>
          <BubbleReactions side="bottom" align="end" role="img" aria-label="Reaction: thumbs up">
            <span>👍</span>
          </BubbleReactions>
        </Bubble>
        <Bubble align="end">
          <BubbleContent>side bottom, align start</BubbleContent>
          <BubbleReactions side="bottom" align="start" role="img" aria-label="Reactions: heart, party">
            <span>❤️</span>
            <span>🎉</span>
          </BubbleReactions>
        </Bubble>
        <Bubble variant="tinted">
          <BubbleContent>side top, align start</BubbleContent>
          <BubbleReactions side="top" align="start" role="img" aria-label="Reaction: eyes">
            <span>👀</span>
          </BubbleReactions>
        </Bubble>
        <Bubble variant="outline" align="end">
          <BubbleContent>side top, align end, with a count</BubbleContent>
          <BubbleReactions side="top" align="end" role="img" aria-label="Reactions: thumbs up and 4 more">
            <span>👍</span>
            <span>+4</span>
          </BubbleReactions>
        </Bubble>
        <ReactionPicker />
      </Demo>
      <Demo label="In context" className="block">
        <BubbleGroup>
          <Bubble variant="secondary">
            <BubbleContent>Hi! Is the 3pm slot on Friday still free?</BubbleContent>
          </Bubble>
          <Bubble align="end">
            <BubbleContent>It is. Shall I book it for you?</BubbleContent>
          </Bubble>
          <Bubble align="end" variant="outline">
            <BubbleContent render={<button type="button" />}>Send booking link</BubbleContent>
          </Bubble>
        </BubbleGroup>
      </Demo>
    </Showcase>
  )
}

/* ---------------------------------------------------------------- Message */

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).join("")
}

function MessageShowcase() {
  return (
    <Showcase
      id="message"
      title="Message"
      summary="A chat row: avatar, header, one or more bubbles and a footer, aligned to the speaker's side."
      covers={["align: start", "align: end", "avatar", "header", "footer", "with ghost bubble", "group (several bubbles)"]}
    >
      <Demo label="Align" className="flex-col items-stretch">
        <Message>
          <MessageAvatar>
            <Avatar>
              <AvatarFallback>{initials("Priya Nair")}</AvatarFallback>
            </Avatar>
          </MessageAvatar>
          <MessageContent>
            <MessageHeader>Priya Nair · WhatsApp</MessageHeader>
            <Bubble variant="secondary">
              <BubbleContent>Hello, do you deliver on Sundays?</BubbleContent>
            </Bubble>
            <MessageFooter>09:41</MessageFooter>
          </MessageContent>
        </Message>
        <Message align="end">
          <MessageAvatar>
            <Avatar>
              <AvatarFallback>{initials("Tomás Ortega")}</AvatarFallback>
            </Avatar>
          </MessageAvatar>
          <MessageContent>
            <MessageHeader>Tomás Ortega</MessageHeader>
            <Bubble>
              <BubbleContent>We do, between 10:00 and 14:00.</BubbleContent>
            </Bubble>
            <MessageFooter>09:43 · Read</MessageFooter>
          </MessageContent>
        </Message>
      </Demo>
      <Demo label="Ghost bubble · no avatar" className="block">
        <Message>
          <MessageContent>
            <MessageHeader>Relay Assist</MessageHeader>
            <Bubble variant="ghost">
              <BubbleContent>
                Priya has ordered 6 times this year and usually asks about delivery windows. Suggested reply: confirm Sunday delivery and
                offer the 10:00 slot.
              </BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
      </Demo>
      <Demo label="In context · group" className="block">
        <MessageGroup>
          <Message align="end">
            <MessageContent>
              <Bubble>
                <BubbleContent>Your table for 4 is booked for Friday at 19:30.</BubbleContent>
              </Bubble>
              <Bubble>
                <BubbleContent>Reply C to cancel or R to reschedule.</BubbleContent>
              </Bubble>
              <MessageFooter>
                <CheckIcon className="me-1 size-3" aria-hidden />
                Delivered
              </MessageFooter>
            </MessageContent>
          </Message>
          <Message>
            <MessageAvatar>
              <Avatar size="sm">
                <AvatarFallback>{initials("Amara Okafor")}</AvatarFallback>
              </Avatar>
            </MessageAvatar>
            <MessageContent>
              <Bubble variant="secondary">
                <BubbleContent>R please, can we do 20:00?</BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
        </MessageGroup>
      </Demo>
    </Showcase>
  )
}

/* -------------------------------------------------------- Message scroller */

const thread = [
  "Hi, I ordered a gift card yesterday but haven't received the email.",
  "Sorry about that! Can you confirm the email address on the order?",
  "It's priya.nair@example.com",
  "Thanks. I can see it bounced. Let me resend it now.",
  "Great, thank you.",
  "Done. It should arrive in the next couple of minutes.",
  "Got it! Can I also change the recipient name?",
  "Of course. What name should it show?",
  "Tomás Ortega, please.",
  "Updated and resent. Anything else I can help with?",
  "That's all, thanks for the quick help!",
  "Happy to help. Have a lovely day!",
]

function MessageScrollerShowcase() {
  return (
    <Showcase
      id="message-scroller"
      title="Message scroller"
      summary="A chat viewport that keeps the newest message in view and shows jump buttons when you scroll away from either end."
      covers={["scroll button: end", "scroll button: start", "items aligned start / end", "scroll anchor"]}
    >
      <Demo label="In context" className="block">
        <div className="h-80 w-full rounded-lg ring-1 ring-hairline">
          <MessageScrollerProvider>
            <MessageScroller>
              <MessageScrollerViewport>
                <MessageScrollerContent className="gap-3 p-4">
                  {thread.map((text, i) => (
                    <MessageScrollerItem key={text} scrollAnchor={i === thread.length - 1}>
                      <Message align={i % 2 ? "end" : "start"}>
                        <MessageContent>
                          <Bubble variant={i % 2 ? "default" : "secondary"}>
                            <BubbleContent>{text}</BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  ))}
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton direction="start" label="Scroll to first message" />
              <MessageScrollerButton direction="end" label="Scroll to latest message" />
            </MessageScroller>
          </MessageScrollerProvider>
        </div>
      </Demo>
    </Showcase>
  )
}

/* ------------------------------------------------------------------ Trace */

function TraceShowcase() {
  return (
    <Showcase
      id="trace"
      title="Trace"
      summary="The steps an assistant took, one line each, with collapsible details. Use it to show how Relay Assist drafted a reply."
      covers={["status: none (done)", "status: running", "status: error", "status: pending", "description", "collapsible: open", "collapsible: closed", "collapsible with error"]}
    >
      <Demo label="Statuses" className="block">
        <Trace>
          <TraceLine>
            <TraceIcon><CheckIcon /></TraceIcon>
            <TraceTitle>Read the conversation</TraceTitle>
            <TraceDescription>0.4s</TraceDescription>
          </TraceLine>
          <TraceLine status="running">
            <TraceIcon><LoaderIcon className="motion-safe:animate-spin" /></TraceIcon>
            <TraceTitle>Drafting a reply</TraceTitle>
          </TraceLine>
          <TraceLine status="error">
            <TraceIcon><TriangleAlertIcon /></TraceIcon>
            <TraceTitle>Order lookup timed out</TraceTitle>
            <TraceDescription>10s</TraceDescription>
          </TraceLine>
          <TraceLine status="pending">
            <TraceIcon><SendIcon /></TraceIcon>
            <TraceTitle>Send for approval</TraceTitle>
          </TraceLine>
        </Trace>
      </Demo>
      <Demo label="Collapsible" className="block">
        <Trace>
          <TraceCollapsible defaultOpen>
            <TraceCollapsibleTrigger>
              <TraceLine>
                <TraceIcon><SearchIcon /></TraceIcon>
                <TraceTitle>Searched contacts</TraceTitle>
                <TraceDescription>3 results</TraceDescription>
              </TraceLine>
            </TraceCollapsibleTrigger>
            <TraceCollapsibleContent>
              Matched Priya Nair (VIP), Priya N. (lead) and P. Nair (opted out). Using the VIP record.
            </TraceCollapsibleContent>
          </TraceCollapsible>
          <TraceCollapsible>
            <TraceCollapsibleTrigger>
              <TraceLine>
                <TraceIcon><MessageSquareIcon /></TraceIcon>
                <TraceTitle>Checked approved templates</TraceTitle>
              </TraceLine>
            </TraceCollapsibleTrigger>
            <TraceCollapsibleContent>&quot;Order shipped&quot; and &quot;Delivery window&quot; fit this conversation.</TraceCollapsibleContent>
          </TraceCollapsible>
          <TraceCollapsible>
            <TraceCollapsibleTrigger>
              <TraceLine status="error">
                <TraceIcon><TriangleAlertIcon /></TraceIcon>
                <TraceTitle>Could not reach the shop calendar</TraceTitle>
              </TraceLine>
            </TraceCollapsibleTrigger>
            <TraceCollapsibleContent>The calendar integration returned HTTP 401. Reconnect it in Settings → Integrations.</TraceCollapsibleContent>
          </TraceCollapsible>
        </Trace>
      </Demo>
    </Showcase>
  )
}

/* -------------------------------------------------------------- Direction */

function DirectionControls({ rtl }: { rtl: boolean }) {
  const id = React.useId()
  const [channel, setChannel] = React.useState("whatsapp")
  const t = rtl
    ? { name: "اسم القالب", send: "إرسال الرسالة", notify: "إشعار الفريق", whatsapp: "واتساب", sms: "رسائل SMS", email: "البريد", inbox: "الوارد", contacts: "جهات الاتصال", volume: "حد الإرسال اليومي" }
    : { name: "Template name", send: "Send message", notify: "Notify team", whatsapp: "WhatsApp", sms: "SMS", email: "Email", inbox: "Inbox", contacts: "Contacts", volume: "Daily send limit" }
  return (
    <DirectionProvider direction={rtl ? "rtl" : "ltr"}>
      <div dir={rtl ? "rtl" : "ltr"} className="flex w-full max-w-sm flex-col gap-4 rounded-lg p-4 ring-1 ring-hairline">
        <Tabs defaultValue="inbox">
          <TabsList>
            <TabsTrigger value="inbox">
              <MailIcon data-icon="inline-start" />
              {t.inbox}
            </TabsTrigger>
            <TabsTrigger value="contacts">
              <UsersIcon data-icon="inline-start" />
              {t.contacts}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${id}-name`}>{t.name}</Label>
          <Input id={`${id}-name`} variant="compact" defaultValue={rtl ? "تذكير بالموعد" : "Appointment reminder"} />
        </div>
        <RadioGroup value={channel} onValueChange={(v) => setChannel(v as string)} aria-label={rtl ? "القناة" : "Channel"}>
          {(["whatsapp", "sms", "email"] as const).map((v) => (
            <Label key={v} className="font-normal">
              <RadioGroupItem value={v} />
              {t[v]}
            </Label>
          ))}
        </RadioGroup>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">{t.volume}</span>
          <Slider defaultValue={[60]} aria-label={t.volume} />
        </div>
        <Label className="font-normal">
          <Switch defaultChecked />
          {t.notify}
        </Label>
        <Button variant="primary" size="compact" className="self-start">
          {t.send}
          <ArrowRightIcon data-icon="inline-end" className="rtl:rotate-180" />
        </Button>
      </div>
    </DirectionProvider>
  )
}

function DirectionShowcase() {
  return (
    <Showcase
      id="direction"
      title="Direction"
      summary="Sets left-to-right or right-to-left for Base UI components inside it, so keyboard navigation, sliders and popups follow the reading order. Pair it with the dir attribute."
      covers={["direction: rtl", "direction: ltr", "tabs", "input", "radio group", "slider", "switch", "button with end icon"]}
    >
      <Demo label="RTL" className="block">
        <DirectionControls rtl />
      </Demo>
      <Demo label="LTR (default)" className="block">
        <DirectionControls rtl={false} />
      </Demo>
    </Showcase>
  )
}
