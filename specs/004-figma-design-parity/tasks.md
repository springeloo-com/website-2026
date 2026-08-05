# Tasks: Figma Design Parity (Multi-Breakpoint)

**Input**: Design documents from `/specs/004-figma-design-parity/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Manual four-width visual QA via `contracts/visual-qa.md` and `quickstart.md` — no automated pixel-diff / E2E tasks

**Organization**: Tasks are grouped by user story. **US2 (tokens/breakpoints) runs before US1 (homepage)** because layout parity depends on a synced token system (research + cadence).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Astro static site**: `src/components/`, `src/layouts/`, `src/pages/`, `src/styles/`, `src/content/`, `public/`, `docs/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm Figma source access and baseline inventory before edits

- [X] T001 Confirm maintainer/agent access to Figma file `QLSDfzdupEsnPJ4WY528O5` page `1969:37969` and the four frame nodes listed in `specs/004-figma-design-parity/contracts/figma-source.md`
- [X] T002 [P] Inventory current `@media` layout thresholds across `src/pages/*.astro`, `src/components/*.astro`, and `src/styles/*.css`; note divergences from 390/768/1024/1280 (especially 900px / 960px) for Phase 3 cleanup
- [X] T003 [P] List production assets required by the homepage Figma frames (images/icons/logos) and mark missing files that would block section sign-off per FR-011

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared prep that blocks story implementation — QA checklist ready, CMS boundary confirmed, no content overwrite

**⚠️ CRITICAL**: No user story layout work until this phase is complete

- [X] T004 Create a working homepage visual QA checklist instance (copy/adapt from `specs/004-figma-design-parity/contracts/visual-qa.md`) under `specs/004-figma-design-parity/checklists/homepage-visual-qa.md` with the four widths and severity-1 criteria
- [X] T005 Confirm Decap boundary: do not overwrite `src/content/pages/home.yaml` or `src/content/site/globals.yaml` from Figma placeholders; note any *new* editable fields implied by design for later narrow expansion (`contracts/cms-boundary.md`)
- [X] T006 Verify `npm run build` succeeds on the branch baseline before visual changes

**Checkpoint**: Figma access confirmed, audit done, QA checklist ready — US2 can start

---

## Phase 3: User Story 2 - Design tokens and breakpoints stay consistent (Priority: P1)

**Goal**: One consistent token + breakpoint system aligned to Figma Variables and acceptance widths 390 / 768 / 1024 / 1280; remove contradictory intermediate layout rules

**Independent Test**: Review `src/styles/tokens.css` / `breakpoints.css` against Figma Variables; confirm layout switches on touched surfaces use only the four widths (no unexplained 900/960 rules on home path)

### Implementation for User Story 2

- [X] T007 [US2] Sync Figma Variables (color, type, spacing, related) into `src/styles/tokens.css` without inventing values not present in the approved design system
- [X] T008 [US2] Align `src/styles/breakpoints.css` documentation and helpers to Mobile 390 / Tablet hoch 768 / Tablet quer 1024 / Desktop 1280 (retain optional 1920 only if still intentional)
- [X] T009 [P] [US2] Realign ad-hoc `@media (min-width: 900px)` in `src/pages/index.astro` to an approved width from the four-frame set
- [X] T010 [P] [US2] Realign shared chrome media queries in `src/components/SiteHeader.astro`, `src/components/MobileMenu.astro`, `src/components/SiteFooter.astro`, and `src/components/HeroBanner.astro` so layout switches use 768 / 1024 / 1280 (not divergent intermediates)
- [X] T011 [US2] Spot-check `src/styles/global.css` for one-off colors/type/spacing that conflict with the synced token set; replace with token references where homepage will consume them

**Checkpoint**: Token + breakpoint foundation ready — homepage parity (US1) can proceed safely

---

## Phase 4: User Story 1 - Homepage matches all four Figma frames (Priority: P1) 🎯 MVP

**Goal**: Homepage visually matches Desktop / Tablet quer / Tablet hoch / Mobile frames at 1280 / 1024 / 768 / 390; Decap home/globals edits still work; release gate for the feature

**Independent Test**: Side-by-side compare `npm run preview` homepage vs Figma nodes in `contracts/figma-source.md` at all four widths; zero severity-1; Decap (or YAML) edit still renders without layout code changes (`quickstart.md` scenarios 3–4)

### Implementation for User Story 1

- [X] T012 [US1] Update shared header/nav behavior for homepage chrome parity in `src/components/SiteHeader.astro` and `src/components/MobileMenu.astro` (and `src/components/NavLink.astro` / `ExpandableNav.astro` if required by frames) using Decap globals labels — do not hardcode Figma placeholder nav copy
- [X] T013 [US1] Update hero composition for four-width parity in `src/components/HeroBanner.astro` (and `src/pages/index.astro` wiring) while keeping hero copy/image from `src/content/pages/home.yaml`
- [X] T014 [P] [US1] Update Leistungen section layout in `src/pages/index.astro` + `src/components/ContentCard.astro` / `src/components/SectionHeading.astro` to match Figma; keep exactly three cards and Decap card fields
- [X] T015 [P] [US1] Update mid-page carousel/band sections in `src/components/HeroCarousel.astro` and related blocks in `src/pages/index.astro` to match Figma structure/spacing/media placement
- [X] T016 [US1] Update CTA band + footer chrome for homepage parity in `src/pages/index.astro` CTA section, `src/components/CTAButton.astro`, and `src/components/SiteFooter.astro` (footer content still from globals YAML)
- [X] T017 [US1] Add any missing production assets under `public/` / `public/uploads/` required by homepage frames; prefer SVG for logos/icons; wire paths without replacing Decap-managed image fields unless design adds a new editable field
- [X] T018 [US1] Preserve a11y/SEO baselines on home: semantic landmarks/heading order/focus/alt in updated components + meta fields from `src/content/pages/home.yaml` via `src/layouts/BaseLayout.astro` (AR-001/AR-002)
- [X] T019 [US1] Run homepage four-width visual QA using `specs/004-figma-design-parity/checklists/homepage-visual-qa.md`; fix all severity-1 mismatches before sign-off request
- [X] T020 [US1] Verify Decap boundary: change one approved home text or image via Decap or local edit to `src/content/pages/home.yaml`, rebuild, confirm layout still holds without editor layout changes
- [ ] T021 [US1] Obtain designer visual OK + stakeholder acceptance for homepage at four breakpoints (SC-008); record completion in `specs/004-figma-design-parity/checklists/homepage-visual-qa.md`

**Checkpoint**: Homepage release gate met — MVP deliverable; secondary pages MUST NOT block this

---

## Phase 5: User Story 3 - Remaining public pages reach parity (Priority: P2)

**Goal**: Secondary marketing routes with Figma frames match at the four widths; shared chrome stays consistent; pages without frames stay untouched

**Independent Test**: For each framed secondary route, four-width compare vs Figma; shared header/footer consistent; unframed routes unchanged

### Implementation for User Story 3

- [X] T022 [US3] Inventory which of `/projektunterstuetzung`, `/produkte`, `/springeloo`, `/kontakt` have Figma frames in file `QLSDfzdupEsnPJ4WY528O5`; document node IDs (or “no frames”) in `specs/004-figma-design-parity/contracts/figma-source.md`
- [X] T023 [P] [US3] Realign `@media (min-width: 900px)` in `src/pages/produkte.astro` to an approved four-frame width (even if full visual parity waits on frames)
- [X] T024 [P] [US3] Realign `@media (min-width: 960px)` in `src/pages/kontakt.astro` to an approved four-frame width
- [X] T025 [US3] Implement four-width layout parity for each **framed** secondary page among `src/pages/projektunterstuetzung.astro`, `src/pages/produkte.astro`, `src/pages/springeloo.astro`, `src/pages/kontakt.astro` — skip routes with no frames (no speculative redesign)
- [X] T026 [US3] Reuse/update shared components from US1 for secondary chrome consistency; avoid one-off page copies of header/footer/nav patterns
- [X] T027 [US3] Run four-width visual QA for each completed secondary page (adapt checklist); do not block homepage release if this phase is incomplete

**Checkpoint**: Framed secondary pages at parity standard; unframed pages left alone

---

## Phase 6: User Story 4 - Repeatable design-drop cadence (Priority: P3)

**Goal**: Documented, agreed sequence for future Figma drops: frames → tokens → layout → four-width QA → merge; CMS/layout boundary clear; no auto-publish promise

**Independent Test**: Walk `contracts/design-drop-cadence.md` dry-run; roles/steps/CMS boundary understood (SC-005)

### Implementation for User Story 4

- [X] T028 [US4] Add maintainer-facing design-drop how-to in `docs/howto-figma-design-drop.md` summarizing `contracts/design-drop-cadence.md`, `contracts/cms-boundary.md`, and acceptance widths
- [X] T029 [P] [US4] Cross-link the cadence doc from `README.md` and/or `docs/howto-edit-content.md` so editors/maintainers can find layout vs Decap ownership
- [X] T030 [US4] Dry-run the cadence checklist once against the completed homepage pass; note gaps in `docs/howto-figma-design-drop.md` if any

**Checkpoint**: Next design drop can follow the documented cadence without reinventing process

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Quality gate across stories; static deploy readiness

- [X] T031 [P] Asset hygiene: optimize new images, prefer SVG logos/icons, remove unused exports under `public/` / `src/assets/`
- [X] T032 Accessibility pass on touched pages/components (landmarks, heading order, keyboard, focus, alt) per AR-001
- [X] T033 SEO pass: titles, descriptions, canonical, Open Graph still intact on `src/layouts/BaseLayout.astro` consumers per AR-002
- [X] T034 Verify `npm run build` succeeds and output remains GitHub Pages–ready (`.github/workflows/deploy.yml` assumptions unchanged)
- [X] T035 Run full `specs/004-figma-design-parity/quickstart.md` validation scenarios
- [X] T036 Confirm no promise of continuous Figma auto-publish remains in docs; human QA before merge is stated in `docs/howto-figma-design-drop.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS story implementation
- **User Story 2 (Phase 3)**: Depends on Foundational — **required before US1 layout work**
- **User Story 1 (Phase 4)**: Depends on US2 (tokens/breakpoints) — **MVP / release gate**
- **User Story 3 (Phase 5)**: Depends on US1 shared chrome ideally; MUST NOT block homepage sign-off
- **User Story 4 (Phase 6)**: Can start after US1 acceptance (cadence documents the completed path); parallel with US3 late work OK
- **Polish (Phase 7)**: After desired stories; homepage polish can run right after US1 for MVP ship

### User Story Dependencies

- **User Story 2 (P1)**: After Foundational — no dependency on other stories
- **User Story 1 (P1)**: After US2 — homepage is the release gate
- **User Story 3 (P2)**: After US1 preferred (reuse chrome); independently testable per framed page; non-blocking
- **User Story 4 (P3)**: After US1 (needs a real pass to document); independently testable via dry-run

### Within Each User Story

- Tokens before components; shared chrome before page sections
- One component or page section at a time (Cursor-friendly)
- Do not overwrite Decap YAML from Figma text
- Story complete (spec match + visual check) before next priority when sequencing alone

### Parallel Opportunities

- T002 / T003 in Setup
- T009 / T010 in US2 (different files)
- T014 / T015 in US1 (different sections/files after hero baseline)
- T023 / T024 in US3 (different pages)
- T028 / T029 docs; T031 asset hygiene with doc polish

---

## Parallel Example: User Story 2

```bash
# After T007–T008 tokens/breakpoints updated:
Task: "Realign @media 900px in src/pages/index.astro"
Task: "Realign chrome media queries in SiteHeader/MobileMenu/SiteFooter/HeroBanner"
```

## Parallel Example: User Story 1

```bash
# After hero (T013) establishes section rhythm:
Task: "Update Leistungen in index.astro + ContentCard/SectionHeading"
Task: "Update HeroCarousel + mid-page bands in index.astro"
```

## Parallel Example: User Story 3

```bash
Task: "Realign 900px media query in src/pages/produkte.astro"
Task: "Realign 960px media query in src/pages/kontakt.astro"
```

---

## Implementation Strategy

### MVP First (US2 + US1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 2 (tokens/breakpoints)
4. Complete Phase 4: User Story 1 (homepage parity + sign-off)
5. **STOP and VALIDATE**: Designer OK + stakeholder acceptance; ship homepage
6. Continue US3/US4 without blocking the homepage release

### Incremental Delivery

1. Setup + Foundational → ready
2. US2 → consistent tokens/breakpoints
3. US1 → homepage MVP release gate
4. US3 → framed secondary pages as available
5. US4 → durable cadence docs
6. Polish → a11y/SEO/build/quickstart

### Parallel Team Strategy

1. Together: Setup + Foundational + US2
2. Then: primary engineer on US1 homepage sections
3. After chrome stable: secondary pages (US3) in parallel by route
4. Tech writer/maintainer: US4 docs in parallel with late US3

---

## Notes

- [P] tasks = different files, no incomplete-task dependencies
- Homepage is the release gate; secondary pages are non-blocking
- Layout from Figma; Decap content wins for copy/images
- Severity-1 = section order, alignment, spacing rhythm, type hierarchy, major media placement
- Commit after each task or logical group
- Avoid: plugin exporters, Framer, overwriting Decap from Figma, inventing missing breakpoints
