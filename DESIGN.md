---
name: Vellum
description: Calm, precise product UI with soft layered shadows, hairline rings and a single violet accent.
colors:
  canvas: "#f7f7f8"        # --background
  ink: "#131316"           # --foreground
  surface: "#ffffff"       # --surface, --card, --popover, --field
  surface-muted: "#f7f7f8" # --surface-muted (dialog shell, hover wash)
  muted-text: "#5e5f6e"    # --muted-foreground
  subtle-text: "#6c6d7d"   # --subtle
  placeholder: "#747583"   # --placeholder (--placeholder-on-tint #6d6e7c on tinted inputs)
  hairline: "rgb(19 19 22 / 0.05)"  # --hairline
  border: "#e3e3e7"        # --border
  accent: "#6c47ff"        # --brand (actions, checked states, focus)
  accent-edge: "#5b35f0"   # --brand-edge
  solid: "#42434d"         # --solid (default dark button)
  danger: "#ef4444"        # --destructive (fills, rings, icons)
  danger-text: "#c10007"   # --destructive-text, also --destructive-strong behind white text
  warning-text: "#ca3500"  # --warning-text
  info-text: "#1447e6"     # --info-text
  success-text: "#007a32"  # --success-text
  accent-text: "#6c47ff"   # --brand-text (#9479ff in dark)
  success: "#22c543"
  warning: "#f36b16"
rounded:
  sm: 4px
  md: 6px    # buttons (compact), fields, menu items, toggles
  lg: 8px    # popovers, menus, cards
  xl: 12px   # dialogs, large cards
typography:
  family: system sans (Geist recommended), mono for code
  body: 14px/20px
  label: 13px/16px medium
  caption: 11px/14px
components:
  button-height: { default: 32px, compact: 28px, compact-sm: 24px, compact-md: 32px, pill: 30px }
  field-height: 32px
---

# Vellum design spec

Vellum is quiet, dense product UI. Surfaces are white on a pale canvas, edges are hairline rings rather than borders, and depth comes from several very soft shadow layers. There is exactly one accent, violet, and it marks the things a user can act on or has turned on.

This file is for people and for coding agents. The rules below override shadcn defaults when you build with Vellum. Tokens are defined in `registry/themes/vellum.tokens.json` and installed by `vellum-theme`.

## Colors

| Role | Token / utility | Use |
|---|---|---|
| Page canvas | `bg-background` | App and page background |
| Raised surface | `bg-surface` (`bg-card`, `bg-popover`) | Cards, panels, menus, dialogs, white controls |
| Muted surface | `bg-surface-muted` | Dialog shell around a panel, hover wash on cards, read-only areas |
| Text | `text-foreground`, `text-muted-foreground`, `text-subtle` | Body, secondary, tertiary (meta, hints) |
| Placeholder | `placeholder:text-placeholder`; `placeholder:text-placeholder-on-tint` on a tinted input (`bg-input/30`) | Inputs only |
| Accent | `bg-brand`, `text-brand-foreground`, `ring-brand-edge` | Primary actions, checked/selected/progress states, focus |
| Solid | `bg-solid`, `text-solid-foreground` | The default (dark) button; dark badges and bubbles use `primary` |
| Hairline | `ring-1 ring-hairline` | Edges of popovers, cards, tags |
| Edge | `ring-edge/{4,6,12,20}`, `border-edge/6` | Graded rings and dividers on dashboard surfaces |
| Fields | `bg-field`, `ring-field-ring`, `--field-halo`, `ring-field-invalid` | Inputs, selects, OTP, textareas |
| Status text | `text-destructive-text`, `text-warning-text`, `text-info-text`, `text-success-text` | Any status-coloured text. `--destructive`, `--warning`, `--info` and `--success` are for fills, tints, rings and icons only |
| Status tints | `bg-destructive/6`, `bg-warning/6`, `bg-info/6`, `bg-success/6` with a matching `ring-*/20` | Badges, banners, callouts |
| Solid danger | `bg-destructive-strong text-destructive-foreground` | Solid red fills behind white text (counts, destructive buttons) |
| Accent text | `text-brand-text` | Violet links and labels (`bg-brand` stays for fills) |

## Contrast

All text meets WCAG AA (4.5:1, or 3:1 at 18px and up) in light and dark. `npm run test:contrast` checks every text/background token pair the components use and runs in CI. When adding a token or a new pairing, add it to `tests/contrast.mjs`.

- `--subtle` passes on white, the canvas and its own 4% tint. It must not sit on `--muted` (4.40:1); `--muted-foreground` is stronger: use it for avatar initials and anything on `--muted`.
- `--brand-text` and `--success-text` are for white, the canvas and tints of 4% or less (not `--muted`).
- `--placeholder` passes on fields; `--placeholder-on-tint` on the command palette's and combobox popup's tinted inputs (4.5:1 or more).
- Never set status-coloured text with the fill token (`text-destructive`); use the `-text` token.
- Focus rings (`--ring`) reach 3:1 on every surface; the test checks them too, with Vellum's violet and with a green accent fixture, so a rebrand is covered.
- `node tests/contrast.mjs --json` prints every pair and its ratio, for apps that extend the list with their own tokens.
- Reported for information only: control boundaries under 3:1 (unchecked checkbox, radio, field ring, switch-off track). These controls are identified by their label and shape, and a darker edge would change the look at rest. Every other pair is enforced, with no known gaps (v0.5.0 closed the checked and progress fills in dark mode, the `gloss` pill label and success text on a success banner).

## Change the accent

The violet accent is spread over a handful of tokens. To rebrand, set all of them in your global CSS, after the theme block:

| Token | Light | Dark | Drives |
|---|---|---|---|
| `--brand` | `#6c47ff` | inherits light | Primary buttons, selection, brand fills behind text |
| `--control-checked` | `var(--brand)` | `#7755ff` | Checked checkbox, radio and switch, slider range and progress fill (3:1 on dark surfaces; white marks on it 3:1) |
| `--brand-edge` | `#5b35f0` | inherits light | 1px ring around brand fills (also used by `--control-shadow-checked`) |
| `--brand-foreground` | `#ffffff` | `#ffffff` | Text and icons on brand fills |
| `--brand-text` | `#6c47ff` | `#9479ff` | Violet text and links (must pass 4.5:1 on white and the dark canvas) |
| `--ring` | `#6c47ff` | `#9480ff` | Focus rings (3:1 on every surface, white fills included) |
| `--sidebar-ring` | `#6c47ff` | `#9480ff` | Focus rings inside the sidebar |
| `--sidebar-primary` | `#131316` (ink, not violet) | `#9785ff` | Active sidebar item fill |
| `--brand-edge-strong` | `color-mix(in oklab, #4a2bc7 88%, transparent)` | inherits light | Ring around the checked switch |
| `--sidebar-primary-foreground` | `#ffffff` | `#ffffff` | Text on the active sidebar item |
| `--success-text` | `#007a32` | `#7bf1a8` | Success text (apps with a green accent often want one green) |
| `--chart-1`, `--chart-2` | `#6c47ff`, `#9785ff` | inherit light | First two chart series |

`--brand`, `--brand-edge`, `--brand-edge-strong`, `--chart-1` and `--chart-2` have no dark values of their own (`--control-checked` follows `--brand` in light mode and has its own dark value): dark mode uses the light ones unless you set them in `.dark`. The machine-readable list is `accentTokens` in `registry/themes/vellum.tokens.json`, so an app can check that no violet is left.

```css
:root {
  --brand: #0e7e45; --brand-edge: #0a6b3a; --brand-edge-strong: color-mix(in oklab, #085c32 88%, transparent);
  --brand-text: #0e7e45; --success-text: #0e7e45; --ring: #0f8a4b; --sidebar-ring: #0f8a4b;
  --sidebar-primary: #0e7e45; --chart-1: #0f8a4b; --chart-2: #064e2b;
}
.dark {
  --brand-text: #3dd68c; --success-text: #3dd68c; --ring: #1f9e5c; --sidebar-ring: #1f9e5c;
  --sidebar-primary: #3dd68c; --sidebar-primary-foreground: #0d1f15; --control-checked: #12924f;
}
```

These are the green values `tests/contrast.mjs` checks as its second accent, so this example passes every pair.

After changing them, run `npm run test:contrast` in a Vellum checkout with your values, or check `--brand-text` and `--brand-foreground` on `--brand` by hand.

## Touch targets

Controls stay visually dense (24 to 32px), but on touch screens (`pointer: coarse`) they get an invisible hit area at their visual size, so apps don't need to enlarge controls. The areas below add no overlap that v0.3.0 didn't have:

- 44×44px: buttons and icon buttons, the toggle, the field select trigger, the slider thumb, breadcrumb links, the accordion trigger and the banner's dismiss button.
- 44px on the cross axis only for items that sit in a row: toggle-group items, segmented-control items and tabs triggers (a row of them never takes a neighbour's taps).
- 44 wide by 36 tall for checkbox, radio and switch. Not 44×44: their stacked rows sit 27px apart, and a 44px-tall area would take taps from the row above. 36px still meets WCAG 2.5.8 (24px minimum). Their labels are clickable and extend the target.
- Buttons inside a field (`InputGroupButton`) grow only vertically; chip remove buttons keep their 24px box.

Underline tabs get 4px of room above and below on touch screens so their scrolling list doesn't clip the areas. On phones a default or line tab list that overflows scrolls, and its triggers' areas stay inside it. It is detected after hydration (without JavaScript an overflowing list still widens the page), and a list in a shrink-to-fit parent (`w-fit`, `mx-auto`) widens that parent first: give such a parent `max-w-full`. The marketing `gloss` pills keep their 30px hit area; text fields keep 32px (their label is part of the target).

The areas are drawn with a pseudo-element: `::after` on most controls, `::before` on tabs triggers (their `::after` is the underline). If you add your own `::before`/`::after` to a control, check it doesn't replace these. Controls that hold an area are `position: relative` on touch screens through a zero-specificity rule, so any position you set wins (a class, a responsive or arbitrary class, a parent selector or an inline style).

**Spacing:** buttons have the full 44px both ways, so leave at least 44px minus the control height between neighbouring buttons: 12px between 32px controls, 16px between 28px (`compact`) and 20px between 24px (`compact-sm`). Icon-only buttons in a row want a 44px pitch. Closer than that, a later button's area takes taps from the edge of an earlier one; the kit's own `Pagination` (4px gaps) and some demo button rows are that close today.

## Focus, forced colours and motion

- **Focus:** every interactive control shows an opaque 2px outline in `--ring`, 2px outside it (fields: on their edge; controls in a scrolling list, such as tabs: drawn inside, so the scroll doesn't clip it; a small button set flush against text, such as a filter pill's clear button: drawn inside, so the text doesn't paint over it). Some controls keep a soft halo under it. The slider draws it on the thumb (Base UI focuses a hidden input inside it). Don't replace it with a translucent ring.
- **Forced colours (Windows high contrast):** field and button edges, the switch, checkbox, checked radio dot, progress and slider fills, the selected tab, toggle and segment, and every floating layer keep a visible edge or system-colour fill (`Canvas`, `CanvasText`, `Highlight`). Nothing changes outside that mode.
- **Reduced motion:** with `prefers-reduced-motion: reduce`, dialogs, sheets, popovers, menus, selects, tooltips, accordions, the drawer, toasts and small state transitions (switch, checkbox, progress) don't animate.
- **Field text** is 16px on touch screens at any width (so iOS doesn't zoom on focus) and 14px from the `sm` breakpoint with a mouse.
- **Translated labels:** every built-in string is a prop with English as its default (`closeLabel`, `optionalLabel`, `copyLabel`/`copiedLabel`, `label`, `triggerLabel`, `clearLabel`, `removeLabel`, `mobileTitle`…); the README lists them.

## Elevation

| Utility | Use |
|---|---|
| `shadow-popover` + `ring-1 ring-hairline` | Every floating layer: menus, popovers, select, combobox, hover card, toast, sheet |
| `shadow-card` (`dark:shadow-card-dark`) | Content cards |
| `shadow-surface` | Panels inside a shell (dialog panel, radio cards) |
| `shadow-dialog` | Dialog shell |
| `shadow-control`, `shadow-control-hover`, `shadow-control-checked` | Checkbox and similar small controls |
| `shadow-chip`, `shadow-thumb` | Selected segment/tab chip, switch thumb |
| `shadow-rule` | 1px underline rule under underline tabs |

## Shapes

`rounded-md` (6px) for buttons in compact sizes, fields, menu items and toggles; `rounded-lg` (8px) for popovers, menus and cards; `rounded-xl` (12px) for dialogs and large cards; `rounded-full` for switches, avatars and pills. The whole scale follows `--radius`.

## Components: which variant when

- **Buttons.** `primary` (violet, raised) for the one main action in a view or dialog. `elevated` (white, raised) for secondary actions next to it, toolbar buttons and select-style triggers. `default` (dark solid) for marketing CTAs. `ghost` for low-emphasis icon actions. `gloss` / `gloss-solid` with `size="pill"` only on marketing pages. Dashboards use `size="compact"` (28px); dense headers use `compact-sm`; touch toolbars use `compact-md`; square icon buttons use `icon-compact*`.
- **Fields.** Marketing and forms: `<Input />` (32px, white, 4px gray halo on focus). Dashboards and dialogs: `<Input variant="compact" />`. Selects in dashboards: `<SelectTrigger variant="elevated">`.
- **Badges.** `subtle` for neutral tags ("Optional", plan names), `subtle-info` for recommendations, `subtle-warning` for environment/attention tags.
- **Tabs.** `variant="underline"` for page-level navigation in dashboards; default (chip) tabs for switching views inside a card. Use `SegmentedControl` for 2 to 4 mutually exclusive options in a toolbar.
- **Dialogs.** A muted shell (`DialogContent`) holding a white `DialogPanel` with `DialogHeader` and one or more `DialogSection`s; the `DialogFooter` sits on the shell with `elevated` Cancel and `primary` confirm, both `size="compact"`.
- **Checked state.** Checkbox, radio, switch, slider, calendar selection, progress and choice cards are violet. Nothing else is violet except focus.
- **Tags** (`subtle`, `subtle-info`, `subtle-warning`) are flat tints: they pass 4.5:1 on panels and on the canvas.

## Layout

- Dashboard content: `mx-auto w-[calc(100%-2.5rem)] max-w-6xl pt-8 pb-10`, page title `text-xl font-semibold`, sections separated by 32px.
- Cards: `rounded-xl bg-surface shadow-card`, inner padding 20 to 24px, header row with title left and actions right.
- Forms: label above field, 6px gap, 24px between fields; helper text `text-[0.8125rem] text-subtle`.
- Density: body text 13 to 14px in product UI, 16 to 18px in marketing.

## Do's and Don'ts

- Do use token utilities (`bg-surface`, `ring-hairline`, `text-subtle`, `shadow-popover`). Don't hard-code colors (`gray-950`, `#fff`, `rgb(...)`) in components; add a token instead.
- Do keep one `primary` button per view. Don't make secondary actions violet.
- Do use rings (`ring-1 ring-hairline`) for edges. Don't add `border` on top of a shadowed surface.
- Do override a token shadow with another token shadow or `shadow-none!`. `cn()` treats custom shadow names as colors, so a plain `shadow-none` passed in `className` will not replace `shadow-surface`.
- Don't put the brand violet on large areas (backgrounds, whole cards). It is for actions and states.
- Don't mix `compact` and default sizes in the same toolbar or form.

## Known gaps

- Dark mode tokens exist for every component, but the design was tuned in light mode first.
- Charts use `--chart-1..5`; they are violet-led but not tuned per chart type.
