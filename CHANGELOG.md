# Changelog

Each entry lists what consumers will see in `npx shadcn add RahulSulegaokar/vellum/<item> --diff`.

## v0.2.1 (2026-11-17)

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
