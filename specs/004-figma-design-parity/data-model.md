# Data Model: Figma Design Parity (Multi-Breakpoint)

**Feature**: `004-figma-design-parity` | **Date**: 2026-08-05

This feature is primarily **visual/layout**. Content file shapes from features
002/003 remain unless design requires a narrow Decap field expansion.

## Entities

### Design Frame Set

Named Figma frames for a marketing page at the four acceptance viewports.

| Attribute | Rule |
|-----------|------|
| fileKey | `lhqqJkipcRchejNEqQ1ehb` (team copy; legacy `QLSDfzdupEsnPJ4WY528O5`) |
| desktop | landing `2109:78609` / canvas `1924:34092` @ **1280px** |
| tabletQuer | landing `2109:91364` / canvas `1924:34096` @ **1024px** |
| tabletHoch | landing `2109:104991` / canvas `1924:34095` @ **768px** |
| mobile | landing `2109:114327` / canvas `1924:34093` @ **390px** |
| subset | Allowed: implement/QA only supplied frames; do not invent missing ones |

Runtime band map for agents/layout: `src/lib/breakpoints.ts` +
`src/scripts/viewport-band.ts` (sets `html[data-viewport]`).

Relationships: one Design Frame Set per Marketing Page (when design provides it).

### Design Token Set

Approved Figma Variables mirrored into CSS custom properties.

| Concern | Storage |
|---------|---------|
| Color, type, spacing, radii, motion | `src/styles/tokens.css` |
| Named breakpoint widths | `src/styles/breakpoints.css` (`--bp-mobile` … `--bp-desktop`) |
| Sync trigger | Design Drop token step (before layout rewrite) |

Validation: homepage should not introduce conflicting one-off palette/type scales
outside the token set after sync.

### Marketing Page

Public route implemented as Astro page + components.

| Route | Role in this feature |
|-------|----------------------|
| `/` | **Release gate** — four-width parity required |
| `/projektunterstuetzung` | Follow-on when frames exist |
| `/produkte` | Follow-on when frames exist |
| `/springeloo` | Follow-on when frames exist |
| `/kontakt` | Follow-on when frames exist |
| `/admin/` | Out of visual-parity scope (CMS UI) |

Layout ownership: engineering (`.astro` / CSS). No free-form layout in CMS.

### Editable Content Slice

Decap-managed fields (unchanged shapes unless narrowly expanded).

| Slice | Path | Notes |
|-------|------|-------|
| HomeContent | `src/content/pages/home.yaml` | Live copy/images for home |
| GlobalContent | `src/content/site/globals.yaml` | Nav labels, footer, contact |
| Media | `public/uploads/` | Production assets; alt required when meaningful |

**Authority**: When Figma placeholders differ, **Decap wins** for content;
Figma wins for structure/spacing/type/media placement around those fields.

### Design Drop

Versioned Figma delivery that triggers the sync cadence.

| Attribute | Description |
|-----------|-------------|
| frames | Named/updated Design Frame Sets |
| variables | Optional Variable changes → Token Set sync |
| assets | Production-ready images/icons/logos required before section sign-off |
| cadence | frames → tokens → layout → four-width QA → merge |

### Visual QA Result

Structured review outcome per page × viewport.

| Field | Values |
|-------|--------|
| viewport | 390 / 768 / 1024 / 1280 |
| severity1Open | boolean — any composition failure (see contracts/visual-qa.md) |
| designerOk | required for homepage release |
| stakeholderAccepted | required for homepage release |

## State transitions (homepage release)

```text
Frames ready → Tokens synced → Layout updated → Visual QA
  → (severity-1 open) → fix layout → Visual QA
  → designer OK → stakeholder acceptance → merge / release
Secondary pages: same loop; cannot block homepage release
```

## Non-goals

- New content database or page-builder schema
- Automatic Figma→Git content overwrite
- Pixel-diff CI as a release gate
