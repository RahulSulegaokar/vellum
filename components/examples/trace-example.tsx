"use client"

import { CheckIcon, LoaderIcon, SearchIcon, TriangleAlertIcon } from "lucide-react"
import { Example, ExampleWrapper } from "@/components/examples/example"
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

/** Static demo (the upstream example depends on an AI SDK chat helper). */
export default function TraceExample() {
  return (
    <ExampleWrapper className="lg:grid-cols-1">
      <Example title="Agent steps">
        <Trace className="w-full max-w-md">
          <TraceLine>
            <TraceIcon><CheckIcon /></TraceIcon>
            <TraceTitle>Read deployment logs</TraceTitle>
          </TraceLine>
          <TraceCollapsible>
            <TraceCollapsibleTrigger>
              <TraceLine>
                <TraceIcon><SearchIcon /></TraceIcon>
                <TraceTitle>Searched the docs</TraceTitle>
              </TraceLine>
            </TraceCollapsibleTrigger>
            <TraceCollapsibleContent>
              <TraceDescription>Found 3 pages about memory limits for build steps.</TraceDescription>
            </TraceCollapsibleContent>
          </TraceCollapsible>
          <TraceLine status="error">
            <TraceIcon><TriangleAlertIcon /></TraceIcon>
            <TraceTitle>Build step exited with code 137</TraceTitle>
          </TraceLine>
          <TraceLine status="running">
            <TraceIcon><LoaderIcon /></TraceIcon>
            <TraceTitle>Re-running with a higher limit</TraceTitle>
          </TraceLine>
          <TraceLine status="pending">
            <TraceIcon><CheckIcon /></TraceIcon>
            <TraceTitle>Verify the deploy</TraceTitle>
          </TraceLine>
        </Trace>
      </Example>
    </ExampleWrapper>
  )
}
