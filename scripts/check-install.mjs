// Installs every registry item into a throwaway project with the strict TypeScript settings of a stock Vite +
// React template (noUnusedLocals, noUnusedParameters, verbatimModuleSyntax, erasableSyntaxOnly…) and type-checks
// it, so an unused import or a Next-only API in any item fails here before a consumer sees it.
// Files land where the shadcn CLI puts them in a Vite project: src/components/ui, src/components/blocks,
// src/hooks, src/lib. Run with `npm run test:install`.
// Types resolve through this repo's node_modules (where Next is installed for the gallery), so a Next-only import
// would type-check here; the import scan below fails on `next`, `next/*` and `next-themes` instead.
import { execFileSync } from "node:child_process"
import { cpSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs"
import { basename, join } from "node:path"

const ROOT = new URL("..", import.meta.url).pathname
const OUT = join(ROOT, ".check-install")
const { items } = JSON.parse(readFileSync(join(ROOT, "registry.json"), "utf8"))

rmSync(OUT, { recursive: true, force: true })
mkdirSync(join(OUT, "src"), { recursive: true })
const target = (path) =>
  path.startsWith("components/ui/") ? `src/components/ui/${basename(path)}`
  : path.startsWith("components/blocks/") ? `src/components/blocks/${basename(path)}`
  : path.startsWith("hooks/") ? `src/hooks/${basename(path)}`
  : null
let count = 0
const nextOnly = []
for (const item of items) {
  for (const file of item.files ?? []) {
    const to = target(file.path)
    if (!to) continue
    mkdirSync(join(OUT, to, ".."), { recursive: true })
    cpSync(join(ROOT, file.path), join(OUT, to))
    count++
    for (const [, spec] of readFileSync(join(ROOT, file.path), "utf8").matchAll(/from\s+"([^"]+)"/g))
      if (/^(next|next-themes)(\/|$)/.test(spec)) nextOnly.push(`${file.path}: imports ${spec}`)
  }
}
// The `utils` item the components depend on.
mkdirSync(join(OUT, "src/lib"), { recursive: true })
cpSync(join(ROOT, "lib/utils.ts"), join(OUT, "src/lib/utils.ts"))
symlinkSync(join(ROOT, "node_modules"), join(OUT, "node_modules"), "dir")
writeFileSync(
  join(OUT, "tsconfig.json"),
  JSON.stringify(
    {
      compilerOptions: {
        target: "ES2022", useDefineForClassFields: true, lib: ["ES2022", "DOM", "DOM.Iterable"], module: "ESNext",
        skipLibCheck: true, moduleResolution: "bundler", allowImportingTsExtensions: true, verbatimModuleSyntax: true,
        moduleDetection: "force", noEmit: true, jsx: "react-jsx", strict: true, noUnusedLocals: true, noUnusedParameters: true,
        erasableSyntaxOnly: true, noFallthroughCasesInSwitch: true, noUncheckedSideEffectImports: true,
        paths: { "@/*": ["./src/*"] }, types: [],
      },
      include: ["src"],
    },
    null,
    2
  )
)
if (nextOnly.length) {
  console.error(`Registry items must not depend on Next.js:\n${nextOnly.join("\n")}`)
  process.exitCode = 1
}
try {
  execFileSync(join(ROOT, "node_modules/.bin/tsc"), ["-p", OUT], { stdio: "inherit" })
  if (!nextOnly.length) console.log(`${count} item files type-check in a strict Vite-style project and import nothing from Next`)
} catch {
  console.error("Registry items fail a strict Vite-style type check (see above)")
  process.exitCode = 1
} finally {
  rmSync(OUT, { recursive: true, force: true })
}
