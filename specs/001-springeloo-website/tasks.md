---
description: "Task list for Springeloo corporate website implementation"
---

# Tasks: Springeloo Corporate Website

**Input**: Design documents from `/specs/001-springeloo-website/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not requested in the feature specification — no automated test tasks.

**Organization**: Tasks are grouped by user story to enable independent implementation and validation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US4)
- Include exact file paths in descriptions

## Path Conventions

- **Astro static site**: `src/components/`, `src/layouts/`, `src/pages/`, `src/styles/`, `src/scripts/`, `src/assets/`, `public/`
- Figma visual reference (outside repo): `../figmaextract/Webdesign` relative to Landingpage parent

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the Astro static project at repo root

- [x] T001 Create Astro 5 TypeScript project scaffold at repo root with `package.json`, `astro.config.mjs`, and `tsconfig.json`
- [x] T002 [P] Create source directory tree `src/components/`, `src/layouts/`, `src/pages/`, `src/styles/`, `src/scripts/`, `src/assets/` per plan.md
- [x] T003 [P] Configure `astro.config.mjs` for static output with configurable `site` and `base` (default `base: '/'`) for GitHub Pages
- [x] T004 [P] Add npm scripts `dev`, `build`, and `preview` in `package.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared tokens, layout, assets, and primitive components required by every story

**⚠️ CRITICAL**: No user story work begins until this phase is complete

- [x] T005 Extract design tokens from Figma into CSS custom properties in `src/styles/tokens.css` (colors, typography, spacing, radii, shadows, overlays, max content width)
- [x] T006 [P] Define responsive breakpoint tokens and media-query helpers in `src/styles/breakpoints.css` for mobile, tablet-portrait, tablet-landscape, desktop, and 2k
- [x] T007 [P] Add base element styles and focus-visible rules in `src/styles/global.css` importing tokens and breakpoints
- [x] T008 Copy only production-needed shared assets (logo, icons, fonts) from Figma extract into `src/assets/` with predictable filenames
- [x] T009 Create `src/layouts/BaseLayout.astro` with semantic landmarks slots, `lang="de"`, and SEO props (title, description, canonical, Open Graph, Twitter)
- [x] T010 [P] Create `src/components/NavLink.astro` with `href`, `label`, and `aria-current` support
- [x] T011 [P] Create `src/components/CTAButton.astro` with label, href, and variant props
- [x] T012 [P] Create `src/components/SectionHeading.astro` with configurable heading level
- [x] T013 [P] Create `src/components/ContentCard.astro` for repeated card patterns
- [x] T014 Create shared navigation data module `src/data/navigation.ts` listing the five German routes and nested items (in-scope hrefs only)
- [x] T015 Create `src/components/SiteFooter.astro` matching Figma footer (include legal text only if present in extract)
- [x] T016 Create `src/components/SiteHeader.astro` with logo link to `/` and top-level NavLinks from `src/data/navigation.ts` (desktop inline nav)

**Checkpoint**: Foundation ready — user stories can proceed

---

## Phase 3: User Story 1 - Discover Springeloo on the home page (Priority: P1) 🎯 MVP

**Goal**: Public home page with brand navigation, hero (carousel), and home sections aligned to Figma

**Independent Test**: Open `/` on desktop and ~390px mobile; confirm logo, nav, hero, and home sections; no layout collapse (see quickstart §3)

### Implementation for User Story 1

- [x] T017 [P] [US1] Create `src/components/HeroBanner.astro` for single-slide hero layout from Figma
- [x] T018 [P] [US1] Create `src/components/HeroCarousel.astro` for multi-slide hero markup, controls, and slide content slots
- [x] T019 [US1] Implement carousel behavior with autoplay, pause/advance, and reduced-motion disable in `src/scripts/carousel.ts` and wire it from `HeroCarousel.astro`
- [x] T020 [P] [US1] Optimize and add home/hero/carousel production images into `src/assets/` with meaningful alt text
- [x] T021 [US1] Implement home page sections (arguments, products teaser, CTA, and other Figma home blocks) in `src/pages/index.astro` using shared components
- [x] T022 [US1] Compose `/` in `src/pages/index.astro` with `BaseLayout`, `SiteHeader`, hero, sections, and `SiteFooter`; set title/description derived from Figma headline/lead

**Checkpoint**: Home page is demonstrable MVP

---

## Phase 4: User Story 2 - Browse core company pages (Priority: P2)

**Goal**: Secondary pages Projektunterstützung, Produkte, Kontakt, and Springeloo with consistent shell

**Independent Test**: From header, open each secondary route; layouts match Figma Sub-Pages; Kontakt is display-only (quickstart §4)

### Implementation for User Story 2

- [x] T023 [P] [US2] Add production section assets for secondary pages into `src/assets/` (only unused-excluded production files)
- [x] T024 [P] [US2] Implement `src/pages/projektunterstuetzung.astro` sections and SEO meta from Figma
- [x] T025 [P] [US2] Implement `src/pages/produkte.astro` sections and SEO meta from Figma
- [x] T026 [P] [US2] Implement `src/pages/kontakt.astro` as informational contact only (no form POST) with SEO meta from Figma
- [x] T027 [P] [US2] Implement `src/pages/springeloo.astro` sections and SEO meta from Figma
- [x] T028 [US2] Verify all four pages use `BaseLayout`, `SiteHeader`, and `SiteFooter` and match Figma section order at desktop and mobile breakpoints

**Checkpoint**: All five routes reachable with designed content

---

## Phase 5: User Story 3 - Navigate confidently on all devices (Priority: P3)

**Goal**: Mobile menu, expandable nested nav, keyboard access, and responsive nav parity

**Independent Test**: Mobile menu reaches all five destinations; nested items stay in-scope; keyboard focus visible; tablet variants (quickstart §5–6)

### Implementation for User Story 3

- [x] T029 [P] [US3] Create `src/components/ExpandableNav.astro` with `aria-expanded` disclosure for nested groups from `src/data/navigation.ts`
- [x] T030 [P] [US3] Create `src/components/MobileMenu.astro` for small-viewport menu pattern from Figma (including nested groups)
- [x] T031 [US3] Implement expandable menu keyboard/toggle behavior in `src/scripts/expandable-menu.ts` and wire into `ExpandableNav.astro` / `MobileMenu.astro`
- [x] T032 [US3] Integrate `ExpandableNav` and `MobileMenu` into `src/components/SiteHeader.astro` with progressive enhancement (primary links remain in DOM without JS)
- [x] T033 [US3] Apply tablet-portrait and tablet-landscape header/menu layout rules in `src/styles/` and header components per Figma variants
- [x] T034 [US3] Confirm carousel reduced-motion and controls still pass on home after nav integration (`src/scripts/carousel.ts`, `src/pages/index.astro`)

**Checkpoint**: Navigation usable on mobile/tablet/keyboard across the site

---

## Phase 6: User Story 4 - Share and find the site professionally (Priority: P4)

**Goal**: Unique, accurate metadata and heading structure for sharing and discovery

**Independent Test**: View-source on `/` and one secondary page for title, description, canonical, OG/Twitter, `lang="de"`, heading order (quickstart §7)

### Implementation for User Story 4

- [x] T035 [P] [US4] Audit and finalize unique title/description props on all five pages under `src/pages/` derived from each page’s Figma headline/lead
- [x] T036 [P] [US4] Ensure `BaseLayout.astro` emits canonical, Open Graph, and Twitter tags correctly with `site`/`base` awareness
- [x] T037 [US4] Fix heading hierarchy on all pages (`h1` once per page, logical `h2`/`h3`) in `src/pages/*.astro` and section components
- [x] T038 [US4] Add or wire social preview image(s) for OG/Twitter where a suitable Figma asset exists in `src/assets/`

**Checkpoint**: Link previews and document outline meet AR-002 / SC-005

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Quality gate, deploy pipeline, asset hygiene

- [x] T039 [P] Add GitHub Pages deploy workflow in `.github/workflows/deploy.yml` building Astro and publishing `dist/`
- [x] T040 [P] Add project README usage notes in `README.md` (dev, build, preview, `base` config)
- [x] T041 Run production asset hygiene pass: remove unused files from `src/assets/` and confirm `dist/` has no extract dumps
- [x] T042 Accessibility pass: landmarks, focus, alt text, contrast spot-check across `src/pages/` and `src/components/`
- [x] T043 Visual QA against Figma at desktop, tablet, and mobile for all five pages; record gaps without inventing layouts
- [x] T044 Run `npm run build` and execute quickstart.md validation scenarios §1–10; fix blockers before calling done

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — **blocks all user stories**
- **US1 (Phase 3)**: Depends on Foundational — MVP
- **US2 (Phase 4)**: Depends on Foundational; can start after US1 header/shell exists (practically after T016); parallelizable across the four page files
- **US3 (Phase 5)**: Depends on Foundational + SiteHeader (T016); ideally after US1/US2 routes exist for link targets
- **US4 (Phase 6)**: Depends on pages from US1–US2 existing
- **Polish (Phase 7)**: Depends on desired stories complete (all four for full release)

### User Story Dependencies

- **US1 (P1)**: After Foundational — no dependency on US2–US4
- **US2 (P2)**: After Foundational — uses shared shell; independent page files can proceed in parallel
- **US3 (P3)**: After SiteHeader exists; enhances navigation across all pages
- **US4 (P4)**: After page content exists for meta/heading audit

### Within Each User Story

- Shared components before page composition
- Assets before sections that reference them
- One component or page section at a time (Cursor-friendly)
- Story complete (spec match + visual check) before treating as done

### Parallel Opportunities

- T002–T004 after T001 scaffold direction is clear
- T006–T007, T010–T013 in Foundational once tokens (T005) started or done
- T017–T018, T020 in US1 in parallel
- T024–T027 secondary pages in parallel after T023 assets
- T029–T030 in US3 in parallel
- T035–T036 in US4 in parallel
- T039–T040 in Polish in parallel

---

## Parallel Example: User Story 2

```bash
# After shared secondary assets (T023), launch page implementations together:
Task: "Implement src/pages/projektunterstuetzung.astro sections and SEO meta from Figma"
Task: "Implement src/pages/produkte.astro sections and SEO meta from Figma"
Task: "Implement src/pages/kontakt.astro as informational contact only…"
Task: "Implement src/pages/springeloo.astro sections and SEO meta from Figma"
```

---

## Parallel Example: User Story 1

```bash
# Launch hero building blocks together:
Task: "Create src/components/HeroBanner.astro…"
Task: "Create src/components/HeroCarousel.astro…"
Task: "Optimize and add home/hero/carousel production images into src/assets/…"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (home)
4. **STOP and VALIDATE** via quickstart §1–3
5. Demo home page

### Incremental Delivery

1. Setup + Foundational → shell ready
2. US1 → Home MVP
3. US2 → Full page inventory
4. US3 → Mobile/expandable navigation fidelity
5. US4 → SEO/share readiness
6. Polish → Deploy + quality gate

### Parallel Team Strategy

1. Team completes Setup + Foundational together
2. Then: Developer A on US1 home sections; Developer B on US2 page stubs; Developer C on US3 menu components (after header exists)
3. US4 and Polish after pages merge

---

## Notes

- [P] = different files, no blocking dependency on incomplete sibling tasks
- [USn] maps to spec user stories for traceability
- No automated test tasks (not requested)
- Commit after each task or logical group
- Stop at checkpoints to validate independently
- Do not invent copy/layout; Figma extract is visual source of truth
