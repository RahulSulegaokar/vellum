"use client"

import * as React from "react"
import { Example, ExampleWrapper } from "@/components/examples/example"
import { Button } from "@/components/ui/button"
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function FormExample() {
  const [email, setEmail] = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)
  const error = submitted && !/^\S+@\S+\.\S+$/.test(email) ? "Enter a valid email address." : undefined
  return (
    <ExampleWrapper className="lg:grid-cols-1">
      <Example title="Field with description and error">
        <form
          noValidate
          className="flex w-full max-w-sm flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault()
            setSubmitted(true)
          }}
        >
          <FormItem error={error}>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </FormControl>
            <FormDescription>Receipts are sent here.</FormDescription>
            <FormMessage />
          </FormItem>
          <FormItem>
            <FormLabel>Note</FormLabel>
            <FormControl>
              <Textarea placeholder="Anything we should know?" />
            </FormControl>
          </FormItem>
          <Button type="submit" variant="primary" size="compact" className="self-start">
            Save
          </Button>
        </form>
      </Example>
    </ExampleWrapper>
  )
}
