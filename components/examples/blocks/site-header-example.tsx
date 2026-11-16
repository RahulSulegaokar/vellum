import { BookOpenIcon, CalendarClockIcon, CodeIcon, GitForkIcon, HistoryIcon, LayoutTemplateIcon, PlugIcon, WaypointsIcon } from "lucide-react"
import { SiteHeader, type SiteAnnouncement, type SiteNavItem } from "@/components/blocks/site-header"

const announcement: SiteAnnouncement = {
  text: "Scheduled runs are here: trigger any flow on a timetable",
  cta: "See what's new",
  href: "#changelog",
}

const nav: SiteNavItem[] = [
  {
    label: "Product",
    groups: [
      {
        title: "Build",
        items: [
          { title: "Flow editor", description: "Chain steps together on a canvas", href: "#editor", icon: <WaypointsIcon /> },
          { title: "Branching", description: "Route work based on its contents", href: "#branching", icon: <GitForkIcon /> },
          { title: "Schedules", description: "Run flows hourly, daily or on a cron", href: "#schedules", icon: <CalendarClockIcon /> },
        ],
      },
      {
        title: "Operate",
        items: [
          { title: "Run history", description: "Replay and inspect every step", href: "#history", icon: <HistoryIcon /> },
          { title: "Connectors", description: "Hook up the apps your team uses", href: "#connectors", icon: <PlugIcon /> },
          { title: "Templates", description: "Start from a flow that already works", href: "#templates", icon: <LayoutTemplateIcon /> },
        ],
      },
    ],
  },
  {
    label: "Resources",
    groups: [
      {
        title: "Learn",
        items: [
          { title: "Handbook", description: "Concepts, recipes and how-tos", href: "#handbook", icon: <BookOpenIcon /> },
          { title: "Reference", description: "Every endpoint and option", href: "#reference", icon: <CodeIcon /> },
        ],
      },
    ],
  },
  { label: "Pricing", href: "#pricing" },
  { label: "Changelog", href: "#changelog" },
  { label: "Stories", href: "#stories" },
]

function Logo() {
  return (
    <a href="#home" className="inline-flex items-center gap-1.5 text-[1.0625rem] font-semibold tracking-[-0.03em] text-foreground">
      <span aria-hidden="true" className="grid size-5 place-items-center rounded-full bg-foreground text-background">
        <WaypointsIcon className="size-3" strokeWidth={2.25} />
      </span>
      relay
    </a>
  )
}

export default function SiteHeaderExample() {
  return (
    <div className="min-h-[150vh] bg-background">
      <SiteHeader logo={<Logo />} nav={nav} announcement={announcement} signInHref="#sign-in" signUpHref="#sign-up" />
      <div className="mx-auto max-w-5xl p-6 pt-24 sm:p-10 sm:pt-32">
        <h1 className="text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">Scroll to see the header float</h1>
        <p className="mt-4 max-w-xl text-base/6 text-muted-foreground">
          The bar stays pinned near the top with a soft blur behind it. Open a menu to see the mega-menu, or narrow the window for the phone menu.
        </p>
      </div>
    </div>
  )
}
