# Contract: Editable Fields (Decap migration)

**Feature**: `003-decap-cms-migration`  
**Consumer**: Decap editors; Astro build reads the same Git files

## In scope (editable via Decap)

| Surface | Fields |
|---------|--------|
| Globals | Nav **labels**; footer tagline/company/address/phone/email; legal **labels**; contact address/phone/email |
| Home | SEO title/description; hero eyebrow/headline/badge; hero image+alt; CTA **labels**; three Leistungen cards (eyebrow, title, Markdown body, optional image+alt, CTA **label**) |

## Out of scope (developer-only)

| Surface | Control |
|---------|---------|
| All | Layout, spacing, colors, typography |
| Nav / CTA / legal | `href` destinations |
| Home | Leistungen count (fixed **3**); home carousel (still code-only) |
| Site | Other pages’ body copy (not migrated in this feature) |
| Tooling | CloudCannon (removed) |

## Field types

| Kind | Decap widget | Render |
|------|--------------|--------|
| Plain string | string / text | text node |
| Markdown body | markdown | HTML via existing `marked` + `.rich-text` |
| Image | image + alt string | `<img>` / existing hero/card |

## File paths

- `src/content/site/globals.yaml`
- `src/content/pages/home.yaml`
- Media: `public/uploads/`
- Admin: `public/admin/config.yml`
