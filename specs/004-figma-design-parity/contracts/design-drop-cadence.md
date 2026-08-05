# Contract: Design-Drop Cadence

**Feature**: `004-figma-design-parity`

Repeatable sequence for each approved Figma delivery. Not continuous auto-sync.

## Steps (order mandatory)

1. **Prepare frames** — Ensure named Desktop / Tablet quer / Tablet hoch / Mobile
   frames (Auto Layout where practical); record node IDs if they change.
2. **Token sync** — Diff Figma Variables → update `tokens.css` /
   `breakpoints.css`; align `@media` literals to 390 / 768 / 1024 / 1280.
3. **Layout update** — Assisted design-to-code into existing Astro components /
   pages (home first; secondary when framed). Respect
   [cms-boundary.md](./cms-boundary.md).
4. **Four-width visual QA** — Per [visual-qa.md](./visual-qa.md); fix severity-1
   before asking for designer OK.
5. **Sign-off & merge** — Designer visual OK + stakeholder acceptance (homepage
   gate); then merge. Human review before production is mandatory.

## Roles

| Role | Cadence duties |
|------|----------------|
| Design | Deliver named frames, Variables, production assets |
| Engineering | Token sync, layout implementation, build, QA fixes |
| Designer (review) | Visual OK against frames |
| Stakeholder | Acceptance for release |
| Editors | Content via Decap; not layout |

## Explicit non-promises

- Instant Figma → live production sync
- Plugin exporter as the production site
- Hosted visual builder replacing GitHub Pages + Decap
