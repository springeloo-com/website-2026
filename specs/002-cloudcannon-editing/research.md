# Research: CloudCannon Editable Content

**Feature**: `002-cloudcannon-editing` | **Date**: 2026-07-27

## 1. Editorial platform

**Decision**: Use CloudCannon as Git-based visual/data editor connected to this
repo; public site stays Astro static on GitHub Pages.

**Rationale**: Matches PRD and clarifications; content commits remain portable
in Git (no proprietary content database lock-in).

**Alternatives considered**:
- Decap/Tina — also Git CMS; CloudCannon is the approved product
- WordPress / Sanity DB — violates static-first and non-goals
- Code-only workflow — fails non-developer editing goal

## 2. Content storage format

**Decision**: Store editable content in YAML (globals + home structured data).
For rich-text **body** fields, store Markdown strings (multiline) and render
with Astro’s Markdown pipeline / a small markdown renderer, styled by site CSS.

**Rationale**: YAML is CloudCannon-friendly for structured inputs; Markdown
supports lists and headings without freeform HTML/CSS that breaks tokens.
Headings/CTAs remain plain strings.

**Alternatives considered**:
- Astro Content Collections with Zod — good validation; optional enhancement
  once shapes stabilize (may adopt in implementation if it simplifies typing)
- MDX components in editor content — too powerful; risks layout escape
- HTML rich text blobs — harder to sanitize; easier to break design

## 3. Bookshop / page builder

**Decision**: **Do not** adopt Bookshop or CloudCannon structures that let
editors add/remove layout components in v1.

**Rationale**: Spec forbids page-builder layouts and requires **fixed** three
Leistungen cards (no add/remove).

**Alternatives considered**:
- Bookshop live components — excellent DX for page building; conflicts with
  fixed-slot / no-redesign constraints
- Structures with `max_items: 3` — still encourages collection mutation UX;
  fixed object keys (`card_1`…`card_3`) are clearer for v1

## 4. Editable surface wiring

**Decision**: CloudCannon `cloudcannon.config.yml` defines:
- Global data file collection for `src/content/site/globals.yaml`
- Page/data file for `src/content/pages/home.yaml` (or `.md`)
- Input types: text, markdown/textarea, image, select where needed
- Disable source/layout editing for editor role where CloudCannon permissions
  allow

Optional later: Visual Editor select-to-edit annotations — not required if data
editor covers all v1 fields.

**Rationale**: Smallest change that satisfies FR-012/FR-013 without redesigning
components into a builder.

**Alternatives considered**:
- Inline editable regions only — harder for globals/nav; still possible as
  enhancement
- Hard-coded strings left in `.astro` — blocks CloudCannon editing

## 5. Git / publish workflow

**Decision**:
- Editors save → commits on a dedicated content branch (e.g. `content` or
  CloudCannon-managed editing branch)
- Open/update a pull request into `main`
- Only developer/maintainer merges
- Existing GitHub Pages workflow deploys from `main`

**Rationale**: Clarifications Q2=B and Q5=B; protects production from unreviewed
rich text.

**Alternatives considered**:
- Direct push to `main` — rejected
- Editor self-merge — rejected

## 6. Images

**Decision**: CloudCannon image inputs write into a predictable repo path
(prefer `public/uploads/` or `src/assets/uploads/`). Astro pages reference paths
from content files. Alt text is a sibling string field on each image object.

**Rationale**: Asset hygiene + a11y (AR-001); keeps uploads reviewable in Git/PR.

**Alternatives considered**:
- External-only CDN URLs — weaker Git review of binaries
- Replacing files under hashed `_astro/` — wrong layer

## 7. Rich text safety

**Decision**: Render Markdown to HTML with default safe allowlist (no raw
script); style via site CSS only (no editor-chosen colors/fonts). PR checklist
includes heading-order and overflow spot-check.

**Rationale**: Stakeholder chose full rich text; design tokens must still win
(DR-005 / FR-017).

**Alternatives considered**:
- Plain text — rejected by clarify Q4
- Limited bold/italic only — not chosen

## 8. Typing / loaders

**Decision**: Add `src/lib/content.ts` with TypeScript types mirroring
`data-model.md`; load YAML at build time. Fail the build if required fields are
missing (empty hero headline, missing cards).

**Rationale**: Catch bad editor data before production deploy.

**Alternatives considered**:
- Runtime defaults silently filling blanks — hides editorial errors
