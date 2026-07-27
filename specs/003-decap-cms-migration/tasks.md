# Tasks: Migrate Content Editing to Decap CMS

**Input**: Design documents from `/specs/003-decap-cms-migration/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Manual validation via `quickstart.md` only — no automated CMS E2E tasks

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Astro static site**: `src/content/`, `src/lib/`, `public/admin/`, `public/uploads/`, `docs/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create Decap admin directory scaffolding without wiring collections yet

- [X] T001 Create `public/admin/` directory for the Decap CMS shell
- [X] T002 [P] Add a short placeholder note in `public/uploads/.gitkeep` (or confirm existing) so media path remains committed for Decap uploads

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Decap shell + base GitHub backend config that all stories build on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Create Decap CMS admin shell in `public/admin/index.html` (CDN `decap-cms` / `decap-cms-app` script + mount root; no Decap on marketing pages)
- [X] T004 Create base Decap config in `public/admin/config.yml` with `backend.name: github`, repo `springeloo-com/website-2026`, `branch: main`, `publish_mode: editorial_workflow`, and placeholder `base_url` for the OAuth proxy
- [X] T005 Configure media paths in `public/admin/config.yml` (`media_folder: public/uploads`, `public_folder: /uploads`)
- [X] T006 Verify `npm run build` still succeeds and `public/admin/` is copied into the static output (respect `PUBLIC_BASE_PATH` for project-site admin URL)

**Checkpoint**: Admin shell loads locally; base backend + media config present — story work can start

---

## Phase 3: User Story 1 - Edit text through Decap (Priority: P1) 🎯 MVP

**Goal**: Editors can change in-scope home + globals text via Decap; saves open/update a PR to `main`; production updates only after maintainer merge

**Independent Test**: Change one in-scope heading via Decap; confirm Git/PR exists and rendered site shows new text after merge/deploy (see `quickstart.md` scenario 1 & 3)

### Implementation for User Story 1

- [X] T007 [US1] Add Decap `files` collection for globals text fields (nav labels, footer tagline/company/address/phone/email, legal labels, contact fields) mapping to `src/content/site/globals.yaml` in `public/admin/config.yml` — omit `href` widgets
- [X] T008 [US1] Add Decap `files` collection for home text fields (meta title/description, hero eyebrow/headline/badge, CTA labels, three Leistungen card eyebrow/title/Markdown body/CTA labels) mapping to `src/content/pages/home.yaml` in `public/admin/config.yml` — Markdown widget for bodies; plain string for headings/SEO/labels
- [X] T009 [US1] Confirm Astro loaders still render Decap-compatible YAML: keep `src/lib/content.ts` validation and existing page consumers (`src/pages/index.astro` and layout consumers of globals) unchanged except if field path fixes are required
- [X] T010 [US1] Smoke-check: edit a string in `src/content/pages/home.yaml` and a footer field in `src/content/site/globals.yaml` locally, run `npm run build`, and confirm homepage + footer text update without layout change

**Checkpoint**: Text surfaces for home + globals are editable via Decap config; MVP acceptance (hero/footer-class copy) is configured

---

## Phase 4: User Story 2 - Replace images through Decap (Priority: P2)

**Goal**: Editors can replace in-scope images + alt text; media lands in `public/uploads/`; layout containers unchanged

**Independent Test**: Replace one approved image + alt via Decap; confirm asset/path in Git and correct render on desktop/mobile (`quickstart.md` scenario 2)

### Implementation for User Story 2

- [X] T011 [P] [US2] Add Decap image + alt widgets for home hero `image.src` / `image.alt` in `public/admin/config.yml` (file `src/content/pages/home.yaml`)
- [X] T012 [P] [US2] Add optional image + alt widgets for each of the three Leistungen cards in `public/admin/config.yml` if/when those fields exist in `src/content/pages/home.yaml` (keep optional; do not invent layout redesign)
- [X] T013 [US2] Verify media uploads target `public/uploads/` and YAML `src` values remain `/uploads/...` paths compatible with existing `publicUrl()` / image rendering on `src/pages/index.astro`

**Checkpoint**: Hero (and optional card) images editable; shared uploads folder preserved

---

## Phase 5: User Story 3 - Preserve layout and Git review control (Priority: P3)

**Goal**: No page-builder/layout controls; hrefs and card count protected; CloudCannon removed; editorial workflow enforces PR review

**Independent Test**: Decap shows only approved fields; layout/CSS not editor-controlled; saves are Git PRs; CloudCannon not required (`quickstart.md` scenarios 4–6)

### Implementation for User Story 3

- [X] T014 [US3] Audit `public/admin/config.yml` so CTA/nav/legal `href` fields are not editable widgets (developer-controlled only per `contracts/editable-fields.md`)
- [X] T015 [US3] Configure Leistungen as a fixed list of exactly three cards in `public/admin/config.yml` (no create/delete of cards); keep build guard `leistungen.cards.length === 3` in `src/lib/content.ts`
- [X] T016 [US3] Delete `cloudcannon.config.yml` from the repository editorial path (no dual-editor workflow)
- [X] T017 [US3] Confirm `publish_mode: editorial_workflow` remains set in `public/admin/config.yml` so Decap saves create/update PRs to `main` rather than direct production publishes

**Checkpoint**: Layout protected; CloudCannon gone; Git PR review path enforced in config

---

## Phase 6: User Story 4 - Self-hosted / vendor-independent admin access (Priority: P4)

**Goal**: Editors authenticate with GitHub OAuth via Decap GitHub backend; write collaborators can edit; merge to `main` stays maintainer-only; no CloudCannon account needed

**Independent Test**: Sign in with GitHub OAuth; complete a small edit; confirm no CloudCannon account required (`quickstart.md` scenario 5)

### Implementation for User Story 4

- [X] T018 [US4] Wire GitHub backend auth settings in `public/admin/config.yml` (`name: github`, repo, branch, `base_url` for OAuth proxy) ready for maintainer-supplied proxy URL
- [X] T019 [US4] Document GitHub OAuth App + OAuth proxy setup, admin URL (including `PUBLIC_BASE_PATH`), write-collaborator vs maintainer-merge roles, and branch-protection expectations in `docs/howto-decap.md`
- [X] T020 [US4] Document that unauthorized users cannot publish and editors cannot merge to `main` in `docs/howto-decap.md` (align with `contracts/editorial-workflow.md`)

**Checkpoint**: Auth/access runbook complete; Decap usable without CloudCannon

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Docs cutover, README pointers, validation against quickstart

- [X] T021 [P] Replace CloudCannon-first guidance: update `docs/howto-edit-content.md` to point to Decap / `docs/howto-decap.md`
- [X] T022 [P] Replace or retarget `docs/howto-cloudcannon.md` to a short redirect/note that Decap is the editorial path
- [X] T023 [P] Update `README.md` editorial/CMS links to Decap (remove CloudCannon as primary)
- [X] T024 [P] Add OAuth proxy / admin prerequisites note to `docs/howto-deploy.md` if maintainers need it for Pages + Decap
- [X] T025 Confirm public marketing pages do not load Decap JS (only `public/admin/`); run `npm run build` and spot-check layout unchanged
- [X] T026 Run validation scenarios from `specs/003-decap-cms-migration/quickstart.md` (local build + documented Decap/PR path) and fix gaps

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — **BLOCKS** all user stories
- **User Story 1 (Phase 3)**: After Foundational — MVP
- **User Story 2 (Phase 4)**: After Foundational; best after US1 collections exist (extends same `config.yml` home file entry)
- **User Story 3 (Phase 5)**: After US1 field mapping (audit/remove CC); can partially overlap US2 once text collections exist
- **User Story 4 (Phase 6)**: After Foundational backend stub; docs can parallel US3 polish items
- **Polish (Phase 7)**: After US1–US4 desired scope complete

### User Story Dependencies

- **User Story 1 (P1)**: After Foundational — no dependency on US2–US4 for local text/config MVP
- **User Story 2 (P2)**: Extends US1 home collection with image widgets
- **User Story 3 (P3)**: Hardens US1/US2 config + removes CloudCannon
- **User Story 4 (P4)**: Completes auth ops docs/config for production Decap login

### Within Each User Story

- Configure Decap widgets before claiming story done
- Keep YAML shapes compatible with `src/lib/content.ts`
- Prefer one collection/file area at a time (Cursor-friendly)
- Validate with `npm run build` at checkpoints

### Parallel Opportunities

- T002 parallel with T001
- T011 and T012 parallel within US2
- T021–T024 parallel in Polish
- US4 docs (T019–T020) can proceed while US3 CloudCannon deletion (T016) runs if different owners

---

## Parallel Example: User Story 2

```bash
# After US1 home collection exists, image widgets can be added in parallel conceptually:
Task: "Add hero image + alt widgets in public/admin/config.yml"
Task: "Add optional Leistungen card image + alt widgets in public/admin/config.yml"
```

## Parallel Example: Polish docs

```bash
Task: "Update docs/howto-edit-content.md to Decap"
Task: "Retarget docs/howto-cloudcannon.md"
Task: "Update README.md CMS links"
Task: "Note OAuth/admin in docs/howto-deploy.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (admin shell + GitHub + editorial_workflow + media)
3. Complete Phase 3: User Story 1 (text collections for home + globals)
4. **STOP and VALIDATE**: Local YAML edit + build; Decap text save → PR when OAuth available
5. Demo MVP (hero/footer-class copy via Decap config)

### Incremental Delivery

1. Setup + Foundational → admin loads
2. US1 → text editing MVP
3. US2 → images
4. US3 → lock down fields, remove CloudCannon
5. US4 → OAuth runbook / production auth
6. Polish → docs + quickstart

### Parallel Team Strategy

1. Together: Setup + Foundational
2. Then:
   - Dev A: US1 text collections
   - Dev B: US4 OAuth docs (after T004 stub)
3. Then US2 images → US3 lockdown + CC removal → Polish

---

## Notes

- [P] = different files / no incomplete-task dependency
- No automated test tasks (spec uses manual `quickstart.md`)
- Decap editorial workflow uses per-entry PR branches targeting `main` (see `research.md`)
- OAuth proxy is external ops — document, do not embed secrets in the Astro app
- Commit after each task or logical group when asked
- Suggested MVP: Phases 1–3 (through US1)
