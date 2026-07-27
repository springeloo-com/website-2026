# Feature Specification: Migrate Content Editing to Decap CMS

**Feature Branch**: `003-decap-cms-migration`

**Created**: 2026-07-27

**Status**: Ready for planning

**Input**: User description: "PRD from docs/iter3.md — Replace CloudCannon with Decap CMS so Springeloo content editing stays Git-based, open source, self-hosted/vendor-independent, while preserving the Astro static site layout, design system, and publishing workflow."

## Clarifications

### Session 2026-07-27

- Q: Which auth method for Decap admin access? → A: GitHub OAuth (Decap GitHub
  backend); editors authenticate with GitHub.
- Q: Where should media uploads go? → A: Shared folder — reuse `public/uploads/`.
- Q: Are multilingual content edits required? → A: German only; multilingual
  editing is out of scope for this migration.
- Q: How do Decap saves reach production? → A: Content branch + pull request;
  only maintainers merge to `main` (same review discipline as feature 002).
- Q: Who counts as an approved Decap editor? → A: GitHub collaborators with
  **write** access; `main` stays protected so editors cannot merge to production.
- Q: What happens to CloudCannon artifacts after Decap is live? → A: Remove
  CloudCannon config from the editorial path and replace how-tos with Decap
  documentation (no dual-editor transition).
- Q: How rich may body fields be in Decap? → A: Bodies = full Markdown
  (lists/headings allowed); headings, CTA labels, and SEO = plain text — same
  rule as feature 002.
- Q: Home Leistungen card cardinality in Decap? → A: Fixed exactly **three**
  cards (edit fields only; no add/remove) — same as feature 002.

## Context

Feature `002-cloudcannon-editing` already delivered Git-file content (`src/content/`)
and a CloudCannon-based editorial path for home + globals. This feature
**replaces CloudCannon** with **Decap CMS** so editors keep a browser UI without
a proprietary SaaS CMS dependency. Public pages remain static; the repository
stays the source of truth.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Edit text through Decap (Priority: P1)

A content editor opens the Decap admin UI, updates approved headline or body
copy, saves, and the change is committed to Git; after the normal publish path,
the live site shows the new text — without CloudCannon and without editing code.

**Why this priority**: Proves Decap replaces CloudCannon for the most common
editorial task and satisfies the minimum acceptance bar (hero/footer-class copy).

**Independent Test**: Change one in-scope heading via Decap; confirm a Git
commit exists and the rendered site shows the new text after publish/merge.

**Acceptance Scenarios**:

1. **Given** an approved editor is signed into Decap, **When** they change an
   in-scope text field and save, **Then** the change is committed on the
   configured **content branch** and a pull request to `main` is opened or
   updated (production is unchanged until merge).
2. **Given** a maintainer merges that PR to `main`, **When** a visitor opens
   the page after deploy, **Then** the new text appears in the approved layout
   position.
3. **Given** CloudCannon is no longer part of the editorial workflow, **When**
   an editor needs to change copy, **Then** they use Decap only (no CloudCannon
   required).
4. **Given** an editor has saved but the PR is not merged, **When** they check
   production, **Then** production still shows the previous copy.
---

### User Story 2 - Replace images through Decap (Priority: P2)

An editor replaces an approved image (e.g. hero) and sets alt text in Decap;
after publish, the live site shows the new image without layout breakage.

**Why this priority**: Image updates are a primary PRD acceptance criterion
alongside hero text and footer.

**Independent Test**: Replace one approved image + alt via Decap; confirm Git
includes the asset/path change and the live page renders correctly.

**Acceptance Scenarios**:

1. **Given** an editor replaces an in-scope image and provides alt text,
   **When** they save, **Then** the repository records the media/path update.
2. **Given** the change is published, **When** the page is viewed on desktop
   and mobile, **Then** the image appears in the approved container without
   breaking layout.

---

### User Story 3 - Preserve layout and Git review control (Priority: P3)

Developers keep layout and design tokens protected; editors cannot use a
page-builder to restructure the site; content remains reviewable in Git.

**Why this priority**: Protects design fidelity and ownership goals while
removing SaaS lock-in.

**Independent Test**: Confirm Decap exposes only approved fields; confirm
layout/CSS are not editor-controlled; confirm commits are visible in Git
history.

**Acceptance Scenarios**:

1. **Given** an editor uses Decap, **When** they look for layout, spacing, or
   drag-and-drop page building, **Then** those controls are not available.
2. **Given** content is saved from Decap, **When** a maintainer reviews Git,
   **Then** the change appears as a content-branch commit and PR to `main`.
3. **Given** the migration is complete, **When** checking editorial tooling,
   **Then** no CloudCannon dependency remains in the day-to-day edit workflow.
4. **Given** an editor, **When** they attempt to merge the content PR to
   `main`, **Then** they cannot; a maintainer must merge.
---

### User Story 4 - Self-hosted / vendor-independent admin access (Priority: P4)

Site owners and editors can access Decap without relying on CloudCannon; admin
authentication follows the chosen method so access stays under team control.

**Why this priority**: Core motivation of the PRD (leave proprietary CMS SaaS).

**Independent Test**: Sign in with the chosen auth method; complete a small
edit; confirm no CloudCannon account is required.

**Acceptance Scenarios**:

1. **Given** an approved editor (GitHub write collaborator), **When** they open
   the Decap admin entry point and authenticate with GitHub OAuth, **Then**
   they reach the editorial UI.
2. **Given** a user without repository write access, **When** they attempt to
   access Decap admin or save content, **Then** they cannot publish edits.
3. **Given** an editor with write access, **When** they attempt to merge a
   content PR to `main`, **Then** branch protection prevents it.
---

### Edge Cases

- Failed auth or expired session must not leave partial unpublished corruption;
  editor can retry cleanly.
- Invalid/empty required fields must be blocked by Decap and/or build checks
  before production.
- Concurrent edits resolve via Git/PR conflict handling.
- Oversized images must not break approved containers.
- After migration, CloudCannon config is removed and docs point to Decap only;
  CloudCannon must not remain a required editor.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a Decap CMS browser UI for approved editors
  to change in-scope text and images without modifying component source.
- **FR-002**: System MUST persist Decap saves as Git commits on a dedicated
  **content branch** and open/update a **pull request to `main`**. Production
  updates only after a **developer/maintainer** merges the PR.
- **FR-003**: System MUST preserve the existing approved visual layout and
  design system; no page-builder layout editing.
- **FR-004**: System MUST support structured content where already modeled
  (home Leistungen cards / globals) via Decap collections/files configuration.
  Home Leistungen MUST remain **exactly three** fixed cards (no add/remove in
  Decap).
- **FR-017**: Build and/or Decap config MUST reject Leistungen card counts
  other than 3.
- **FR-005**: Editorial scope for this migration MUST cover at least hero text,
  one image field, and footer (or equivalent globals footer) text — matching
  PRD acceptance — and MUST migrate the existing feature-002 editable surfaces
  (home + globals).
- **FR-006**: System MUST **remove** CloudCannon from the day-to-day editorial
  workflow: delete (or stop shipping) `cloudcannon.config.yml` as a required
  editor config, and replace CloudCannon how-tos with Decap documentation. No
  parallel CloudCannon + Decap transition period.
- **FR-007**: Public site MUST remain static output suitable for the existing
  GitHub Pages publish path from `main`. Editors MUST NOT merge to `main`.
- **FR-008**: Editors MUST NOT modify layout, spacing, colors, or component
  structure through Decap.
- **FR-009**: CTA/nav **href** destinations MUST remain developer-controlled
  unless explicitly opened later (labels may stay editable where already so).
- **FR-010**: Admin authentication MUST use **GitHub OAuth** with the Decap
  **GitHub backend**. Approved editors authenticate with GitHub; unauthorized
  users MUST NOT be able to edit content.
- **FR-011**: Media uploads MUST write to the shared repository folder
  **`public/uploads/`** (same path family as feature 002).
- **FR-012**: Multilingual editing is **out of scope**; content remains
  **German only**.
- **FR-013**: Documentation MUST explain how editors open Decap, authenticate
  with GitHub, save to the content branch, and how maintainers merge to `main`.
  CloudCannon how-tos MUST be replaced (not left as the primary path).
- **FR-014**: Only a developer/maintainer MAY merge content PRs to `main`.
  Approved editors are GitHub collaborators with **write** access who
  authenticate via GitHub OAuth; they MUST NOT be able to merge to `main`
  (branch protection / role separation).
- **FR-016**: Where body fields exist in migrated content, Decap MUST expose a
  Markdown (or equivalent rich-text) widget; headings, CTA labels, and SEO MUST
  use plain-text widgets.

### Design & Visual Requirements *(mandatory for UI work)*

- **DR-001**: Migrated editable fields MUST map to existing approved page
  layouts; no redesign.
- **DR-002**: Repeated patterns continue via existing reusable components fed
  by content files.
- **DR-003**: Desktop/tablet/mobile behavior remains as already approved;
  editors get no breakpoint layout controls.
- **DR-004**: Replacement images use existing containers (object-fit/crop);
  uploads remain Git-reviewable.
- **DR-005**: Body fields (e.g. Leistungen card bodies) MUST allow full Markdown
  rich text (lists and headings). Headings, CTA labels, and SEO fields MUST
  remain plain text. Rendered rich text MUST inherit site styles only.

### Accessibility & SEO Requirements *(mandatory for pages)*

- **AR-001**: Edited pages MUST keep semantic structure, keyboard access,
  visible focus, and meaningful alt text for replaced images.
- **AR-002**: Where SEO title/description fields exist in content, they remain
  editable as plain text and aligned with on-page messaging.

### Key Entities

- **DecapConfig**: Editorial configuration defining files/collections, fields,
  media folder, and backend/auth settings.
- **GlobalContent / HomeContent**: Existing Git content entities migrated to
  Decap; home Leistungen remain a fixed three-card structure.
- **ContentImage**: Image path + alt text.
- **EditorialChange**: Git commit created from a Decap save.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An approved editor can update hero text, one image, and footer (or
  globals footer) text via Decap in under 15 minutes without a developer.
- **SC-002**: 100% of sample Decap edits appear in Git as content-branch
  commits with a PR path to `main`.
- **SC-008**: Editors cannot merge content PRs to `main`; only
  developer/maintainer merge updates production.
- **SC-003**: After publish/merge, the live site shows those edits correctly on
  desktop and mobile without layout breaks for normal content.
- **SC-004**: Editors can complete a full edit cycle without any CloudCannon
  account or CloudCannon UI.
- **SC-005**: Unauthorized users cannot modify content through the Decap admin
  entry point.
- **SC-006**: Accessibility/SEO baselines (alt text, metadata where exposed)
  remain satisfied on edited pages.
- **SC-007**: Small team can follow a short how-to for Decap edit → Git →
  production without SaaS CMS dependency.

## Assumptions

- Feature-002 content files and Astro loaders on `main` are the migration
  baseline (home + globals at minimum).
- German is the only language.
- Decap uses GitHub OAuth; approved editors are collaborators with **write**
  access; `main` is protected from editor merges.
- Body fields use full Markdown; headings/CTAs/SEO stay plain text (aligned with
  feature 002).
- Media uploads go to `public/uploads/`.
- No database CMS; no WordPress; no Bookshop-style page builder.
- GitHub Pages (or equivalent static hosting) remains the public delivery path.
- Publish discipline: content branch + PR; only maintainers merge to `main`
  (same as feature 002).
- Home Leistungen stay fixed at three cards in Decap (no add/remove).
- Expanding editable surfaces beyond home + globals is out of this migration
  unless a later feature expands scope; minimum PRD acceptance is covered by
  home hero/image + globals footer.

## Out of Scope

- Visual redesign or rebranding
- Database-backed or proprietary hosted CMS
- Page-builder arbitrary layout editing
- Ecommerce, accounts, or live form lead automation
- Keeping CloudCannon as a required editor or running dual editors in parallel
- Changing home Leistungen cardinality away from fixed three
- Archiving unused CloudCannon config as an ongoing supported path (config is removed)
- Multilingual site structure or locale switching
- Netlify Identity / Git Gateway auth (not selected)
- Per-section media folder trees (shared `public/uploads/` selected)
