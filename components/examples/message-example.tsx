"use client"

import { Example, ExampleWrapper } from "@/components/examples/example"
import { Message, MessageAvatar, MessageContent, MessageFooter, MessageGroup, MessageHeader } from "@/components/ui/message"
import { Bubble } from "@/components/ui/bubble"

/** Static demo (the upstream example depends on an AI SDK chat helper). */
export default function MessageExample() {
  return (
    <ExampleWrapper className="lg:grid-cols-1">
      <Example title="Conversation">
        <MessageGroup className="w-full max-w-md">
          <Message>
            <MessageAvatar>AK</MessageAvatar>
            <MessageContent>
              <MessageHeader>Ana Kim</MessageHeader>
              <Bubble>Can you check why the deploy failed?</Bubble>
              <MessageFooter>09:41</MessageFooter>
            </MessageContent>
          </Message>
          <Message align="end">
            <MessageContent>
              <Bubble>The build step ran out of memory. I bumped the limit and re-ran it.</Bubble>
              <MessageFooter>09:42</MessageFooter>
            </MessageContent>
          </Message>
        </MessageGroup>
      </Example>
    </ExampleWrapper>
  )
}
