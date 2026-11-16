import Link from "next/link"
import { examples } from "@/components/examples"
import { blocks } from "@/components/examples/blocks"

const install = "npx shadcn@latest add RahulSulegaokar/vellum/vellum-theme\nnpx shadcn@latest add RahulSulegaokar/vellum/button"

export default function Home() {
  const names = Object.keys(examples).filter((n) => n !== "component")
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Vellum</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        A themeable, shadcn-compatible component registry built on Base UI. Every component reads its colours, rings,
        shadows and radius from theme tokens, so a project can restyle the whole kit by changing a few variables.
      </p>
      <pre className="mt-6 overflow-x-auto rounded-lg bg-surface-muted p-4 font-mono text-sm ring-1 ring-hairline">{install}</pre>
      <p className="mt-3 text-sm text-subtle">
        Install the theme first (it sets the tokens), then add components. Update later with <code className="font-mono">--diff</code> or{" "}
        <code className="font-mono">--overwrite</code>.
      </p>
      <h2 className="mt-12 text-lg font-semibold">Components ({names.length})</h2>
      <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {names.map((n) => (
          <li key={n}>
            <Link href={`/components/${n}`} className="block rounded-md px-3 py-2 text-sm ring-1 ring-hairline hover:bg-accent">
              {n}
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="mt-12 text-lg font-semibold">Blocks ({Object.keys(blocks).length})</h2>
      <p className="mt-1 text-sm text-subtle">Ready-made screen sections built from the components. Install one and edit its copy and data.</p>
      <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {Object.keys(blocks).map((n) => (
          <li key={n}>
            <Link href={`/blocks/${n}`} className="block rounded-md px-3 py-2 text-sm ring-1 ring-hairline hover:bg-accent">
              {n}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm">
        <Link href="/components/component" className="underline underline-offset-4">
          See everything on one page
        </Link>
      </p>
    </main>
  )
}
