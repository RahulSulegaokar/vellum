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
  placeholder: "#747583"   # --placeholder
  hairline: "rgb(19 19 22 / 0.05)"  # --hairline
  border: "#e3e3e7"        # --border
  accent: "#6c47ff"        # --brand (actions, checked states, focus)
  accent-edge: "#5b35f0"   # --brand-edge
  solid: "#42434d"         # --solid (default dark button)
  danger: "#ef4444"        # --destructive (fills, rings, icons)
  danger-text: "#c10007"   # --destructive-text, also --destructive-strong behind white text
  warning-text: "#ca3500"  # --warning-text
  info-text: "#1447e6"     # --info-text
  success-text: "#008236"  # --success-text
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
| Placeholder | `placeholder:text-placeholder` | Inputs only |
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

- `--subtle` passes on white, the canvas and its own 4% tint. `--muted-foreground` is stronger; use it for avatar initials and anything on `--muted`.
- `--placeholder` passes on fields.
- Never set status-coloured text with the fill token (`text-destructive`); use the `-text` token.

## Change the accent

The violet accent is spread over a handful of tokens. To rebrand, set all of them in your global CSS, after the theme block:

| Token | Light | Dark | Drives |
|---|---|---|---|
| `--brand` | `#6c47ff` | inherits light | Primary buttons, checked controls, progress, selection |
| `--brand-edge` | `#5b35f0` | inherits light | 1px ring around brand fills (also used by `--control-shadow-checked`) |
| `--brand-foreground` | `#ffffff` | `#ffffff` | Text and icons on brand fills |
| `--brand-text` | `#6c47ff` | `#9479ff` | Violet text and links (must pass 4.5:1 on white and the dark canvas) |
| `--ring` | `#6c47ff` | `#9785ff` | Focus rings |
| `--sidebar-ring` | `#6c47ff` | `#9785ff` | Focus rings inside the sidebar |
| `--sidebar-primary` | `#131316` (ink, not violet) | `#9785ff` | Active sidebar item fill |
| `--chart-1`, `--chart-2` | `#6c47ff`, `#9785ff` | inherit light | First two chart series |

```css
:root { --brand: #0f9d58; --brand-edge: #0b7a44; --brand-text: #0b7a44; --ring: #0f9d58; --sidebar-ring: #0f9d58; --chart-1: #0f9d58; --chart-2: #5cc68d; }
.dark { --brand-text: #5cc68d; --ring: #5cc68d; --sidebar-ring: #5cc68d; --sidebar-primary: #5cc68d; }
```

After changing them, run `npm run test:contrast` in a Vellum checkout with your values, or check `--brand-text` and `--brand-foreground` on `--brand` by hand.

## Touch targets

Controls stay visually dense (24 to 32px), but on touch screens (`pointer: coarse`) each `Button` gets an invisible hit area of at least 44×44px, centred on the button, so apps don't need to enlarge controls. Checkbox and radio already extend their hit area with a pseudo-element, and labels of fields, checkboxes, radios and switches are clickable. Keep about 8px between adjacent compact buttons so the extended areas don't overlap. The marketing `gloss` pills keep their 30px hit area.

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
