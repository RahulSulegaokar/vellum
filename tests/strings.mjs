// Every built-in English string in the registry must be translatable: a prop default (`closeLabel = "Close"`) or
// a key of a block's `…Labels` object. This scans every components/ui and components/blocks file with the
// TypeScript parser and fails on English written directly into JSX: text children, string literals in JSX
// expressions, and the attributes people read (aria-*, title, alt, placeholder, label, description).
// Non-words (symbols, numbers, key caps) are allowed below. Run: `node tests/strings.mjs`.
//
// Also caught: prose-like strings ("Two words", "Capitalised") in any other JSX attribute (`heading="…"`), and
// module-level string constants that read like prose and are used in JSX.
// Not caught (limits): prose built in event handlers, state setters or helper functions that are not JSX
// (`setError("Couldn't save")`, `function label() { return "…" }`). Checking those would also flag error
// messages for developers, so review them by hand; English in a `…Labels` object or a prop default is fine.
import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import ts from "typescript"

const ROOT = new URL("..", import.meta.url).pathname
const READ_ATTRS = /^(aria-(label|roledescription|valuetext|description|placeholder)|title|alt|placeholder|label|description|subtitle)$/
// Strings that are not words a translator would change.
const ALLOWED = new Set(["·", "99+", "⌘", "K", "W", "/", "+", "-", "—", "…", "%", "@", "1", "2"])
const isWords = (text) => /[A-Za-z]{2,}/.test(text) && !ALLOWED.has(text.trim())
// Prose for attributes outside READ_ATTRS: a capitalised word, or words separated by spaces, with no class-name
// or path punctuation.
const isProse = (text) => isWords(text) && !/[:/\[\]{}=_#]|^[a-z0-9-]+$/.test(text.trim()) && (/^[A-Z][a-z]/.test(text.trim()) || /[A-Za-z] [A-Za-z]/.test(text))
// Attributes that hold code, not text, even when the value looks like words.
const CODE_ATTRS = /^(className|class|style|href|src|srcSet|id|key|type|role|name|value|defaultValue|rel|target|method|action|autoComplete|inputMode|variant|size|side|align|orientation|tone|htmlFor|dir|lang|d|viewBox|fill|stroke|strokeLinecap|strokeLinejoin|xmlns|mode|captionLayout|collapsible|swipeDirection|loading|decoding|data-[\w-]+|aria-(hidden|current|live|controls|describedby|labelledby|orientation|haspopup|expanded|invalid|disabled|modal|pressed|selected|checked|sort))$/

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
    // Module-level constants holding prose, by name, so their use in JSX can be reported.
    const proseConstants = new Map()
    for (const st of src.statements) {
      if (!ts.isVariableStatement(st)) continue
      for (const d of st.declarationList.declarations) {
        if (!/Labels$/.test(d.name.getText(src)) && d.initializer && (ts.isStringLiteral(d.initializer) || ts.isNoSubstitutionTemplateLiteral(d.initializer)) && isProse(d.initializer.text))
          proseConstants.set(d.name.getText(src), d.initializer.text)
      }
    }
    const walk = (node) => {
      if (inLabels(node)) return
      if (ts.isIdentifier(node) && proseConstants.has(node.text) && (ts.isJsxExpression(node.parent) || ts.isJsxExpression(node.parent?.parent)))
        report(node, proseConstants.get(node.text))
      if (ts.isJsxAttribute(node) && !READ_ATTRS.test(node.name.getText(src)) && !CODE_ATTRS.test(node.name.getText(src)) && node.initializer && ts.isStringLiteral(node.initializer) && isProse(node.initializer.text))
        report(node, node.initializer.text)
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
