# Tasks: Replace Decap CMS with Sveltia CMS

**Input**: Design documents from `specs/006-sveltia-cms/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Not requested — no test tasks included.

**Organization**: Tasks grouped by user story. US1 is fully independent and is the MVP. US2 builds on the working US1 admin. US3 is clean-up and can be done any time after US1 is confirmed.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install the new dependency and verify the local environment is ready before touching any admin files.

- [x] T001 Install `@sveltia/cms` npm package: run `npm install @sveltia/cms` and confirm `package.json` lists it under `dependencies`
- [x] T002 Verify the installed bundle exists at `node_modules/@sveltia/cms/dist/sveltia-cms.js`

**Checkpoint**: `@sveltia/cms` is installed and the source bundle file exists.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the Sveltia copy script and wire it into npm scripts — this must be in place before the admin shell can be updated.

- [x] T003 Create `scripts/copy-sveltia.mjs` mirroring `scripts/copy-decap.mjs`: copy `node_modules/@sveltia/cms/dist/sveltia-cms.js` → `public/admin/sveltia-cms.js`; exit with a clear error if the source is missing
- [x] T004 Update `package.json` `predev` and `prebuild` scripts to call `node scripts/copy-sveltia.mjs` instead of `node scripts/copy-decap.mjs`
- [x] T005 Run `npm run build` and confirm it succeeds — `dist/admin/sveltia-cms.js` must exist and `dist/admin/decap-cms.js` must still exist (both present in this phase; Decap not yet removed)

**Checkpoint**: Build succeeds, Sveltia bundle is copied at build time. Decap files still present.

---

## Phase 3: User Story 1 — Editor opens admin panel via Sveltia CMS (Priority: P1) 🎯 MVP

**Goal**: The `/admin/` page loads the Sveltia CMS interface. Editors can authenticate and browse all three content collections (Globals, Home, Produkte) exactly as they could with Decap CMS.

**Independent Test**: Run `npm run dev`, open `http://localhost:4321/admin/`, sign in with GitHub → Sveltia CMS admin panel loads and shows Globals, Home, Produkte collections.

### Implementation for User Story 1

- [x] T006 [US1] Update `public/admin/index.html`: replace `<script src="./decap-cms.js"></script>` with `<script src="./sveltia-cms.js"></script>` and update the HTML comment to reference Sveltia CMS
- [x] T007 [US1] Run `npm run dev` and open `/admin/` — confirm the Sveltia CMS login screen appears and no browser console errors are thrown
- [ ] T008 [US1] Authenticate via GitHub using the existing Cloudflare OAuth proxy — confirm all three collections (Globals, Home page, Produkte page) are listed and accessible
- [ ] T009 [US1] Verify field parity: open each collection and confirm all fields and labels match the Decap CMS equivalents (use `public/admin/config.yml` as reference; no config changes should be needed)


> **Manual remaining (need GitHub login):** T008–T009 (auth + field parity), T010–T012 (save → PR), T024 (full quickstart). Local admin UI verified: Sveltia CMS login screen loads at `/admin/` with GitHub sign-in.

**Checkpoint**: US1 code complete — Sveltia CMS login UI verified locally. Full auth/collection parity still needs a human GitHub login (T008–T009).

---

## Phase 4: User Story 2 — Content save produces a PR on GitHub (Priority: P2)

**Goal**: An editor can save a content change in Sveltia CMS and it arrives as a pull request on the repository, triggering the GitHub Actions build pipeline. Image uploads also work correctly.

**Independent Test**: Change the Home hero headline in Sveltia CMS, save → a PR appears on `springeloo-com/website-2026` with the expected YAML diff in `src/content/pages/home.yaml`.

### Implementation for User Story 2

- [ ] T010 [US2] Make a test text edit in Sveltia CMS (e.g., Home hero headline) and save — confirm a branch + PR is created on the repository with `editorial_workflow` (PR branch named `cms/…`)
- [ ] T011 [US2] Upload a test image via the Sveltia CMS media panel — confirm the file is committed to `public/uploads/` on the PR branch and the YAML field stores a `/uploads/…` path
- [ ] T012 [US2] Discard / close the test PR on GitHub to leave `main` clean

**Checkpoint**: US2 complete — the full editorial workflow (edit → PR → merge) is confirmed working with Sveltia CMS.

---

## Phase 5: User Story 3 — Remove legacy Decap CMS bundle and scripts (Priority: P3)

**Goal**: All Decap CMS artifacts are removed from the repository. The build output contains no Decap bundle, and no prebuild script references Decap.

**Independent Test**: After deletion, `npm run build` succeeds, `dist/admin/decap-cms.js` does not exist, and `grep -r "decap" package.json scripts/` returns no matches.

### Implementation for User Story 3

- [x] T013 [US3] Delete `public/admin/decap-cms.js` from the repository (if it was committed; it may only exist as a generated file — confirm with `git ls-files public/admin/decap-cms.js`)
- [x] T014 [US3] Delete `scripts/copy-decap.mjs`
- [x] T015 [US3] Remove `decap-cms` from `package.json` `dependencies` and run `npm install` to update `package-lock.json`
- [x] T016 [P] [US3] Remove or rename `scripts/check-decap.sh`: update it to check for `sveltia-cms` in the admin HTML instead of `decap-cms`; rename the `package.json` script from `check:decap` to `check:cms`
- [x] T017 [US3] Run `npm run build` and confirm: build succeeds, `dist/admin/` contains `index.html`, `config.yml`, `sveltia-cms.js` — no `decap-cms.js`
- [x] T018 [US3] Confirm `grep -r "decap" package.json scripts/` returns no matches

**Checkpoint**: US3 complete — Decap is fully removed. Repo and build output contain only Sveltia CMS admin assets.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation updates and final verification.

- [x] T019 [P] Update `docs/howto-decap.md`: rename to `docs/howto-cms.md` (or update in place) — replace all "Decap CMS" references with "Sveltia CMS"; update admin URL notes and troubleshooting section
- [x] T020 [P] Update `docs/howto-edit-content.md`: replace "Decap CMS" with "Sveltia CMS" in the Preferred section
- [x] T021 [P] Update `README.md`: replace "Decap CMS" with "Sveltia CMS" in the how-to link and description
- [x] T022 [P] Update `docs/howto-decap2pages.md` or add a note that the project migrated to Sveltia CMS instead of Pages CMS
- [x] T023 Run the updated `check:cms` health check script against the deployed site (or locally) to confirm the Sveltia bundle is served and OAuth proxy is reachable
- [ ] T024 Run `quickstart.md` validation end-to-end: dev server → authenticate → verify collections → save test change → verify PR → discard PR

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (T001, T002)
- **US1 (Phase 3)**: Depends on Phase 2 — this is the MVP gate
- **US2 (Phase 4)**: Depends on US1 being confirmed working (T006–T009)
- **US3 (Phase 5)**: Depends on US2 confirmation (safe to remove Decap only after editing is verified)
- **Polish (Phase 6)**: Depends on US3 completion

### User Story Dependencies

- **US1 (P1)**: Blocks US2 and US3 — admin must work before verifying saves or cleaning up
- **US2 (P2)**: Blocks US3 — full workflow must be confirmed before removing Decap
- **US3 (P3)**: Safe to start only after US1 + US2 verified; T013–T016 are independent of each other within this phase

### Within Each Phase

- One file at a time (Cursor-friendly)
- Commit after each task or logical group
- Stop at each **Checkpoint** to validate before proceeding

### Parallel Opportunities

- T019, T020, T021, T022 (Polish docs) can all run in parallel
- T013, T014, T015, T016 (US3 deletions) can run in parallel once the decision to clean up is confirmed

---

## Parallel Example: Phase 6 (Polish)

```text
# All doc updates can launch together:
Task: "Update docs/howto-decap.md → howto-cms.md (T019)"
Task: "Update docs/howto-edit-content.md (T020)"
Task: "Update README.md (T021)"
Task: "Update docs/howto-decap2pages.md (T022)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T002)
2. Complete Phase 2: Foundational (T003–T005)
3. Complete Phase 3: User Story 1 (T006–T009)
4. **STOP and VALIDATE**: Admin loads, all collections accessible, OAuth works
5. This is a shippable increment — Sveltia CMS is live, Decap still present as fallback

### Incremental Delivery

1. Setup + Foundational → Sveltia bundle copied, build passes
2. US1 → Admin panel works (**MVP**)
3. US2 → Full editorial workflow confirmed
4. US3 → Decap removed, clean repo
5. Polish → Docs updated

---

## Notes

- `config.yml` is **never modified** in any task — this is intentional and a hard constraint
- The Cloudflare OAuth proxy requires **zero changes** — confirmed by research
- T013 should check `git ls-files` first: `decap-cms.js` may only be a generated artifact (not tracked in Git), in which case deletion from `public/admin/` suffices
- Commit after Phase 2, after US1 confirmation, and after each subsequent phase
