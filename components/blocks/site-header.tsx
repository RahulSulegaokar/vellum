"use client"

/** Floating sticky marketing header: announcement bar, logo slot, mega-menu navigation, auth links and a phone menu. */

import * as React from "react"
import { ChevronDownIcon, MenuIcon, PlayIcon, XIcon } from "lucide-react"
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
  return <PlayIcon aria-hidden="true" className={cn("size-2.5 flex-none fill-current", className)} />
}

/** Dark strip above the header; skewed side panels and a sliding arrow on hover. */
export function AnnouncementBar({
  text,
  cta,
  href,
  linkComponent,
  className,
}: SiteAnnouncement & {
  /** Element or component used for the link, e.g. your router's `Link`. Defaults to `"a"`. */
  linkComponent?: React.ElementType
  className?: string
}) {
  const Link = linkComponent ?? "a"
  const side =
    "relative -my-2 grow overflow-hidden before:absolute before:inset-0 before:-translate-y-[calc(100%-0.625rem)] before:rounded before:border-background/15 before:bg-background/8"
  return (
    <Link
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
    </Link>
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
  linkComponent: Link,
}: {
  item: Extract<SiteNavItem, { groups: SiteNavGroup[] }>
  defaultOpen?: boolean
  onNavigate: () => void
  linkComponent: React.ElementType
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
        <ChevronDownIcon aria-hidden="true" className="size-3.5 text-subtle transition-transform group-aria-expanded:rotate-180 group-aria-expanded:text-foreground" />
      </button>
      <div id={id} hidden={!open} className="space-y-6 pt-3 pb-6">
        {item.groups.map((group) => (
          <div key={group.title}>
            <div className="mb-3 text-[0.6875rem]/4 font-medium tracking-wide text-muted-foreground uppercase">{group.title}</div>
            <ul className="flex flex-col gap-y-4">
              {group.items.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} onClick={onNavigate} className="group/link flex items-center gap-x-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-brand/40">
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
                  </Link>
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
 *
 * Every link (announcement, nav, mega-menu, mobile menu, auth actions) renders through `linkComponent`,
 * which defaults to `"a"`. Pass your router's `Link` (Next.js, Inertia, React Router…) to get client-side navigation.
 * The auth actions render only when their `href` is set.
 */
export function SiteHeader({
  nav = [],
  announcement,
  logo,
  signInHref,
  signUpHref,
  signInLabel = "Sign in",
  signUpLabel = "Sign up",
  linkComponent,
  tone = "light",
  className,
}: {
  nav?: SiteNavItem[]
  /** Omit or pass `null` to hide the bar. */
  announcement?: SiteAnnouncement | null
  /** Your brand mark, usually a link home. Nothing renders when omitted. */
  logo?: React.ReactNode
  signInHref?: string
  signUpHref?: string
  signInLabel?: string
  signUpLabel?: string
  /** Element or component used for every link, e.g. your router's `Link`. Defaults to `"a"`. */
  linkComponent?: React.ElementType
  tone?: "light" | "dark"
  className?: string
}) {
  const Link = linkComponent ?? "a"
  const hasAuth = Boolean(signInHref || signUpHref)
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
      {announcement && <AnnouncementBar {...announcement} linkComponent={Link} />}
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
            {logo && (
              <div className="flex items-center gap-x-3 select-none">
                {logo}
                <div aria-hidden="true" className="hidden h-6.5 w-px bg-edge/12 md:block" />
              </div>
            )}

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
                                      <NavigationMenuLink render={<Link href={link.href} />} className="items-start gap-2.5 px-2 py-1.5">
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
                      <NavigationMenuLink render={<Link href={item.href} />} className={cn(navText, "rounded-md p-0 px-2 hover:bg-transparent focus:bg-transparent")}>
                        {item.label}
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            <div className="ml-auto flex items-center [@media(width<22.5rem)]:hidden">
              {signInHref && (
                <Button variant="ghost" size="compact-sm" nativeButton={false} render={<Link href={signInHref} />} className="h-6.5 px-2.5 text-[0.8125rem]">
                  {signInLabel}
                </Button>
              )}
              {signInHref && signUpHref && <div aria-hidden="true" className="mx-1 h-3.5 w-px bg-edge/12" />}
              {signUpHref && (
                <Button variant="ghost" size="compact-sm" nativeButton={false} render={<Link href={signUpHref} />} className="h-6.5 px-2.5 text-[0.8125rem]">
                  {signUpLabel}
                </Button>
              )}
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
              {open ? <XIcon aria-hidden="true" className="size-4" strokeWidth={1.5} /> : <MenuIcon aria-hidden="true" className="size-4" strokeWidth={1.5} />}
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
                      <MobileSection key={item.label} item={item} defaultOpen={i === 0} onNavigate={close} linkComponent={Link} />
                    ) : (
                      <li key={item.label} className="group/item">
                        <Link
                          href={item.href}
                          onClick={close}
                          className="block border-t border-edge/6 py-2 text-[1.0625rem]/6 font-medium text-foreground outline-none group-first/item:border-t-0 focus-visible:ring-2 focus-visible:ring-brand/40"
                        >
                          {item.label}
                        </Link>
                      </li>
                    )
                  )}
                </ul>
                {/* Below 360px the header hides its auth links, so they move here. */}
                {hasAuth && (
                  <div className="grid w-full grid-cols-2 gap-x-6 [@media(width>=22.5rem)]:hidden">
                    {signInHref && (
                      <Button variant="elevated" nativeButton={false} render={<Link href={signInHref} onClick={close} />}>
                        {signInLabel}
                      </Button>
                    )}
                    {signUpHref && (
                      <Button nativeButton={false} render={<Link href={signUpHref} onClick={close} />}>
                        {signUpLabel}
                      </Button>
                    )}
                  </div>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
