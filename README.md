# Vellum

A themeable, [shadcn](https://ui.shadcn.com)-compatible component registry built on [Base UI](https://base-ui.com).

Vellum ships 66 components (every shadcn `base-nova` component, a framework-free `form`, and `segmented-control`). Every one of them reads its colours, rings, shadows and radius from theme tokens, so you can restyle the whole kit by changing a few CSS variables. The default theme is calm and precise: soft layered shadows, hairline rings, and a violet accent.

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

Pin a release by appending a tag: `RahulSulegaokar/vellum/button#v0.5.1`.

**CLI versions.** Vellum is built and tested with shadcn CLI 4.23.0, which the update workflow pins; `shadcn@latest` works as long as it is 4.x. The `#tag` form is checked on every release by `.github/workflows/release-check.yml` (an empty Vite project and a Laravel-shaped one, `--dry-run`).

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
| `--brand`, `--brand-foreground`, `--brand-edge` | Primary buttons, selection, focus outlines |
| `--control-checked` | Checked checkbox, radio and switch, slider and progress fills (follows `--brand`; lighter in dark mode) |
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

Settings at the top of the file:

- `WORKDIR`: the folder with `components.json` (for example `apps/web` in a monorepo); every step runs there.
- `UPDATE_BLOCKS: "false"`: blocks are yours after install; the PR lists what each would change (`--diff`) instead of overwriting them.
- `STATE_FILE` (`vellum.json`): the job records the installed release and the Vellum items it found; when the newest release is already recorded it stops without a PR.

The workflow uses npm (`npm ci`, `cache: npm`); with pnpm or yarn, change its setup and install steps. The job keeps no git credentials in the checkout, runs `npm ci --ignore-scripts`, passes a token only to the step that opens the PR, and never runs twice at once.

> **Public repo required.** The `RahulSulegaokar/vellum/<item>` addresses (and the dependencies between items) are fetched from GitHub without credentials, so they only work while the repo is public. If you keep a private fork, host its built registry (`npm run registry:build` writes `public/r`) behind your own URL and reference items by that URL or a namespace in `components.json` instead.

## Forms, banners and theming outside Next.js

- `form`: `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`. Pass the field's error (`errors.email` from Inertia's `useForm`, a server error, anything) to `FormItem`; `FormControl` wires `id`, `aria-describedby` (description + error) and `aria-invalid` onto the input. No form library required.
- `banner` block: info, warning, destructive and success notice strips.
- Dark mode follows the `dark` class on `<html>`; `sonner` uses the framework-free `use-theme` hook, so Laravel/Inertia and Vite apps don't need `next-themes`.
- Contrast: every text/background token pair and every focus ring meets WCAG AA in light and dark, with Vellum's violet and with a green accent fixture (`npm run test:contrast`, run in CI; `--json` prints the list). Use the `-text` tokens for status-coloured text.

## Accessibility

- Focus: an opaque 2px `--ring` outline on every control (drawn inside where a scrolling list would clip it).
- Touch: a 44×44px hit area on coarse pointers for every control, at its visual size (see `DESIGN.md` for spacing).
- Field text is 16px on touch screens, so iOS doesn't zoom.
- Forced colours (Windows high contrast) and `prefers-reduced-motion` are honoured.
- Dialogs and sheets set `aria-modal`; their header and footer are plain `div`s (no landmarks).
- `tests/a11y.spec.ts` (Playwright; locally with `npm run test:visual`, in CI against the production build) checks it: pixel-sampled focus rings, touch areas, forced colours, reduced motion, labels, reflow at 320px.

**Translated labels.** Every built-in string is a prop with the English text as its default:

| Component | Props |
|---|---|
| `DialogContent`, `SheetContent` | `closeLabel` ("Close") |
| `DialogFooter` | `closeLabel` ("Close", the footer button's text) |
| `Label`, `FormLabel` | `optionalLabel` ("Optional") |
| `CodeBlockCopyButton` | `copyLabel` ("Copy"), `copiedLabel` ("Copied") |
| `BreadcrumbEllipsis` | `label` ("More") |
| `PaginationPrevious`, `PaginationNext` | `label` ("Go to previous page" / "Go to next page"), `text` |
| `PaginationEllipsis` | `label` ("More pages") |
| `CarouselPrevious`, `CarouselNext` | `label` ("Previous slide" / "Next slide") |
| `Carousel`, `CarouselItem` | `roleDescription` ("carousel" / "slide") |
| `Sidebar` | `mobileTitle` ("Sidebar"), `mobileDescription` |
| `SidebarTrigger`, `SidebarRail` | `label` ("Toggle Sidebar") |
| `ComboboxInput` | `triggerLabel` ("Show options"), `clearLabel` ("Clear") |
| `ComboboxClear` | `aria-label` ("Clear") |
| `ComboboxChip` | `removeLabel` ("Remove") |
| `MessageScrollerButton` | `label` ("Scroll to end" / "Scroll to start") |
| `Slider` | `getAriaValueText`, `getAriaLabel` (passed to every thumb, for a spoken value such as "50 percent volume") |

`Breadcrumb` and `Pagination` (`aria-label`), `ToastClose` (`aria-label`), `Spinner` (`aria-label`) and `CommandDialog` (`title`, `description`) already take their text as props. Every block with built-in text takes a `labels` prop (defaults exported as `…Labels`, for example `authSignInLabels`, `pricingPlansLabels`). `npm run test:strings` fails on any English written straight into a component's JSX.

## Blocks

Ready-made screen sections built from the components. Each installs into a `blocks` folder under your components alias (`components/blocks/<name>.tsx` in Next.js, `resources/js/components/blocks/<name>.tsx` in Laravel); it exports prop-driven components and ships no demo data.

```bash
npx shadcn@latest add RahulSulegaokar/vellum/data-table-card
```

**Dashboard**

- `dashboard-shell`: Dashboard chrome: workspace, application and environment menus, header actions and the primary tab nav above the page content.
- `settings-sidebar`: Desktop settings sidebar: a "Find…" box that opens the find dialog above the grouped, collapsible settings navigation.
- `settings-card`: Settings card: a switch-led header (title, description, optional badge) over a white panel of option rows that collapses while off.
- `data-table-card`: Data table card with search, column visibility, filters, sortable headers, row actions and empty states.
- `filter-bar`: Filter toolbar: removable filter pills and "Clear all" on wider screens, a filter sheet on phones, with leading and trailing slots for navigation and actions (date range, refresh, share).
- `date-range-picker`: Popover date-range picker with relative presets, From/To date-time rows and a range calendar.
- `create-user-dialog`: "Create new user" dialog with Create / Invite tabs, optional name fields, password visibility toggle and inline validation.
- `invite-member-dialog`: Invite-member dialog: email and role fields with inline validation, Cancel / Invite footer.
- `create-wizard`: Two-step create flow (type cards and name, then toggleable options) with a live preview on the right.
- `integration-cards`: Responsive grid of integration cards with an optional "request an integration" callout.
- `feature-upsell`: "Turn on a feature" panel: a feature carousel with illustrations and an enable button, which swaps to an empty state with a turn-off action once enabled.
- `banner`: Full-width notice strip for page or section state (trial ending, sending paused, verification needed).
- `callout`: Inline notice for page-level context ("Use this sandbox for test data; switch to live when you're ready.").
- `empty-state`: Centered empty state: icon tile, title, supporting copy and optional actions.

**Auth and account**

- `auth-page`: Full-page auth layout: soft centered glow on the canvas, a centered card slot and a copyright/links footer.
- `auth-sign-in`: Sign-in card: optional logo, provider buttons, email field, primary continue, an optional alternative method and a link to sign up.
- `auth-sign-up`: Sign-up card: optional logo, provider buttons, email and password (with show/hide), primary continue and a link to sign in.
- `auth-waitlist`: Waitlist card: email field and a join button, swapping to a confirmation once submitted.
- `account-menu`: Avatar button that opens an account dropdown menu: user summary, "Manage account" and "Sign out", other signed-in accounts to switch to, "Add account" and an optional confirmed "Sign out of all accounts".
- `account-profile`: Account settings panel with a sidebar nav and a Profile section (avatar and name, email addresses, linked sign-in accounts).
- `workspace-switcher`: Workspace switcher: a compact trigger showing the active workspace that opens a dropdown menu.
- `members-card`: Workspace members: Members/Invitations tabs, search, invite dialog, and a table with per-member role select and an actions menu.
- `api-keys-card`: API keys list with masked values, copy, revoke (with confirmation) and a create dialog that reveals the new secret once.

**Marketing**

- `site-header`: Floating sticky marketing header: optional announcement bar, logo slot, mega-menu navigation, sign-in/sign-up actions and a phone menu.
- `hero-section`: Marketing hero: headline, supporting copy, a primary CTA beside a copy-to-clipboard pill, and an optional logo cloud.
- `feature-grid`: Feature section: eyebrow, title and body, a bento grid of feature cards, and an optional badge row.
- `pricing-plans`: Pricing section: title, monthly/annual toggle and a responsive grid of plan cards.
- `testimonials-section`: Testimonials: heading, an optional action, a rotating featured quote and a grid of quote cards.
- `faq-section`: FAQ section: title on the left, accordion of questions on the right.
- `cta-section`: Closing call-to-action card: title, short pitch and actions over soft line art.
- `site-footer`: Marketing footer: framed logo, link columns, social links and a legal line.

Blocks ship no demo data: every data prop (rows, members, plans, nav items…) is passed in, and the gallery demos live in the Vellum repo under `components/examples/blocks/`. Blocks that render links take `linkComponent` (defaults to `"a"`), so an Inertia or React Router app can pass its own `Link`:

```tsx
import { Link } from "@inertiajs/react"
<DashboardShell linkComponent={Link} nav={nav} activeHref={url}>{children}</DashboardShell>
```

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
npm run dev                 # gallery at http://localhost:3000, every component and state at /showcase
npm run registry:generate   # rebuild registry.json + app/theme.css from components/ui and the tokens file
npm run registry:validate
npm run registry:build      # writes public/r/*.json for URL hosting
npm run test:visual         # every gallery page, light and dark, must render without console errors
```

- Tokens live in `registry/themes/vellum.tokens.json`. Don't edit `app/theme.css` or `registry.json` by hand; `registry:generate` writes them.
- The gallery pages in `components/examples/` come from shadcn's examples, used as demos.

## License

MIT. Includes code derived from shadcn/ui (MIT); see [NOTICE](NOTICE).
