# Data Model: Migrate Content Editing to Decap CMS

**Feature**: `003-decap-cms-migration` | **Date**: 2026-07-27

Content shapes are **unchanged** from feature 002. Decap is a new editor over
the same files.

## Entities (unchanged file shapes)

### GlobalContent — `src/content/site/globals.yaml`

Same fields as `specs/002-cloudcannon-editing/data-model.md` (nav labels,
footer, contact; hrefs developer-controlled).

### HomeContent — `src/content/pages/home.yaml`

Same fields as feature 002 (meta, hero, Leistungen **exactly 3** cards with
Markdown bodies).

### ProdukteContent — `src/content/pages/produkte.yaml`

Meta, intro, lead, slider (**exactly 3** slides), products (**exactly 3**
blocks), OSS, CTA. Product/slide `id`s and CTA `href` are developer-controlled.

### ContentImage

`src` under `/uploads/…` + required `alt` when meaningful.

### DecapConfig — `public/admin/config.yml`

| Concern | Setting |
|---------|---------|
| Backend | `github`, repo, `branch: main` |
| Auth | OAuth via `base_url` → proxy |
| Publish | `publish_mode: editorial_workflow` |
| Media | `media_folder: public/uploads`, `public_folder: /uploads` |
| Collections | `files` entries for globals, home, and Produkte |
| Locale | German content only (no i18n structure) |

### EditorialChange

Decap editorial-workflow PR (working branch + PR into `main`) created/updated
on save; production reflects content only after maintainer merge + Pages deploy.

## Validation (Astro build — keep)

- `leistungen.cards.length === 3` or build fails
- `slider.slides.length === 3` and `products.length === 3` or build fails
- Required strings non-empty (hero headline, contact phone/email, etc.)

## Relationships

- Decap writes YAML/media → Git PR → merge → Astro build reads YAML → Pages

## Non-goals

- New page YAML files beyond home / Produkte / globals
- Changing card or product cardinality
- Multilingual schemas
- Database entities
