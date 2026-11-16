---
name: vellum
description: Build UI with the Vellum design system (a themeable shadcn-compatible registry on Base UI). Use when a project's components come from RahulSulegaokar/vellum, when components/ui files mention vellum tokens (bg-surface, ring-hairline, shadow-popover, variant="elevated"/"compact"), or when asked to build screens, dashboards, settings pages, dialogs, auth or marketing sections "in the Vellum style". Covers installing items and blocks, choosing variants, composing layouts and the styling rules.
---

# Vellum

Vellum is a shadcn-compatible component registry: calm, dense product UI with white surfaces on a pale canvas, hairline rings, soft layered shadows and one violet accent. Components live in the project's `components/ui` after install and read every color, ring, shadow and radius from theme tokens.

## Setup in a project

1. The project must use shadcn with Tailwind v4 (`components.json` exists). If not: `npx shadcn@latest init`.
2. Install the theme once (overwrites shadcn's default tokens):
   `npx shadcn@latest add RahulSulegaokar/vellum/vellum-theme`
3. Add what you need. Components and blocks pull their own dependencies:
   `npx shadcn@latest add RahulSulegaokar/vellum/button RahulSulegaokar/vellum/dialog`
4. List everything available: `npx shadcn@latest list RahulSulegaokar/vellum`. Read an item before adding: `npx shadcn@latest view RahulSulegaokar/vellum/<name>`.
5. Update an item: `npx shadcn@latest add RahulSulegaokar/vellum/<name> --diff`, then `--overwrite`.

Never install the bare shadcn version of a component that came from Vellum (`npx shadcn add button`): it would overwrite the Vellum file. Always use the `RahulSulegaokar/vellum/` address.

## Choose the variant

| Need | Use |
|---|---|
| The one main action in a view or dialog | `<Button variant="primary" size="compact">` |
| Secondary action, toolbar button, Cancel | `<Button variant="elevated" size="compact">` |
| Marketing CTA | `<Button>` (dark solid) or `variant="gloss"` / `"gloss-solid"` with `size="pill"` |
| Quiet icon action | `<Button variant="ghost" size="icon-compact">` |
| Form field in a dashboard or dialog | `<Input variant="compact" />`, `<SelectTrigger variant="elevated">` |
| Form field on a marketing/contact page | `<Input />`, `<Textarea />`, `<SelectTrigger>` |
| Neutral tag | `<Badge variant="subtle">` (`subtle-info`, `subtle-warning` for emphasis) |
| Page-level nav inside a dashboard | `<TabsList variant="underline">` |
| 2 to 4 exclusive options in a toolbar | `<SegmentedControl>` |
| On/off setting with description | `Switch` inside a settings row (see blocks) |

Sizes: dashboards use `compact` (28px). Dense headers use `compact-sm` (24px); touch toolbars use `compact-md` (32px). Don't mix sizes within one toolbar or form.

## Compose

- **Dialog:** `DialogContent` (muted shell) > `DialogPanel` (white) > `DialogHeader` + `DialogSection`s; `DialogFooter` on the shell with `elevated` Cancel and `primary` confirm.
- **Card:** `rounded-xl bg-surface shadow-card`, 20 to 24px padding, title left and actions right in the header row.
- **Dashboard page:** `mx-auto w-[calc(100%-2.5rem)] max-w-6xl pt-8 pb-10`, `text-xl font-semibold` title, 32px between sections.
- **Floating layers** (menus, popovers, selects, toasts) already carry `shadow-popover ring-1 ring-hairline`; don't add borders.

Prefer a Vellum block over hand-building a screen section. Install it (`npx shadcn@latest add RahulSulegaokar/vellum/<block>`), then edit its copy and data: each block file exports named, prop-driven components and ships no demo data. Blocks land in a `blocks` folder under the project's components alias (for example `resources/js/components/blocks/` in Laravel); find the real paths with `npx shadcn@latest info`.

## Blocks

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

## Styling rules

- Text colour for status: `text-destructive-text`, `text-warning-text`, `text-info-text`, `text-success-text`; violet text is `text-brand-text`. The plain tokens (`destructive`, `warning`, `info`, `success`, `brand`) are for fills, tints (`bg-warning/6`), rings and icons. A solid red fill behind white text is `bg-destructive-strong text-destructive-foreground`. All of these pass WCAG AA.
- Forms: wrap each field in `<FormItem error={…}>` with `FormLabel`, `FormControl` (around the input), `FormDescription` and `FormMessage` from `@/components/ui/form`; it wires `id`, `aria-describedby` and `aria-invalid`. Works with Inertia's `useForm` errors.
- Page or section notices: the `banner` block (`tone="info" | "warning" | "destructive" | "success"`).
- Theme: Vellum reads dark mode from the `dark` class on `<html>` (`useTheme` from `@/hooks/use-theme`); no `next-themes` needed.
- Use token utilities only: `bg-background`, `bg-surface`, `bg-surface-muted`, `bg-field`, `text-foreground`, `text-muted-foreground`, `text-subtle`, `ring-hairline`, `ring-edge/{4,6,12,20}`, `bg-brand`, `text-brand-foreground`, `shadow-popover|card|surface|dialog|control|chip`. Never hard-code `gray-*`, `white`, hex or `rgb()` colors; if something is missing, add a token to the theme instead.
- Violet (`brand`) marks actions, checked/selected/progress states and focus only. Never on large backgrounds.
- One `primary` button per view.
- Edges are rings, not borders, on shadowed surfaces.
- To remove or change a token shadow pass another token shadow or `shadow-none!`; plain `shadow-none` in `className` does not override it because `cn()` treats custom shadow names as colors.
- Radius: `rounded-md` controls and fields, `rounded-lg` popovers and menus, `rounded-xl` cards and dialogs. Change the whole scale with `--radius`, not per component.

## Theming a project

Override tokens in the project's global CSS `:root` / `.dark` (for example `--brand`, `--brand-edge`, `--radius`, `--surface-muted`). Re-running the explicit theme install (`vellum-theme`) resets them to Vellum's values; component installs never touch values that already exist.

The full design spec, with every token, is `DESIGN.md` in https://github.com/RahulSulegaokar/vellum.
