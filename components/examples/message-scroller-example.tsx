"use client"

import { Example, ExampleWrapper } from "@/components/examples/example"
import { Bubble } from "@/components/ui/bubble"
import { Message, MessageContent } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"

const lines = Array.from({ length: 14 }, (_, i) => (i % 2 ? `Reply ${i}: sounds good, shipping it.` : `Message ${i}: can you review the change?`))

/** Static demo (the upstream example depends on an AI SDK chat helper). */
export default function MessageScrollerExample() {
  return (
    <ExampleWrapper className="lg:grid-cols-1">
      <Example title="Scroll to latest">
        <div className="h-80 w-full max-w-md rounded-lg border">
          <MessageScrollerProvider>
            <MessageScroller>
              <MessageScrollerViewport>
                <MessageScrollerContent className="gap-3 p-4">
                  {lines.map((text, i) => (
                    <MessageScrollerItem key={text}>
                      <Message align={i % 2 ? "end" : "start"}>
                        <MessageContent>
                          <Bubble>{text}</Bubble>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  ))}
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton />
            </MessageScroller>
          </MessageScrollerProvider>
        </div>
      </Example>
    </ExampleWrapper>
  )
}
