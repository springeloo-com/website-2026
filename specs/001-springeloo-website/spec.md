# Feature Specification: Springeloo Corporate Website

**Feature Branch**: `001-springeloo-website`

**Created**: 2026-07-27

**Status**: Ready for planning

**Input**: User description: "Build a static, maintainable corporate website for Springeloo from the existing Figma file. Delivered as a public static site with no WordPress, no e-commerce, and no lead-capture backend. Visual source: Figma extract at Landingpage/figmaextract/Webdesign."

## Clarifications

### Session 2026-07-27

- Q: Legal/compliance pages (Impressum, Datenschutz) for v1? → A: No new pages; include legal content only where already shown in the Figma extract (e.g. Kontakt/footer)
- Q: Hero carousel behavior for v1? → A: Autoplay as designed, with user controls and reduced-motion: no autoplay
- Q: Expandable menu destinations for nested items? → A: Nested items only target the five in-scope pages or anchors on those pages
- Q: Public URL path language? → A: German paths aligned to Figma labels (`/`, `/projektunterstuetzung`, `/produkte`, `/kontakt`, `/springeloo`)
- Q: SEO title & description copy source? → A: Derive concise title/description from each page’s visible headline and lead copy in Figma

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Discover Springeloo on the home page (Priority: P1)

A prospective client or partner opens the Springeloo website and immediately
sees a polished home experience: brand navigation, a strong hero with headline
and supporting text, and a clear path to learn about services, products, and
contact.

**Why this priority**: The home page is the primary public face of the company
and the minimum viable deliverable for a corporate presence.

**Independent Test**: Open the home page on desktop and mobile; confirm header,
hero, and home sections render, match the approved design hierarchy, and allow
navigation to key destinations.

**Acceptance Scenarios**:

1. **Given** a visitor opens the home page, **When** the page loads, **Then**
   they see the Springeloo logo, primary navigation, hero headline, and
   supporting hero content without layout collapse.
2. **Given** a visitor views the home page, **When** they scroll through
   sections, **Then** they encounter the designed home sections (including
   project support / services, products, and contact-related content as shown
   in the approved design).
3. **Given** a visitor on a phone-sized viewport, **When** they open the site,
   **Then** the home layout follows the mobile design variant and remains
   readable and usable.

---

### User Story 2 - Browse core company pages (Priority: P2)

A visitor uses navigation to move between the core pages represented in the
approved design: project support (Projektunterstützung), products (Produkte),
contact (Kontakt), and company (Springeloo), each with consistent header and
footer treatment.

**Why this priority**: The Figma export includes dedicated page designs beyond
the home page; delivering them completes the corporate site information
architecture.

**Independent Test**: From the header or menu, open each core page and confirm
content, layout hierarchy, and responsive variants match the approved design
for that page.

**Acceptance Scenarios**:

1. **Given** a visitor on any page, **When** they select a primary nav item,
   **Then** they reach the corresponding page with matching section structure
   from the design.
2. **Given** a visitor opens Projektunterstützung, Produkte, Kontakt, or
   Springeloo, **When** they view desktop and mobile sizes, **Then** layout
   adapts according to the design breakpoints without broken overflow.
3. **Given** a visitor reaches the contact page, **When** they review contact
   information, **Then** contact details are presented as designed (display
   content only — no form submission).
4. **Given** legal or compliance text appears in the Figma extract on Kontakt
   or in the footer, **When** a visitor views those areas, **Then** that text
   is present as designed; no separate Impressum/Datenschutz pages are added.

---

### User Story 3 - Navigate confidently on all devices (Priority: P3)

A visitor on tablet or mobile can open the menu, understand available
destinations, and move through the site with keyboard and pointer/touch without
getting stuck.

**Why this priority**: Navigation is shared across all pages and must work for
accessibility and small screens; it depends on the page shell existing first.

**Independent Test**: On mobile and tablet, open/close the menu, follow links,
and tab through interactive controls with visible focus.

**Acceptance Scenarios**:

1. **Given** a visitor on a mobile viewport, **When** they open the menu,
   **Then** they see the designed menu structure and can reach each primary
   destination.
2. **Given** a keyboard-only user, **When** they tab through header and menu
   controls, **Then** focus is always visible and they can activate each link.
3. **Given** a visitor using a tablet landscape or portrait size, **When** they
   browse, **Then** navigation and page layouts follow the corresponding design
   variants.
4. **Given** a visitor expands a nested menu group (e.g. Insight or
   Kompetenzen), **When** they activate a nested item, **Then** they land on
   one of the five in-scope pages or an in-page anchor on those pages — never
   a route outside the v1 inventory.
5. **Given** a visitor on a page with the hero carousel and no reduced-motion
   preference, **When** the page loads, **Then** the carousel autoplays as
   designed and offers controls to pause or advance.
6. **Given** a visitor who prefers reduced motion, **When** they view the hero
   carousel, **Then** slides do not autoplay and remain manually controllable.

---

### User Story 4 - Share and find the site professionally (Priority: P4)

A visitor or colleague shares a page link in social or chat tools, and search /
preview consumers see a correct title, description, and preview metadata. The
page structure supports scanning via sensible headings.

**Why this priority**: Professional discovery and sharing matter for a corporate
site but build on correct page content already existing.

**Independent Test**: Inspect page title, description, and link-preview fields
for home and at least one secondary page; confirm unique, accurate wording and
a coherent heading order.

**Acceptance Scenarios**:

1. **Given** any published page, **When** a link preview is generated, **Then**
   title and description accurately represent that page and are derived from
   the page’s visible headline and lead copy in the Figma extract.
2. **Given** a visitor or assistive tool reads headings, **When** they scan the
   page, **Then** heading levels follow a logical order without skipped
   primary structure.

---

### Edge Cases

- Design export missing a breakpoint for a page: record the gap; do not invent
  a new layout — fall back to the nearest defined breakpoint only after the gap
  is documented.
- Missing or unclear marketing copy in the extract: stop and mark clarification
  rather than inventing brand wording.
- Very large background or carousel imagery: page MUST remain usable if an
  image is slow or fails (meaningful alt text / fallback treatment; no blank
  unusable hero).
- Reduced-motion preference enabled: hero carousel MUST NOT autoplay; manual
  controls remain available.
- Narrow mobile widths below the smallest designed frame: content remains
  readable without horizontal page scroll for primary text.
- JavaScript unavailable: core content and primary navigation destinations
  remain reachable (progressive enhancement; no JS-only critical content).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Visitors MUST be able to view a public Springeloo home page that
  presents brand navigation, hero, and home sections aligned with the approved
  design.
- **FR-002**: Visitors MUST be able to open the core pages present in the
  approved design inventory: Landing (Startseite), Projektunterstützung,
  Produkte, Kontakt, and Springeloo. Public URL paths MUST use German segments
  aligned to Figma labels: `/` (Landing), `/projektunterstuetzung`,
  `/produkte`, `/kontakt`, and `/springeloo`.
- **FR-003**: Visitors MUST be able to navigate between pages via header
  navigation and, on small viewports, via the mobile menu pattern from the
  design. Nested/expandable menu items MUST only target the five in-scope
  pages or in-page anchors on those pages — they MUST NOT introduce additional
  routes beyond the v1 inventory.
- **FR-004**: The site MUST remain fully static for visitors: no CMS, no
  database, no e-commerce, and no lead-capture or form-processing backend.
- **FR-005**: Contact experiences MUST present contact information as designed
  without requiring form submission in this release.
- **FR-006**: The site MUST be publishable as static files suitable for public
  web hosting without a server-side application.
- **FR-007**: Repeated visual patterns (header, footer, navigation links,
  section headings, content cards, call-to-action controls, hero) MUST be
  represented as reusable building blocks so the same pattern is not
  redesigned per page.
- **FR-008**: Design tokens (colors, typography, spacing, breakpoints, max
  content width, radii, shadows, overlays) MUST be defined from the Figma
  export before page implementation proceeds.
- **FR-009**: Only production-needed assets from the Figma extract MAY be
  included; decorative or unused export files MUST NOT ship.
- **FR-010**: Interactive patterns shown in Figma (including expandable menu
  panels and carousel-style header treatment) MUST ship with full interactive
  parity to the approved design in v1 (carousel advances as designed;
  expandable menus open/close and expose nested destinations). The hero
  carousel MUST autoplay as designed, expose user controls to pause/advance,
  and MUST NOT autoplay when the visitor prefers reduced motion.
- **FR-011**: If design and delivered pages conflict, the team MUST update this
  specification and design references before changing visuals ad hoc.
- **FR-012**: Ambiguous content, layout, or interaction in the Figma extract
  MUST be recorded as open questions rather than silently invented.
- **FR-013**: v1 page inventory MUST include exactly the five Sub-Page designs
  from the extract — Landing (Startseite), Projektunterstützung, Produkte,
  Kontakt, and Springeloo — and MUST NOT add pages beyond that set in this
  release.
- **FR-014**: Custom domain configuration is out of scope for this feature;
  default host URL is acceptable for initial publication.
- **FR-015**: Analytics integrations are out of scope unless explicitly added
  in a later change.
- **FR-016**: Dedicated Impressum or Datenschutz pages MUST NOT be added in
  v1. Legal or compliance text MUST appear only where already present in the
  Figma extract (for example on Kontakt or in the footer); missing legal copy
  MUST be recorded as a gap rather than invented.

### Design & Visual Requirements *(mandatory for UI work)*

- **DR-001**: Each page/section MUST match Figma layout, typography, spacing,
  and color tokens at the specified breakpoints (2K desktop, desktop, tablet
  landscape, tablet portrait, mobile) for screens present in the extract.
- **DR-002**: Repeated patterns MUST map to named reusable components
  corresponding to design systems usage (header, nav link, hero, section
  heading, content card, CTA, footer, and related elements present in the
  extract).
- **DR-003**: Desktop, tablet, and mobile behavior MUST be specified and
  verified explicitly per page that has variants in the extract.
- **DR-004**: Required production assets MUST be listed from the Figma extract
  (prefer vector logos/icons where available); filenames and folders MUST stay
  predictable.
- **DR-005**: Visual translation MUST be faithful to the approved design — not
  a creative redesign.
- **DR-006**: Complex motion or animation MUST NOT be added unless already
  present in the Figma design.

### Accessibility & SEO Requirements *(mandatory for pages)*

- **AR-001**: Pages MUST use semantic landmarks, correct heading order,
  keyboard-accessible navigation, visible focus states, sufficient contrast,
  and meaningful alternative text for meaningful images. Text MUST NOT exist
  only as imagery when real text is possible. Motion that is not essential
  MUST respect reduced-motion preferences (see FR-010).
- **AR-002**: Each page MUST have a unique title and meta description, Open
  Graph metadata, Twitter card metadata, a canonical URL, and a clean heading
  hierarchy suitable for scanning and sharing. Title and description text MUST
  be derived from that page’s visible headline and lead copy in the Figma
  extract (concise restatement only — no invented marketing claims).

### Key Entities

- **Page**: A publicly reachable screen (home/landing, project support,
  products, contact, company) with title, sections, and metadata. Canonical
  public paths: `/`, `/projektunterstuetzung`, `/produkte`, `/kontakt`,
  `/springeloo`.
- **Section**: A vertical content block within a page (hero, arguments,
  products teaser, CTA, end segment, etc.) with hierarchy and content.
- **Navigation item**: A labeled destination in header or mobile menu, possibly
  with nested/expandable groups as designed. Nested leaf targets are limited to
  the five in-scope pages or anchors on those pages.
- **Design token set**: Shared visual values (color, type, space, breakpoint,
  etc.) extracted from Figma and applied consistently.
- **Media asset**: An image or graphic required for production, with usage
  context and alternative text when meaningful.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor can identify the company and primary offer
  from the home hero within 10 seconds of page load on a typical broadband
  connection.
- **SC-002**: 100% of the agreed in-scope pages are reachable from primary
  navigation on desktop and mobile via the German paths `/`,
  `/projektunterstuetzung`, `/produkte`, `/kontakt`, and `/springeloo`.
- **SC-003**: Visual review against the approved Figma export finds no major
  layout or hierarchy mismatches at desktop, tablet, and mobile for in-scope
  pages (spacing, type scale, and section order align).
- **SC-004**: Keyboard-only users can reach every primary navigation
  destination and see a visible focus indicator on interactive controls.
- **SC-005**: Shared link previews for home and at least one secondary page
  show accurate title and description text for that page, derived from the
  page’s visible Figma headline and lead copy.
- **SC-006**: The published site is consumable as static pages with no
  server-side app, CMS, database, or form backend required for normal browsing.
- **SC-007**: Accessibility and SEO baseline requirements (AR-001, AR-002) are
  met on every in-scope page.
- **SC-008**: On a mid-range mobile device, the home page becomes readable
  (primary text visible) within 3 seconds on a typical 4G connection.
- **SC-009**: No production page ships unused extract assets; all meaningful
  images have appropriate alternative text.

## Assumptions

- Visual source of truth is the Figma extract under
  `Landingpage/figmaextract/Webdesign` (including Sub-Page and component
  exports).
- Confirmed v1 page inventory is exactly the five Sub-Page designs: Landing,
  Projektunterstützung, Produkte, Kontakt, and Springeloo.
- No dedicated Impressum/Datenschutz pages in v1; legal content only if already
  shown in the Figma extract (Kontakt/footer).
- Marketing copy and imagery for v1 come from the Figma extract; inventing new
  brand copy is out of scope. SEO titles/descriptions are concise derivations
  of each page’s visible headline and lead copy in Figma.
- Contact is informational only (addresses, links, or designed contact content)
  — no form processing in this release.
- Custom domain and analytics are deferred.
- Breakpoints to support are those represented in the extract: 2K desktop,
  desktop, tablet landscape, tablet portrait, and mobile.
- Language of the site matches the Figma content (German labels such as
  Startseite, Produkte, Kontakt appear as designed). Public URL paths use
  German segments: `/`, `/projektunterstuetzung`, `/produkte`, `/kontakt`,
  `/springeloo`.
- Confirmed v1 ships full interactive parity for carousel header and expandable
  menus (FR-010), while remaining a static site (no CMS/backend) and keeping
  progressive enhancement for core content when scripts fail. Carousel
  autoplays as designed with user pause/advance controls; autoplay is disabled
  under reduced-motion preferences.
- Small-team maintainability and static hosting constraints from the project
  constitution apply to this feature.
