"use client"

// Test fixture for tests/a11y.spec.ts: the primary button rendered as itself and through other parts (which give it
// their own data-slot), so the label-contrast check covers every way an app renders it.
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"

export default function PrimaryFixture() {
  const [alert, setAlert] = useState(false)
  return (
    <main className="flex flex-wrap items-center gap-6 p-8" data-section="primary">
      <Button variant="primary" size="compact" data-testid="primary-button">Save changes</Button>
      <Button variant="primary" data-testid="primary-default">Save changes</Button>
      <Button variant="primary" size="compact" nativeButton={false} render={<a href="#saved" />} data-testid="primary-link">Save changes</Button>
      <Dialog>
        <DialogTrigger data-testid="primary-dialog-trigger" render={<Button variant="primary" size="compact" />}>Save changes</DialogTrigger>
        <DialogContent>
          <DialogTitle className="p-5">Saved</DialogTitle>
          <DialogFooter>
            <DialogClose data-testid="primary-dialog-close" render={<Button variant="primary" size="compact" />}>Save changes</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Popover>
        <PopoverTrigger data-testid="primary-popover-trigger" render={<Button variant="primary" size="compact" />}>Save changes</PopoverTrigger>
        <PopoverContent>Saved</PopoverContent>
      </Popover>
      <Button variant="elevated" size="compact" data-testid="open-alert" onClick={() => setAlert(true)}>Open alert</Button>
      <AlertDialog open={alert} onOpenChange={setAlert}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Sure?</AlertDialogTitle></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogAction variant="primary" size="compact" data-testid="primary-alert-action">Save changes</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
