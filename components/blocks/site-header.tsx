"use client"

import * as React from "react"
import { BookOpenIcon, BoxesIcon, KeyRoundIcon, LayersIcon, PlugIcon, ShieldCheckIcon, TerminalIcon, UsersIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

export type SiteNavLink = { title: string; description?: string; href: string; icon?: React.ReactNode }
export type SiteNavGroup = { title: string; items: SiteNavLink[] }
export type SiteNavItem = { label: string; href: string } | { label: string; groups: SiteNavGroup[] }
export type SiteAnnouncement = { text: string; cta: string; href: string }

/* Shared easing for the header (450ms out, 200ms on hover). */
const ease = "transition-[color,background-color,border-color,box-shadow] duration-450 ease-[cubic-bezier(0.33,1,0.68,1)] hover:duration-200"
const arrowMotion = "transition duration-300 ease-[cubic-bezier(0.4,0.36,0,1)]"

function Triangle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 10 10" aria-hidden="true" className={cn("size-2.5 flex-none", className)}>
      <path fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m7.25 5-3.5-2.25v4.5L7.25 5Z" />
    </svg>
  )
}

/** Default logo: a round mark and a lowercase wordmark. Pass your own through `logo`. */
export function AcmeLogo({ name = "Acme", href = "#home", className }: { name?: string; href?: string; className?: string }) {
  return (
    <a href={href} className={cn("inline-flex items-center gap-1.5 text-[1.0625rem] font-semibold tracking-[-0.03em] text-foreground", className)}>
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4.5">
        <circle cx="12" cy="12" r="10" className="fill-foreground" />
        <path d="M7.5 15.5 12 7l4.5 8.5" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="stroke-background" />
      </svg>
      {name.toLowerCase()}
    </a>
  )
}

/** Dark strip above the header; skewed side panels and a sliding arrow on hover. */
export function AnnouncementBar({ text, cta, href, className }: SiteAnnouncement & { className?: string }) {
  const side =
    "relative -my-2 grow overflow-hidden before:absolute before:inset-0 before:-translate-y-[calc(100%-0.625rem)] before:rounded before:border-background/15 before:bg-background/8"
  return (
    <a
      href={href}
      className={cn(
        "group relative z-10 flex w-full gap-x-4 bg-foreground py-2 text-sm font-medium whitespace-nowrap text-background outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-inset",
        className
      )}
    >
      <div aria-hidden="true" className={cn(side, "before:mr-8 before:skew-x-[-45deg] before:border-r before:border-b")} />
      <div className="truncate">{text}</div>
      <div aria-hidden="true" className="my-0.75 w-px flex-none bg-background/20" />
      <span className="hidden items-center sm:inline-flex">
        {cta}
        <Triangle className={cn("ml-2 opacity-60 group-hover:translate-x-6 group-hover:opacity-0", arrowMotion)} />
        <Triangle className={cn("-ml-2.5 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100", arrowMotion)} />
      </span>
      <div aria-hidden="true" className={cn(side, "before:ml-8 before:skew-x-45 before:border-b before:border-l")} />
    </a>
  )
}

/** Stacked backdrop blurs that fade out downward, so content softens behind the floating bar. */
function ProgressiveBlur() {
  const layers = [1, 1, 2, 2, 3, 4, 5, 6, 8, 10, 12, 16]
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-2 -z-10 h-[3.15rem]">
      {layers.map((px, i) => {
        const mask = `linear-gradient(to bottom, black 40%, transparent ${100 - i * 5}%)`
        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{ backdropFilter: `blur(${px}px)`, WebkitBackdropFilter: `blur(${px}px)`, maskImage: mask, WebkitMaskImage: mask }}
          />
        )
      })}
    </div>
  )
}

/* Hovering or opening any item dims its siblings; the active one stays full strength. */
const navText = cn(
  ease,
  "text-[0.8125rem] leading-6 font-medium text-foreground",
  "group-has-[[data-navitem]:hover]/nav:text-subtle group-has-data-popup-open/nav:text-subtle",
  "group-hover/item:text-foreground! group-data-popup-open/navigation-menu-trigger:text-foreground!"
)

const triggerReset =
  "h-auto rounded-md bg-transparent! px-2 py-0 hover:bg-transparent focus:bg-transparent data-popup-open:bg-transparent [&>svg]:size-2.5 [&>svg]:ml-1.5"

/** Mobile accordion section: one expandable group of links. */
function MobileSection({
  item,
  defaultOpen,
  onNavigate,
}: {
  item: Extract<SiteNavItem, { groups: SiteNavGroup[] }>
  defaultOpen?: boolean
  onNavigate: () => void
}) {
  const [open, setOpen] = React.useState(!!defaultOpen)
  const id = React.useId()
  return (
    <li className="group/item">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="group flex w-full items-center justify-between border-t border-edge/6 py-3 pr-1.25 text-lg/6 font-medium text-foreground outline-none group-first/item:border-t-0 focus-visible:ring-2 focus-visible:ring-brand/40"
      >
        {item.label}
        <svg viewBox="0 0 10 10" aria-hidden="true" fill="none" className="size-2.5 text-subtle transition-transform group-aria-expanded:rotate-180 group-aria-expanded:text-foreground">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M1.75 3.75 5 7.25l3.25-3.5" />
        </svg>
      </button>
      <div id={id} hidden={!open} className="space-y-6 pt-3 pb-6">
        {item.groups.map((group) => (
          <div key={group.title}>
            <div className="mb-3 text-[0.6875rem]/4 font-medium tracking-wide text-muted-foreground uppercase">{group.title}</div>
            <ul className="flex flex-col gap-y-4">
              {group.items.map((link) => (
                <li key={link.title}>
                  <a href={link.href} onClick={onNavigate} className="group/link flex items-center gap-x-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-brand/40">
                    {link.icon && (
                      <span className="flex size-8 flex-none items-center justify-center rounded-md bg-surface text-foreground shadow-surface ring-1 ring-hairline [&_svg]:size-4">
                        {link.icon}
                      </span>
                    )}
                    <span>
                      <span className="block text-[0.8125rem]/5 font-medium text-foreground">{link.title}</span>
                      {link.description && (
                        <span className="block text-xs/4 text-muted-foreground transition-colors group-hover/link:text-foreground">{link.description}</span>
                      )}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </li>
  )
}

/**
 * Floating sticky marketing header: optional announcement bar, logo slot, mega-menu navigation,
 * sign-in/sign-up actions and a phone menu. `tone="dark"` swaps it to dark tokens.
 */
export function SiteHeader({
  nav = defaultNav,
  announcement = defaultAnnouncement,
  logo = <AcmeLogo />,
  signInHref = "#sign-in",
  signUpHref = "#sign-up",
  signInLabel = "Sign in",
  signUpLabel = "Sign up",
  tone = "light",
  className,
}: {
  nav?: SiteNavItem[]
  /** Pass `null` to hide the bar. */
  announcement?: SiteAnnouncement | null
  logo?: React.ReactNode
  signInHref?: string
  signUpHref?: string
  signInLabel?: string
  signUpLabel?: string
  tone?: "light" | "dark"
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  const headerRef = React.useRef<HTMLElement>(null)
  const toggleRef = React.useRef<HTMLButtonElement>(null)
  const panelId = React.useId()
  const close = () => setOpen(false)

  React.useEffect(() => {
    if (!open) return
    // Lock page scroll, close on Escape (returning focus to the toggle), and close when the viewport grows to desktop.
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      setOpen(false)
      toggleRef.current?.focus()
    }
    const mq = window.matchMedia("(min-width: 48rem)")
    const onMq = () => mq.matches && setOpen(false)
    window.addEventListener("keydown", onKey)
    mq.addEventListener("change", onMq)

    // Make everything outside the header inert while the menu covers the page.
    const inerted: HTMLElement[] = []
    let node: HTMLElement | null = headerRef.current
    while (node && node !== document.body && node.parentElement) {
      for (const sibling of Array.from(node.parentElement.children)) {
        if (sibling !== node && sibling instanceof HTMLElement && !sibling.inert) {
          sibling.inert = true
          inerted.push(sibling)
        }
      }
      node = node.parentElement
    }

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener("keydown", onKey)
      mq.removeEventListener("change", onMq)
      inerted.forEach((el) => (el.inert = false))
    }
  }, [open])

  return (
    <>
      {announcement && <AnnouncementBar {...announcement} />}
      <header ref={headerRef} data-tone={tone} className={cn("sticky top-2 isolate z-50 mt-2 h-fit w-full", tone === "dark" && "dark", className)}>
        <div className="relative z-40">
          <ProgressiveBlur />
          <div
            className={cn(
              ease,
              "relative mx-auto flex h-fit w-[calc(100vw-1rem)] max-w-6xl items-center rounded-xl bg-surface-muted/90 py-0 pr-0 pl-3 shadow-surface ring-1 ring-hairline backdrop-blur-md md:w-[calc(100vw-2rem)] md:py-2 md:pr-2",
              "[@media(width<22.5rem)]:h-10.5"
            )}
          >
            <div className="flex items-center gap-x-3 select-none">
              {logo}
              <div aria-hidden="true" className="hidden h-6.5 w-px bg-edge/12 md:block" />
            </div>

            <NavigationMenu className="ml-3 hidden md:flex">
              <NavigationMenuList className="group/nav">
                {nav.map((item, i) => (
                  <NavigationMenuItem key={item.label} data-navitem="" className="group/item flex">
                    {"groups" in item ? (
                      <>
                        <NavigationMenuTrigger className={cn(triggerReset, navText, i === 0 && "pl-0")}>{item.label}</NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className={cn("grid gap-4 p-2", item.groups.length > 1 ? "w-130 grid-cols-2" : "w-70")}>
                            {item.groups.map((group) => (
                              <div key={group.title}>
                                <p className="px-2 pt-1 pb-2 text-[0.6875rem] font-medium tracking-wide text-placeholder uppercase">{group.title}</p>
                                <ul className="grid gap-0.5">
                                  {group.items.map((link) => (
                                    <li key={link.title}>
                                      <NavigationMenuLink href={link.href} className="items-start gap-2.5 px-2 py-1.5">
                                        {link.icon && <span className="mt-0.5 flex-none text-subtle [&_svg]:size-4">{link.icon}</span>}
                                        <span className="flex flex-col gap-0.5">
                                          <span className="text-[0.8125rem] font-medium text-foreground">{link.title}</span>
                                          {link.description && <span className="text-xs text-subtle">{link.description}</span>}
                                        </span>
                                      </NavigationMenuLink>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink href={item.href} className={cn(navText, "rounded-md p-0 px-2 hover:bg-transparent focus:bg-transparent")}>
                        {item.label}
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            <div className="ml-auto flex items-center [@media(width<22.5rem)]:hidden">
              <Button variant="ghost" size="compact-sm" nativeButton={false} render={<a href={signInHref} />} className="h-6.5 px-2.5 text-[0.8125rem]">
                {signInLabel}
              </Button>
              <div aria-hidden="true" className="mx-1 h-3.5 w-px bg-edge/12" />
              <Button variant="ghost" size="compact-sm" nativeButton={false} render={<a href={signUpHref} />} className="h-6.5 px-2.5 text-[0.8125rem]">
                {signUpLabel}
              </Button>
            </div>

            <button
              ref={toggleRef}
              type="button"
              aria-label={open ? "Close navigation" : "Open navigation"}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpen((o) => !o)}
              className={cn(
                ease,
                "relative flex size-10.5 items-center justify-center rounded-r-xl text-subtle outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-inset md:hidden [@media(width<22.5rem)]:ml-auto"
              )}
            >
              <svg viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden="true">
                {open ? (
                  <path stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" d="M4 4l8 8M12 4l-8 8" />
                ) : (
                  <path stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" d="M4 4.667h8M4 11.333h8" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div id={panelId} className="fixed inset-0 z-30 md:hidden">
            <div className="flex h-dvh w-screen animate-in flex-col overflow-y-auto overscroll-contain bg-background pt-24 duration-200 fade-in-0">
              <nav aria-label="Mobile" className="mb-8 px-4 pb-10">
                <ul role="list" className="mb-10">
                  {nav.map((item, i) =>
                    "groups" in item ? (
                      <MobileSection key={item.label} item={item} defaultOpen={i === 0} onNavigate={close} />
                    ) : (
                      <li key={item.label} className="group/item">
                        <a
                          href={item.href}
                          onClick={close}
                          className="block border-t border-edge/6 py-2 text-[1.0625rem]/6 font-medium text-foreground outline-none group-first/item:border-t-0 focus-visible:ring-2 focus-visible:ring-brand/40"
                        >
                          {item.label}
                        </a>
                      </li>
                    )
                  )}
                </ul>
                {/* Below 360px the header hides its auth links, so they move here. */}
                <div className="grid w-full grid-cols-2 gap-x-6 [@media(width>=22.5rem)]:hidden">
                  <Button variant="elevated" nativeButton={false} render={<a href={signInHref} onClick={close} />}>
                    {signInLabel}
                  </Button>
                  <Button nativeButton={false} render={<a href={signUpHref} onClick={close} />}>
                    {signUpLabel}
                  </Button>
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  )
}

const defaultAnnouncement: SiteAnnouncement = {
  text: "Acme 3.0 is here: faster builds, preview environments and a new CLI",
  cta: "Read the release notes",
  href: "#changelog",
}

const defaultNav: SiteNavItem[] = [
  {
    label: "Product",
    groups: [
      {
        title: "Platform",
        items: [
          { title: "Accounts", description: "Sign-up, sign-in and profiles", href: "#accounts", icon: <UsersIcon /> },
          { title: "Access control", description: "Roles, permissions and policies", href: "#access", icon: <ShieldCheckIcon /> },
          { title: "API keys", description: "Issue and rotate machine credentials", href: "#keys", icon: <KeyRoundIcon /> },
        ],
      },
      {
        title: "Build",
        items: [
          { title: "Workspaces", description: "Group members and applications", href: "#workspaces", icon: <LayersIcon /> },
          { title: "Integrations", description: "Connect the tools you already use", href: "#integrations", icon: <PlugIcon /> },
          { title: "Components", description: "Drop-in UI for common flows", href: "#components", icon: <BoxesIcon /> },
        ],
      },
    ],
  },
  {
    label: "Developers",
    groups: [
      {
        title: "Resources",
        items: [
          { title: "Documentation", description: "Guides and API reference", href: "#docs", icon: <BookOpenIcon /> },
          { title: "CLI", description: "Manage applications from the terminal", href: "#cli", icon: <TerminalIcon /> },
        ],
      },
    ],
  },
  { label: "Pricing", href: "#pricing" },
  { label: "Changelog", href: "#changelog" },
  { label: "Blog", href: "#blog" },
]

export default function SiteHeaderDemo() {
  return (
    <div className="min-h-[150vh] bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-5xl p-6 pt-24 sm:p-10 sm:pt-32">
        <h1 className="text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">Scroll to see the header float</h1>
        <p className="mt-4 max-w-xl text-base/6 text-muted-foreground">
          The bar stays pinned near the top with a soft blur behind it. Open a menu to see the mega-menu, or narrow the window for the phone menu.
        </p>
      </div>
    </div>
  )
}
