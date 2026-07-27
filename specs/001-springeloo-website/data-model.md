# Data Model: Springeloo Corporate Website

**Feature**: `001-springeloo-website` | **Date**: 2026-07-27

Static content model (no database). Entities describe structured content and
configuration used by Astro pages/components.

## Entities

### Page

| Field | Type | Rules |
|-------|------|-------|
| id | string | Stable key: `landing`, `projektunterstuetzung`, `produkte`, `kontakt`, `springeloo` |
| path | string | Exact public path (see routes contract) |
| title | string | Unique; derived from Figma headline |
| description | string | Unique meta description; derived from Figma lead |
| sections | Section[] | Ordered; must match Figma section order |
| navLabel | string | German label as in design |

**Relationships**: Page has many Sections; Page referenced by NavigationItem targets.

**Validation**:
- Exactly five pages in v1 (FR-013)
- Every page has title + description (AR-002)
- Paths are the five German routes only

### Section

| Field | Type | Rules |
|-------|------|-------|
| id | string | Unique within page |
| type | enum | `hero`, `hero-carousel`, `arguments`, `products`, `management`, `zahlen`, `cta`, `contact`, `endsegment`, `content`, `other` |
| heading | string? | Visible heading when present in Figma |
| body | string? | Supporting copy from Figma |
| media | MediaAsset[] | Production assets used by section |
| cta | CTA? | Optional call-to-action |

**Relationships**: belongs to Page; may reference MediaAsset and CTA.

### NavigationItem

| Field | Type | Rules |
|-------|------|-------|
| id | string | Stable key |
| label | string | Visible German label |
| href | string | In-scope path or `#anchor` on in-scope page |
| children | NavigationItem[] | Nested expandable items; same href rules |
| placement | enum | `header`, `mobile`, `footer` |

**Validation**:
- `href` MUST target one of the five pages or an anchor on those pages (FR-003)
- Expandable groups keyboard-operable; not the sole path to primary destinations
  without progressive enhancement fallback

### DesignTokenSet

| Field | Type | Rules |
|-------|------|-------|
| colors | map | From Figma |
| typography | map | Families, sizes, weights, line-heights |
| spacing | scale | Consistent spacing scale |
| breakpoints | map | `2k`, `desktop`, `tablet-landscape`, `tablet-portrait`, `mobile` with px values from Figma |
| maxContentWidth | length | From Figma |
| radii | map | Border radii |
| shadows | map | Elevation tokens |
| overlays | map | Opacity values for hero overlays |

**Validation**: Tokens defined before implementing page layouts (FR-008).

### MediaAsset

| Field | Type | Rules |
|-------|------|-------|
| id | string | Stable key |
| src | path | Under `src/assets` (or `public` if required) |
| alt | string | Required when meaningful; empty only for decorative |
| kind | enum | `logo`, `icon`, `hero`, `carousel-slide`, `section`, `other` |
| usedOn | Page.id[] | Traceability; unused assets MUST NOT ship (FR-009) |

### CTA

| Field | Type | Rules |
|-------|------|-------|
| label | string | From Figma |
| href | string | In-scope route or anchor |
| variant | enum | As designed (primary/secondary/etc.) |

## Breakpoint model

| Token | Role | Source |
|-------|------|--------|
| mobile | Smallest phone layout | Figma `*-Mobile` |
| tablet-portrait | Tablet hoch | Figma `*-Tablet-hoch` |
| tablet-landscape | Tablet quer | Figma `*-Tablet-quer` |
| desktop | Standard desktop | Figma `*-Desktop` |
| 2k | Large desktop | Figma `*-2K` |

Exact pixel values are filled during token extraction from Figma (implementation
task); layouts MUST follow these tokens, not framework defaults.

## State transitions (UI only)

### ExpandableNav

`collapsed` → `expanded` → `collapsed` via toggle, Escape, or outside/focus
management as appropriate for a11y. Default: `collapsed`.

### HeroCarousel

`playing` ↔ `paused` via controls; forced `paused` when
`prefers-reduced-motion: reduce`. Slide index advances while `playing`.

No persistent server-side state.

## Notes

- Copy and imagery originate from
  `Landingpage/figmaextract/Webdesign` — inventing brand wording is out of scope.
- Legal text is not a separate entity/page unless present inside Kontakt/footer
  content in the extract.
