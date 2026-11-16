"use client"

import { AtSignIcon, GitBranchIcon, MessageCircleIcon, PlayIcon, RssIcon, WaypointsIcon } from "lucide-react"
import * as React from "react"
import { SiteFooter, type FooterColumn, type FooterSocial } from "@/components/blocks/site-footer"

const columns = (openCookies: () => void): FooterColumn[] => [
  { title: "Product", links: [{ label: "Flow editor", href: "#editor" }, { label: "Schedules", href: "#schedules" }, { label: "Connectors", href: "#connectors" }, { label: "Pricing", href: "#pricing" }] },
  { title: "Build", links: [{ label: "Handbook", href: "#handbook" }, { label: "Reference", href: "#reference" }, { label: "Templates", href: "#templates" }, { label: "Uptime", href: "#uptime" }] },
  { title: "Company", links: [{ label: "About", href: "#about" }, { label: "Jobs", href: "#jobs" }, { label: "Journal", href: "#journal" }, { label: "Get in touch", href: "#contact" }] },
  { title: "Community", links: [{ label: "Changelog", href: "#changelog" }, { label: "Meetups", href: "#meetups" }, { label: "Forum", href: "#forum" }] },
  { title: "Legal", links: [{ label: "Privacy", href: "#privacy" }, { label: "Terms", href: "#terms" }, { label: "Cookie settings", onClick: openCookies }] },
]

const socials: FooterSocial[] = [
  { label: "Social updates", href: "#social", icon: <AtSignIcon /> },
  { label: "Community forum", href: "#forum", icon: <MessageCircleIcon /> },
  { label: "Source code", href: "#source", icon: <GitBranchIcon /> },
  { label: "Video walkthroughs", href: "#videos", icon: <PlayIcon /> },
  { label: "Journal feed", href: "#feed", icon: <RssIcon /> },
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

export default function SiteFooterExample() {
  const [cookiesOpened, setCookiesOpened] = React.useState(false)
  return (
    <div className="bg-background">
      <p role="status" className="mx-auto w-[calc(100%-2.5rem)] max-w-6xl pt-6 text-sm text-muted-foreground">
        {cookiesOpened ? "Cookie preferences would open here." : ""}
      </p>
      <SiteFooter
        logo={<Logo />}
        columns={columns(() => setCookiesOpened(true))}
        socials={socials}
        legal="Relay Labs. All rights reserved."
        year={2026}
      />
    </div>
  )
}
