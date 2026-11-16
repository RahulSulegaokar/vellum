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

> The shadcn CLI also adds lines like `--rule-shadow: var(--rule-shadow);` to `@theme inline` for every token that isn't a colour. They're harmless, because the real values in `:root` win, and you can delete them.

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

To get updates as a weekly pull request, copy [`templates/vellum-update.yml`](templates/vellum-update.yml) into your project's `.github/workflows/`. It reads your folders from `npx shadcn info` (so it works with any layout: Next.js, Laravel, Vite), re-installs every Vellum component, hook and block you already have, plus the Vellum skill if installed, and opens a PR if anything changed. Local edits to those files show up in the PR diff, so you can keep or drop them. It never re-installs the theme, so your token choices are not overwritten; to take a new release's token values, re-run step 1 by hand.

> **Public repo required.** The `RahulSulegaokar/vellum/<item>` addresses (and the dependencies between items) are fetched from GitHub without credentials, so they only work while the repo is public. If you keep a private fork, host its built registry (`npm run registry:build` writes `public/r`) behind your own URL and reference items by that URL or a namespace in `components.json` instead.

## Blocks

Ready-made screen sections built from the components. Each installs into a `blocks` folder under your components alias (`components/blocks/<name>.tsx` in Next.js, `resources/js/components/blocks/<name>.tsx` in Laravel); it exports prop-driven components plus a default demo.

```bash
npx shadcn@latest add RahulSulegaokar/vellum/data-table-card
```

**Dashboard**

- `dashboard-shell`: Breadcrumb-style menu trigger: flat until hovered or open, then a raised white chip.
- `settings-sidebar`: Grouped settings navigation: section headings, plain links and collapsible groups with a guide rail.
- `settings-card`: Height-animated disclosure region; content is `inert` while closed.
- `data-table-card`: Makes the column sortable. Return `null` for "no value" (sorts as lowest).
- `filter-bar`: Fixed choices render as a checkbox list; omit for a free-text field.
- `date-range-picker`: Length of the window ending at "now", in milliseconds.
- `create-user-dialog`: "Create new user" dialog with Create / Invite tabs, optional name fields, password visibility toggle and inline validation.
- `invite-member-dialog`: Invite-member dialog: email and role fields with inline validation, Cancel / Invite footer.
- `create-wizard`: "identifier" options become the preview's text field; the rest render as provider buttons.
- `integration-cards`: Secondary line under the name, usually the partner's domain.
- `feature-upsell`: Illustration for the 244×151 card; `active` is true for the centered card.
- `callout`: Inline notice for page-level context ("Use this development instance for test users…").
- `empty-state`: Centered empty state: icon tile, title, supporting copy and optional actions. Sits inside a card or table body.

**Auth and account**

- `auth-page`: Full-page auth layout: soft centered glow on the canvas, a centered card slot and a copyright/links footer.
- `auth-sign-in`: Glyph shown before the label. Defaults to a monogram of the label.
- `auth-sign-up`: Sign-up card: logo, provider buttons, email and password (with show/hide), primary continue and a link to sign in.
- `auth-waitlist`: Waitlist card: email field and a join button, swapping to a confirmation once submitted.
- `account-menu`: The menu body on its own: user summary, manage/sign-out actions, other signed-in accounts and "Add account".
- `account-profile`: Settings shell: title and vertical nav on the muted rail, the active section in a white panel. Nav scrolls horizontally on narrow screens.
- `workspace-switcher`: Your role in it ("Admin", "Member"). Omit for a personal workspace.
- `members-card`: ISO date, formatted deterministically.
- `api-keys-card`: Visible prefix, e.g. "ak_live_".

**Marketing**

- `site-header`: Default logo: a round mark and a lowercase wordmark. Pass your own through `logo`.
- `hero-section`: Pill that copies a prompt to the clipboard: stacked bubbles, label and a copy glyph that swaps to a check.
- `feature-grid`: Small label above a section title.
- `pricing-plans`: Per-month prices; leave both `null` for a free or custom plan and set `label` ("Free", "Custom").
- `testimonials-section`: True when the viewer asked for reduced motion; false during server render.
- `faq-section`: Accordion list of questions, one open at a time. Use inside your own section layout.
- `cta-section`: Large round mark used as the card's decorative art.
- `site-footer`: One dotted hairline that runs past its box by 1.25rem and fades out at both ends.

## For AI agents

- `npx skills add RahulSulegaokar/vellum --skill vellum` installs the Vellum skill (setup, variant choice, composition and styling rules).
- Or install it with the registry: `npx shadcn@latest add RahulSulegaokar/vellum/vellum-skill` (writes `.claude/skills/vellum/SKILL.md`).
- `npx shadcn@latest add RahulSulegaokar/vellum/vellum-design` adds the full design spec as `DESIGN.md`.

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
