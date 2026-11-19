"use client"

import * as React from "react"
import { toast as sonner } from "sonner"
import {
  ArchiveIcon,
  BellIcon,
  BoldIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  ClockIcon,
  CopyIcon,
  CreditCardIcon,
  DownloadIcon,
  FileTextIcon,
  InboxIcon,
  ItalicIcon,
  LayoutTemplateIcon,
  LogOutIcon,
  MailIcon,
  MegaphoneIcon,
  MessageSquareIcon,
  MoreHorizontalIcon,
  PaperclipIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  SendIcon,
  SettingsIcon,
  SlashIcon,
  SmileIcon,
  SparklesIcon,
  TagIcon,
  Trash2Icon,
  UserIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react"

import { Demo, Showcase } from "@/components/showcase/frame"
import { cn } from "@/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Label } from "@/components/ui/label"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover"
import { SegmentedControl, SegmentedControlItem } from "@/components/ui/segmented-control"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster, toast } from "@/components/ui/toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const SIDES = ["top", "right", "bottom", "left"] as const
const ALIGNS = ["start", "center", "end"] as const

const trigger = <Button variant="elevated" size="compact" />

/* Toasts portal to <body>; both providers sit outside the twice-rendered demos so each is mounted once. */
export function OverlaysShowcase() {
  return (
    <Toaster>
      <DialogShowcase />
      <AlertDialogShowcase />
      <SheetShowcase />
      <DrawerShowcase />
      <PopoverShowcase />
      <HoverCardShowcase />
      <TooltipShowcase />
      <DropdownMenuShowcase />
      <ContextMenuShowcase />
      <MenubarShowcase />
      <CommandShowcase />
      <NavigationMenuShowcase />
      <BreadcrumbShowcase />
      <PaginationShowcase />
      <TabsShowcase />
      <AccordionShowcase />
      <CollapsibleShowcase />
      <SidebarShowcase />
      <ToastShowcase />
      <div>
        <SonnerToaster position="bottom-center" />
        <SonnerShowcase />
      </div>
    </Toaster>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Dialog
 * ---------------------------------------------------------------------------------------------- */

function RenameTemplateDialog() {
  const id = React.useId()
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="primary" size="compact" />}>
        <PencilIcon data-icon="inline-start" />
        Rename template
      </DialogTrigger>
      <DialogContent>
        <DialogPanel>
          <DialogHeader>
            <DialogTitle>Rename template</DialogTitle>
            <DialogDescription>Teammates see the new name the next time they pick a template.</DialogDescription>
          </DialogHeader>
          <DialogSection className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-name`}>Template name</Label>
            <Input id={`${id}-name`} variant="compact" defaultValue="Order ready for pickup" />
          </DialogSection>
        </DialogPanel>
        <DialogFooter>
          <DialogClose render={<Button variant="elevated" size="compact" />}>Cancel</DialogClose>
          <DialogClose render={<Button variant="primary" size="compact" />}>Save template</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DialogShowcase() {
  return (
    <Showcase
      id="dialog"
      title="Dialog"
      summary="A focused task over the page: a muted shell holding a white panel, with Cancel and the confirm action on the shell below. Use it for short forms and confirmations that need context."
      covers={["corner close button", "no close button", "footer close button", "wide (footer row)", "non-modal", "stacked sections", "form in context"]}
    >
      <Demo label="Variants">
        <Dialog>
          <DialogTrigger render={trigger}>Corner close</DialogTrigger>
          <DialogContent>
            <DialogPanel>
              <DialogHeader>
                <DialogTitle>Message delivered</DialogTitle>
                <DialogDescription>Priya Nair received your WhatsApp reply at 14:32.</DialogDescription>
              </DialogHeader>
            </DialogPanel>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger render={trigger}>Footer close</DialogTrigger>
          <DialogContent showCloseButton={false}>
            <DialogPanel>
              <DialogHeader>
                <DialogTitle>Export contacts</DialogTitle>
                <DialogDescription>2,418 contacts will be exported as a CSV file.</DialogDescription>
              </DialogHeader>
            </DialogPanel>
            <DialogFooter showCloseButton closeLabel="Cancel">
              <DialogClose render={<Button variant="primary" size="compact" />}>
                <DownloadIcon data-icon="inline-start" />
                Export CSV
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger render={trigger}>Wide, sections</DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogPanel>
              <DialogHeader>
                <DialogTitle>Campaign summary</DialogTitle>
                <DialogDescription>Spring restock, scheduled for 24 Nov 2026 at 09:00.</DialogDescription>
              </DialogHeader>
              <DialogSection className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-subtle">Recipients</p>
                  <p className="font-medium tabular-nums">1,204</p>
                </div>
                <div>
                  <p className="text-subtle">Channel</p>
                  <p className="font-medium">SMS</p>
                </div>
                <div>
                  <p className="text-subtle">Est. cost</p>
                  <p className="font-medium tabular-nums">$38.52</p>
                </div>
              </DialogSection>
              <DialogSection className="text-sm text-muted-foreground">
                Contacts who opted out are skipped automatically.
              </DialogSection>
            </DialogPanel>
            <DialogFooter>
              <DialogClose render={<Button variant="elevated" size="compact" />}>Edit campaign</DialogClose>
              <DialogClose render={<Button variant="primary" size="compact" />}>Schedule</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog modal={false}>
          <DialogTrigger render={trigger}>Non-modal</DialogTrigger>
          <DialogContent>
            <DialogPanel>
              <DialogHeader>
                <DialogTitle>Keyboard shortcuts</DialogTitle>
                <DialogDescription>The page behind stays interactive while this is open.</DialogDescription>
              </DialogHeader>
            </DialogPanel>
          </DialogContent>
        </Dialog>
      </Demo>
      <Demo label="In context">
        <div className="flex w-full items-center justify-between gap-3 rounded-xl bg-surface p-4 shadow-card ring-1 ring-hairline">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Order ready for pickup</p>
            <p className="text-xs text-subtle">WhatsApp template · Approved</p>
          </div>
          <RenameTemplateDialog />
        </div>
      </Demo>
    </Showcase>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Alert dialog
 * ---------------------------------------------------------------------------------------------- */

function AlertDialogShowcase() {
  return (
    <Showcase
      id="alert-dialog"
      title="Alert dialog"
      summary="Interrupts to confirm an action that can't be undone. It only closes through its buttons, never by clicking outside."
      covers={["size: default", "size: sm", "with media", "destructive action", "cancel: elevated"]}
    >
      <Demo label="Sizes">
        <AlertDialog>
          <AlertDialogTrigger render={trigger}>Default</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Discard draft reply?</AlertDialogTitle>
              <AlertDialogDescription>Your reply to Tomás Ortega hasn&apos;t been sent and will be lost.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel variant="elevated" size="compact">Keep editing</AlertDialogCancel>
              <AlertDialogAction variant="primary" size="compact">Discard draft</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog>
          <AlertDialogTrigger render={trigger}>Small</AlertDialogTrigger>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Pause campaign?</AlertDialogTitle>
              <AlertDialogDescription>Remaining messages stay queued until you resume.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel variant="elevated" size="compact">Cancel</AlertDialogCancel>
              <AlertDialogAction variant="primary" size="compact">Pause</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Demo>
      <Demo label="Destructive, with media">
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="destructive" size="compact" />}>
            <Trash2Icon data-icon="inline-start" />
            Delete contact
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogMedia className="bg-destructive/10 text-destructive">
                <Trash2Icon />
              </AlertDialogMedia>
              <AlertDialogTitle>Delete Priya Nair?</AlertDialogTitle>
              <AlertDialogDescription>
                Her 46 conversations and notes are removed for every teammate. This can&apos;t be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel variant="elevated" size="compact">Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive" size="compact">Delete contact</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog>
          <AlertDialogTrigger render={trigger}>Small with media</AlertDialogTrigger>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogMedia>
                <ArchiveIcon />
              </AlertDialogMedia>
              <AlertDialogTitle>Archive 12 conversations?</AlertDialogTitle>
              <AlertDialogDescription>They move to Archived and reopen when the contact replies.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel variant="elevated" size="compact">Cancel</AlertDialogCancel>
              <AlertDialogAction variant="primary" size="compact">Archive</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Demo>
    </Showcase>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Sheet
 * ---------------------------------------------------------------------------------------------- */

function ContactSheet() {
  const id = React.useId()
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="elevated" size="compact" />}>
        <UserIcon data-icon="inline-start" />
        Edit contact
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Tomás Ortega</SheetTitle>
          <SheetDescription>Last message 2 hours ago on WhatsApp.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-phone`}>Phone</Label>
            <Input id={`${id}-phone`} variant="compact" defaultValue="+34 612 555 018" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-email`}>Email</Label>
            <Input id={`${id}-email`} variant="compact" type="email" placeholder="name@example.com" />
          </div>
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor={`${id}-sms`}>Marketing SMS</Label>
            <Switch id={`${id}-sms`} defaultChecked />
          </div>
        </div>
        <SheetFooter className="flex-row justify-end">
          <SheetClose render={<Button variant="elevated" size="compact" />}>Cancel</SheetClose>
          <SheetClose render={<Button variant="primary" size="compact" />}>Save contact</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function SheetShowcase() {
  return (
    <Showcase
      id="sheet"
      title="Sheet"
      summary="A panel that slides in from an edge for secondary work (contact details, filters) without leaving the page."
      covers={["side: top", "side: right", "side: bottom", "side: left", "no close button", "form in context"]}
    >
      <Demo label="Sides">
        {SIDES.map((side) => (
          <Sheet key={side}>
            <SheetTrigger render={trigger}>
              <span className="capitalize">{side}</span>
            </SheetTrigger>
            <SheetContent side={side}>
              <SheetHeader>
                <SheetTitle>Filter conversations</SheetTitle>
                <SheetDescription>Opened from the {side} edge. Showing 38 open conversations.</SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        ))}
        <Sheet>
          <SheetTrigger render={trigger}>No close button</SheetTrigger>
          <SheetContent showCloseButton={false}>
            <SheetHeader>
              <SheetTitle>Assign conversation</SheetTitle>
              <SheetDescription>Pick a teammate below; press Escape to close.</SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <SheetClose render={<Button variant="elevated" size="compact" />}>Done</SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </Demo>
      <Demo label="In context">
        <ContactSheet />
      </Demo>
    </Showcase>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Drawer
 * ---------------------------------------------------------------------------------------------- */

const QUICK_REPLIES = ["Thanks, we'll be in touch shortly!", "Your order is ready for pickup.", "Could you share your order number?"]

function DrawerShowcase() {
  const directions = ["down", "up", "left", "right"] as const
  return (
    <Showcase
      id="drawer"
      title="Drawer"
      summary="A swipeable panel for touch-first flows. Drag it toward its edge to dismiss."
      covers={["swipeDirection: down", "swipeDirection: up", "swipeDirection: left", "swipeDirection: right", "swipe handle", "non-modal"]}
    >
      <Demo label="Directions">
        {directions.map((dir) => (
          <Drawer key={dir} swipeDirection={dir}>
            <DrawerTrigger render={trigger}>
              <span className="capitalize">{dir}</span>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Conversation details</DrawerTitle>
                <DrawerDescription>Swipe {dir} to close.</DrawerDescription>
              </DrawerHeader>
              <div className="p-4 text-sm text-muted-foreground">Opened 18 Nov 2026 · Assigned to Mei Tanaka · 4 messages</div>
            </DrawerContent>
          </Drawer>
        ))}
      </Demo>
      <Demo label="States">
        <Drawer showSwipeHandle>
          <DrawerTrigger render={trigger}>With swipe handle</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Snooze conversation</DrawerTitle>
              <DrawerDescription>It returns to your inbox at the time you pick.</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="pt-4">
              <DrawerClose render={<Button variant="elevated" size="compact" />}>Tomorrow, 09:00</DrawerClose>
              <DrawerClose render={<Button variant="elevated" size="compact" />}>Next Monday</DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        <Drawer modal={false}>
          <DrawerTrigger render={trigger}>Non-modal</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Sending campaign</DrawerTitle>
              <DrawerDescription>612 of 1,204 delivered. You can keep working.</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="pt-4">
              <DrawerClose render={<Button variant="elevated" size="compact" />}>Hide</DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Demo>
      <Demo label="In context">
        <Drawer showSwipeHandle>
          <DrawerTrigger render={<Button variant="primary" size="compact" />}>
            <MessageSquareIcon data-icon="inline-start" />
            Quick reply
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Reply to Priya Nair</DrawerTitle>
              <DrawerDescription>Pick a saved reply to send it now.</DrawerDescription>
            </DrawerHeader>
            <div className="flex flex-col gap-2 p-4">
              {QUICK_REPLIES.map((r) => (
                <DrawerClose key={r} render={<Button variant="elevated" size="compact" className="justify-start" />}>
                  {r}
                </DrawerClose>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      </Demo>
    </Showcase>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Popover
 * ---------------------------------------------------------------------------------------------- */

function SnoozePopover() {
  const [until, setUntil] = React.useState("Tomorrow, 09:00")
  const options = ["Later today, 17:00", "Tomorrow, 09:00", "Next Monday, 09:00"]
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="elevated" size="compact" />}>
        <ClockIcon data-icon="inline-start" />
        Snooze: {until}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64">
        <PopoverHeader>
          <PopoverTitle>Snooze until</PopoverTitle>
          <PopoverDescription>The conversation leaves your inbox until then.</PopoverDescription>
        </PopoverHeader>
        <div className="flex flex-col gap-1">
          {options.map((o) => (
            <Button key={o} variant={o === until ? "secondary" : "ghost"} size="compact" className="justify-start" aria-pressed={o === until} onClick={() => setUntil(o)}>
              {o}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function PopoverShowcase() {
  return (
    <Showcase
      id="popover"
      title="Popover"
      summary="Rich, interactive content anchored to a trigger: pickers, quick settings, previews with actions."
      covers={["side: top", "side: right", "side: bottom", "side: left", "align: start", "align: center", "align: end", "header + description"]}
    >
      <Demo label="Sides">
        {SIDES.map((side) => (
          <Popover key={side}>
            <PopoverTrigger render={trigger}>
              <span className="capitalize">{side}</span>
            </PopoverTrigger>
            <PopoverContent side={side} className="w-56">
              <PopoverHeader>
                <PopoverTitle>Delivery status</PopoverTitle>
                <PopoverDescription>Read by Priya Nair at 14:35.</PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
        ))}
      </Demo>
      <Demo label="Align">
        {ALIGNS.map((align) => (
          <Popover key={align}>
            <PopoverTrigger render={trigger}>
              <span className="capitalize">Align {align}</span>
            </PopoverTrigger>
            <PopoverContent align={align} className="w-56">
              <PopoverHeader>
                <PopoverTitle>Tags</PopoverTitle>
                <PopoverDescription>VIP, Wholesale, Returning customer</PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
        ))}
      </Demo>
      <Demo label="In context">
        <SnoozePopover />
      </Demo>
    </Showcase>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Hover card
 * ---------------------------------------------------------------------------------------------- */

function ContactPreview() {
  return (
    <div className="flex gap-3">
      <Avatar>
        <AvatarFallback>PN</AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-col gap-1">
        <p className="text-sm font-medium">Priya Nair</p>
        <p className="text-xs text-subtle">+44 7700 900 412 · London</p>
        <div className="mt-1 flex gap-1.5">
          <Badge variant="subtle-info">VIP</Badge>
          <Badge variant="subtle">46 conversations</Badge>
        </div>
      </div>
    </div>
  )
}

function HoverCardShowcase() {
  return (
    <Showcase
      id="hover-card"
      title="Hover card"
      summary="A read-only preview behind a link, shown on hover or focus. Don't put the only copy of an action in it."
      covers={["side: top", "side: right", "side: bottom", "side: left", "link trigger", "contact preview"]}
    >
      <Demo label="Sides">
        {SIDES.map((side) => (
          <HoverCard key={side}>
            <HoverCardTrigger href="#hover-card" className="text-sm font-medium text-brand-text underline-offset-4 hover:underline">
              <span className="capitalize">{side}</span>
            </HoverCardTrigger>
            <HoverCardContent side={side}>
              <ContactPreview />
            </HoverCardContent>
          </HoverCard>
        ))}
      </Demo>
      <Demo label="In context">
        <div className="w-full rounded-xl bg-surface p-4 text-sm shadow-card ring-1 ring-hairline">
          <p className="text-muted-foreground">
            Assigned by{" "}
            <HoverCard>
              <HoverCardTrigger href="#hover-card" className="font-medium text-foreground underline decoration-dotted underline-offset-4">
                Priya Nair
              </HoverCardTrigger>
              <HoverCardContent align="start">
                <ContactPreview />
              </HoverCardContent>
            </HoverCard>{" "}
            · 18 Nov 2026, 10:12
          </p>
        </div>
      </Demo>
    </Showcase>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Tooltip
 * ---------------------------------------------------------------------------------------------- */

function TooltipShowcase() {
  const tools = [
    { label: "Bold", icon: BoldIcon, keys: ["⌘", "B"] },
    { label: "Italic", icon: ItalicIcon, keys: ["⌘", "I"] },
    { label: "Attach file", icon: PaperclipIcon, keys: null },
    { label: "Insert emoji", icon: SmileIcon, keys: null },
  ]
  return (
    <Showcase
      id="tooltip"
      title="Tooltip"
      summary="A short label for a control, mostly icon buttons. Shown on hover and keyboard focus."
      covers={["side: top", "side: right", "side: bottom", "side: left", "with shortcut (Kbd)", "icon toolbar", "provider delay"]}
    >
      <Demo label="Sides">
        {SIDES.map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger render={trigger}>
              <span className="capitalize">{side}</span>
            </TooltipTrigger>
            <TooltipContent side={side}>Assign to me</TooltipContent>
          </Tooltip>
        ))}
      </Demo>
      <Demo label="With shortcut">
        <Tooltip>
          <TooltipTrigger render={<Button variant="primary" size="compact" />}>
            <SendIcon data-icon="inline-start" />
            Send message
          </TooltipTrigger>
          <TooltipContent>
            Send now
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>↵</Kbd>
            </KbdGroup>
          </TooltipContent>
        </Tooltip>
      </Demo>
      <Demo label="In context">
        <TooltipProvider delay={300}>
          <div className="flex items-center gap-1 rounded-lg bg-surface p-1 shadow-card ring-1 ring-hairline">
            {tools.map(({ label, icon: Icon, keys }) => (
              <Tooltip key={label}>
                <TooltipTrigger render={<Button variant="ghost" size="icon-compact" aria-label={label} />}>
                  <Icon />
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {label}
                  {keys && (
                    <KbdGroup>
                      {keys.map((k) => (
                        <Kbd key={k}>{k}</Kbd>
                      ))}
                    </KbdGroup>
                  )}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </Demo>
    </Showcase>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Dropdown menu
 * ---------------------------------------------------------------------------------------------- */

function ConversationMenu() {
  const [showRead, setShowRead] = React.useState(true)
  const [showArchived, setShowArchived] = React.useState(false)
  const [sort, setSort] = React.useState("newest")
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={trigger}>
        Conversation
        <ChevronDownIcon data-icon="inline-end" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem>
            <UserPlusIcon />
            Assign to me
            <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CopyIcon />
            Copy link
            <DropdownMenuShortcut>⌘L</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <TagIcon />
              Add tag
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>VIP</DropdownMenuItem>
              <DropdownMenuItem>Wholesale</DropdownMenuItem>
              <DropdownMenuItem>Refund request</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem disabled>
            <MailIcon />
            Send as email (no address)
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Show</DropdownMenuLabel>
          <DropdownMenuCheckboxItem checked={showRead} onCheckedChange={setShowRead}>
            Read messages
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={showArchived} onCheckedChange={setShowArchived}>
            Archived
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={sort} onValueChange={(v) => setSort(v as string)}>
            <DropdownMenuRadioItem value="newest">Newest first</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="oldest">Oldest first</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="unread">Unread first</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Trash2Icon />
          Delete conversation
          <DropdownMenuShortcut>⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function DropdownMenuShowcase() {
  return (
    <Showcase
      id="dropdown-menu"
      title="Dropdown menu"
      summary="A list of actions or options behind a button. Group related items, put shortcuts on the right and the destructive action last."
      covers={["label", "icons", "shortcuts", "submenu", "checkbox items", "radio items", "disabled item", "inset item", "variant: destructive", "align: start/center/end", "side: top"]}
    >
      <Demo label="Full menu">
        <ConversationMenu />
      </Demo>
      <Demo label="Align and side">
        {ALIGNS.map((align) => (
          <DropdownMenu key={align}>
            <DropdownMenuTrigger render={trigger}>
              <span className="capitalize">Align {align}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={align} className="w-44">
              <DropdownMenuItem>Mark as read</DropdownMenuItem>
              <DropdownMenuItem>Snooze</DropdownMenuItem>
              <DropdownMenuItem>Archive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ))}
        <DropdownMenu>
          <DropdownMenuTrigger render={trigger}>Side top</DropdownMenuTrigger>
          <DropdownMenuContent side="top" className="w-44">
            <DropdownMenuLabel inset>Channel</DropdownMenuLabel>
            <DropdownMenuItem inset>WhatsApp</DropdownMenuItem>
            <DropdownMenuItem inset>SMS</DropdownMenuItem>
            <DropdownMenuItem inset>Email</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Demo>
      <Demo label="In context">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="compact" className="gap-2 px-1.5" />}>
            <Avatar size="sm">
              <AvatarFallback>MT</AvatarFallback>
            </Avatar>
            Mei Tanaka
            <ChevronsUpDownIcon data-icon="inline-end" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <span className="block text-sm text-foreground">Mei Tanaka</span>
                <span className="block font-normal">mei@harborflorist.example</span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SettingsIcon />
              Account settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCardIcon />
              Billing
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOutIcon />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Demo>
    </Showcase>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Context menu
 * ---------------------------------------------------------------------------------------------- */

function ContextMenuDemo() {
  const [pinned, setPinned] = React.useState(true)
  const [muted, setMuted] = React.useState(false)
  const [priority, setPriority] = React.useState("normal")
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex w-full items-center gap-3 rounded-xl bg-surface p-4 shadow-card ring-1 ring-hairline">
        <Avatar>
          <AvatarFallback>TO</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">Tomás Ortega</p>
          <p className="truncate text-xs text-subtle">Is the wholesale order still on for Friday?</p>
        </div>
        <span className="text-xs text-subtle">Right-click</span>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuGroup>
          <ContextMenuLabel>Conversation</ContextMenuLabel>
          <ContextMenuItem>
            <MessageSquareIcon />
            Reply
            <ContextMenuShortcut>R</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <UserPlusIcon />
            Assign to me
            <ContextMenuShortcut>⌘A</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <ClockIcon />
              Snooze
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>Later today</ContextMenuItem>
              <ContextMenuItem>Tomorrow</ContextMenuItem>
              <ContextMenuItem>Next week</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuItem disabled>
            <FileTextIcon />
            Export transcript (Pro)
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked={pinned} onCheckedChange={setPinned}>
          Pinned
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem checked={muted} onCheckedChange={setMuted}>
          Muted
        </ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuLabel inset>Priority</ContextMenuLabel>
          <ContextMenuRadioGroup value={priority} onValueChange={(v) => setPriority(v as string)}>
            <ContextMenuRadioItem value="high">High</ContextMenuRadioItem>
            <ContextMenuRadioItem value="normal">Normal</ContextMenuRadioItem>
            <ContextMenuRadioItem value="low">Low</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuItem inset>Mark as unread</ContextMenuItem>
        <ContextMenuItem variant="destructive">
          <Trash2Icon />
          Delete conversation
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

function ContextMenuShowcase() {
  return (
    <Showcase
      id="context-menu"
      title="Context menu"
      summary="Right-click (or long-press) actions for an item in a list. Every action in it must also be reachable another way."
      covers={["label", "inset label and item", "icons", "shortcuts", "submenu", "checkbox items", "radio items", "disabled item", "variant: destructive"]}
    >
      <Demo label="In context">
        <ContextMenuDemo />
      </Demo>
    </Showcase>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Menubar
 * ---------------------------------------------------------------------------------------------- */

function MenubarDemo() {
  const [showSidebar, setShowSidebar] = React.useState(true)
  const [showPreview, setShowPreview] = React.useState(false)
  const [density, setDensity] = React.useState("comfortable")
  return (
    <Menubar className="w-fit">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <PlusIcon />
            New conversation
            <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <LayoutTemplateIcon />
            New template
            <MenubarShortcut>⌘⇧N</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>
              <DownloadIcon />
              Export
            </MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Contacts as CSV</MenubarItem>
              <MenubarItem>Transcripts as PDF</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarItem disabled>Import from spreadsheet</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo
            <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo
            <MenubarShortcut>⌘⇧Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            <SearchIcon />
            Find in conversation
            <MenubarShortcut>⌘F</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarLabel inset>Panels</MenubarLabel>
            <MenubarCheckboxItem checked={showSidebar} onCheckedChange={setShowSidebar}>
              Sidebar
            </MenubarCheckboxItem>
            <MenubarCheckboxItem checked={showPreview} onCheckedChange={setShowPreview}>
              Contact preview
            </MenubarCheckboxItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarLabel inset>Density</MenubarLabel>
            <MenubarRadioGroup value={density} onValueChange={(v) => setDensity(v as string)}>
              <MenubarRadioItem value="comfortable">Comfortable</MenubarRadioItem>
              <MenubarRadioItem value="compact">Compact</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Conversation</MenubarTrigger>
        <MenubarContent>
          <MenubarItem inset>Mark as unread</MenubarItem>
          <MenubarItem inset>Snooze…</MenubarItem>
          <MenubarSeparator />
          <MenubarItem variant="destructive">
            <Trash2Icon />
            Delete conversation
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

function MenubarShowcase() {
  return (
    <Showcase
      id="menubar"
      title="Menubar"
      summary="A desktop-style row of menus for dense tools, such as a template editor. Prefer a toolbar of buttons for fewer than three menus."
      covers={["icons", "shortcuts", "submenu", "checkbox items", "radio items", "inset label and items", "disabled item", "variant: destructive"]}
      stacked
    >
      <Demo label="In context">
        <div className="w-full rounded-xl bg-surface shadow-card ring-1 ring-hairline">
          <div className="flex items-center justify-between gap-3 border-b border-edge/6 px-3 py-2">
            <MenubarDemo />
            <Badge variant="subtle-warning">Draft</Badge>
          </div>
          <p className="p-4 text-sm text-muted-foreground">Hi {"{{first_name}}"}, your order #{"{{order_id}}"} is ready for pickup at Harbor Florist.</p>
        </div>
      </Demo>
    </Showcase>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Command
 * ---------------------------------------------------------------------------------------------- */

function CommandItems() {
  return (
    <>
      <CommandEmpty>No results.</CommandEmpty>
      <CommandGroup heading="Contacts">
        <CommandItem>
          <UserIcon />
          Priya Nair
        </CommandItem>
        <CommandItem data-checked="true">
          <UserIcon />
          Tomás Ortega
        </CommandItem>
        <CommandItem disabled>
          <UserIcon />
          Ana Lima (opted out)
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Actions">
        <CommandItem>
          <SendIcon />
          New message
          <CommandShortcut>⌘N</CommandShortcut>
        </CommandItem>
        <CommandItem>
          <MegaphoneIcon />
          New campaign
          <CommandShortcut>⌘⇧C</CommandShortcut>
        </CommandItem>
        <CommandItem>
          <SettingsIcon />
          Workspace settings
          <CommandShortcut>⌘,</CommandShortcut>
        </CommandItem>
      </CommandGroup>
    </>
  )
}

function CommandEmptyDemo() {
  const [value, setValue] = React.useState("Lisbon office")
  return (
    <Command className="w-full max-w-sm shadow-popover ring-1 ring-hairline">
      <CommandInput placeholder="Search contacts…" value={value} onValueChange={setValue} />
      <CommandList>
        <CommandEmpty>No contacts match “{value}”.</CommandEmpty>
        <CommandGroup heading="Contacts">
          <CommandItem>Priya Nair</CommandItem>
          <CommandItem>Tomás Ortega</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

function CommandDialogDemo() {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <Button variant="elevated" size="compact" onClick={() => setOpen(true)}>
        <SearchIcon data-icon="inline-start" />
        Search Relay
        <KbdGroup className="ml-2">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Search Relay" description="Find contacts, templates and actions">
        <Command>
          <CommandInput placeholder="Search contacts, templates, actions…" />
          <CommandList>
            <CommandItems />
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}

function CommandShowcase() {
  return (
    <Showcase
      id="command"
      title="Command"
      summary="Searchable list of contacts and actions. Inline as a picker, or in a dialog as the ⌘K palette."
      covers={["inline", "dialog", "groups + headings", "separator", "icons", "shortcuts", "checked item", "disabled item", "empty"]}
    >
      <Demo label="Inline">
        <Command className="w-full max-w-sm shadow-popover ring-1 ring-hairline">
          <CommandInput placeholder="Search contacts and actions…" />
          <CommandList>
            <CommandItems />
          </CommandList>
        </Command>
      </Demo>
      <Demo label="Empty">
        <CommandEmptyDemo />
      </Demo>
      <Demo label="Dialog">
        <CommandDialogDemo />
      </Demo>
    </Showcase>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Navigation menu
 * ---------------------------------------------------------------------------------------------- */

const PRODUCT_LINKS = [
  { title: "Shared inbox", description: "WhatsApp, SMS and email in one place.", icon: InboxIcon },
  { title: "Campaigns", description: "Send offers to opted-in contacts.", icon: MegaphoneIcon },
  { title: "Templates", description: "Approved messages your team reuses.", icon: LayoutTemplateIcon },
  { title: "Automations", description: "Auto-replies outside opening hours.", icon: SparklesIcon },
]

function NavigationMenuDemo({ align }: { align: "start" | "center" | "end" }) {
  return (
    <NavigationMenu align={align}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Product</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[26rem] max-w-[calc(100vw-2rem)] gap-1 sm:grid-cols-2">
              {PRODUCT_LINKS.map(({ title, description, icon: Icon }) => (
                <li key={title}>
                  <NavigationMenuLink href="#navigation-menu" className="items-start">
                    <Icon className="mt-0.5 text-subtle" />
                    <span className="flex flex-col gap-0.5">
                      <span className="font-medium">{title}</span>
                      <span className="text-xs text-muted-foreground">{description}</span>
                    </span>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex w-56 flex-col gap-1">
              {["Help center", "Changelog", "WhatsApp approval guide"].map((t) => (
                <li key={t}>
                  <NavigationMenuLink href="#navigation-menu">{t}</NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#navigation-menu" className={navigationMenuTriggerStyle()} active>
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function NavigationMenuShowcase() {
  const [align, setAlign] = React.useState<"start" | "center" | "end">("start")
  return (
    <Showcase
      id="navigation-menu"
      title="Navigation menu"
      summary="Site navigation with dropdown panels of links, for marketing headers and docs. For app navigation use the sidebar or tabs."
      covers={["trigger + content", "plain link", "active link", "align: start", "align: center", "align: end"]}
      stacked
    >
      <Demo label="Align">
        <SegmentedControl value={align} onValueChange={(v) => setAlign(v as typeof align)} aria-label="Panel alignment">
          {ALIGNS.map((a) => (
            <SegmentedControlItem key={a} value={a} className="capitalize">
              {a}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
      </Demo>
      <Demo label="In context">
        <div className="flex w-full items-center justify-between gap-4 rounded-xl bg-surface px-4 py-2 shadow-card ring-1 ring-hairline">
          <span className="text-sm font-semibold">Relay</span>
          <NavigationMenuDemo align={align} />
          <Button variant="primary" size="compact">Start free trial</Button>
        </div>
      </Demo>
    </Showcase>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Breadcrumb
 * ---------------------------------------------------------------------------------------------- */

function BreadcrumbShowcase() {
  return (
    <Showcase
      id="breadcrumb"
      title="Breadcrumb"
      summary="Where the current page sits in the hierarchy, with links back up. Collapse the middle when the path is long."
      covers={["links + current page", "ellipsis (collapsed)", "ellipsis menu", "custom separator", "page header"]}
    >
      <Demo label="Basic">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#breadcrumb">Contacts</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#breadcrumb">Wholesale</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Tomás Ortega</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Demo>
      <Demo label="Collapsed">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#breadcrumb">Settings</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Webhooks</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#breadcrumb">Settings</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="ghost" size="icon-xs" aria-label="Show hidden pages" />}>
                  <MoreHorizontalIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40">
                  <DropdownMenuItem>Workspace</DropdownMenuItem>
                  <DropdownMenuItem>Channels</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>WhatsApp</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Demo>
      <Demo label="Custom separator">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#breadcrumb">Campaigns</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <SlashIcon />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Spring restock</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Demo>
      <Demo label="In context">
        <div className="flex w-full flex-col gap-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#breadcrumb">Templates</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Order ready for pickup</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-xl font-semibold">Order ready for pickup</h4>
            <Button variant="primary" size="compact">Save template</Button>
          </div>
        </div>
      </Demo>
    </Showcase>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Pagination
 * ---------------------------------------------------------------------------------------------- */

const PAGE_COUNT = 12

function pageWindow(page: number): (number | "gap")[] {
  if (page <= 3) return [1, 2, 3, 4, "gap", PAGE_COUNT]
  if (page >= PAGE_COUNT - 2) return [1, "gap", PAGE_COUNT - 3, PAGE_COUNT - 2, PAGE_COUNT - 1, PAGE_COUNT]
  return [1, "gap", page - 1, page, page + 1, "gap", PAGE_COUNT]
}

function PaginationDemo({ compact = false, initial = 1 }: { compact?: boolean; initial?: number }) {
  const [page, setPage] = React.useState(initial)
  const go = (p: number) => (e: React.MouseEvent) => {
    e.preventDefault()
    setPage(Math.min(PAGE_COUNT, Math.max(1, p)))
  }
  const off = "pointer-events-none opacity-50"
  return (
    <Pagination className="mx-0 w-auto justify-start">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#pagination"
            {...(compact && { size: "compact" as const })}
            aria-disabled={page === 1 || undefined}
            className={cn(page === 1 && off)}
            onClick={go(page - 1)}
          />
        </PaginationItem>
        {pageWindow(page).map((p, i) =>
          p === "gap" ? (
            <PaginationItem key={`gap-${i}`}>
              <PaginationEllipsis className={cn(compact && "size-7")} />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink href="#pagination" size={compact ? "icon-compact" : undefined} isActive={p === page} onClick={go(p)}>
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationNext
            href="#pagination"
            {...(compact && { size: "compact" as const })}
            aria-disabled={page === PAGE_COUNT || undefined}
            className={cn(page === PAGE_COUNT && off)}
            onClick={go(page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

function PaginationShowcase() {
  return (
    <Showcase
      id="pagination"
      title="Pagination"
      summary="Moves between pages of a long list such as contacts or message history."
      covers={["active page", "ellipsis", "previous / next", "disabled previous (first page)", "disabled next (last page)", "size: icon (default)", "size: icon-compact", "table footer"]}
    >
      <Demo label="Default size">
        <PaginationDemo />
      </Demo>
      <Demo label="Compact, last page">
        <PaginationDemo compact initial={PAGE_COUNT} />
      </Demo>
      <Demo label="In context">
        <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-xl bg-surface px-4 py-2 shadow-card ring-1 ring-hairline">
          <p className="text-xs text-subtle tabular-nums">Showing 101–125 of 2,418 contacts</p>
          <PaginationDemo compact initial={5} />
        </div>
      </Demo>
    </Showcase>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Tabs
 * ---------------------------------------------------------------------------------------------- */

function TabsShowcase() {
  return (
    <Showcase
      id="tabs"
      title="Tabs"
      summary="Switches between views of the same object. Default for compact switches, line and underline for page-level navigation."
      covers={["variant: default", "variant: line", "variant: underline", "orientation: horizontal", "orientation: vertical", "with icons", "disabled trigger", "selected"]}
    >
      <Demo label="Variants">
        <div className="flex w-full flex-col gap-5">
          <Tabs defaultValue="open">
            <TabsList>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="snoozed">Snoozed</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
              <TabsTrigger value="spam" disabled>
                Spam
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Tabs defaultValue="open">
            <TabsList variant="line">
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="snoozed">Snoozed</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
              <TabsTrigger value="spam" disabled>
                Spam
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Tabs defaultValue="overview">
            <TabsList variant="underline">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="billing" disabled>
                Billing
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </Demo>
      <Demo label="With icons">
        <Tabs defaultValue="whatsapp">
          <TabsList>
            <TabsTrigger value="whatsapp">
              <MessageSquareIcon data-icon="inline-start" />
              WhatsApp
            </TabsTrigger>
            <TabsTrigger value="sms">
              <SendIcon data-icon="inline-start" />
              SMS
            </TabsTrigger>
            <TabsTrigger value="email">
              <MailIcon data-icon="inline-start" />
              Email
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </Demo>
      <Demo label="Vertical" className="items-start gap-8">
        <Tabs defaultValue="profile" orientation="vertical">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="channels">Channels</TabsTrigger>
            <TabsTrigger value="billing" disabled>
              Billing
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Tabs defaultValue="channels" orientation="vertical">
          <TabsList variant="line">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="channels">Channels</TabsTrigger>
            <TabsTrigger value="billing" disabled>
              Billing
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </Demo>
      <Demo label="In context">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList variant="underline">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="pt-2 text-muted-foreground">
            Priya Nair · Customer since March 2024 · 46 conversations · Lifetime spend $2,310
          </TabsContent>
          <TabsContent value="messages" className="pt-2 text-muted-foreground">
            Last message: “Can I change the pickup time to 4pm?” · 18 Nov 2026
          </TabsContent>
          <TabsContent value="notes" className="pt-2 text-muted-foreground">
            Prefers WhatsApp. Allergic to lilies — never include them in bouquets.
          </TabsContent>
        </Tabs>
      </Demo>
    </Showcase>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Accordion
 * ---------------------------------------------------------------------------------------------- */

const FAQ = [
  { value: "opt-out", q: "What happens when a contact opts out?", a: "Relay stops campaign messages to them right away. You can still reply when they message you first." },
  { value: "templates", q: "Why does WhatsApp need template approval?", a: "WhatsApp reviews messages you send outside the 24-hour reply window. Approval usually takes under an hour." },
  { value: "billing", q: "How are SMS messages billed?", a: "Each 160-character segment counts as one message, billed at your plan's per-message rate." },
]

function AccordionShowcase() {
  return (
    <Showcase
      id="accordion"
      title="Accordion"
      summary="Stacked sections that expand in place. Good for FAQs and long settings pages; keep the first useful one open."
      covers={["single (one open by default)", "multiple", "closed", "disabled item"]}
    >
      <Demo label="Single, first open">
        <Accordion defaultValue={["opt-out"]}>
          {FAQ.map((f) => (
            <AccordionItem key={f.value} value={f.value}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Demo>
      <Demo label="Multiple, disabled item">
        <Accordion multiple defaultValue={["whatsapp", "sms"]}>
          <AccordionItem value="whatsapp">
            <AccordionTrigger>WhatsApp · Connected</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">+44 20 7946 0958 · Business account verified</AccordionContent>
          </AccordionItem>
          <AccordionItem value="sms">
            <AccordionTrigger>SMS · Connected</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">Sender ID “HARBOR” · 2 numbers</AccordionContent>
          </AccordionItem>
          <AccordionItem value="email" disabled>
            <AccordionTrigger>Email · Upgrade to connect</AccordionTrigger>
            <AccordionContent>Email inbox is part of the Growth plan.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Demo>
    </Showcase>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Collapsible
 * ---------------------------------------------------------------------------------------------- */

function RecipientsCollapsible({ defaultOpen }: { defaultOpen: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen)
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full max-w-xs rounded-lg bg-surface p-3 shadow-card ring-1 ring-hairline">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">5 recipients</p>
        <CollapsibleTrigger render={<Button variant="ghost" size="icon-compact-sm" aria-label={open ? "Hide recipients" : "Show recipients"} />}>
          <ChevronDownIcon className={cn("transition-transform", open && "rotate-180")} />
        </CollapsibleTrigger>
      </div>
      <p className="mt-1 text-xs text-subtle">Priya Nair, Tomás Ortega</p>
      <CollapsibleContent>
        <ul className="mt-1 flex flex-col gap-0.5 text-xs text-subtle">
          <li>Mei Tanaka</li>
          <li>Kwame Mensah</li>
          <li>Sofia Lindqvist</li>
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}

function AdvancedSettings() {
  const id = React.useId()
  return (
    <Collapsible className="w-full rounded-xl bg-surface shadow-card ring-1 ring-hairline">
      <CollapsibleTrigger className="group flex w-full items-center justify-between gap-2 rounded-xl px-4 py-3 text-left text-sm font-medium outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:[--tw-outline-style:solid]">
        Advanced delivery settings
        <ChevronRightIcon className="size-4 text-subtle transition-transform group-data-[panel-open]:rotate-90" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex flex-col gap-3 border-t border-edge/6 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor={`${id}-quiet`}>Respect quiet hours (21:00–08:00)</Label>
            <Switch id={`${id}-quiet`} defaultChecked />
          </div>
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor={`${id}-fallback`}>Fall back to SMS if WhatsApp fails</Label>
            <Switch id={`${id}-fallback`} />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function CollapsibleShowcase() {
  return (
    <Showcase
      id="collapsible"
      title="Collapsible"
      summary="Shows and hides one region. Use it for optional detail; for a list of sections use the accordion."
      covers={["open", "closed", "icon trigger", "row trigger", "settings in context"]}
    >
      <Demo label="States" className="items-start">
        <RecipientsCollapsible defaultOpen />
        <RecipientsCollapsible defaultOpen={false} />
      </Demo>
      <Demo label="In context">
        <AdvancedSettings />
      </Demo>
    </Showcase>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Sidebar
 * ---------------------------------------------------------------------------------------------- */

const INBOX_NAV = [
  { title: "Conversations", icon: InboxIcon, badge: "12", active: true },
  { title: "Mentions", icon: BellIcon, badge: "3" },
  { title: "Campaigns", icon: MegaphoneIcon },
]

const TEMPLATE_NAV = [
  { title: "Approved", active: true },
  { title: "Pending review" },
  { title: "Drafts" },
]

type SidebarVariant = "sidebar" | "floating" | "inset"
type SidebarCollapsible = "icon" | "offcanvas"

function RelaySidebar({
  variant,
  side,
  collapsible,
}: {
  variant: SidebarVariant
  side: "left" | "right"
  collapsible: SidebarCollapsible
}) {
  return (
    <Sidebar variant={variant} side={side} collapsible={collapsible} className="absolute h-full">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Harbor Florist">
              <span className="flex size-8 items-center justify-center rounded-md bg-brand text-sm font-semibold text-brand-foreground">H</span>
              <span className="grid flex-1 text-left leading-tight">
                <span className="truncate font-medium">Harbor Florist</span>
                <span className="truncate text-xs text-subtle">Growth plan</span>
              </span>
              <ChevronsUpDownIcon className="ml-auto" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarInput placeholder="Search…" aria-label="Search Relay" className="group-data-[collapsible=icon]:hidden" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Inbox</SidebarGroupLabel>
          <SidebarGroupAction title="New conversation">
            <PlusIcon />
            <span className="sr-only">New conversation</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {INBOX_NAV.map(({ title, icon: Icon, badge, active }) => (
                <SidebarMenuItem key={title}>
                  <SidebarMenuButton isActive={active} tooltip={title}>
                    <Icon />
                    <span>{title}</span>
                  </SidebarMenuButton>
                  {badge && <SidebarMenuBadge>{badge}</SidebarMenuBadge>}
                </SidebarMenuItem>
              ))}
              <Collapsible defaultOpen className="group/collapsible" render={<SidebarMenuItem />}>
                <CollapsibleTrigger render={<SidebarMenuButton tooltip="Templates" />}>
                  <LayoutTemplateIcon />
                  <span>Templates</span>
                  <ChevronRightIcon className="ml-auto transition-transform group-data-open/collapsible:rotate-90" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {TEMPLATE_NAV.map((t) => (
                      <SidebarMenuSubItem key={t.title}>
                        <SidebarMenuSubButton href="#sidebar" isActive={t.active}>
                          <span>{t.title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Contacts">
                  <UsersIcon />
                  <span>Contacts</span>
                </SidebarMenuButton>
                <SidebarMenuAction title="Add contact">
                  <UserPlusIcon />
                  <span className="sr-only">Add contact</span>
                </SidebarMenuAction>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="sm" tooltip="Teammates">
                  <UsersIcon />
                  <span>Teammates</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton size="sm" tooltip="Billing">
                  <CreditCardIcon />
                  <span>Billing</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton size="sm" tooltip="Settings" disabled>
                  <SettingsIcon />
                  <span>Settings (admins only)</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton variant="outline" tooltip="Upgrade plan">
              <SparklesIcon />
              <span>Upgrade plan</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Mei Tanaka">
              <Avatar size="sm">
                <AvatarFallback>MT</AvatarFallback>
              </Avatar>
              <span className="grid flex-1 text-left leading-tight">
                <span className="truncate font-medium">Mei Tanaka</span>
                <span className="truncate text-xs text-subtle">mei@harborflorist.example</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function SidebarDemo() {
  const [variant, setVariant] = React.useState<SidebarVariant>("sidebar")
  const [side, setSide] = React.useState<"left" | "right">("left")
  const [collapsible, setCollapsible] = React.useState<SidebarCollapsible>("icon")
  const [open, setOpen] = React.useState(true)
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <SegmentedControl value={variant} onValueChange={(v) => setVariant(v as SidebarVariant)} aria-label="Sidebar variant">
          <SegmentedControlItem value="sidebar">Sidebar</SegmentedControlItem>
          <SegmentedControlItem value="floating">Floating</SegmentedControlItem>
          <SegmentedControlItem value="inset">Inset</SegmentedControlItem>
        </SegmentedControl>
        <SegmentedControl value={side} onValueChange={(v) => setSide(v as "left" | "right")} aria-label="Sidebar side">
          <SegmentedControlItem value="left">Left</SegmentedControlItem>
          <SegmentedControlItem value="right">Right</SegmentedControlItem>
        </SegmentedControl>
        <SegmentedControl value={collapsible} onValueChange={(v) => setCollapsible(v as SidebarCollapsible)} aria-label="Collapse mode">
          <SegmentedControlItem value="icon">Icons</SegmentedControlItem>
          <SegmentedControlItem value="offcanvas">Off-canvas</SegmentedControlItem>
        </SegmentedControl>
      </div>
      <SidebarProvider
        open={open}
        onOpenChange={setOpen}
        className={cn("relative h-[30rem] min-h-0 overflow-hidden rounded-xl ring-1 ring-hairline", side === "right" && "flex-row-reverse")}
      >
        <RelaySidebar variant={variant} side={side} collapsible={collapsible} />
        <SidebarInset className="min-w-0">
          <div className="flex h-12 shrink-0 items-center gap-2 border-b border-edge/6 px-3">
            <SidebarTrigger label="Toggle sidebar" />
            <Separator orientation="vertical" className="h-4" />
            <span className="text-sm font-medium">Conversations</span>
            <Badge variant="subtle" className="ml-auto">
              {open ? "Expanded" : "Collapsed"}
            </Badge>
          </div>
          <ul className="flex flex-col divide-y divide-edge/6">
            {[
              ["Priya Nair", "Can I change the pickup time to 4pm?", "14:32"],
              ["Tomás Ortega", "Is the wholesale order still on for Friday?", "12:08"],
              ["Kwame Mensah", "Thanks, the flowers arrived!", "Yesterday"],
            ].map(([name, text, time]) => (
              <li key={name} className="flex items-baseline gap-3 px-4 py-3 text-sm">
                <span className="w-28 shrink-0 truncate font-medium">{name}</span>
                <span className="min-w-0 flex-1 truncate text-muted-foreground">{text}</span>
                <span className="shrink-0 text-xs text-subtle">{time}</span>
              </li>
            ))}
          </ul>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

function SidebarShowcase() {
  return (
    <Showcase
      id="sidebar"
      title="Sidebar"
      summary="The app's main navigation: grouped items, counts, nested pages and a collapse-to-icons mode (⌘B, the rail or the trigger). Shown contained here; in an app it fills the viewport height."
      covers={[
        "variant: sidebar",
        "variant: floating",
        "variant: inset",
        "side: left",
        "side: right",
        "collapsible: icon",
        "collapsible: offcanvas",
        "groups + labels",
        "group action",
        "active item",
        "badges",
        "menu action",
        "sub-menu (collapsible)",
        "active sub-item",
        "button size: default/sm/lg",
        "button variant: outline",
        "disabled item",
        "tooltips when collapsed",
        "input",
        "rail + trigger",
      ]}
      stacked
    >
      <Demo label="In context">
        <SidebarDemo />
      </Demo>
    </Showcase>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Toast (Base UI)
 * ---------------------------------------------------------------------------------------------- */

function ToastShowcase() {
  const types = [
    { type: undefined, label: "Default", title: "Message sent", description: "Delivered to Priya Nair via WhatsApp." },
    { type: "success", label: "Success", title: "Template approved", description: "“Order ready for pickup” is ready to use." },
    { type: "info", label: "Info", title: "New teammate", description: "Kwame Mensah joined Harbor Florist." },
    { type: "warning", label: "Warning", title: "80% of SMS credits used", description: "Top up before your next campaign." },
    { type: "error", label: "Error", title: "Message failed", description: "+34 612 555 018 isn't on WhatsApp." },
    { type: "loading", label: "Loading", title: "Importing contacts…", description: "This can take a minute." },
  ] as const

  return (
    <Showcase
      id="toast"
      title="Toast"
      summary="Brief, non-blocking feedback after an action, stacked at the bottom right. Hover the stack to expand it; swipe to dismiss."
      covers={["type: default", "type: success", "type: info", "type: warning", "type: error", "type: loading", "with action", "promise", "persistent"]}
    >
      <Demo label="Types">
        {types.map((t) => (
          <Button key={t.label} variant="elevated" size="compact" onClick={() => toast.add({ type: t.type, title: t.title, description: t.description })}>
            {t.label}
          </Button>
        ))}
      </Demo>
      <Demo label="Behaviour">
        <Button
          variant="elevated"
          size="compact"
          onClick={() => {
            const id = toast.add({
              title: "Conversation archived",
              description: "Tomás Ortega · 4 messages",
              actionProps: {
                children: "Undo",
                onClick() {
                  toast.close(id)
                  toast.add({ title: "Conversation restored" })
                },
              },
            })
          }}
        >
          With action
        </Button>
        <Button
          variant="elevated"
          size="compact"
          onClick={() =>
            toast.promise(
              new Promise<{ count: number }>((resolve) => {
                window.setTimeout(() => resolve({ count: 1204 }), 2000)
              }),
              {
                loading: "Scheduling campaign…",
                success: (d) => `Campaign scheduled for ${d.count.toLocaleString("en-US")} contacts.`,
                error: "Couldn't schedule the campaign.",
              }
            )
          }
        >
          Promise
        </Button>
        <Button
          variant="elevated"
          size="compact"
          onClick={() => toast.add({ type: "warning", title: "WhatsApp disconnected", description: "Reconnect to keep receiving messages.", timeout: 0 })}
        >
          Persistent
        </Button>
      </Demo>
      <Demo label="In context">
        <Button variant="primary" size="compact" onClick={() => toast.add({ type: "success", title: "Template saved", description: "Submitted to WhatsApp for review." })}>
          Save template
        </Button>
      </Demo>
    </Showcase>
  )
}

/* ------------------------------------------------------------------------------------------------
 * Sonner
 * ---------------------------------------------------------------------------------------------- */

const SONNER_POSITIONS = ["top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"] as const

function SonnerShowcase() {
  return (
    <Showcase
      id="sonner"
      title="Sonner"
      summary="Toasts on the Sonner library, for apps that already use it. Same surface as the other popups; follows the page theme."
      covers={["default", "description", "success", "info", "warning", "error", "loading", "action", "cancel", "promise", "positions"]}
    >
      <Demo label="Types">
        <Button variant="elevated" size="compact" onClick={() => sonner("Message sent")}>
          Default
        </Button>
        <Button variant="elevated" size="compact" onClick={() => sonner("Message sent", { description: "Delivered to Priya Nair at 14:32." })}>
          Description
        </Button>
        <Button variant="elevated" size="compact" onClick={() => sonner.success("Template approved")}>
          Success
        </Button>
        <Button variant="elevated" size="compact" onClick={() => sonner.info("Kwame Mensah joined the workspace")}>
          Info
        </Button>
        <Button variant="elevated" size="compact" onClick={() => sonner.warning("80% of SMS credits used")}>
          Warning
        </Button>
        <Button variant="elevated" size="compact" onClick={() => sonner.error("Message failed to send")}>
          Error
        </Button>
        <Button variant="elevated" size="compact" onClick={() => sonner.loading("Importing 2,418 contacts…")}>
          Loading
        </Button>
      </Demo>
      <Demo label="Behaviour">
        <Button
          variant="elevated"
          size="compact"
          onClick={() =>
            sonner("Contact deleted", {
              description: "Ana Lima",
              action: { label: "Undo", onClick: () => sonner.success("Contact restored") },
            })
          }
        >
          Action
        </Button>
        <Button
          variant="elevated"
          size="compact"
          onClick={() => sonner("Campaign paused", { cancel: { label: "Dismiss", onClick: () => {} } })}
        >
          Cancel
        </Button>
        <Button
          variant="elevated"
          size="compact"
          onClick={() =>
            sonner.promise(
              new Promise<string>((resolve) => {
                window.setTimeout(() => resolve("contacts.csv"), 2000)
              }),
              {
                loading: "Exporting contacts…",
                success: (file) => `Saved ${file}`,
                error: "Export failed",
              }
            )
          }
        >
          Promise
        </Button>
      </Demo>
      <Demo label="Positions">
        {SONNER_POSITIONS.map((position) => (
          <Button key={position} variant="elevated" size="compact" onClick={() => sonner("Reply sent", { position })}>
            {position}
          </Button>
        ))}
      </Demo>
      <Demo label="In context">
        <Button variant="primary" size="compact" onClick={() => sonner.success("Campaign scheduled", { description: "Spring restock · 24 Nov 2026, 09:00" })}>
          <SendIcon data-icon="inline-start" />
          Schedule campaign
        </Button>
      </Demo>
    </Showcase>
  )
}
