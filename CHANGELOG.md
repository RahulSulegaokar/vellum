# Changelog

Each entry lists what consumers will see in `npx shadcn add RahulSulegaokar/vellum/<item> --diff`.

## v0.4.0 (2026-11-19)

Accessibility release. At rest, with a mouse, controls look the same as in v0.3.0 except: the primary button's top sheen is lighter, subtle tags lose their 2% gradient, the command palette's and the combobox popup's search placeholders are a shade darker, the combobox chips input's placeholder uses the placeholder colour, the dark checked choice card tint is lighter, the segmented control's unselected label is darker in light and lighter in dark, and the slider thumb's border follows the new dark `--ring`. On touch screens, fields use 16px text and the underline tab row is 8px taller. It is a minor (breaking) release under 0.x: a `data-slot`, two elements, positioning, pseudo-elements and token values changed (see "What changed that you may depend on").

- Focus: every interactive control shows an opaque 2px `--ring` outline (offset 2px; on the edge of fields; inside for tabs, menu items and other controls in scrolling lists). Before, most controls drew a 40 to 50% ring, and `outline-solid` resolved to the `--solid` colour in this theme, so several outlines were grey or missing. Text fields show it on click as well as on Tab (browsers treat any focus of a text field as `:focus-visible`).
- Focus: links inside kit containers (accordion panel, alert, dialog and alert-dialog descriptions, empty state, field description, item, marker) and chart surfaces get the same ring.
- Focus: the slider thumb shows the ring (Base UI focuses a hidden input inside it; the thumb now styles `has-focus-visible`).
- Focus: the dark `--ring` and `--sidebar-ring` are `#9480ff` (were `#9785ff`), so the ring also reaches 3:1 on white fills in dark mode. This also moves the slider thumb's border, which uses `--ring`, by a few levels.
- Focus: rings are no longer clipped or covered: a focused `Button`, bubble, questionnaire choice, calendar day or resize handle is raised (`z-index`) above its neighbours; `AccordionContent` uses `overflow: clip` (was `hidden`) and lets a ring paint 4px past it while something inside has focus; the calendar's month/year dropdowns and the command palette input show the ring.
- Touch: on coarse pointers controls get an invisible hit area at their visual size, never covering another control: 44×44px for the toggle, field select trigger, slider thumb, breadcrumb links, accordion trigger and the banner's dismiss button; 44px on the cross axis only for items in a row (toggle-group items, segmented-control items, tabs triggers); 44 wide by 36 tall for checkbox, radio and switch, so rows at the kit's default 27px pitch don't overlap. Buttons inside a field (`InputGroupButton`) grow only vertically, chip remove buttons don't grow. Buttons already had 44×44px.
- Touch: underline tabs get 4px of room above and below on coarse pointers so the scrolling list doesn't clip the hit areas.
- Field text is 16px on coarse pointers at every width (input, compact input, textarea, native select, command input, combobox and chips inputs, the calendar's month/year dropdowns), keeping each field's line height; with a mouse it stays 14px from `sm`. The OTP input was already 32px.
- Placeholders use the placeholder tokens everywhere (the command input and chips input had Tailwind's 50% default, the dark select trigger used `--subtle`). `--placeholder` keeps its value; a new `--placeholder-on-tint` (`#6d6e7c` light) is used where the field sits on the `bg-input/30` tint (command palette, combobox popup search) so it reaches 4.5:1 there.
- Primary button: the top sheen starts at 7% white (was 20%), so the label reaches 4.5:1 on every row below the 1px bevel with the default violet and with a green accent, however the button is rendered (`render` through `DialogClose`, `AlertDialogAction`, a link…).
- Dark checked choice card tint is 6% (was 10%); segmented-control unselected labels use `--muted-foreground` (light) and `--foreground` at 55% (dark), including on hover and on the canvas.
- Subtle tags (`subtle`, `subtle-info`, `subtle-warning`) drop the 2% black gradient, so they pass 4.5:1 on the canvas as well as on panels.
- `FormControl` keeps the wrapped component's own `data-slot` (`input`, `textarea`, `select-trigger`) and adds `data-form-control` to whatever it wraps. Only a bare element (`<input>`, `<select>`) without a slot is still tagged `data-slot="form-control"`; a component of your own wrapped in it no longer receives `data-slot="form-control"`.
- Translatable strings: `closeLabel` (DialogContent, SheetContent, DialogFooter), `optionalLabel` (Label, FormLabel), `copyLabel`/`copiedLabel` (CodeBlockCopyButton), `label` (BreadcrumbEllipsis, PaginationEllipsis, PaginationPrevious/Next, CarouselPrevious/Next, SidebarTrigger, SidebarRail, MessageScrollerButton), `roleDescription` (Carousel, CarouselItem), `mobileTitle`/`mobileDescription` (Sidebar), and a `labels` prop on every block with built-in text, including the auth blocks (`authSignInLabels`: "Continue with …", show/hide password, "… home") and pricing (`pricingPlansLabels`). All default to the current English. `npm run test:strings` fails on any English written straight into JSX.
- Accessible names: the combobox's clear and trigger buttons (`clearLabel`, `triggerLabel`) and the chip remove button (`removeLabel`) are named.
- `Slider` passes `getAriaValueText` and `getAriaLabel` to every thumb, and gives each thumb its `index` (its hidden input is now server-rendered, with its value text).
- Tables: when a table is wider than its container, the container becomes a focusable, named scrolling region (`tabindex="0"`, `role="region"`): `Table` (`label` prop, falling back to the caption), and the `data-table-card` and `members-card` blocks. The hook is exported as `useScrollRegion` from `table`.
- Forced colours (Windows high contrast): field, input-group, chips and button edges, the switch (track and thumb), checkbox, checked radio dot, progress and slider fills, selected tab, pressed toggle and segment, and every floating layer stay visible; nothing changes outside that mode.
- Reduced motion: dialogs, sheets, alert dialogs, drawers, popovers, menus, selects, comboboxes, hover cards, tooltips, navigation menus, accordions, collapsible trace content, toasts and the switch, checkbox and progress transitions don't animate under `prefers-reduced-motion: reduce`.
- Dialog and sheet: `aria-modal="true"` on modal dialogs, sheets, alert dialogs and drawers; `DialogHeader` and `DialogFooter` are `div`s (were `header`/`footer`, which became landmarks).
- Tabs on phones: below the `sm` breakpoint a default or line `TabsList` that is too long for its container scrolls sideways on one row (scrollbar hidden) instead of pushing the page sideways; lists that fit are unchanged. The line list keeps its underline inside the scrolling box with 9px of transparent room above and below, taken back with negative margins.
- `segmented-control` and `scroll-area` no longer import `React` without using it (failed `noUnusedLocals` in a strict Vite project). `npm run test:install` now type-checks every item in a strict Vite-style project.
- `templates/vellum-update.yml`: `WORKDIR` (folder with `components.json`), `UPDATE_BLOCKS` (false: blocks aren't overwritten; the PR lists their `--diff`), `STATE_FILE` (records the release and the item list it regenerates each run; no PR when nothing new), `persist-credentials: false`, `npm ci --ignore-scripts`, the token only in the PR step, `concurrency`; item lists reach `shadcn add` as arguments from the environment, never pasted into the script.
- `.github/workflows/release-check.yml`: on each `v*` tag, an empty Vite project and a Laravel-shaped project dry-run `dialog#<tag>` and must list `dialog.tsx`, `button.tsx` and the CSS file for the theme (bash with `pipefail`, exact paths, `setup-node` pinned by commit).
- CI runs `test:strings`, `test:install` and the Playwright gallery and accessibility specs against the production build (`--ignore-snapshots`: the screenshot baselines are macOS ones).
- `tests/contrast.mjs` covers every text/background pair, focus rings on every surface (white fills included), checked marks and fills, with a green accent fixture next to the violet one, reads the sheen, tag and placeholder classes from the components, and prints JSON with `--json`. Known gaps are keyed by accent and mode with today's ratio as a floor (getting worse fails): the `gloss` pill label, success text on a success banner on the canvas (violet, light), the dark checked and progress fills; control boundaries under 3:1 are reported.
- `tests/a11y.spec.ts` (Playwright): pixel-sampled focus rings on every control of 45 gallery pages and fixtures in light and dark (no cap on Tab stops), touch areas and an edge tap, no control taking taps inside another's box on every gallery page, a consumer's `absolute` winning on touch, 16px field text, forced colours, reduced motion, translated labels, `aria-modal` and no landmarks, `FormControl` slots, table regions, the slider's value text, the primary label on every row, tab lists on one row at 360px, reflow at 320px and Escape/focus return for overlays. Fixture pages live under `app/fixtures/`.
- `DESIGN.md`: corrected "Touch targets", new "Focus, forced colours and motion" section, the accent table and its CSS example list `--brand-edge-strong`, `--sidebar-primary-foreground` and `--success-text` and which tokens have no dark value, `accentTokens` in `vellum.tokens.json`, and the pairs that are not allowed. README: CLI versions, the label props, the workflow settings.

### What changed that you may depend on

- `data-slot`: a Vellum field inside `FormControl` now carries its own slot (`input`, `textarea`, `select-trigger`…) instead of `form-control`, and your own components wrapped in `FormControl` no longer get `data-slot="form-control"`. Select either with `[data-form-control]` (new).
- Elements: `DialogHeader` and `DialogFooter` render `div` (were `header` and `footer`); their prop types are `div` props.
- Positioning: on touch screens `Toggle`, `ToggleGroupItem`, the field `SelectTrigger` and `BreadcrumbLink` become `position: relative` (to hold their touch area), unless you pass `absolute`, `fixed` or `sticky`, which wins. With a mouse their position is unchanged. A focused `Button` gets `z-index: 10`.
- `AccordionContent` uses `overflow: clip` instead of `overflow: hidden`.
- Pseudo-elements: on coarse pointers `::after` draws the hit area on the switch, toggle and toggle-group items, segmented-control items, the field select trigger, the accordion trigger, breadcrumb links and the banner's dismiss button; `::before` on tabs triggers (their `::after` stays the underline). Checkbox, radio and slider thumb keep their existing `::after`, widened on coarse pointers. Rules of your own on these pseudo-elements will clash. `toggleVariants` no longer carries the hit area (the `Toggle` component adds it).
- Tabs on phones: `TabsList` (default and line) is a horizontal scroll container below `sm`.
- Classes: the subtle tags no longer have `bg-linear-to-t from-black/2`; the primary variant's sheen is `before:from-white/7`; `outline-solid` is no longer used (it set `outline-color: var(--solid)` in this theme).
- Tokens: new `--placeholder-on-tint`; `--ring` and `--sidebar-ring` dark `#9480ff`. If you install the theme with `--overwrite` you get them; overrides you set yourself win.
- New `accentTokens` key in `vellum.tokens.json` (ignored by the generator).

### What consumers must do

- Re-install the components you use (`--diff`, then `--overwrite`) or let the update workflow open its PR. Re-install `vellum-theme` by hand to take the dark `--ring` (`--placeholder-on-tint` also arrives with the components).
- Delete app-level work-arounds that this release makes unnecessary: rules that add a focus outline to `[data-slot]` controls, rules that add a 44px `::before`/`::after` hit area on coarse pointers, rules that force 16px field text on coarse pointers, overrides of the primary button's sheen, and rules that draw the underline tab's focus ring inside or pad its list for touch. Keeping a hit-area rule of your own duplicates Vellum's and can make neighbours take each other's taps.
- Replace selectors on `[data-slot="form-control"]` with `[data-form-control]`.
- Keep 44px minus the control height between neighbouring controls (DESIGN.md "Touch targets").
- If you render a translated UI, pass the new `…Label` props and each block's `labels`.
- If your accent changes `--ring` in dark mode, check it on white fills too (`node tests/contrast.mjs` in a Vellum checkout with your values).
- Copy the new `templates/vellum-update.yml` if you use it, and set `WORKDIR`, `UPDATE_BLOCKS` and `STATE_FILE`.

## v0.3.0 (2026-11-17)

Breaking: blocks no longer have a default export or demo data. Data props that used to default to sample content are now required or default to empty; demos moved to `components/examples/blocks/` in this repo. Several props were renamed (see each block's JSDoc).

- Contrast (WCAG AA in light and dark, checked by `npm run test:contrast` in CI):
  - New text tokens `destructive-text`, `warning-text`, `info-text`, `success-text`, `brand-text`, plus `destructive-strong`/`destructive-foreground` for solid red fills and `info` for tints.
  - Every destructive/warning/info text in components and blocks moved to them; `--destructive` stays for fills, rings and icons.
  - `--subtle` `#747686` → `#6c6d7d`; `--placeholder` `#9394a1` → `#747583` (dark `#9799a5`); avatar initials use `text-muted-foreground` on `bg-muted`.
- Removed everything derived from the site Vellum was extracted from (copy, product and ID formats, navigation that mirrored another dashboard, icon paths); demo copy is now original and generic.
- `linkComponent` prop (defaults to `"a"`) on every block that renders links, for Inertia and other routers. No block imports `next/*`.
- `sonner` and the new `use-theme` hook work without `next-themes`.
- New `form` component (label, description and error wired with `aria-describedby`/`aria-invalid`, no form library) and `banner` block (info, warning, destructive, success).
- Accessibility: ⌘K in `settings-sidebar` is opt-in (`shortcut` / `useSettingsFindShortcut`) and ignores typing; date presets are a `RadioGroup`; menus of actions are `DropdownMenu`; destructive actions confirm; no `href="#"` or buttons that do nothing.
- Touch targets: on coarse pointers every `Button` (except the marketing `gloss` pills) gets an invisible hit area of at least 44×44px; sizes and looks are unchanged. `elevated` and `primary` buttons no longer use `overflow-hidden` (their overlay is rounded instead), so the hit area isn't clipped.
- `DESIGN.md`: new "Change the accent" section (every token tied to the violet, light and dark values) and "Touch targets" section.
- Block descriptions in the registry, README and skill now come from each block's main component, not the first prop comment in the file.
- Release pinning: internal dependencies are pinned to the release tag (`…#v0.3.0`), and `templates/vellum-update.yml` installs from the newest release tag with a pinned shadcn CLI (4.23.0).
- Gallery-only packages (`shiki`, `date-fns`, `streamdown`, `next-themes`) moved to devDependencies; the shadcn CLI was already a dev dependency.

## v0.2.1 (2026-11-17)

First release that installs blocks under the project's components alias (`resources/js/components/blocks` in Laravel).

- Blocks no longer pin an install path: they land in a `blocks` folder under the project's components alias, so they work in Laravel (`resources/js/components/blocks`), Vite and other layouts, and their `@/components/blocks/*` imports resolve.
- `templates/vellum-update.yml` reads folder paths from `npx shadcn info` and re-installs components, hooks, blocks and the Vellum skill (theme still excluded).
- README: `npx skills add RahulSulegaokar/vellum --skill vellum`, a public-repo note, and layout-neutral block paths.

## v0.2.0 (2026-11-17)

- 30 blocks: dashboard (shell, settings sidebar and cards, data table, filters, date range, dialogs, create wizard, integrations, feature upsell, callout, empty state), auth and account (sign-in, sign-up, waitlist, auth page, account menu and profile, workspace switcher, members, API keys) and marketing (header, hero, feature grid, pricing, testimonials, FAQ, CTA, footer).
- `vellum-skill` and `vellum-design` items, `DESIGN.md` and `skills/vellum/SKILL.md` for AI agents.
- Gallery pages and light/dark screenshot checks for every block.

## v0.1.0 (2026-11-17)

First release.

- 65 components (all shadcn base-nova components except `form`, plus `segmented-control`), one hook (`use-mobile`) and the `vellum-theme` item.
- Every component reads colours, rings, shadows and radius from theme tokens; installing any component also installs `vellum-theme`.
- Checked, selected and progress states (checkbox, radio, switch, slider, calendar selection, progress, field choice cards, questionnaire choices) use the brand colour.
- API parity with shadcn 4.23.0: every upstream export, `data-slot`, variant and prop is present.
- Variants beyond shadcn's: button `primary`, `elevated`, `gloss`, `gloss-solid` and sizes `compact*`, `icon-compact*`, `pill`; badge `subtle`, `subtle-info`, `subtle-warning`; input `compact`; select trigger `elevated`; tabs `underline`.
