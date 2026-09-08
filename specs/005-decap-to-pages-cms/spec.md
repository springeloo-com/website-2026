# Feature Specification: Migrate from Decap CMS to Pages CMS

**Feature Branch**: `005-decap-to-pages-cms`

**Created**: 2026-08-19

**Status**: Draft

**Input**: Remove Decap CMS and replace with Pages CMS following docs/howto-decap2pages.md

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Editor edits content via Pages CMS (Priority: P1)

A content editor opens [app.pagescms.org](https://app.pagescms.org), signs in with their GitHub account, navigates to the Springeloo repository, and can edit all previously Decap-editable fields: Home copy and hero image, Produkte copy and images, and Globals (nav labels, footer, contact). They save a change and it produces a Git commit/PR exactly as Decap did.

**Why this priority**: This is the entire point of the migration. Until an editor can successfully save a content change through Pages CMS the feature delivers no value.

**Independent Test**: Open app.pagescms.org, connect the repo, edit the Home hero headline, save — verify a PR or commit appears on the repo with the expected YAML change.

**Acceptance Scenarios**:

1. **Given** `.pages.yml` exists on the default branch and the editor's GitHub account has write access, **When** the editor opens app.pagescms.org and authenticates, **Then** the Springeloo repository is listed and they can open the admin panel without additional OAuth proxy setup.
2. **Given** the editor is inside the Pages CMS admin panel, **When** they navigate to "Home page", **Then** all previously Decap-editable fields are present (SEO, hero, Leistungen cards with their images).
3. **Given** the editor is inside the Pages CMS admin panel, **When** they navigate to "Produkte page", **Then** all Produkte fields are present (intro, lead, slider slides, product blocks, OSS, CTA).
4. **Given** the editor changes any text field and saves, **Then** a Git commit or PR is created on the repository reflecting the YAML change, and the static build is triggered.

---

### User Story 2 — Editor uploads a media file via Pages CMS (Priority: P2)

An editor replaces a hero image by uploading a new file through the Pages CMS media panel. The resulting image path resolves correctly in the Astro build, matching the same `/uploads/…` path convention used today.

**Why this priority**: Images are a core content type. If uploads are broken, editors are blocked from a large class of changes.

**Independent Test**: Upload a `.jpg` via the Pages CMS media widget, save, rebuild the site — confirm the image appears at the expected `/uploads/` path.

**Acceptance Scenarios**:

1. **Given** the `.pages.yml` `media` config points to `public/uploads` / output `/uploads`, **When** an editor uploads an image via the media panel, **Then** the file is committed to `public/uploads/` and the YAML field stores a path beginning with `/uploads/`.
2. **Given** a new image path is committed, **When** `npm run build` runs on the resulting branch, **Then** the build succeeds and the image is served from the expected URL.

---

### User Story 3 — Legacy Decap admin is removed from the repository (Priority: P3)

After Pages CMS is verified, the old Decap admin bundle (`public/admin/index.html`, `public/admin/config.yml`, `public/admin/decap-cms.js`) and the Cloudflare OAuth proxy dependency are removed from the repo and build scripts. No `/admin` route is served from the static site anymore.

**Why this priority**: Clean-up removes dead code, reduces the bundle, and eliminates the maintenance burden of the OAuth proxy. It is safe to defer until editing is confirmed working.

**Independent Test**: After deletion, `npm run build` succeeds, no `/admin` directory appears in `dist/`, and the `prebuild` script that copies `decap-cms.js` is removed or disabled.

**Acceptance Scenarios**:

1. **Given** the Decap admin files are deleted, **When** `npm run build` runs, **Then** the build succeeds without errors and produces no `/admin/` directory in `dist/`.
2. **Given** the `scripts/copy-decap.mjs` prebuild script exists, **When** it is removed or bypassed, **Then** no Decap bundle is copied during build.
3. **Given** the `package.json` `prebuild` script references `copy-decap.mjs`, **When** that reference is removed, **Then** `npm run build` no longer attempts to copy the bundle.

---

### Edge Cases

- What happens if an editor's GitHub account does not have write access to the repo? Pages CMS should refuse to connect or show a clear error — the same constraint as Decap.
- What happens to the Cloudflare Worker OAuth proxy after migration? It should be kept alive temporarily but can be decommissioned once Pages CMS editing is confirmed working for all editors.
- What if `.pages.yml` contains a field that Pages CMS does not support (e.g., `hidden` widget)? Field mapping must be reviewed; unsupported widgets must be replaced with supported alternatives or removed for developer-only fields.
- What happens to content already in `src/content/pages/home.yaml`, `produkte.yaml`, and `globals.yaml`? No migration needed — files stay exactly as they are; only the admin config and UI change.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A `.pages.yml` file MUST exist in the repository root and correctly describe all editable collections previously defined in `public/admin/config.yml`.
- **FR-002**: The `.pages.yml` media configuration MUST map to `public/uploads` (input) and `/uploads` (output) so existing image paths remain valid.
- **FR-003**: All three content surfaces — Globals, Home page, Produkte page — MUST be editable via Pages CMS with field parity to the current Decap config.
- **FR-004**: Developer-only fields (`id`, `href`, `startIndex`) MUST remain non-editable; they should be omitted from `.pages.yml` or set as read-only so editors cannot accidentally change them.
- **FR-005**: Editors MUST be able to authenticate to Pages CMS using only their GitHub account — no external OAuth proxy or Cloudflare Worker required.
- **FR-006**: After authentication, Pages CMS MUST auto-detect `.pages.yml` from the default branch and load the admin panel.
- **FR-007**: A save action in Pages CMS MUST produce a Git commit or pull request on the repository, triggering the existing GitHub Actions build pipeline.
- **FR-008**: The legacy Decap admin directory (`public/admin/`) MUST be removed from the repository once Pages CMS editing is verified.
- **FR-009**: The `prebuild` npm script that copies the Decap bundle (`scripts/copy-decap.mjs`) MUST be removed or disabled after the Decap files are deleted.
- **FR-010**: The site MUST continue to build successfully (`npm run build`) throughout the migration and after clean-up.

### Key Entities

- **`.pages.yml`**: Root-level Pages CMS configuration file. Replaces `public/admin/config.yml`. Describes media paths and all editable content collections.
- **Content YAML files**: `src/content/site/globals.yaml`, `src/content/pages/home.yaml`, `src/content/pages/produkte.yaml`. Unchanged by this migration — same files, same paths, same Astro build consumption.
- **GitHub App / OAuth**: Pages CMS authenticates editors directly via GitHub without an external proxy. No Cloudflare Worker needed post-migration.
- **Decap admin bundle**: `public/admin/index.html`, `public/admin/config.yml`, `public/admin/decap-cms.js`. Deleted at the end of the migration.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An editor with GitHub write access can sign into Pages CMS, navigate to any of the three content surfaces (Globals, Home, Produkte), change a field, and save — all within 5 minutes and without any developer intervention.
- **SC-002**: All fields editable in the current Decap admin are present and editable in Pages CMS (100% field parity for in-scope editor fields).
- **SC-003**: Uploading an image via Pages CMS produces a file in `public/uploads/` and a path beginning with `/uploads/` in the YAML — identical behavior to Decap.
- **SC-004**: `npm run build` succeeds with zero errors after `.pages.yml` is added and after the Decap files are removed.
- **SC-005**: No `/admin/` directory appears in `dist/` after the legacy Decap files are removed.
- **SC-006**: Zero dependency on the Cloudflare OAuth proxy for new editor logins after migration is complete.
- **SC-007**: The existing GitHub Actions build pipeline fires on every Pages CMS save/commit without any pipeline changes.

---

## Assumptions

- Content YAML files (`home.yaml`, `produkte.yaml`, `globals.yaml`) are unchanged by this migration. All content stays in Git; only the admin UI and config format change.
- Pages CMS supports a `files`-style (single-file) collection pattern equivalent to Decap's `files` collections — required for the single-YAML-per-page approach used by this project.
- Pages CMS field types cover all required widgets: `text`, `string`, `rich-text`, `image`, `object`, `list`, `number`. The Decap `hidden` widget (developer-only fields) has no direct Pages CMS equivalent and those fields will be omitted from `.pages.yml`.
- The editorial workflow (PR-based merging before production update) is preserved because Pages CMS also produces Git commits; the existing `main`-branch-protection rules remain unchanged.
- The Cloudflare Worker OAuth proxy (`springeloo-decap-oauth.mf-7e0.workers.dev`) can be decommissioned after migration is confirmed but does not need to be removed before editing is verified.
- `docs/howto-decap2pages.md` is the authoritative migration reference for this project.
- The `scripts/copy-decap.mjs` prebuild script and the `decap-cms` npm package are removed as part of clean-up (P3).
