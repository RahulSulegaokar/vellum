// Every built-in English string in the registry must be translatable: a prop default (`closeLabel = "Close"`) or
// a key of a block's `…Labels` object. This scans every components/ui and components/blocks file with the
// TypeScript parser and fails on English written directly into JSX: text children, string literals in JSX
// expressions, and the attributes people read (aria-*, title, alt, placeholder, label, description).
// Non-words (symbols, numbers, key caps) are allowed below. Run: `node tests/strings.mjs`.
import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import ts from "typescript"

const ROOT = new URL("..", import.meta.url).pathname
const READ_ATTRS = /^(aria-(label|roledescription|valuetext|description|placeholder)|title|alt|placeholder|label|description|subtitle)$/
// Strings that are not words a translator would change.
const ALLOWED = new Set(["·", "99+", "⌘", "K", "W", "/", "+", "-", "—", "…", "%", "@", "1", "2"])
const isWords = (text) => /[A-Za-z]{2,}/.test(text) && !ALLOWED.has(text.trim())

const problems = []
for (const dir of ["components/ui", "components/blocks"]) {
  for (const f of readdirSync(join(ROOT, dir)).filter((f) => f.endsWith(".tsx"))) {
    const path = join(dir, f)
    const src = ts.createSourceFile(path, readFileSync(join(ROOT, path), "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    const report = (node, text) => {
      const { line } = src.getLineAndCharacterOfPosition(node.getStart())
      problems.push(`${path}:${line + 1}  ${JSON.stringify(text.trim().slice(0, 60))}`)
    }
    // String literals (and template text) inside an expression, ignoring class names and other code-ish props.
    const scanExpression = (expr) => {
      const visit = (n) => {
        if (ts.isJsxAttribute(n)) return // nested JSX attributes are handled on their own
        if (ts.isCallExpression(n) && /^(cn|cva|clsx)$/.test(n.expression.getText(src))) return
        if (ts.isBinaryExpression(n) && [ts.SyntaxKind.EqualsEqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsEqualsToken].includes(n.operatorToken.kind)) return
        if (ts.isElementAccessExpression(n)) return
        if (ts.isBinaryExpression(n) && n.operatorToken.kind === ts.SyntaxKind.InKeyword) return
        // `prop ?? "Default"`: the right-hand string is that prop's default.
        if (ts.isBinaryExpression(n) && n.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken) return visit(n.left)
        // Local constants inside a render callback (`const mask = \`linear-gradient(…)\``) are code, not text.
        if (ts.isVariableDeclaration(n)) return
        // `["left", "right"].map(…)`: keys iterated in code.
        if (ts.isArrayLiteralExpression(n) && ts.isPropertyAccessExpression(skipAs(n.parent)) && skipAs(n.parent).name.text === "map") return
        if (ts.isAsExpression(n) && ts.isArrayLiteralExpression(n.expression) && ts.isParenthesizedExpression(n.parent) && ts.isPropertyAccessExpression(n.parent.parent) && n.parent.parent.name.text === "map") return
        if ((ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) && isWords(n.text)) report(n, n.text)
        if (ts.isTemplateExpression(n)) {
          const text = [n.head.text, ...n.templateSpans.map((s) => s.literal.text)].join(" ")
          if (isWords(text)) report(n, text)
          return
        }
        ts.forEachChild(n, visit)
      }
      visit(expr)
    }
    const skipAs = (n) => (ts.isParenthesizedExpression(n) || ts.isAsExpression(n) ? n.parent : n)
    // Inside a `…Labels` defaults object every string is a translatable default by definition.
    const inLabels = (n) => {
      for (let p = n; p; p = p.parent) {
        if (ts.isVariableDeclaration(p) && /Labels$/.test(p.name.getText(src))) return true
        // A destructured prop's default (`trigger = <Button>Invite</Button>`) is a prop default too.
        if (ts.isBindingElement(p) && p.initializer && n.pos >= p.initializer.pos && n.end <= p.initializer.end) return true
      }
      return false
    }
    // An aria-label written before `{...props}` is a default the caller overrides with its own aria-label.
    const overridable = (attr) => {
      if (attr.name.getText(src) !== "aria-label") return false
      const list = attr.parent.properties
      return list.slice(list.indexOf(attr) + 1).some((p) => ts.isJsxSpreadAttribute(p))
    }
    const walk = (node) => {
      if (inLabels(node)) return
      if (ts.isJsxText(node) && isWords(node.text)) report(node, node.text)
      if (ts.isJsxExpression(node) && node.expression && (ts.isJsxElement(node.parent) || ts.isJsxFragment(node.parent))) scanExpression(node.expression)
      if (ts.isJsxAttribute(node) && READ_ATTRS.test(node.name.getText(src)) && node.initializer && !overridable(node)) {
        if (ts.isStringLiteral(node.initializer) && isWords(node.initializer.text)) report(node, node.initializer.text)
        else if (ts.isJsxExpression(node.initializer) && node.initializer.expression) scanExpression(node.initializer.expression)
      }
      ts.forEachChild(node, walk)
    }
    walk(src)
  }
}
if (problems.length) {
  console.log(`${problems.length} fixed English string(s) in JSX; make each a prop default or a labels key:\n${problems.join("\n")}`)
  process.exit(1)
}
console.log("No fixed English in JSX: every built-in string is a prop default or a labels key")
