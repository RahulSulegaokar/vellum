"use client"

// Test fixture for tests/a11y.spec.ts: one of each control, spaced so each 44px touch area stands alone,
// plus the translated-label props, FormControl and the overlays. Not linked from the gallery.
import * as React from "react"
import { BoldIcon, ItalicIcon, PlusIcon } from "lucide-react"
import { Banner } from "@/components/blocks/banner"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Checkbox } from "@/components/ui/checkbox"
import { CodeBlock, CodeBlockActions, CodeBlockContent, CodeBlockCopyButton, CodeBlockHeader, CodeBlockLine, CodeBlockTitle } from "@/components/ui/code-block"
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList, ComboboxValue, useComboboxAnchor } from "@/components/ui/combobox"
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogPanel, DialogSection, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FormControl, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { SegmentedControl, SegmentedControlItem } from "@/components/ui/segmented-control"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const fruits = ["Apple", "Banana", "Cherry"]

function Cell({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div data-cell={id} className="flex h-24 min-w-24 items-center justify-center px-6">
      {children}
    </div>
  )
}

export default function ControlsFixture() {
  const [checked, setChecked] = React.useState(false)
  const [on, setOn] = React.useState(false)
  const [radio, setRadio] = React.useState("a")
  const [pressed, setPressed] = React.useState(false)
  const [group, setGroup] = React.useState<string[]>([])
  const [segment, setSegment] = React.useState("a")
  const [clicks, setClicks] = React.useState(0)
  const [dismissed, setDismissed] = React.useState(0)
  const anchor = useComboboxAnchor()

  return (
    <main className="flex flex-col gap-10 p-8">
      <section data-section="touch" className="flex flex-wrap">
        <Cell id="checkbox"><Checkbox data-testid="checkbox" aria-label="Accept" checked={checked} onCheckedChange={setChecked} /></Cell>
        <Cell id="radio">
          <RadioGroup value={radio} onValueChange={(v) => setRadio(v as string)} aria-label="Choice" className="w-auto">
            <RadioGroupItem data-testid="radio" value="b" aria-label="B" />
          </RadioGroup>
        </Cell>
        <Cell id="switch"><Switch data-testid="switch" aria-label="Notifications" checked={on} onCheckedChange={setOn} /></Cell>
        <Cell id="toggle"><Toggle data-testid="toggle" aria-label="Bold" size="sm" pressed={pressed} onPressedChange={setPressed}><BoldIcon /></Toggle></Cell>
        <Cell id="toggle-group">
          <ToggleGroup value={group} onValueChange={setGroup}>
            <ToggleGroupItem data-testid="toggle-group-item" value="i" aria-label="Italic" size="sm"><ItalicIcon /></ToggleGroupItem>
          </ToggleGroup>
        </Cell>
        <Cell id="segmented">
          <SegmentedControl value={segment} onValueChange={setSegment} aria-label="Range" className="w-fit">
            <SegmentedControlItem value="a">Day</SegmentedControlItem>
            <SegmentedControlItem data-testid="segmented-item" value="b">Week</SegmentedControlItem>
          </SegmentedControl>
        </Cell>
        <Cell id="tabs">
          <Tabs defaultValue="a">
            <TabsList>
              <TabsTrigger value="a">One</TabsTrigger>
              <TabsTrigger data-testid="tabs-trigger" value="b">Two</TabsTrigger>
            </TabsList>
          </Tabs>
        </Cell>
        <Cell id="underline-tabs">
          <Tabs defaultValue="a" className="w-32">
            <TabsList variant="underline">
              <TabsTrigger value="a">One</TabsTrigger>
              <TabsTrigger data-testid="underline-tabs-trigger" value="b">Two</TabsTrigger>
            </TabsList>
          </Tabs>
        </Cell>
        <Cell id="select">
          <Select>
            <SelectTrigger data-testid="select-trigger" className="w-20" aria-label="Fruit"><SelectValue placeholder="Pick" /></SelectTrigger>
            <SelectContent>{fruits.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
          </Select>
        </Cell>
        <Cell id="slider"><Slider data-testid="slider" defaultValue={[50]} className="w-20" aria-label="Volume" getAriaValueText={(_, v) => `${v} percent volume`} /></Cell>
        <Cell id="breadcrumb">
          <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink data-testid="breadcrumb-link" href="#crumb">Home</BreadcrumbLink></BreadcrumbItem></BreadcrumbList></Breadcrumb>
        </Cell>
        <Cell id="icon-button"><Button data-testid="icon-button" variant="ghost" size="icon-compact-sm" aria-label="Add" onClick={() => setClicks((c) => c + 1)}><PlusIcon /></Button></Cell>
        <div data-cell="accordion" className="flex w-60 items-center">
          <Accordion className="w-full">
            <AccordionItem value="a">
              <AccordionTrigger data-testid="accordion-trigger">Question</AccordionTrigger>
              <AccordionContent>Answer</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div data-cell="banner" className="flex w-72 items-center">
          {dismissed === 0 ? <Banner onDismiss={() => setDismissed(1)} className="w-full">Trial ends soon</Banner> : <p data-testid="banner-gone">Dismissed</p>}
        </div>
        <output data-testid="clicks" className="sr-only">{clicks}</output>
      </section>

      <section data-section="accordion-open" className="w-80">
        <Accordion defaultValue={["open"]}>
          <AccordionItem value="open">
            <AccordionTrigger>Open panel</AccordionTrigger>
            <AccordionContent>
              <Button size="compact" variant="elevated" data-testid="accordion-panel-button">Inside the panel</Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section data-section="position" className="relative h-24 w-80">
        <Toggle aria-label="Positioned toggle" className="absolute top-1 right-1" data-testid="pos-toggle"><BoldIcon /></Toggle>
        <ToggleGroup className="absolute bottom-1 left-1">
          <ToggleGroupItem value="p" aria-label="Positioned item" className="absolute top-0 left-0" data-testid="pos-toggle-group-item"><ItalicIcon /></ToggleGroupItem>
        </ToggleGroup>
        <Select>
          <SelectTrigger aria-label="Positioned select" className="absolute right-1 bottom-1 w-24" data-testid="pos-select-trigger"><SelectValue placeholder="Pick" /></SelectTrigger>
          <SelectContent><SelectItem value="a">A</SelectItem></SelectContent>
        </Select>
        <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href="#p" className="absolute top-1 left-1" data-testid="pos-breadcrumb-link">Home</BreadcrumbLink></BreadcrumbItem></BreadcrumbList></Breadcrumb>
      </section>

      {/* Every other way to position a control must beat the kit's touch-only `relative` too. */}
      <section data-section="position-variants" className="relative h-40 w-96">
        <Toggle aria-label="Responsive" className="md:absolute md:top-1 md:right-1" data-testid="pos-md-toggle"><BoldIcon /></Toggle>
        <Select>
          <SelectTrigger aria-label="Responsive select" className="w-24 md:absolute md:bottom-1 md:left-1" data-testid="pos-md-select-trigger"><SelectValue placeholder="Pick" /></SelectTrigger>
          <SelectContent><SelectItem value="a">A</SelectItem></SelectContent>
        </Select>
        <Toggle aria-label="Arbitrary" className="[position:absolute] top-10 right-1" data-testid="pos-arbitrary-toggle"><BoldIcon /></Toggle>
        <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href="#q" className="[position:absolute] top-20 left-1" data-testid="pos-arbitrary-breadcrumb-link">Docs</BreadcrumbLink></BreadcrumbItem></BreadcrumbList></Breadcrumb>
        <Toggle aria-label="Inline" style={{ position: "absolute", top: 80, right: 4 }} data-testid="pos-inline-toggle"><BoldIcon /></Toggle>
        <div className="[&>button]:absolute [&>button]:right-24 [&>button]:bottom-1">
          <Toggle aria-label="Parent rule" data-testid="pos-parent-toggle"><BoldIcon /></Toggle>
        </div>
        <Toggle aria-label="Layered rule" className="layered-absolute top-1 left-40" data-testid="pos-layered-toggle"><BoldIcon /></Toggle>
        <Toggle aria-label="No position" data-testid="pos-none-toggle"><BoldIcon /></Toggle>
      </section>

      <section data-section="fields" className="grid max-w-md gap-4">
        <Input aria-label="Name" placeholder="Name" />
        <Input aria-label="Compact" variant="compact" placeholder="Compact" />
        <Textarea aria-label="Note" placeholder="Note" />
        <NativeSelect aria-label="Plan"><NativeSelectOption>Starter</NativeSelectOption></NativeSelect>
        <Command className="h-auto ring-1 ring-hairline">
          <CommandInput placeholder="Search commands" />
          <CommandList><CommandEmpty>Nothing found</CommandEmpty><CommandItem>Open</CommandItem></CommandList>
        </Command>
        <Combobox items={fruits}>
          <ComboboxInput placeholder="Fruit" aria-label="Fruit search" showClear clearLabel="Effacer" triggerLabel="Afficher les options" />
          <ComboboxContent>
            <ComboboxEmpty>None</ComboboxEmpty>
            <ComboboxList>{(item: string) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}</ComboboxList>
          </ComboboxContent>
        </Combobox>
        <Combobox items={fruits} multiple defaultValue={["Apple"]}>
          <ComboboxChips ref={anchor}>
            <ComboboxValue>{(values: string[]) => values.map((v) => <ComboboxChip key={v} removeLabel="Retirer">{v}</ComboboxChip>)}</ComboboxValue>
            <ComboboxChipsInput aria-label="Fruits" placeholder="Add fruit" />
          </ComboboxChips>
          <ComboboxContent anchor={anchor}>
            <ComboboxList>{(item: string) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}</ComboboxList>
          </ComboboxContent>
        </Combobox>
        <InputOTP maxLength={4} aria-label="Code">
          <InputOTPGroup>{[0, 1, 2, 3].map((i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>
        </InputOTP>
      </section>

      <section data-section="forced" className="flex flex-wrap items-center gap-6 bg-background p-4">
        <Checkbox aria-label="Unchecked" data-testid="fc-checkbox-off" />
        <Checkbox aria-label="Checked" defaultChecked data-testid="fc-checkbox-on" />
        <RadioGroup defaultValue="on" className="flex w-auto gap-4" aria-label="Radios">
          <RadioGroupItem value="off" aria-label="Off" data-testid="fc-radio-off" />
          <RadioGroupItem value="on" aria-label="On" data-testid="fc-radio-on" />
        </RadioGroup>
        <Switch aria-label="Off" data-testid="fc-switch-off" />
        <Switch aria-label="On" defaultChecked data-testid="fc-switch-on" />
        <Progress value={60} aria-label="Upload" className="w-32" data-testid="fc-progress" />
        <Slider defaultValue={[60]} aria-label="Level" className="w-32" data-testid="fc-slider" />
        <Toggle aria-label="Pressed" defaultPressed data-testid="fc-toggle"><BoldIcon /></Toggle>
        <Tabs defaultValue="a" data-testid="fc-tabs">
          <TabsList><TabsTrigger value="a">Selected</TabsTrigger><TabsTrigger value="b">Other</TabsTrigger></TabsList>
        </Tabs>
        <Tabs defaultValue="a" data-testid="fc-underline-tabs" className="w-48">
          <TabsList variant="underline"><TabsTrigger value="a">Selected</TabsTrigger><TabsTrigger value="b">Other</TabsTrigger></TabsList>
        </Tabs>
        <SegmentedControl value="a" onValueChange={() => {}} aria-label="View" className="w-fit" data-testid="fc-segmented">
          <SegmentedControlItem value="a">Selected</SegmentedControlItem>
          <SegmentedControlItem value="b">Other</SegmentedControlItem>
        </SegmentedControl>
        <Input aria-label="Field" placeholder="Field" className="w-40" data-testid="fc-input" />
        <Button variant="primary" size="compact" data-testid="fc-primary">Primary</Button>
        <Button variant="elevated" size="compact" data-testid="fc-elevated">Elevated</Button>
      </section>

      <section data-section="i18n" className="flex flex-wrap items-center gap-4">
        <Dialog>
          <DialogTrigger render={<Button variant="elevated" size="compact" />}>Ouvrir le dialogue</DialogTrigger>
          <DialogContent closeLabel="Fermer">
            <DialogPanel>
              <DialogHeader><DialogTitle>Titre</DialogTitle><DialogDescription>Description</DialogDescription></DialogHeader>
              <DialogSection>Corps</DialogSection>
            </DialogPanel>
            <DialogFooter showCloseButton closeLabel="Annuler" />
          </DialogContent>
        </Dialog>
        <Sheet>
          <SheetTrigger render={<Button variant="elevated" size="compact" />}>Ouvrir le panneau</SheetTrigger>
          <SheetContent closeLabel="Fermer le panneau">
            <SheetHeader><SheetTitle>Filtres</SheetTitle><SheetDescription>Affiner</SheetDescription></SheetHeader>
          </SheetContent>
        </Sheet>
        <Label optional optionalLabel="Facultatif">Société</Label>
        <CodeBlock className="w-48">
          <CodeBlockHeader><CodeBlockTitle>npm</CodeBlockTitle><CodeBlockActions><CodeBlockCopyButton value="npm i" copyLabel="Copier" copiedLabel="Copié" /></CodeBlockActions></CodeBlockHeader>
          <CodeBlockContent><CodeBlockLine>npm i</CodeBlockLine></CodeBlockContent>
        </CodeBlock>
        <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbEllipsis label="Plus" /></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>Page</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
        <Pagination className="w-auto">
          <PaginationContent>
            <PaginationItem><PaginationPrevious href="#p" text="Précédent" label="Page précédente" /></PaginationItem>
            <PaginationItem><PaginationLink href="#1">1</PaginationLink></PaginationItem>
            <PaginationItem><PaginationEllipsis label="Autres pages" /></PaginationItem>
            <PaginationItem><PaginationNext href="#n" text="Suivant" label="Page suivante" /></PaginationItem>
          </PaginationContent>
        </Pagination>
        <Carousel className="mx-14 w-32" roleDescription="diaporama">
          <CarouselContent><CarouselItem roleDescription="diapositive">1</CarouselItem><CarouselItem roleDescription="diapositive">2</CarouselItem></CarouselContent>
          <CarouselPrevious label="Diapositive précédente" />
          <CarouselNext label="Diapositive suivante" />
        </Carousel>
      </section>

      <section data-section="form" className="grid max-w-md gap-4">
        <FormItem error="Requis">
          <FormLabel>Email</FormLabel>
          <FormControl><Input id="fc-input" placeholder="you@example.com" /></FormControl>
        </FormItem>
        <FormItem>
          <FormLabel>Bio</FormLabel>
          <FormControl><Textarea id="fc-textarea" /></FormControl>
        </FormItem>
        <FormItem>
          <FormLabel>Fruit</FormLabel>
          <Select>
            <FormControl><SelectTrigger id="fc-select"><SelectValue placeholder="Pick" /></SelectTrigger></FormControl>
            <SelectContent>{fruits.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
          </Select>
        </FormItem>
        <FormItem>
          <FormLabel>Raw</FormLabel>
          <FormControl><input id="fc-raw" className="rounded-sm ring-1 ring-hairline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[--tw-outline-style:solid] focus-visible:outline-ring" /></FormControl>
        </FormItem>
      </section>

      <section data-section="overlays" className="flex flex-wrap items-center gap-4">
        <Dialog>
          <DialogTrigger data-testid="open-dialog" render={<Button variant="elevated" size="compact" />}>Dialog</DialogTrigger>
          <DialogContent data-testid="dialog-popup">
            <DialogPanel><DialogHeader><DialogTitle>Dialog</DialogTitle><DialogDescription>Text</DialogDescription></DialogHeader></DialogPanel>
            <DialogFooter showCloseButton />
          </DialogContent>
        </Dialog>
        <Sheet>
          <SheetTrigger data-testid="open-sheet" render={<Button variant="elevated" size="compact" />}>Sheet</SheetTrigger>
          <SheetContent data-testid="sheet-popup"><SheetHeader><SheetTitle>Sheet</SheetTitle><SheetDescription>Text</SheetDescription></SheetHeader></SheetContent>
        </Sheet>
        <AlertDialog>
          <AlertDialogTrigger data-testid="open-alert" render={<Button variant="elevated" size="compact" />}>Alert</AlertDialogTrigger>
          <AlertDialogContent data-testid="alert-popup">
            <AlertDialogHeader><AlertDialogTitle>Sure?</AlertDialogTitle><AlertDialogDescription>Text</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction>OK</AlertDialogAction></AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Popover>
          <PopoverTrigger data-testid="open-popover" render={<Button variant="elevated" size="compact" />}>Popover</PopoverTrigger>
          <PopoverContent data-testid="popover-popup"><Button size="compact">Inside</Button></PopoverContent>
        </Popover>
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="open-menu" render={<Button variant="elevated" size="compact" />}>Menu</DropdownMenuTrigger>
          <DropdownMenuContent data-testid="menu-popup"><DropdownMenuItem>Archive</DropdownMenuItem><DropdownMenuItem>Delete</DropdownMenuItem></DropdownMenuContent>
        </DropdownMenu>
        <Select>
          <SelectTrigger data-testid="open-select" className="w-32" aria-label="Fruit list"><SelectValue placeholder="Fruit" /></SelectTrigger>
          <SelectContent data-testid="select-popup">{fruits.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
        </Select>
      </section>
    </main>
  )
}
