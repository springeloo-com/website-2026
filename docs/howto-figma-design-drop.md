# How-to: Figma design drop → site update

Repeatable cadence for bringing Springeloo’s static site into visual parity with
an approved Figma drop. **Not** continuous auto-publish from Figma.

Canonical contracts:

- [`specs/004-figma-design-parity/contracts/design-drop-cadence.md`](../specs/004-figma-design-parity/contracts/design-drop-cadence.md)
- [`specs/004-figma-design-parity/contracts/cms-boundary.md`](../specs/004-figma-design-parity/contracts/cms-boundary.md)
- [`specs/004-figma-design-parity/contracts/figma-source.md`](../specs/004-figma-design-parity/contracts/figma-source.md)
- [`specs/004-figma-design-parity/contracts/visual-qa.md`](../specs/004-figma-design-parity/contracts/visual-qa.md)

## Steps (order)

1. **Prepare frames** — Named Desktop / Tablet quer / Tablet hoch / Mobile
   (record node IDs if they change). Implementation file key:
   `lhqqJkipcRchejNEqQ1ehb`. Canonical map: `src/lib/breakpoints.ts` +
   `specs/004-figma-design-parity/contracts/figma-source.md`.
   Fetch landing **instances** (not empty breakpoint canvases).
2. **Token sync** — Diff Figma Variables → `src/styles/tokens.css` and
   `src/styles/breakpoints.css`. Align `@media` literals to **390 / 768 / 1024 /
   1280** (same mins as `BP` in `breakpoints.ts`).
3. **Layout update** — Assisted design-to-code into existing Astro components /
   pages. Runtime band: `<html data-viewport="mobile|tablet-hoch|tablet-quer|desktop">`
   via `src/scripts/viewport-band.ts`. Home first (release gate). Secondary
   pages only when frames exist.
4. **Four-width visual QA** — Use
   `specs/004-figma-design-parity/checklists/homepage-visual-qa.md` (or a page
   copy). Severity-1 = wrong section order, alignment, spacing rhythm, type
   hierarchy, or major media placement.
5. **Sign-off & merge** — Designer visual OK **and** stakeholder acceptance for
   homepage; then merge. Human review is mandatory.

## Ownership

| Concern | Owner |
|---------|-------|
| Copy & images | Editors via Sveltia CMS (`home.yaml`, `produkte.yaml`, `globals.yaml`) |
| Layout / responsive | Engineering (`.astro`, CSS) |
| Tokens / breakpoints | Engineering from Figma Variables |

**Do not** overwrite CMS fields with Figma placeholder text/images.

## Explicit non-promises

- Instant Figma → production sync
- Plugin exporters as the production site
- Hosted builders that replace GitHub Pages + Sveltia CMS

## Dry-run notes (2026-08-05 homepage pass)

| Step | Result |
|------|--------|
| Frames | Public proto OK; design-file Variables need Figma login |
| Token sync | Kept existing `tokens.css`; see `specs/004-figma-design-parity/checklists/token-sync-note.md` |
| Layout | Hero + chrome + breakpoint literals updated |
| Four-width QA | Engineering pass started in `checklists/homepage-visual-qa.md` |
| Sign-off | **Pending** designer OK + stakeholder acceptance (T021) |
