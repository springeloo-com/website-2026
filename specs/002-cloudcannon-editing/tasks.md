---
description: "Task list for CloudCannon editable content"
---

# Tasks: CloudCannon Editable Content

**Input**: Design documents from `/specs/002-cloudcannon-editing/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not requested — no automated CMS E2E tasks; validate via quickstart.md

**Organization**: Tasks grouped by user story for incremental delivery

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Parallelizable (different files, no incomplete blockers)
- **[Story]**: [US1]–[US4] for story phases only
- Include exact file paths

## Path Conventions

- Content: `src/content/site/`, `src/content/pages/`
- Loaders: `src/lib/`
- Config: `cloudcannon.config.yml`
- Uploads: `public/uploads/`
- Existing UI: `src/components/`, `src/pages/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Content directories and upload target for CloudCannon

- [x] T001 Create content directories `src/content/site/` and `src/content/pages/` per plan.md
- [x] T002 [P] Create `public/uploads/.gitkeep` as CloudCannon image upload target
- [x] T003 [P] Add `src/lib/content.ts` stub exporting types matching `specs/002-cloudcannon-editing/data-model.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Content files, loaders, Markdown rendering, and CloudCannon base config — required before story wiring

**⚠️ CRITICAL**: No user story work begins until this phase is complete

- [x] T004 Seed `src/content/site/globals.yaml` from current `src/data/navigation.ts` / footer values (nav labels, footer, contact)
- [x] T005 Seed `src/content/pages/home.yaml` from current `src/pages/index.astro` hero, meta, and three Leistungen cards (exact card count 3)
- [x] T006 Implement typed loaders and validation (fail build if required fields missing or cards.length ≠ 3) in `src/lib/content.ts`
- [x] T007 [P] Add Markdown-to-HTML helper for rich-text body fields in `src/lib/markdown.ts` using site-safe rendering (no raw script; styles via CSS only)
- [x] T008 Add rich-text body styles under existing design tokens in `src/styles/global.css` (lists/headings inherit site type scale)
- [x] T009 Create base `cloudcannon.config.yml` with collections for globals and home content files (no Bookshop)
- [x] T010 Document content-branch + PR publishing expectations for CloudCannon in `docs/howto-cloudcannon.md` (editor saves ≠ production until maintainer merge)

**Checkpoint**: Content loads locally via `npm run build`; CloudCannon config file exists

---

## Phase 3: User Story 1 - Update headline and body copy (Priority: P1) 🎯 MVP

**Goal**: Editors can change home hero plain-text fields, home meta, and (via later card body) rich text through content files; home page reads YAML

**Independent Test**: Change `hero.headline` in `src/content/pages/home.yaml`, rebuild; home shows new headline without layout change (quickstart local text check)

### Implementation for User Story 1

- [x] T011 [US1] Wire `src/pages/index.astro` to load home content via `src/lib/content.ts` for hero eyebrow, headline, badge, and CTA labels
- [x] T012 [P] [US1] Wire home `meta.title` / `meta.description` from `src/content/pages/home.yaml` into `BaseLayout` props in `src/pages/index.astro`
- [x] T013 [US1] Configure CloudCannon text/markdown inputs for home hero copy + meta in `cloudcannon.config.yml`
- [x] T014 [US1] Verify CTA **href** values remain hard-coded/developer fields in `src/content/pages/home.yaml` and are not editable inputs in `cloudcannon.config.yml`

**Checkpoint**: Local YAML edit updates home hero/meta; MVP demo-ready

---

## Phase 4: User Story 2 - Replace hero and section images (Priority: P2)

**Goal**: Approved image fields + alt text editable; paths point at uploads

**Independent Test**: Point `hero.image` at a file under `public/uploads/`, set alt, rebuild; hero image updates (quickstart §2 adapted locally)

### Implementation for User Story 2

- [x] T015 [P] [US2] Extend home hero image + alt binding in `src/pages/index.astro` / `src/components/HeroBanner.astro` to use paths from `src/content/pages/home.yaml`
- [x] T016 [P] [US2] Add optional image+alt fields on Leistungen cards in `src/content/pages/home.yaml` and render in `src/pages/index.astro` / `src/components/ContentCard.astro`
- [x] T017 [US2] Configure CloudCannon image inputs (with alt) for hero and card images writing under `public/uploads/` in `cloudcannon.config.yml`
- [x] T018 [US2] Ensure object-fit/crop behavior preserved in `src/components/HeroBanner.astro` and card styles so swaps do not expand layout

**Checkpoint**: Image path + alt changes reflect on rebuild without layout break

---

## Phase 5: User Story 3 - Edit structured content blocks (Priority: P3)

**Goal**: Exactly three fixed Leistungen cards editable (title, body Markdown, CTA label)

**Independent Test**: Edit card 2 fields in YAML; still three cards; Markdown list renders with site styles (quickstart §3)

### Implementation for User Story 3

- [x] T019 [US3] Render all three Leistungen cards from `src/content/pages/home.yaml` in `src/pages/index.astro` using `ContentCard` / `CTAButton` and `src/lib/markdown.ts` for body HTML
- [x] T020 [US3] Configure CloudCannon structure for fixed three card objects (no add/remove UI) in `cloudcannon.config.yml`
- [x] T021 [US3] Enforce cards length === 3 in `src/lib/content.ts` validation (build fails otherwise)
- [x] T022 [US3] Confirm card `cta.href` remains non-editable in `cloudcannon.config.yml` while `cta.label` is editable

**Checkpoint**: Card copy/CTA labels editable; cardinality locked at 3

---

## Phase 6: User Story 4 - Keep layout developer-controlled (Priority: P4)

**Goal**: Globals editable for labels/contact only; hrefs/layout locked; PR workflow documented; SiteHeader/Footer consume globals

**Independent Test**: Change nav label in globals YAML — href unchanged; CloudCannon has no layout controls; editor cannot merge to main (quickstart §4–5)

### Implementation for User Story 4

- [x] T023 [US4] Refactor `src/data/navigation.ts` to re-export or load labels from `src/content/site/globals.yaml` while keeping hrefs developer-defined
- [x] T024 [P] [US4] Wire `src/components/SiteHeader.astro` and `src/components/SiteFooter.astro` to globals content via `src/lib/content.ts`
- [x] T025 [P] [US4] Wire Kontakt aside contact fields from globals in `src/pages/kontakt.astro`
- [x] T026 [US4] Configure CloudCannon inputs for globals (nav labels, footer, contact) excluding href fields in `cloudcannon.config.yml`
- [x] T027 [US4] Restrict CloudCannon editor permissions notes and branch/PR settings in `cloudcannon.config.yml` + `docs/howto-cloudcannon.md` (content branch; maintainer merges only)
- [x] T028 [US4] Add PR review checklist section for rich-text/heading-order/overflow to `docs/howto-cloudcannon.md`

**Checkpoint**: Globals work; layout/hrefs developer-only; workflow docs match contracts

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Docs, build proof, editorial validation readiness

- [x] T029 [P] Update `docs/howto-edit-content.md` to point editors at CloudCannon + content files instead of only raw Astro edits
- [x] T030 [P] Update `README.md` with CloudCannon + content PR workflow links
- [x] T031 Run `npm run build` and fix any content-loader or Markdown integration errors
- [x] T032 Walk `specs/002-cloudcannon-editing/quickstart.md` scenarios that can run locally; list CloudCannon console steps remaining for the team
- [x] T033 Visual spot-check home desktop/mobile after content-driven render against approved layout expectations

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Start immediately
- **Foundational (Phase 2)**: Depends on Setup — **blocks all stories**
- **US1 (Phase 3)**: Depends on Foundational — MVP
- **US2 (Phase 4)**: Depends on Foundational + home wiring from US1 (T011)
- **US3 (Phase 5)**: Depends on Foundational + Markdown helper (T007) + home page consumer
- **US4 (Phase 6)**: Depends on Foundational globals file (T004); can partially parallelize after T004 with US1
- **Polish (Phase 7)**: After desired stories complete

### User Story Dependencies

- **US1**: After Foundational — home text/meta
- **US2**: After US1 hero wiring (or shared home content binding)
- **US3**: After Markdown helper + home page data binding
- **US4**: After globals seed; header/footer refactor; CloudCannon permissions

### Parallel Opportunities

- T002–T003 after T001
- T007–T008 during/after T006
- T015–T016 in US2
- T024–T025 in US4
- T029–T030 in Polish

---

## Parallel Example: User Story 2

```bash
Task: "Extend home hero image + alt binding in src/pages/index.astro / HeroBanner.astro…"
Task: "Add optional image+alt fields on Leistungen cards in src/content/pages/home.yaml…"
```

---

## Parallel Example: User Story 4

```bash
Task: "Wire SiteHeader.astro and SiteFooter.astro to globals…"
Task: "Wire Kontakt aside contact fields from globals in src/pages/kontakt.astro"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 Setup
2. Phase 2 Foundational (content files + loaders + CloudCannon base)
3. Phase 3 US1 home text/meta wiring
4. **STOP** — demo YAML → rebuild → headline change
5. Then US2 images → US3 cards → US4 globals/permissions

### Incremental Delivery

1. Foundational content model
2. US1 text MVP
3. US2 images
4. US3 fixed cards + Markdown
5. US4 globals + workflow hardening
6. Polish + quickstart

---

## Notes

- No Bookshop / page-builder tasks
- No editable hrefs for nav/CTAs in v1
- Exactly three Leistungen cards enforced in loader
- Commit after each task or logical group
- CloudCannon UI connection may require human steps in the CloudCannon dashboard; repo config + docs must make that path clear
