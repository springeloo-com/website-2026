# Homepage Production Assets (T003)

**Date**: 2026-08-05  
**Source**: Figma proto Desktop `2108:58670` + current Decap/home usage

## Currently in repo (usable)

| Asset | Path | Used by |
|-------|------|---------|
| Hero office 1 | `public/uploads/hero-office-1.jpg` | Home hero (Decap) + carousel |
| Hero office 2 | `public/uploads/hero-office-2.jpg` | Carousel |
| Hero office 3 | `public/uploads/hero-office-3.jpg` | Carousel |
| Video | `public/uploads/video-website_v1.3.mp4` | (check secondary pages) |
| Favicon | `public/favicon.svg` | Global |
| OG default | `public/og-default.jpg` | SEO fallback |

## Observed in Figma Desktop prototype (visual)

| Need | Status | Blocker? |
|------|--------|----------|
| Full-bleed industrial/office hero photography | Present via Decap `hero.image` — Figma shows stock-like industrial; **keep Decap image**, do not replace from Figma placeholders | No (CMS boundary) |
| Brand wordmark / mark in header | Present in site chrome (header logo) | No |
| Grid overlay on hero | Implemented in `HeroBanner` (`.grid-overlay`) | No |
| Section imagery for Leistungen cards | Optional card images in YAML | No unless design requires new mandatory images |
| Icons / SVG marks beyond logo | Not yet inventoried from design file Variables/components | **Pending** — needs design-file (edit) export if new icons appear |

## Missing / pending design package

| Item | Notes |
|------|-------|
| New icons from improved Figma (if any) | Export SVG when design confirms; blocks only affected sections |
| Replacement production photos (if design drops iStock placeholders) | FR-011: block sign-off for those sections until production-ready assets arrive |

## Decision for parity pass

- **Do not** overwrite Decap-managed images with Figma stock placeholders.
- Wire any *new* non-content decorative assets under `public/` as engineering-owned.
- Flag designer if Figma still embeds watermarked stock as final art.
