# Feature Specification: CloudCannon Editable Content

**Feature Branch**: `002-cloudcannon-editing`

**Created**: 2026-07-27

**Status**: Ready for planning

**Input**: User description: "PRD: Editable Content in CloudCannon for Springeloo — allow non-developers to update text, images, and content sections on the static corporate site without modifying code, via CloudCannon as the visual editing layer on a Git-based workflow, without redesign, page builder, or traditional CMS/backend."

## Clarifications

### Session 2026-07-27

- Q: Which page & section is the v1 “main content section”? → A: Home only: the post-hero content cards section (Leistungen / three cards)
- Q: How should editor saves reach production? → A: Save to a content branch + pull request; merge to `main` publishes
- Q: Are home hero CTA button labels editable in v1? → A: Yes — hero CTAs plus card CTA/link labels in Leistungen
- Q: How rich may body/heading text be? → A: Full rich text including lists and headings inside body fields
- Q: Who may merge content pull requests to `main`? → A: Only a developer/maintainer may merge content PRs

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Update headline and body copy (Priority: P1)

A marketing manager opens the visual editor, changes a hero headline and a
section body paragraph on a published page, saves, and sees the new wording on
the live (or preview) site — without opening code files.

**Why this priority**: Copy updates are the most frequent post-launch need and
prove the editing workflow delivers value immediately.

**Independent Test**: Change one approved heading and one paragraph in the
editor; confirm the rendered page shows the new text and layout spacing/type
scale are unchanged.

**Acceptance Scenarios**:

1. **Given** an editor is signed into the content editor on an in-scope page,
   **When** they change an approved heading and save, **Then** the published or
   preview site shows the new heading in the same layout position.
2. **Given** an editor changes body text in an approved region, **When** the
   change is saved and synced, **Then** a content-branch commit and pull
   request exist; after merge to `main`, the live site shows the update.
3. **Given** an editor views the page after a text change, **When** they check
   desktop and mobile widths, **Then** typography and spacing still follow the
   approved design (no broken overflow from normal-length copy).
4. **Given** an editor has saved but the pull request is not yet merged,
   **When** they check production, **Then** production still shows the previous
   copy (pending review).
5. **Given** a content pull request is open, **When** an editor attempts to
   publish to production alone, **Then** they cannot merge to `main` — a
   developer/maintainer must merge.

---

### User Story 2 - Replace hero and section images (Priority: P2)

An editor replaces an approved hero or section image with a new asset, provides
or confirms alternative text where required, and the page shows the new image
without layout breakage.

**Why this priority**: Imagery goes stale; safe image swap is the second most
common editorial need after copy.

**Independent Test**: Swap one approved image field; confirm the new image
renders, alt text remains meaningful, and breakpoints still look correct.

**Acceptance Scenarios**:

1. **Given** an approved image field (hero or section), **When** the editor
   uploads a replacement and saves, **Then** the site displays the new image in
   that field only.
2. **Given** a meaningful image is replaced, **When** the page is checked for
   accessibility, **Then** alternative text is present and appropriate (editor
   can edit alt where exposed).
3. **Given** an oversized or oddly proportioned upload, **When** the page
   renders, **Then** the layout container still matches the approved design
   proportions (image is cropped/fitted within the field, not expanding the
   page structure).

---

### User Story 3 - Edit structured content blocks (Priority: P3)

An editor updates items in the home Leistungen content-cards section —
changing card titles, short descriptions, and link/CTA labels — within the
three fixed slots only (no adding or removing cards).

**Why this priority**: Structured blocks keep messaging current but depend on a
clear content model so editors cannot invent new layouts.

**Independent Test**: Edit one of the three home content cards’ text, link
label (and image if exposed); confirm all three cards still render in the
designed pattern.

**Acceptance Scenarios**:

1. **Given** the home Leistungen cards section is editable, **When** the editor
   changes a card’s title, body, and link/CTA label, **Then** the site shows
   the updated card in the same visual pattern.
2. **Given** the three card slots are fixed, **When** the editor opens the
   editor, **Then** they can change text/images/CTA labels for existing slots
   but cannot add or remove cards.
3. **Given** structured content is saved, **When** a developer reviews Git,
   **Then** the change is visible as a normal content revision.

---

### User Story 4 - Keep layout developer-controlled (Priority: P4)

A developer confirms that editors cannot change spacing, component structure, or
unapproved regions; only explicitly exposed fields are editable. Structural
layout changes still require a developer update.

**Why this priority**: Protects the approved Figma-derived design and prevents
accidental redesign via the editor.

**Independent Test**: Attempt to edit a non-exposed control; confirm it is
unavailable. Change only exposed fields and verify design tokens/layout hold.

**Acceptance Scenarios**:

1. **Given** the editor opens a page, **When** they look for layout/spacing
   controls, **Then** those controls are not available unless a developer
   explicitly exposed them.
2. **Given** content in exposed fields is changed, **When** the page is viewed
   at desktop, tablet, and mobile sizes, **Then** the layout remains stable and
   aligned with the approved design system.

---

### Edge Cases

- Empty required text field: editor is warned; site MUST NOT publish blank
  critical headings without a clear validation message.
- Extremely long or heavily nested rich text: layout MUST NOT permanently
  break; overflow is contained within the region and PR review is used to catch
  design regressions before merge to `main`.
- Rich text that introduces extra heading levels: document outline SHOULD remain
  sensible; reviewers MUST check heading order before merge.
- Missing image after failed upload: previous image remains or a defined
  placeholder is shown — page MUST stay usable.
- Concurrent edits: last successful sync to the content branch wins; conflicts
  surface through the pull-request / Git review workflow before merge to `main`.
- Editor opens a developer-only region: no edit affordance is shown.
- Sync delay: editor sees clear saved/pending-review/published state so they
  know when production should reflect the change (published only after `main`
  merge).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Non-technical editors MUST be able to change approved heading and
  body text without editing source code. Headings MUST be plain single-line
  text. Body fields MUST support full rich text including lists and in-body
  headings, while remaining inside the approved layout region.
- **FR-017**: Rich-text body content MUST NOT allow editors to change page-level
  layout, spacing, or design tokens; rendering MUST use site styles so visual
  hierarchy stays within the approved design system.
- **FR-002**: Editors MUST be able to replace approved image fields (including
  hero and section imagery) without editing source code.
- **FR-003**: Editors MUST be able to update call-to-action labels in the home
  hero and in the home Leistungen content cards (including card link labels).
  CTA destination URLs remain developer-controlled unless explicitly exposed
  later.
- **FR-004**: Editors MUST be able to update navigation labels in approved
  regions without changing destination structure unless a developer exposes
  link targets.
- **FR-005**: On the home page post-hero content cards section (Leistungen /
  three cards), editors MUST be able to edit each fixed card slot’s title,
  body, optional image, and link/CTA label. Editors MUST NOT add or remove
  cards in this release. Broader services/testimonial collections on other
  pages/sections remain developer-controlled until explicitly exposed later.
- **FR-006**: Editors MUST be able to update footer text and contact details via
  shared global fields.
- **FR-007**: Editors MUST be able to update page metadata fields where exposed
  (title/description) without changing layout.
- **FR-008**: Layout, spacing, and component structure MUST remain controlled by
  developers; editors MUST only change content within approved editable
  regions and image fields.
- **FR-009**: Content edits MUST sync to the Git repository so changes are
  versioned and reviewable. Editor saves MUST land on a dedicated content
  branch and open a pull request; production publish MUST occur only after
  merge to `main`. Only a developer or designated maintainer MAY merge content
  pull requests to `main`; editors MUST NOT self-merge to production.
- **FR-010**: The editing experience MUST be understandable for non-technical
  users (clear field labels, page context, save/publish feedback). Editors MUST
  see that a change is pending review until the pull request is merged.
- **FR-011**: The content model MUST support extending the same editing
  workflow to additional pages later without inventing a new editorial process.
- **FR-012**: First-release editable page regions MUST be limited to: home hero
  (headline, supporting text, image, CTA labels), navigation labels (global),
  the home Leistungen content cards (titles, body, optional images, link/CTA
  labels — three fixed cards), and footer (global). All other pages’ section
  bodies remain developer-controlled in this release unless reached via those
  globals.
- **FR-013**: Editors MUST manage both per-page home content (hero and
  Leistungen cards, plus page metadata where exposed) and shared globals
  (navigation labels, footer text, contact details).
- **FR-014**: The site MUST remain a static public website after edits (no
  database-backed traditional CMS, no page-builder arbitrary layouts, no
  e-commerce/accounts/lead-capture automation).
- **FR-015**: Multilingual editing is out of scope for this release; content
  remains the single site language already in use (German).
- **FR-016**: Navigation destination URLs MUST remain developer-controlled in
  v1; editors change labels only (see FR-004).

### Design & Visual Requirements *(mandatory for UI work)*

- **DR-001**: After content edits, pages MUST still match the approved layout,
  typography, spacing, and color system at desktop, tablet, and mobile
  breakpoints.
- **DR-002**: Editable regions MUST map to existing reusable section/component
  patterns — not new freeform layouts.
- **DR-003**: Image fields MUST keep designed aspect/crop behavior so swaps do
  not redesign the composition.
- **DR-005**: Rich-text body fields MUST render with site typography styles;
  editors MUST NOT pick arbitrary fonts, colors, or spacing that bypass design
  tokens.

### Accessibility & SEO Requirements *(mandatory for pages)*

- **AR-001**: Editable title/CTA fields MUST remain real text (not image-only).
  Body rich text MUST remain semantic HTML text (not image-only). Image fields
  MUST retain meaningful alternative text editable where the image is
  meaningful.
- **AR-002**: Where metadata fields are exposed, unique page title and
  description MUST remain available; after rich-text body edits, heading order
  on the page MUST remain valid (verified in PR review before publish).

### Key Entities

- **Editable region**: A named content field bound to a specific place in the
  approved layout. Title/CTA fields are plain text; body fields may be full
  rich text (lists and in-body headings allowed).
- **Image field**: An approved media slot with constraints (usage, alt text).
- **Structured block**: A repeating or fixed set of items (e.g. service card,
  testimonial) with defined fields.
- **Global content**: Shared site values (navigation labels, footer, contact)
  used across pages — included in v1 and editable by editors.
- **Content revision**: A Git-tracked change on a content branch (via pull
  request) produced by an editorial save; production updates after merge to
  `main`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A non-technical editor can update at least one heading and one
  image on an in-scope page in under 10 minutes without developer help.
- **SC-002**: After representative content edits, visual review finds no major
  layout regressions at desktop, tablet, and mobile versus the approved design.
- **SC-003**: 100% of editor saves that affect site content produce a
  reviewable Git revision on a content branch (pull request); production
  reflects the change only after a developer/maintainer merges to `main`.
- **SC-008**: Editors cannot merge content pull requests to `main` (verified by
  role walkthrough: merge permission limited to developer/maintainer).
- **SC-004**: Editors cannot change layout/spacing for non-exposed controls
  (verified by walkthrough: zero layout controls available outside the approved
  field set).
- **SC-005**: Editors can update the home hero (including CTA labels),
  navigation labels, home Leistungen content cards (including link/CTA labels),
  and footer (including shared contact details); other section bodies stay
  developer-controlled.
- **SC-006**: Developers can continue to maintain the site codebase without
  depending on a proprietary locked-in content database (Git remains source of
  truth for content files).
- **SC-007**: Accessibility/SEO baselines remain met after edits (real text,
  alt text on meaningful images, coherent headings/metadata where exposed).

## Assumptions

- CloudCannon is the approved visual editing layer for this feature; it is a
  Git-synced editorial workflow on the existing static site, not a
  WordPress-style database CMS or drag-and-drop page builder.
- The existing five-page Springeloo site and approved visual design remain the
  layout source of truth; this feature only adds an editing workflow.
- German-only content continues; no multilingual requirement in this release.
- Confirmed v1 editable regions: home hero, navigation (global), home
  Leistungen / three content cards, and footer (global) only.
- Confirmed v1 includes shared globals for navigation labels, footer text, and
  contact details alongside per-page home hero and Leistungen card fields.
- Confirmed structured items in Leistungen are three fixed card slots — edit in
  place only; no add/remove in this release.
- Confirmed publish path: editor saves → content branch + pull request →
  developer/maintainer merge to `main` publishes; editors cannot self-merge.
- Confirmed CTA label editing: home hero CTAs and Leistungen card link/CTA
  labels are editable; destination URLs stay developer-controlled.
- Confirmed text formatting: headings/CTAs plain; body fields full rich text
  (lists + in-body headings) styled by the site design system.
- Lead-capture automation, accounts, and e-commerce remain out of scope.
- Developers remain responsible for exposing new editable regions when layout
  structure changes.
