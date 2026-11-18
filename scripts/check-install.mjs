// Installs every registry item into a throwaway project with the strict TypeScript settings of a stock Vite +
// React template (noUnusedLocals, noUnusedParameters, verbatimModuleSyntax, erasableSyntaxOnly…) and type-checks
// it, so an unused import or a Next-only API in any item fails here before a consumer sees it.
// Files land where the shadcn CLI puts them in a Vite project: src/components/ui, src/components/blocks,
// src/hooks, src/lib. Run with `npm run test:install`.
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
for (const item of items) {
  for (const file of item.files ?? []) {
    const to = target(file.path)
    if (!to) continue
    mkdirSync(join(OUT, to, ".."), { recursive: true })
    cpSync(join(ROOT, file.path), join(OUT, to))
    count++
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
try {
  execFileSync(join(ROOT, "node_modules/.bin/tsc"), ["-p", OUT], { stdio: "inherit" })
  console.log(`${count} item files type-check in a strict Vite-style project`)
} catch {
  console.error("Registry items fail a strict Vite-style type check (see above)")
  process.exitCode = 1
} finally {
  rmSync(OUT, { recursive: true, force: true })
}
