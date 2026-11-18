// Test fixture for tests/a11y.spec.ts: tab lists with long (translated) labels must not push a 320px page sideways.
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const labels = ["Vue d’ensemble du compte", "Statistiques détaillées", "Rapports mensuels"]

export default function ReflowFixture() {
  return (
    <main className="flex flex-col gap-8 p-4">
      {(["default", "line", "underline"] as const).map((variant) => (
        <Tabs key={variant} defaultValue="0">
          <TabsList variant={variant} data-testid={`tabs-${variant}`}>
            {labels.map((l, i) => (
              <TabsTrigger key={l} value={String(i)}>{l}</TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="0">Panel</TabsContent>
        </Tabs>
      ))}
      <Table data-testid="wide-table" className="min-w-[36rem]">
        <TableCaption>Messages sent this week</TableCaption>
        <TableHeader><TableRow><TableHead>Contact</TableHead><TableHead>Template</TableHead><TableHead>Status</TableHead><TableHead>Sent</TableHead></TableRow></TableHeader>
        <TableBody><TableRow><TableCell>Asha Rao</TableCell><TableCell>order_update</TableCell><TableCell>Delivered</TableCell><TableCell>18 Nov, 10:42</TableCell></TableRow></TableBody>
      </Table>
    </main>
  )
}
