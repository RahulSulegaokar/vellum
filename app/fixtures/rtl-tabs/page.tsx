// Test fixture for tests/a11y.spec.ts: a right-to-left tab list with long labels in a shrink-to-fit parent.
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const labels = ["Vue d’ensemble du compte", "Statistiques détaillées", "Rapports mensuels"]

export default function RtlTabsFixture() {
  return (
    <main dir="rtl" className="p-4">
      <div className="ms-auto w-fit">
        <Tabs defaultValue="0">
          <TabsList data-testid="tabs-rtl-fit">
            {labels.map((l, i) => (
              <TabsTrigger key={l} value={String(i)}>{l}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </main>
  )
}
