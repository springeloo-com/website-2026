# Implementation Plan: Figma Design Parity (Multi-Breakpoint)

**Branch**: `004-figma-design-parity` | **Date**: 2026-08-05 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-figma-design-parity/spec.md`

**Note**: This plan is produced by `/speckit-plan`. Tasks follow via `/speckit-tasks`.

## Summary

Bring the existing Astro static site into **1:1 visual parity** with the approved
Figma frames (Desktop / Tablet quer / Tablet hoch / Mobile) using an assisted
**Figma → Cursor → Astro/CSS** workflow. Sync design tokens and unify responsive
rules to acceptance widths **390 / 768 / 1024 / 1280**, implement homepage
parity as the **release gate**, then secondary pages when frames exist
(non-blocking). Keep GitHub Pages + Decap for copy/images; layout stays
engineering-owned. No plugin dump, Framer, or continuous auto-publish from Figma.

## Technical Context

**Language/Version**: TypeScript + Astro 5.x (`astro` ^5.12.0), TypeScript ^5.8

**Primary Dependencies**: Existing stack only — Astro, `@fontsource/figtree`,
`yaml`, `marked`, `decap-cms` (admin path unchanged). Design context via Figma
MCP / Desktop selection in Cursor (tooling, not a runtime dependency). No new
public-page libraries planned.

**Storage**: Git YAML content (`src/content/pages/home.yaml`,
`src/content/site/globals.yaml`); media in `public/uploads/`; design tokens in
`src/styles/tokens.css` + `src/styles/breakpoints.css`

**Testing**: Manual four-width visual QA against Figma (severity-1 checklist in
[contracts/visual-qa.md](./contracts/visual-qa.md)); `npm run build` + preview;
Decap smoke edit for home/globals. No automated pixel-diff CI required.

**Target Platform**: Static site on GitHub Pages (`springeloo-com/website-2026`);
local `astro dev` / `astro preview` for QA

**Project Type**: Static marketing site — visual/layout parity feature

**Performance Goals**: No regression to static visitor payload beyond justified
new production assets; prefer SVG for logos/icons; keep minimal JS

**Constraints**: Static-first; Decap boundary (copy/images only); Figma file
`QLSDfzdupEsnPJ4WY528O5` page `1969:37969` frames as SoT; acceptance widths
390/768/1024/1280; home release gate; designer OK + stakeholder acceptance;
German-only content; no exporters/Framer as production path

**Scale/Scope**: Homepage sections + shared chrome first; then framed secondary
routes (`/projektunterstuetzung`, `/produkte`, `/springeloo`, `/kontakt`) when
frames exist; documented design-drop cadence

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Design-first**: ✅ Spec + FR-012 bind approved Figma file/nodes; conflicts
  update spec, no improvisation (I, III, XIV)
- **Static-first**: ✅ Astro static HTML/CSS; Decap remains approved editorial
  surface from feature 003 — not a new CMS introduction (II)
- **Component modularity**: ✅ Update/reuse `src/components/*`; new repeated
  patterns become components (IV)
- **Responsive parity**: ✅ Four named breakpoints with explicit px widths (V)
- **Accessibility & SEO**: ✅ AR-001/AR-002 preserved through layout changes
  (VI, VII)
- **Minimal dependencies**: ✅ No new runtime libs; Figma MCP is editor tooling
  only (VIII)
- **GitHub Pages**: ✅ Unchanged `npm run build` → `dist` Actions deploy (IX)
- **Spec-driven order**: ✅ Specify → clarify → plan → tasks → implement
  section-by-section (X, XI)
- **Maintainability & assets**: ✅ Token sync + component edits; production
  assets only (XII, XIII)
- **Quality gate**: ✅ Build + four-width visual QA + designer/stakeholder
  sign-off (XV)

**Post-design re-check (Phase 1)**: ✅ Gates still pass. Contracts encode CMS
boundary, visual QA, Figma source, and design-drop cadence without hosting or
dependency violations.

## Project Structure

### Documentation (this feature)

```text
specs/004-figma-design-parity/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── figma-source.md
│   ├── visual-qa.md
│   ├── cms-boundary.md
│   └── design-drop-cadence.md
└── tasks.md             # /speckit-tasks (not created by /speckit-plan)
```

### Source Code (repository root) — parity touchpoints

```text
src/
├── styles/
│   ├── tokens.css          # sync from Figma Variables
│   ├── breakpoints.css     # 390 / 768 / 1024 / 1280 (+ optional 1920)
│   └── global.css
├── components/             # shared chrome + section primitives
│   ├── SiteHeader.astro
│   ├── SiteFooter.astro
│   ├── MobileMenu.astro
│   ├── HeroBanner.astro
│   ├── HeroCarousel.astro
│   ├── ContentCard.astro
│   ├── CTAButton.astro
│   ├── SectionHeading.astro
│   └── …
├── layouts/
│   └── BaseLayout.astro
├── pages/
│   ├── index.astro         # P1 release gate
│   ├── projektunterstuetzung.astro
│   ├── produkte.astro
│   ├── springeloo.astro
│   └── kontakt.astro
├── content/                # Decap-owned copy/images — do not overwrite from Figma
│   ├── pages/home.yaml
│   └── site/globals.yaml
└── lib/content.ts          # keep validation

public/
├── admin/                  # Decap unchanged unless new editable fields required
└── uploads/

docs/                       # optional cadence / how-to updates after implement
```

**Structure Decision**: Stay on the existing Astro static site. Prefer editing
tokens, shared components, and page sections in place. Remove or realign ad-hoc
`@media` thresholds (notably **900px** / **960px**) to the four acceptance
widths. Do not introduce a parallel generated site or exporter output tree.

## Complexity Tracking

> No constitution violations requiring justification for this feature.
