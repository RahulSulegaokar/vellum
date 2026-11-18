"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

/*
 * Accessible form fields without a form library. Works with Inertia's useForm, react-hook-form,
 * server-side errors or plain state: pass the field's error message to <FormItem error>.
 *
 *   <FormItem error={errors.email}>
 *     <FormLabel>Email</FormLabel>
 *     <FormControl><Input type="email" /></FormControl>
 *     <FormDescription>We never share it.</FormDescription>
 *     <FormMessage />
 *   </FormItem>
 *
 * FormControl wires id, aria-describedby (description + error) and aria-invalid onto its child, and marks it with
 * data-form-control. The child keeps its own data-slot (data-slot="input" stays "input").
 */

type FormItemContextValue = {
  id: string
  descriptionId: string
  messageId: string
  error?: React.ReactNode
  hasDescription: boolean
  setHasDescription: (v: boolean) => void
}

const FormItemContext = React.createContext<FormItemContextValue | null>(null)

function useFormItem() {
  const ctx = React.useContext(FormItemContext)
  if (!ctx) throw new Error("Form components must be used inside <FormItem>")
  return ctx
}

function FormItem({
  className,
  error,
  id: idProp,
  ...props
}: React.ComponentProps<"div"> & { error?: React.ReactNode }) {
  const generated = React.useId()
  const id = idProp ?? generated
  const [hasDescription, setHasDescription] = React.useState(false)
  const value = React.useMemo(
    () => ({ id: `${id}-control`, descriptionId: `${id}-description`, messageId: `${id}-message`, error, hasDescription, setHasDescription }),
    [id, error, hasDescription]
  )
  return (
    <FormItemContext.Provider value={value}>
      <div data-slot="form-item" data-invalid={error ? true : undefined} className={cn("flex flex-col gap-1.5", className)} {...props} />
    </FormItemContext.Provider>
  )
}

function FormLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  const { id, error } = useFormItem()
  return <Label data-slot="form-label" htmlFor={id} className={cn(error && "text-destructive-text", className)} {...props} />
}

function FormControl({ children }: { children: React.ReactElement<Record<string, unknown>> }) {
  const { id, descriptionId, messageId, error, hasDescription } = useFormItem()
  const child = React.Children.only(children)
  const describedBy = [child.props["aria-describedby"] as string | undefined, hasDescription && descriptionId, error ? messageId : null]
    .filter(Boolean)
    .join(" ")
  // A component child (Input, Textarea, SelectTrigger…) keeps the data-slot it sets itself; only a bare element
  // (<input>, <select>) without one is tagged "form-control". Every wrapped field gets data-form-control.
  const ownSlot = typeof child.type !== "string" || child.props["data-slot"] !== undefined
  return React.cloneElement(child, {
    id: (child.props.id as string | undefined) ?? id,
    "aria-describedby": describedBy || undefined,
    "aria-invalid": error ? true : (child.props["aria-invalid"] as boolean | undefined),
    "data-form-control": "",
    ...(ownSlot ? {} : { "data-slot": "form-control" }),
  })
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { descriptionId, setHasDescription } = useFormItem()
  React.useLayoutEffect(() => {
    setHasDescription(true)
    return () => setHasDescription(false)
  }, [setHasDescription])
  return <p data-slot="form-description" id={descriptionId} className={cn("text-[0.8125rem]/5 text-subtle", className)} {...props} />
}

function FormMessage({ className, children, ...props }: React.ComponentProps<"p">) {
  const { messageId, error } = useFormItem()
  const body = error ?? children
  if (!body) return null
  return (
    <p data-slot="form-message" id={messageId} role="alert" className={cn("text-[0.8125rem]/5 font-medium text-destructive-text", className)} {...props}>
      {body}
    </p>
  )
}

export { FormItem, FormLabel, FormControl, FormDescription, FormMessage, useFormItem }
