# Contract: CMS / Layout Boundary

**Feature**: `004-figma-design-parity`

## Ownership

| Concern | Owner | Location |
|---------|-------|----------|
| Copy & images (approved fields) | Editors via Decap | `home.yaml`, `produkte.yaml`, `globals.yaml`, `public/uploads/` |
| Layout, section composition, responsive behavior | Engineering | `.astro`, CSS, components |
| Design tokens & breakpoints | Engineering (from Figma Variables) | `tokens.css`, `breakpoints.css` |

## Rules

1. Editors MUST NOT be required to edit layout code for normal content updates.
2. Parity work MUST NOT overwrite Decap field values with Figma placeholder
   copy/images.
3. When Figma text/imagery differs from Decap, implement Figma **structure**
   around **live Decap content**.
4. Expand Decap `config.yml` + YAML schema **only** when design introduces a new
   editable copy/image need; keep expansions narrow; preserve build validation
   in `src/lib/content.ts` (e.g. three Leistungen cards).
5. Design structural changes (section add/remove) that affect fields → adjust
   editable fields only as needed; layout remains engineering-owned.
6. Continuous automatic publish from Figma to production is **out of contract**.

## Invariants from prior features

- German-only editorial content
- Leistungen cards, Produkte slides, and product blocks fixed at three unless a later approved scope change
- CTA hrefs remain developer-controlled where already hidden from Decap
- Editorial workflow / PR path for Decap remains unchanged by this feature
