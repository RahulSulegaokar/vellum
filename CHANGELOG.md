# Changelog

Each entry lists what consumers will see in `npx shadcn add RahulSulegaokar/vellum/<item> --diff`.

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
