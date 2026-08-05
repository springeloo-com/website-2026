# Media Query Inventory (T002)

**Date**: 2026-08-05  
**Approved widths**: 390 / 768 / 1024 / 1280 (+ optional 1920)

## Aligned (uses approved widths)

| File | Threshold | Notes |
|------|-----------|-------|
| `src/styles/breakpoints.css` | 768, 1280 | Container helpers; variables document all four |
| `src/components/SiteHeader.astro` | 1024 | Desktop nav |
| `src/components/MobileMenu.astro` | 1024 | Menu visibility |
| `src/components/SiteFooter.astro` | 768 | Footer layout |
| `src/components/HeroBanner.astro` | 768, 1280 | Hero layout |
| `src/pages/projektunterstuetzung.astro` | 768 | Page layout |

## Divergent (must realign)

| File | Threshold | Target action |
|------|-----------|---------------|
| `src/pages/index.astro` | **900px** | → 768 or 1024 per Figma home frames (US2 T009) |
| `src/pages/produkte.astro` | **900px** | → approved width (US3 T023) |
| `src/pages/kontakt.astro` | **960px** | → approved width (US3 T024) |

## Not found

- No `@media` using 390px as a min-width switch (mobile-first default is expected)
- No `@media` using 1920 in components (token only)
