# Data Model: CloudCannon Editable Content

**Feature**: `002-cloudcannon-editing` | **Date**: 2026-07-27

Content is file-based (no database). Shapes below map to YAML/Markdown files.

## Entities

### GlobalContent (`src/content/site/globals.yaml`)

| Field | Type | Rules |
|-------|------|-------|
| nav[].id | string | Stable key matching routes |
| nav[].label | string | Plain text; editable |
| nav[].href | string | Developer-controlled in v1 (not editor-editable) |
| footer.tagline | string | Plain text |
| footer.company | string | Plain text |
| footer.addressLines[] | string[] | Plain text |
| footer.phone | string | Plain text |
| footer.email | string | Plain text |
| footer.legal[].label | string | Plain text |
| footer.legal[].href | string | Developer-controlled anchors/paths |
| contact.addressLines[] | string[] | Plain text (Kontakt aside / globals) |
| contact.phone | string | Plain text |
| contact.email | string | Plain text |

**Validation**: Required contact email/phone non-empty; nav has exactly the
existing four primary items in v1 (labels editable, count fixed).

### HomeContent (`src/content/pages/home.yaml` or frontmatter + bodies)

| Field | Type | Rules |
|-------|------|-------|
| meta.title | string | Plain; SEO |
| meta.description | string | Plain; SEO |
| hero.eyebrow | string | Plain |
| hero.headline | string | Plain; required |
| hero.badge | string | Plain (e.g. HR + AI) |
| hero.image.src | string | Path under uploads/assets |
| hero.image.alt | string | Required if image meaningful |
| hero.primaryCta.label | string | Plain; editable |
| hero.primaryCta.href | string | Developer-controlled |
| hero.secondaryCta.label | string | Plain; editable |
| hero.secondaryCta.href | string | Developer-controlled |
| leistungen.cards | Card[3] | **Exactly three** fixed slots |

### Card (fixed slot)

| Field | Type | Rules |
|-------|------|-------|
| eyebrow | string | Plain |
| title | string | Plain; required |
| body | markdown | Rich text allowed (lists, headings) |
| image.src | string? | Optional |
| image.alt | string? | Required if image present |
| cta.label | string | Plain link/CTA label |
| cta.href | string | Developer-controlled |

**Validation**: Array length MUST be 3; editors cannot add/remove; build fails
if length ≠ 3 or required titles empty.

## Relationships

- `SiteHeader` / `SiteFooter` / Kontakt aside read `GlobalContent`
- `index.astro` hero + Leistungen read `HomeContent`
- Other pages continue to use existing hard-coded or shared globals only

## State transitions (editorial)

```text
editing (CloudCannon)
  → saved on content branch (commit)
  → pull request open (pending review)
  → merged to main by developer/maintainer (published)
  → GitHub Pages deploy
```

Editors cannot transition `pull request open` → `merged to main`.

## Non-goals in model

- Multilingual locales
- Repeatable unbounded collections
- Editable hrefs for nav/CTAs in v1
- Editable bodies for non-home pages
