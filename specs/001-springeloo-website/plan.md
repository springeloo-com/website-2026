# Implementation Plan: Springeloo Corporate Website

**Branch**: `001-springeloo-website` | **Date**: 2026-07-27 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-springeloo-website/spec.md`

**Note**: This plan is produced by `/speckit-plan`. Tasks are generated later via `/speckit-tasks`.

## Summary

Build a static, five-page German corporate website for Springeloo by faithfully
translating the approved Figma extract into an Astro site hosted on GitHub
Pages. Delivery includes shared shell (header/footer/nav), home plus four
secondary pages, design tokens, reusable components, SEO metadata derived from
visible Figma copy, and minimal client JS only for carousel and expandable
menus (with reduced-motion handling).

## Technical Context

**Language/Version**: TypeScript (strict) + HTML/CSS via Astro 5.x

**Primary Dependencies**: Astro (static output); no UI framework; no CMS;
vanilla JS for carousel and expandable menus only

**Storage**: N/A (static content and assets in repo)

**Testing**: Manual visual QA vs Figma + `astro build` / preview validation
scenarios in `quickstart.md` (no automated test suite required for v1)

**Target Platform**: Modern evergreen browsers; static hosting on GitHub Pages

**Project Type**: Astro static marketing website

**Performance Goals**: Home primary text readable within ~3s on mid-range
mobile / typical 4G (SC-008); lean HTML/CSS; minimal JS; optimized images

**Constraints**: Static-first; no WordPress/CMS/DB/forms backend; minimal
dependencies; Figma is visual source of truth; German URL paths; GitHub Pages
compatible (`site` + configurable `base`)

**Scale/Scope**: 5 public pages; shared layout; ~8 reusable component types;
breakpoints: 2K desktop, desktop, tablet landscape, tablet portrait, mobile

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Design-first**: ✅ Spec + Figma extract under
  `Landingpage/figmaextract/Webdesign`; conflicts update spec first
- **Static-first**: ✅ Astro static HTML/CSS; JS only for designed interactions
- **Component modularity**: ✅ SiteHeader, NavLink, HeroBanner/carousel,
  SectionHeading, ContentCard, CTAButton, SiteFooter, mobile menu
- **Responsive parity**: ✅ Explicit Figma breakpoints in data model / tokens
- **Accessibility & SEO**: ✅ Landmarks, keyboard nav, focus, alt text,
  titles/descriptions/canonical/OG/Twitter; reduced-motion for carousel
- **Minimal dependencies**: ✅ Astro only; carousel/menus in vanilla JS
  (justified in Complexity Tracking)
- **GitHub Pages**: ✅ Static `dist/` + Actions deploy; configurable `base`
- **Spec-driven order**: ✅ Specify → clarify → plan → tasks → implement
- **Maintainability & assets**: ✅ Plain CSS tokens; production assets only
- **Quality gate**: ✅ Build + visual check + a11y/SEO/static-deploy in
  quickstart

**Post-design re-check (Phase 1)**: ✅ All gates still pass. Complexity
Tracking documents justified minimal client JS only.

## Project Structure

### Documentation (this feature)

```text
specs/001-springeloo-website/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── routes.md
│   └── ui-components.md
└── tasks.md             # /speckit-tasks (not created here)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── SiteHeader.astro
│   ├── NavLink.astro
│   ├── MobileMenu.astro
│   ├── ExpandableNav.astro
│   ├── HeroBanner.astro
│   ├── HeroCarousel.astro
│   ├── SectionHeading.astro
│   ├── ContentCard.astro
│   ├── CTAButton.astro
│   └── SiteFooter.astro
├── layouts/
│   └── BaseLayout.astro
├── pages/
│   ├── index.astro
│   ├── projektunterstuetzung.astro
│   ├── produkte.astro
│   ├── kontakt.astro
│   └── springeloo.astro
├── styles/
│   ├── tokens.css
│   ├── global.css
│   └── breakpoints.css
├── scripts/
│   ├── carousel.ts
│   └── expandable-menu.ts
└── assets/
    └── …                # production images/fonts from Figma extract
public/
    └── …                # favicon / static files only if needed
.github/
└── workflows/
    └── deploy.yml       # GitHub Pages static deploy
astro.config.mjs
package.json
tsconfig.json
```

**Structure Decision**: Single Astro static project at repo root (default
Springeloo layout). Content is page modules + shared components; design tokens
live in CSS custom properties. Figma extract remains outside the repo as the
visual reference; only optimized production assets are copied into `src/assets`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Minimal client JS for hero carousel + expandable menus | Spec FR-010 requires full interactive parity; clarifications require autoplay with controls and reduced-motion handling | Static first-frame / flat links rejected by stakeholder (clarify Q2=A parity, carousel Q=C) |
