import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { examples } from "@/components/examples"

export function generateStaticParams() {
  return Object.keys(examples).map((name) => ({ name }))
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await params
  return { title: name }
}

export default async function ComponentPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  const load = examples[name]
  if (!load) notFound()
  const { default: Demo } = await load()
  return (
    <>
      <nav className="flex items-center justify-between border-b px-6 py-3 text-sm">
        <Link href="/" className="font-medium">
          ← Vellum
        </Link>
        <code className="font-mono text-subtle">npx shadcn@latest add RahulSulegaokar/vellum/{name.replace(/-(floating|icon|inset)$/, "")}</code>
      </nav>
      <Demo />
    </>
  )
}
