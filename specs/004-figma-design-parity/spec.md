# Feature Specification: Figma Design Parity (Multi-Breakpoint)

**Feature Branch**: `004-figma-design-parity`

**Created**: 2026-08-05

**Status**: Ready for planning

**Input**: User description: "Bring the live static site into 1:1 visual parity with the improved designer Figma that defines Desktop, Tablet hoch, Tablet quer, and Mobile frames. Keep GitHub Pages static hosting and Decap editorial for copy/images. Prefer a Figma-assisted coding workflow into the existing site (not plugin dump or Framer). Proceed: prep named frames → sync design tokens/breakpoints → home 1:1 with QA at four widths → subpages → preserve CMS boundary → repeatable cadence per design drop."

## Clarifications

### Session 2026-08-05

- Q: Which Figma file/version is the approved source of truth? → A: File
  **Springeloo | Webdesign** (`QLSDfzdupEsnPJ4WY528O5`), page
  `1969:37969`, with four named prototype starting frames:
  - Desktop — node `2108:58670`
  - Tablet quer — node `2108:58675`
  - Tablet hoch — node `2108:58680`
  - Mobile — node `2108:58686`
- Q: Which viewport widths define four-breakpoint visual QA? → A: Current
  tokens — Mobile 390, Tablet hoch 768, Tablet quer 1024, Desktop 1280
- Q: What is the delivery scope / release gate for this feature? → A: Home
  four-width parity is the release gate; secondary pages follow when frames
  exist and MUST NOT block home sign-off
- Q: When Figma copy/images differ from Decap, which wins? → A: Layout from
  Figma; Decap copy/images remain the live content source unless design
  introduces new editable fields
- Q: What counts as a severity-1 visual QA failure? → A: Wrong section order,
  alignment, spacing rhythm, type hierarchy, or major media placement;
  sub-pixel/anti-aliasing noise is out of scope
- Q: Who gives explicit homepage acceptance (SC-008)? → A: Designer visual OK
  plus stakeholder acceptance

## Context

The Springeloo public site already ships as a static marketing site with
Figma-derived visual tokens and named breakpoint intent, reusable page
sections, and Decap CMS for home/globals **copy and images only**. Layout
and responsive behavior remain engineering-owned.

A new designer Figma improves the design and defines **four** explicit
responsive frames. The goal of this feature is **faithful visual parity** at
those frames—not a hosting/platform change and not continuous automatic
Figma→production publishing.

Rejected approaches (out of scope): third-party Figma-to-website exporters as
the production site, and hosted visual builders that abandon the static Pages
+ Decap model.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Homepage matches all four Figma frames (Priority: P1)

A stakeholder opens the published homepage and, at each approved viewport
(Desktop, Tablet landscape, Tablet portrait, Mobile), sees layout, spacing,
typography, and imagery composition that match the corresponding Figma frame
for that page—without losing Decap’s ability to edit approved home text and
images.

**Why this priority**: Home is the primary brand surface and the first design
drop target; proving four-breakpoint parity here validates the whole process.

**Independent Test**: Side-by-side compare live (or preview) homepage against
the four named Figma frames; confirm Decap can still change an approved home
text field and publish via the existing editorial path.

**Acceptance Scenarios**:

1. **Given** the approved homepage Figma frames exist for all four breakpoints,
   **When** a reviewer inspects the homepage at each corresponding viewport,
   **Then** section order, alignment, spacing rhythm, type hierarchy, and
   major media placement match the frame (no improvised redesign); failures of
   those criteria are severity-1 and block sign-off.
2. **Given** Decap is available for approved home fields, **When** an editor
   updates in-scope copy or an image and the change is published, **Then** the
   new content appears in the updated layout without breaking the matched
   composition.
3. **Given** a visitor resizes or uses a device between named widths,
   **When** they view the homepage, **Then** layout transitions follow the
   nearest approved frames without broken overflow, clipped CTAs, or
   unusable navigation.

---

### User Story 2 - Design tokens and breakpoints stay consistent (Priority: P1)

A maintainer receives an updated Figma with Variables and named frames; after
the design-sync pass, the site uses one consistent set of colors, type,
spacing, and breakpoint behavior so components do not rely on one-off ad-hoc
widths that diverge from the four frame definitions.

**Why this priority**: Token and breakpoint consistency is the foundation for
repeatable 1:1 updates and prevents drift across pages.

**Independent Test**: Review the live site’s visual system against Figma
Variables and confirm responsive switches align with the four named frame
widths (no unexplained intermediate layout breakpoints that contradict the
design system).

**Acceptance Scenarios**:

1. **Given** Figma Variables for brand color, type, and spacing are approved,
   **When** pages are reviewed, **Then** those values are reflected consistently
   (no conflicting one-off palette or type scale on the homepage).
2. **Given** four named responsive frames, **When** the homepage is checked at
   those widths, **Then** layout changes occur according to those frame
   definitions rather than leftover inconsistent intermediate rules.
3. **Given** a later design drop updates Variables only, **When** the token
   sync step of the cadence is completed, **Then** the site reflects the new
   token values without requiring a full layout rewrite.

---

### User Story 3 - Remaining public pages reach parity (Priority: P2)

After homepage parity, a stakeholder reviews each remaining public marketing
route against its Figma frames (same four breakpoints where provided) and sees
matching layouts while shared chrome (header/footer/nav) stays consistent.

**Why this priority**: Completes site-wide visual truth; depends on the home
process and shared tokens proven in P1.

**Independent Test**: For each in-scope route that has Figma frames, run the
same four-width visual compare; spot-check shared header/footer consistency.

**Acceptance Scenarios**:

1. **Given** Figma frames exist for a secondary page, **When** that page is
   viewed at each provided breakpoint, **Then** it matches those frames.
2. **Given** a page has no new Figma yet, **When** work is planned, **Then** it
   remains unchanged until frames are supplied (no speculative redesign).
3. **Given** shared navigation/footer patterns, **When** pages are compared,
   **Then** chrome behavior matches across routes at the same breakpoint.

---

### User Story 4 - Repeatable design-drop cadence (Priority: P3)

When design delivers a new Figma drop, the team follows a known sequence:
prepare/name frames → sync tokens → update affected pages with assisted
design-to-code → visual QA at four widths → merge—without replacing Decap or
static hosting, and without expecting fully automatic Figma→live deploy.

**Why this priority**: Process durability matters after the first redesign
pass; not required to ship the first homepage parity release.

**Independent Test**: Walk a dry-run checklist for a hypothetical design drop
and confirm roles, steps, and CMS/layout boundaries are documented and agreed.

**Acceptance Scenarios**:

1. **Given** a new approved Figma drop, **When** the team starts work, **Then**
   they use the documented cadence (token sync before layout; QA at four
   widths before merge).
2. **Given** Decap remains the editor path for approved copy/images, **When**
   layout changes, **Then** editors are not required to edit layout code;
   layout stays engineering-owned.
3. **Given** continuous auto-publish from Figma is not supported, **When**
   stakeholders ask for “instant Figma sync,” **Then** the documented answer
   is the repeatable assisted cadence with human QA.

---

### Edge Cases

- Figma provides only a subset of the four frames for a page → implement and QA
  only supplied frames; do not invent missing breakpoints.
- Design changes structure (section added/removed) that affects Decap fields →
  expand or adjust editable fields only when copy/images must change; layout
  structure remains engineering-owned.
- Content longer than design placeholders (German copy overflow) → preserve
  readable wrapping and hierarchy without breaking the approved composition;
  flag extreme overflows for design follow-up.
- Figma shows different copy/images than Decap → keep Decap content; match
  Figma structure, spacing, type, and media placement around the live fields.
- Assets missing from the design package → block visual sign-off for affected
  sections until production-ready assets are provided.
- Tablet portrait vs landscape frames disagree with shared components → resolve
  in spec against Figma before coding; do not average arbitrarily.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The public homepage MUST visually match the approved Figma frames
  for Desktop, Tablet landscape (“Tablet quer”), Tablet portrait (“Tablet
  hoch”), and Mobile where those frames are provided.
- **FR-002**: Responsive layout switches for in-scope pages MUST be driven by
  the four named frame definitions at these acceptance viewport widths:
  Mobile **390px**, Tablet hoch **768px**, Tablet quer **1024px**, Desktop
  **1280px**; leftover inconsistent intermediate layout rules that contradict
  those frames MUST be removed or aligned.
- **FR-003**: Brand visual tokens (color, typography, spacing, and related
  system values from Figma Variables) MUST stay synchronized with the approved
  design system after each design-drop token step.
- **FR-004**: The site MUST remain a static public site deliverable on the
  existing GitHub Pages hosting model.
- **FR-005**: Decap editorial MUST continue to allow approved home/globals
  copy and image edits without requiring editors to change layout code. When
  Figma placeholder copy or imagery differs from Decap, Decap remains the
  live content source; implementation MUST match Figma layout/composition and
  MUST NOT overwrite Decap fields from Figma text unless a design change
  introduces a new editable copy/image field.
- **FR-006**: Layout, section composition, and responsive behavior MUST remain
  engineering-owned (not editable as free-form layout in the CMS).
- **FR-007**: Secondary public marketing pages MUST be brought to Figma parity
  only when corresponding frames exist; pages without frames MUST not be
  redesigned speculatively. Homepage four-width parity is the release gate for
  this feature; secondary-page parity is in-scope as follow-on work within the
  same feature when frames exist and MUST NOT block homepage sign-off.
- **FR-008**: Each design drop MUST follow a documented cadence: prepare named
  frames → token sync → page layout updates → four-width visual QA → merge.
- **FR-009**: Continuous automatic publish from Figma to production MUST NOT be
  required or promised; human review before merge is mandatory. Homepage
  sign-off MUST include designer visual OK and stakeholder acceptance
  (SC-008).
- **FR-010**: Third-party Figma-to-website exporters and hosted visual builders
  that replace static Pages + Decap MUST NOT become the production delivery
  path for this feature.
- **FR-011**: Production assets required by the Figma (images, icons, logos)
  MUST be identified and supplied before visual sign-off of affected sections.
- **FR-012**: The approved Figma source for this feature MUST be the file
  **Springeloo | Webdesign** (file key `QLSDfzdupEsnPJ4WY528O5`), design page
  `1969:37969`, using these prototype frame nodes as the visual source of
  truth for homepage (and related) parity:
  - Desktop: node `2108:58670` —
    [proto](https://www.figma.com/proto/QLSDfzdupEsnPJ4WY528O5/Springeloo-%7C-Webdesign?node-id=2108-58670&page-id=1969%3A37969)
  - Tablet quer: node `2108:58675` —
    [proto](https://www.figma.com/proto/QLSDfzdupEsnPJ4WY528O5/Springeloo-%7C-Webdesign?node-id=2108-58675&page-id=1969%3A37969)
  - Tablet hoch: node `2108:58680` —
    [proto](https://www.figma.com/proto/QLSDfzdupEsnPJ4WY528O5/Springeloo-%7C-Webdesign?node-id=2108-58680&page-id=1969%3A37969)
  - Mobile: node `2108:58686` —
    [proto](https://www.figma.com/proto/QLSDfzdupEsnPJ4WY528O5/Springeloo-%7C-Webdesign?node-id=2108-58686&page-id=1969%3A37969)
  Design-file (edit) access for maintainers MUST use the same file key when
  extracting Variables, structure, and assets (prototype links are the signed
  visual reference; the editable file is the implementation source).

### Design & Visual Requirements *(mandatory for UI work)*

- **DR-001**: Page/section layouts MUST match Figma layout, typography,
  spacing, and color tokens at Desktop (1280px), Tablet quer (1024px), Tablet
  hoch (768px), and Mobile (390px) frames for each in-scope page that has those
  frames.
- **DR-002**: Repeated patterns (header, footer, cards, CTAs, heroes) MUST map
  to the existing reusable component model; new repeated patterns from Figma
  MUST become reusable pieces rather than one-off page copies.
- **DR-003**: Desktop, tablet landscape, tablet portrait, and mobile behavior
  MUST be specified explicitly per in-scope page (no “desktop only” delivery).
- **DR-004**: Assets MUST list required production files (prefer SVG for
  logos/icons; photographic media as provided by design).
- **DR-005**: Faithful translation only — no creative redesign beyond the
  approved Figma when resolving conflicts (update spec if design changes).

### Accessibility & SEO Requirements *(mandatory for pages)*

- **AR-001**: Semantic landmarks, heading order, keyboard access, visible
  focus, and meaningful alt text MUST be preserved or improved when layouts
  change; decorative imagery MUST not become the only carrier of essential
  text when real text exists in Figma.
- **AR-002**: Existing page title, meta description, canonical, and Open Graph
  behavior MUST remain intact unless Figma/content explicitly changes SEO
  copy (then via approved content fields).

### Key Entities

- **Design Frame Set**: Named Figma frames for a page at Desktop (1280px),
  Tablet quer (1024px), Tablet hoch (768px), and Mobile (390px) (subset
  allowed if design omits a size).
- **Design Token Set**: Approved Variables for color, type, spacing, and
  related visual constants.
- **Marketing Page**: Public route (home first; secondary routes when framed).
- **Editable Content Slice**: Decap-managed copy/image fields (home + globals)
  that must continue to work inside updated layouts.
- **Design Drop**: A versioned Figma delivery that triggers the sync cadence.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Homepage visual QA passes at all four named breakpoints
  (Mobile 390px, Tablet hoch 768px, Tablet quer 1024px, Desktop 1280px)
  against the approved Figma frames (reviewer sign-off checklist completed with
  no open severity-1 layout mismatches). A severity-1 mismatch is any wrong
  section order, alignment, spacing rhythm, type hierarchy, or major media
  placement versus the frame; sub-pixel and anti-aliasing differences are not
  severity-1.
- **SC-002**: At least 95% of listed visual QA checklist items for the homepage
  pass on first structured review after the parity pass (remaining items
  tracked with owners).
- **SC-003**: An editor can still complete an approved home text or image
  change through Decap and see it on the live site after the normal publish
  path, with no layout-editing required of the editor.
- **SC-004**: Secondary pages with supplied Figma frames reach the same
  four-width sign-off standard in a follow-on pass after homepage acceptance;
  incomplete secondary-page work MUST NOT block homepage release.
- **SC-005**: A documented design-drop cadence exists and is usable for the
  next Figma update without reinventing process.
- **SC-006**: Site continues to build and publish as static output on GitHub
  Pages after the parity work.
- **SC-007**: Accessibility and SEO baseline requirements (AR-001, AR-002)
  remain met after layout updates.
- **SC-008**: Homepage release requires **designer visual OK** (no open
  severity-1 mismatches per SC-001) **and** **stakeholder acceptance** that the
  production site is an acceptable 1:1 of the improved design at the four
  breakpoints—not a “close enough” improvisation.

## Assumptions

- The improved designer Figma will expose **named frames** for Desktop, Tablet
  quer, Tablet hoch, and Mobile (and Auto Layout suitable for assisted
  extraction); designers will keep naming consistent across drops. Visual QA
  and layout switches use acceptance widths Mobile 390px, Tablet hoch 768px,
  Tablet quer 1024px, Desktop 1280px (aligned with the site’s breakpoint
  tokens unless a later design drop changes them via the token sync step).
- Homepage is the first delivery slice and the release gate; secondary routes
  follow once frames exist and do not block homepage sign-off.
- “1:1” means approved visual parity at the named frames (structure, spacing,
  type, color, media placement), not continuous pixel-diff automation in CI.
  Sign-off uses structured visual QA against severity-1 criteria above, not
  near-pixel screenshot thresholds.
- Decap field scope for home/globals stays as today unless a design change
  introduces new editable copy/image needs—then fields expand narrowly. Figma
  text/images are layout references only; live Decap content is not replaced
  during the parity pass.
- Existing static hosting and editorial Git workflow remain unchanged.
- Plugin export and Framer-style hosting are explicitly rejected for
  production.
- Assisted design-to-code (human + design-context tools in the coding
  environment) is the preferred update method into the existing site.
- German-only content and current public route set remain unless design adds
  pages (new routes would need a separate scope decision).
- Figma file access for maintainers/agents uses file key
  `QLSDfzdupEsnPJ4WY528O5` (Springeloo | Webdesign) with the four frame nodes
  recorded in FR-012; prototype URLs are the stakeholder visual reference.
