# Quickstart Validation: Figma Design Parity (Multi-Breakpoint)

**Feature**: `004-figma-design-parity` | **Date**: 2026-08-05

See [data-model.md](./data-model.md), [contracts/figma-source.md](./contracts/figma-source.md),
[contracts/visual-qa.md](./contracts/visual-qa.md),
[contracts/cms-boundary.md](./contracts/cms-boundary.md), and
[contracts/design-drop-cadence.md](./contracts/design-drop-cadence.md).

## Prerequisites

- Branch with parity work (or preview deploy)
- Access to Figma file `QLSDfzdupEsnPJ4WY528O5` (frames in FR-012 /
  `contracts/figma-source.md`)
- `npm ci` and Node version compatible with CI (Node 22 in deploy workflow)
- Decap editorial path still available for home/globals

## Local setup

```bash
npm ci
npm run build
npm run preview
```

For iterative work: `npm run dev`.

## Validation scenarios

### 1. Build & static deploy readiness

1. Run `npm run build` — must succeed.
2. Confirm `dist/` is static output suitable for GitHub Pages.
3. Spot-check that `/admin/` still serves Decap shell after build/preview.

### 2. Breakpoint alignment

1. Search CSS/Astro styles for layout `@media` thresholds other than
   **390 / 768 / 1024 / 1280** (and optional 1920 if intentionally retained).
2. Confirm leftover **900px** / **960px** layout switches are removed or
   realigned on touched pages.
3. Confirm `src/styles/breakpoints.css` still documents the four acceptance
   widths.

### 3. Homepage four-width visual QA (release gate)

1. Open homepage in preview at **390, 768, 1024, 1280**.
2. Side-by-side compare to Figma frames (nodes in `contracts/figma-source.md`).
3. Complete checklist in `contracts/visual-qa.md`.
4. **Pass criteria**: zero open severity-1; designer visual OK recorded;
   stakeholder acceptance recorded.

### 4. Decap boundary intact

1. Via Decap (or local YAML edit + rebuild), change an approved home text field
   or image.
2. Confirm the change appears in the updated layout without editing `.astro`
   layout code.
3. Confirm Figma placeholder copy was **not** force-written over Decap fields.

### 5. Accessibility & SEO baseline

1. Verify landmarks, heading order, keyboard focus, and meaningful alt text still
   meet AR-001 after layout changes.
2. Confirm page title, meta description, canonical, and Open Graph still present
   (AR-002) unless an approved content-field change updated them.

### 6. Secondary pages (non-blocking)

1. For each route with supplied Figma frames, run the same four-width compare.
2. Incomplete secondary work MUST NOT block homepage release.

### 7. Cadence dry-run (optional before first real drop)

Walk `contracts/design-drop-cadence.md` once and confirm roles/steps are
understood (SC-005).

## Expected outcomes

| Check | Expected |
|-------|----------|
| Build | Success |
| Home @ 4 widths | No severity-1 vs Figma |
| Sign-off | Designer OK + stakeholder acceptance |
| Decap | Home/globals edit still works |
| Hosting model | Unchanged GitHub Pages static delivery |
