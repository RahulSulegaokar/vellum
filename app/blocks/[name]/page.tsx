import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { blocks } from "@/components/examples/blocks"

export function generateStaticParams() {
  return Object.keys(blocks).map((name) => ({ name }))
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await params
  return { title: `${name} block` }
}

export default async function BlockPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  const load = blocks[name]
  if (!load) notFound()
  const { default: Demo } = await load()
  return (
    <>
      <nav className="flex items-center justify-between border-b px-6 py-3 text-sm">
        <Link href="/" className="font-medium rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[--tw-outline-style:solid] focus-visible:outline-ring">
          ← Vellum
        </Link>
        <code className="font-mono text-subtle">npx shadcn@latest add RahulSulegaokar/vellum/{name}</code>
      </nav>
      <div className="min-h-[calc(100dvh-3rem)] bg-background">
        <Demo />
      </div>
    </>
  )
}
