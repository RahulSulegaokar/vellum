# Vellum

A themeable, [shadcn](https://ui.shadcn.com)-compatible component registry built on [Base UI](https://base-ui.com).

Vellum ships 65 components (every shadcn `base-nova` component except `form`, plus `segmented-control`). Every one of them reads its colours, rings, shadows and radius from theme tokens, so you can restyle the whole kit by changing a few CSS variables. The default theme is calm and precise: soft layered shadows, hairline rings, and a violet accent.

Components install into your project with the normal shadcn CLI, and you own the code afterwards, just as with shadcn.

## Install

You need a project that has been set up with shadcn (`npx shadcn@latest init`) using Tailwind CSS v4.

**1. Install the theme once.** This overwrites the shadcn colour, radius and shadow tokens in your global CSS with Vellum's:

```bash
npx shadcn@latest add RahulSulegaokar/vellum/vellum-theme
```

**2. Add components:**

```bash
npx shadcn@latest add RahulSulegaokar/vellum/button RahulSulegaokar/vellum/dialog
```

Each component also brings in:
- the other Vellum components it needs
- the `cn` helper
- any theme tokens your project doesn't have yet

Pulled in this way, the theme only adds missing tokens. It never overwrites values you've set, which is why step 1 installs it explicitly.

Pin a release by appending a tag: `RahulSulegaokar/vellum/button#v0.1.0`.

> With a brand-new `create-next-app` project, `shadcn init` may write `--font-sans: var(--font-sans)` while the layout defines `--font-geist-sans`. Point one at the other, or the page falls back to a serif font. This is unrelated to Vellum.

## Theming

The theme is a set of CSS variables in `:root` and `.dark`. Override them after the theme block in your global CSS:

```css
:root {
  --brand: #0f9d58;        /* accent: primary buttons, checked controls, focus */
  --brand-edge: #0b7a44;   /* ring around brand-filled controls */
  --radius: 0.25rem;       /* the whole radius scale follows this */
  --surface-muted: #fafaf9;
}
```

Main tokens:

| Token | Used for |
|---|---|
| `--brand`, `--brand-foreground`, `--brand-edge` | Primary buttons, checked checkbox/radio/switch, focus outlines |
| `--solid`, `--solid-hover`, `--solid-foreground` | The default (dark) button |
| `--surface`, `--surface-muted` | Raised controls, dialog panel and shell |
| `--field`, `--field-ring`, `--field-ring-focus`, `--field-halo`, `--field-invalid` | Inputs, textareas, selects, OTP slots |
| `--edge`, `--hairline` | Rings and dividers |
| `--subtle`, `--placeholder` | Secondary text, placeholders |
| `--control-shadow*`, `--surface-shadow`, `--dialog-shadow`, `--card-shadow`, `--button-shadow` | Elevation |
| `--radius` | Radius scale (`sm` 4px, `md` 6px, `lg` 8px, `xl` 12px at the default 0.5rem) |

The standard shadcn tokens (`--background`, `--foreground`, `--primary`, `--border`, `--ring`, …) work as usual.

## Updating

The CLI copies code into your project, so updates are opt-in:

```bash
npx shadcn@latest add RahulSulegaokar/vellum/dialog --diff
```

```bash
npx shadcn@latest add RahulSulegaokar/vellum/dialog --overwrite
```

To get updates as a weekly pull request, copy [`templates/vellum-update.yml`](templates/vellum-update.yml) into your project's `.github/workflows/`. It re-installs every Vellum component you already have, and opens a PR if anything changed. Local edits to those files show up in the PR diff, so you can keep or drop them. It doesn't re-install the theme, so your token choices are never overwritten. To take a new release's token values, re-run step 1 by hand.

## Variants beyond shadcn

- **Button:**
  - Variants: `primary` (raised brand fill), `elevated` (raised surface), `gloss` and `gloss-solid` (glossy pills).
  - Sizes: `compact`, `compact-sm`, `compact-md`, `icon-compact*`, `pill`.
- **Badge:** `subtle`, `subtle-info`, `subtle-warning`.
- **Input:** `variant="compact"`.
- **Select trigger:** `variant="elevated"`.
- **Tabs list:** `variant="underline"`.

## Developing

```bash
npm install
npm run dev                 # gallery at http://localhost:3000
npm run registry:generate   # rebuild registry.json + app/theme.css from components/ui and the tokens file
npm run registry:validate
npm run registry:build      # writes public/r/*.json for URL hosting
npm run test:visual         # every gallery page, light and dark, must render without console errors
```

- Tokens live in `registry/themes/vellum.tokens.json`. Don't edit `app/theme.css` or `registry.json` by hand; `registry:generate` writes them.
- The gallery pages in `components/examples/` come from shadcn's examples, used as demos.

## License

MIT. Includes code derived from shadcn/ui (MIT); see [NOTICE](NOTICE).
