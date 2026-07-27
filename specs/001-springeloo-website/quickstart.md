# Quickstart Validation: Springeloo Corporate Website

**Feature**: `001-springeloo-website` | **Date**: 2026-07-27

Use this guide after implementation to validate the quality gate end-to-end.
See [data-model.md](./data-model.md), [contracts/routes.md](./contracts/routes.md),
and [contracts/ui-components.md](./contracts/ui-components.md) for structure.

## Prerequisites

- Node.js LTS installed
- Repo checked out on branch `001-springeloo-website`
- Dependencies installed (`npm install` or equivalent once scaffold exists)
- Figma extract available at
  `../figmaextract/Webdesign` (sibling Landingpage path) for visual compare

## Setup

```bash
# from repo root
npm install
npm run build
npm run preview
```

Confirm Astro `site` / `base` match the intended GitHub Pages target (see
[research.md](./research.md) §5).

## Validation scenarios

### 1. Build & static output

1. Run `npm run build`.
2. Expect success and a `dist/` directory of static HTML/CSS/JS/assets.
3. Expect **no** server-only adapters required for preview.

### 2. Route inventory

With preview running, open:

- `/`
- `/projektunterstuetzung`
- `/produkte`
- `/kontakt`
- `/springeloo`

Expect HTTP 200, `header` / `main` / `footer`, German UI copy from Figma.

### 3. Home discovery (P1)

1. Open `/` on desktop width and ~390px mobile width.
2. Expect logo, nav, hero (carousel if designed), and home sections in Figma order.
3. Expect no layout collapse / horizontal scroll on primary text.

### 4. Secondary pages (P2)

1. From header, visit each secondary route.
2. Expect section hierarchy matches the corresponding Figma Sub-Page.
3. On `/kontakt`, expect display contact content only (no working form POST).

### 5. Navigation & menus (P3)

1. Mobile: open menu, reach all five destinations.
2. Expand nested groups (Insight / Kompetenzen if present): targets stay within
   the five routes or in-page anchors.
3. Keyboard: Tab through header/menu; focus ring always visible; Enter activates.

### 6. Carousel & reduced motion

1. Default: carousel autoplays and exposes pause/advance.
2. Enable OS/browser reduced motion: autoplay stops; manual controls still work.
3. With JS disabled (optional check): hero content still readable; primary nav
   destinations still reachable.

### 7. SEO & sharing (P4)

For `/` and one secondary page, view source or devtools:

- Unique `<title>` and meta description derived from visible headline/lead
- `link[rel=canonical]`
- Open Graph + Twitter tags
- `<html lang="de">`
- Logical heading order

### 8. Visual QA vs Figma

Compare against extract frames for Desktop, Tablet, and Mobile (and 2K where
provided). Record gaps; do not invent missing layouts. Expect alignment of
spacing, type scale, and section order (SC-003).

### 9. Asset hygiene

Confirm unused extract dumps are not in `dist/`. Meaningful images have alt
text.

### 10. GitHub Pages readiness

1. Ensure workflow builds and uploads `dist/` (or Pages artifact).
2. After deploy, smoke-check the five URLs on the Pages origin (respect `base`).

## Pass criteria

All scenarios above pass without constitution/spec violations. Failures block
“done” until fixed or explicitly deferred in the spec.
