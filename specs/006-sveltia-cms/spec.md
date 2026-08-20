# Feature Specification: Replace Decap CMS with Sveltia CMS

**Feature Branch**: `006-sveltia-cms`

**Created**: 2026-08-19

**Status**: Draft

**Input**: Remove Decap CMS and implement Sveltia CMS as the editorial admin interface.

---

## Clarifications

### Session 2026-08-19

- Q: Rollback contingency if Sveltia CMS causes an editorial blocker after Decap removal — what is the recovery strategy? → A: Option A (revert via Git)

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Editor opens the admin panel powered by Sveltia CMS (Priority: P1)

A content editor navigates to `/admin/` on the deployed site (or `http://localhost:4321/admin/` locally), sees the Sveltia CMS login screen, authenticates with their GitHub account using the existing Cloudflare OAuth proxy, and accesses all editable collections — Globals, Home page, Produkte page — exactly as they did with Decap CMS.

**Why this priority**: The admin panel must work before any other editor activity is possible. If this fails, the migration delivers nothing.

**Independent Test**: Open `/admin/`, sign in with GitHub, confirm the Sveltia CMS UI loads and all three content surfaces are accessible.

**Acceptance Scenarios**:

1. **Given** the Sveltia CMS script is served from `/admin/sveltia-cms.js` and `config.yml` is unchanged, **When** an editor opens `/admin/index.html`, **Then** the Sveltia CMS interface loads (not the old Decap interface).
2. **Given** the editor authenticates via the existing Cloudflare OAuth proxy, **When** they log in, **Then** they are granted access to the admin without any changes to the proxy configuration.
3. **Given** the editor is logged in, **When** they navigate to any of the three content collections (Globals, Home, Produkte), **Then** all fields and labels match what was available in Decap CMS.

---

### User Story 2 — Editor saves a content change and it reaches the repository (Priority: P2)

An editor makes a text or image change inside Sveltia CMS and saves. The change produces a Git commit or pull request on the `springeloo-com/website-2026` repository — triggering the existing GitHub Pages build pipeline — with no change to how maintainers review and merge.

**Why this priority**: The editorial workflow (PR-based publishing) must be preserved. This is the contract with content editors.

**Independent Test**: Change the Home hero headline in Sveltia CMS, save — verify a PR or branch commit appears in the repository with the expected YAML diff.

**Acceptance Scenarios**:

1. **Given** `publish_mode: editorial_workflow` remains in `config.yml`, **When** an editor saves a change, **Then** Sveltia CMS creates a branch and a pull request toward `main`, exactly as Decap did.
2. **Given** a PR is created from a Sveltia CMS save, **When** a maintainer merges it, **Then** the GitHub Actions build pipeline fires and the updated static site is deployed to GitHub Pages.
3. **Given** an editor uploads an image via the media panel, **When** they save, **Then** the file appears in `public/uploads/` and the YAML field stores a path beginning with `/uploads/`.

---

### User Story 3 — Legacy Decap bundle is removed from the repository (Priority: P3)

After Sveltia CMS is confirmed working, the old Decap CMS JavaScript bundle (`public/admin/decap-cms.js`) and the build script that copies it (`scripts/copy-decap.mjs`) are removed. The `npm run build` output no longer includes the Decap bundle.

**Why this priority**: Clean-up eliminates a large unnecessary asset (~3 MB) and the maintenance overhead of keeping the prebuild copy script. It is safe to defer until editing is verified.

**Independent Test**: After removal, `npm run build` succeeds, `dist/admin/decap-cms.js` does not exist, and the `prebuild` npm script no longer references `copy-decap.mjs`.

**Acceptance Scenarios**:

1. **Given** `decap-cms.js` and `copy-decap.mjs` are removed, **When** `npm run build` runs, **Then** the build succeeds without errors and produces no `decap-cms.js` in `dist/admin/`.
2. **Given** the `package.json` `prebuild` script references `copy-decap.mjs`, **When** that reference is removed, **Then** `npm run build` completes successfully without attempting to copy a Decap bundle.
3. **Given** `admin/index.html` now loads only the Sveltia CMS script, **When** a browser opens `/admin/`, **Then** only Sveltia CMS assets are downloaded (no Decap bundle network request).
4. **Given** Decap has been removed from `main`, **When** an editorial blocker is reported in production after the migration, **Then** maintainers recover by reverting the Decap-removal PR via standard Git revert, so Decap assets return in the next merged PR.

---

### Edge Cases

- What if the existing Cloudflare OAuth proxy (`springeloo-decap-oauth.mf-7e0.workers.dev`) is incompatible with Sveltia CMS? Sveltia CMS explicitly supports third-party OAuth proxies built for Decap CMS without modification — the proxy can be reused as-is.
- What happens to editors who still have an active Decap CMS auth token in their browser? Sveltia CMS reuses existing GitHub auth tokens stored in the browser — no re-login required for most editors.
- What if `config.yml` contains any Decap-specific config keys that Sveltia CMS ignores or rejects? Sveltia CMS is highly backward-compatible; unknown keys are silently ignored. The existing config needs no changes beyond the script tag swap.
- What if the `local_backend` option is used in local development? Sveltia CMS does not support `local_backend` / `decap-server`. If that option is present it must be removed or guarded; local editing goes through GitHub directly.
- If rollback is required after Decap is removed, the recovery strategy is to revert the Decap-removal PR on `main` via standard Git revert; Decap assets are restored by the subsequent merged revert PR.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The `/admin/index.html` file MUST load the Sveltia CMS JavaScript bundle instead of the Decap CMS bundle.
- **FR-002**: The Sveltia CMS bundle MUST be served from the static site without requiring an external CDN at runtime (consistent with how Decap was bundled locally via `copy-decap.mjs`).
- **FR-003**: The existing `public/admin/config.yml` MUST remain unchanged — Sveltia CMS MUST work with the current collection and field definitions without requiring a config rewrite.
- **FR-004**: Editor authentication MUST continue to work via the existing Cloudflare OAuth proxy (`base_url` in `config.yml`) — no proxy reconfiguration required.
- **FR-005**: All three content surfaces — Globals, Home page, Produkte page — MUST be fully editable in Sveltia CMS with no loss of fields or labels compared to Decap CMS.
- **FR-006**: Image uploads MUST continue to be stored in `public/uploads/` and referenced in YAML with `/uploads/…` paths, unchanged from today.
- **FR-007**: The editorial workflow (PR-based saving, `publish_mode: editorial_workflow`) MUST be preserved so content changes arrive as pull requests to `main`.
- **FR-008**: After Sveltia CMS editing is confirmed working, the Decap CMS bundle (`public/admin/decap-cms.js`) MUST be deleted from the repository.
- **FR-009**: After the Decap bundle is deleted, the prebuild copy script (`scripts/copy-decap.mjs`) and its reference in `package.json` `prebuild` MUST be removed.
- **FR-010**: `npm run build` MUST succeed throughout — before the swap, during, and after clean-up.

### Key Entities

- **Sveltia CMS bundle**: The JavaScript bundle (`@sveltia/cms`) that powers the admin UI. Replaces the Decap bundle. Served from `/admin/sveltia-cms.js` (or equivalent static path).
- **`public/admin/index.html`**: The admin entry point. Only the `<script>` tag source changes — everything else stays the same.
- **`public/admin/config.yml`**: The CMS field/collection configuration. **Unchanged** by this migration.
- **`scripts/copy-decap.mjs`**: The prebuild script that copied the Decap bundle. Removed at clean-up (P3).
- **Content YAML files**: `src/content/site/globals.yaml`, `src/content/pages/home.yaml`, `src/content/pages/produkte.yaml`. Entirely unchanged.
- **Cloudflare OAuth proxy**: `springeloo-decap-oauth.mf-7e0.workers.dev`. Reused as-is; no changes required.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An editor can open `/admin/`, authenticate, and reach any of the three content collections within 2 minutes — identical experience to Decap CMS, with visibly faster UI rendering.
- **SC-002**: 100% of fields editable in Decap CMS are present and editable in Sveltia CMS (no regression in field parity).
- **SC-003**: A content save in Sveltia CMS produces a pull request on `springeloo-com/website-2026` within 30 seconds, triggering the GitHub Actions build pipeline — same as Decap.
- **SC-004**: `npm run build` succeeds with zero errors at every stage: after the bundle swap, and after the Decap clean-up.
- **SC-005**: After clean-up, `dist/admin/` contains no Decap CMS bundle — reducing the admin asset footprint.
- **SC-006**: Zero changes are required to `public/admin/config.yml` — the migration is a drop-in bundle swap, not a config rewrite.
- **SC-007**: The existing Cloudflare OAuth proxy continues to authenticate editors without any proxy-side changes.

---

## Assumptions

- Sveltia CMS is a drop-in successor to Decap CMS: the same `config.yml` format and GitHub OAuth proxy are compatible without modification. This is confirmed by Sveltia CMS documentation.
- The Sveltia CMS JavaScript bundle will be copied into `public/admin/` at build time via a new `copy-sveltia.mjs` script (replacing `copy-decap.mjs`) — keeping the same self-hosted, no-external-CDN approach.
- `publish_mode: editorial_workflow` is supported by Sveltia CMS and produces the same PR workflow as Decap CMS.
- The `decap-cms` npm package is replaced by the `@sveltia/cms` npm package. No other npm dependencies change.
- The `local_backend` option (if present) must be removed; Sveltia CMS has a different local development approach but local editing is not part of the current team workflow.
- Content YAML files, Astro pages, and all build/deploy infrastructure remain unchanged by this migration.
- The Cloudflare Worker OAuth proxy built for Decap CMS is explicitly compatible with Sveltia CMS (documented by Sveltia CMS).
