# Data Model: Replace Decap CMS with Sveltia CMS

**Feature**: `006-sveltia-cms` | **Date**: 2026-08-19

Content shapes are **unchanged** from features 002–004. Sveltia CMS is a new
admin UI over the same Git files with the same config format.

## Entities (unchanged file shapes)

### GlobalContent — `src/content/site/globals.yaml`

Same fields as feature 003 (nav labels, footer, contact; hrefs
developer-controlled).

### HomeContent — `src/content/pages/home.yaml`

Same fields as feature 003 (meta, hero, Leistungen **exactly 3** cards with
Markdown bodies).

### ProdukteContent — `src/content/pages/produkte.yaml`

Same fields as feature 005-era additions (meta, intro, lead, slider
**exactly 3** slides, products **exactly 3** blocks, OSS, CTA).

### ContentImage

`src` under `/uploads/…` + required `alt` when meaningful.

### CMS Config — `public/admin/config.yml`

| Concern | Setting |
|---------|---------|
| Backend | `github`, repo, `branch: main` |
| Auth | OAuth via `base_url` → existing Cloudflare Worker proxy |
| Publish | `publish_mode: editorial_workflow` |
| Media | `media_folder: public/uploads`, `public_folder: /uploads` |
| Collections | `files` entries for globals, home, and Produkte |
| Locale | German content only (no i18n structure) |

**No changes to config.yml** — Sveltia CMS is config-compatible with Decap.

### CMS Admin Shell — `public/admin/index.html`

Only the `<script>` tag source changes:
- Before: `<script src="./decap-cms.js"></script>`
- After: `<script src="./sveltia-cms.js"></script>`

### Build Script — `scripts/copy-sveltia.mjs`

Replaces `scripts/copy-decap.mjs`. Copies
`node_modules/@sveltia/cms/dist/sveltia-cms.js` → `public/admin/sveltia-cms.js`.

## Validation (Astro build — unchanged)

- `leistungen.cards.length === 3` or build fails
- `slider.slides.length === 3` and `products.length === 3` or build fails
- Required strings non-empty (hero headline, contact phone/email, etc.)

## Relationships

- Sveltia CMS reads `config.yml` → shows admin UI → writes YAML/media → Git
  PR → merge → Astro build reads YAML → Pages

## Non-goals

- New content YAML files or collections
- Changing card/product cardinality
- Changing config.yml structure or field definitions
- Deploying a new OAuth proxy
