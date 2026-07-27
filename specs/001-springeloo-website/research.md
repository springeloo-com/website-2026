# Research: Springeloo Corporate Website

**Feature**: `001-springeloo-website` | **Date**: 2026-07-27

All Technical Context unknowns resolved below. Constitution gates informed
these choices (static-first, minimal dependencies, GitHub Pages, Figma fidelity).

## 1. Framework & output mode

**Decision**: Astro 5.x with `output: 'static'` (default static site generation).

**Rationale**: Constitution mandates Astro and static delivery. Astro emits lean
HTML/CSS and isolates client JS to islands/scripts only where needed
(carousel, expandable menus).

**Alternatives considered**:
- Next.js / Nuxt SSG — heavier runtime and dependency surface
- Plain HTML hand-authored — poorer component reuse and maintainability
- WordPress — explicitly out of scope

## 2. Styling & design tokens

**Decision**: Plain CSS with custom properties in `src/styles/tokens.css`,
plus global and breakpoint stylesheets. No Tailwind/Bootstrap/CSS-in-JS.

**Rationale**: Minimal dependency policy; tokens map 1:1 from Figma (colors,
type scale, spacing, radii, shadows, overlays, max width, breakpoints).

**Alternatives considered**:
- Tailwind — extra dependency and design-token indirection
- CSS Modules only — fine, but global tokens file is clearer for a small site
- Sass — unnecessary for this scope

## 3. Interactivity (carousel & expandable menus)

**Decision**: Small vanilla TypeScript modules (`carousel.ts`,
`expandable-menu.ts`) loaded as Astro client scripts. No Swiper/Headless UI.

**Behavior rules** (from clarifications):
- Carousel autoplays as designed; user can pause/advance
- `prefers-reduced-motion: reduce` disables autoplay
- Expandable menus keyboard-accessible; nested targets only in-scope routes
  or in-page anchors
- Core content and primary nav remain usable without JS

**Rationale**: Satisfies FR-010 without library weight; progressive enhancement
matches edge cases in the spec.

**Alternatives considered**:
- Swiper / Embla — better features, rejected for dependency cost
- CSS-only carousel — cannot meet autoplay + controls + a11y cleanly
- Static first slide — rejected by stakeholder

## 4. Routing & URL strategy

**Decision**: File-based routes with German path segments:

| Page | Route |
|------|-------|
| Landing | `/` |
| Projektunterstützung | `/projektunterstuetzung` |
| Produkte | `/produkte` |
| Kontakt | `/kontakt` |
| Springeloo | `/springeloo` |

Use ASCII slug `projektunterstuetzung` (no umlaut) for filesystem/URL safety;
on-page labels remain “Projektunterstützung”.

**Rationale**: Matches clarify decision on German paths; avoids encoding issues.

**Alternatives considered**: English paths; umlaut in URL — rejected for
consistency and tooling simplicity.

## 5. GitHub Pages base path

**Decision**: Set Astro `site` to the production origin and `base` via config
(default `'/'`). If deploying as a project site (`username.github.io/repo`),
set `base: '/repo-name/'` in `astro.config.mjs` before deploy. Document in
quickstart; no custom domain in v1.

**Rationale**: Canonical URLs and asset paths must respect `base`. Deferring
custom domain matches FR-014.

**Alternatives considered**: Hard-code project base now — premature without
confirmed repo Pages type; adapter `@astrojs/cloudflare` etc. — out of scope.

## 6. Images & fonts

**Decision**: Copy only production-needed assets from the Figma extract into
`src/assets`. Prefer SVG for logos/icons. Raster heroes/carousel slides
pre-optimized (appropriate dimensions/formats). Self-host webfonts discovered
during token extraction (no third-party font CDN required for v1).

**Rationale**: Asset hygiene + performance + no extra tracking from font CDNs.

**Alternatives considered**: Ship entire extract folder — violates FR-009;
Google Fonts CDN — avoidable third-party dependency.

## 7. SEO metadata

**Decision**: Per-page `title` and `description` derived from visible Figma
headline + lead copy. `BaseLayout` emits canonical, Open Graph, and Twitter
tags. `lang="de"` on `<html>`.

**Rationale**: Clarification Q5 + AR-002; German content language from Figma.

**Alternatives considered**: Stakeholder-supplied SEO pack — deferred; invent
marketing claims — forbidden by constitution/spec.

## 8. Deployment pipeline

**Decision**: GitHub Actions workflow building Astro and publishing `dist/` to
GitHub Pages (Actions artifact / Pages deploy permissions).

**Rationale**: Constitution IX — static GH Pages + Actions; small-team operable.

**Alternatives considered**: Manual `gh-pages` branch push; Netlify/Vercel —
outside default hosting target.

## 9. Testing approach

**Decision**: No automated unit/e2e suite in v1. Validation = `astro build`,
`astro preview`, checklist in `quickstart.md` (routes, nav, carousel reduced-
motion, responsive spot-checks, SEO tags, visual compare to Figma).

**Rationale**: Spec does not require automated tests; quality gate is visual +
build + a11y/SEO readiness.

**Alternatives considered**: Playwright suite — valuable later, not blocking v1.

## 10. Content & legal

**Decision**: Content from Figma only. No dedicated Impressum/Datenschutz
pages; include legal text only if already in extract (Kontakt/footer).

**Rationale**: Clarifications Q1 + FR-016.

**Alternatives considered**: Add legal pages — expands inventory beyond FR-013.
