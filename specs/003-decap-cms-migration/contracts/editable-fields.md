# Contract: Editable Fields (Decap migration)

**Feature**: `003-decap-cms-migration`  
**Consumer**: Decap editors; Astro build reads the same Git files

## In scope (editable via Decap)

| Surface | Fields |
|---------|--------|
| Globals | Nav **labels**; footer tagline/company/address/phone/email; legal **labels**; contact address/phone/email |
| Home | SEO title/description; hero eyebrow/headline/badge; hero image+alt; CTA **labels**; three Leistungen cards (eyebrow, title, Markdown body, optional image+alt, CTA **label**) |
| Produkte | SEO; intro headline/image+alt; lead; slider (3 slides: name, description, image+alt); three product blocks (category, name, optional logo, mock+alt, features, summary, details); OSS; CTA **label** |

## Out of scope (developer-only)

| Surface | Control |
|---------|---------|
| All | Layout, spacing, colors, typography |
| Nav / CTA / legal | `href` destinations |
| Home | Leistungen count (fixed **3**); home carousel (still code-only) |
| Produkte | Slide and product counts (fixed **3**); product/slide **ids**; slider start index; CTA **href** |
| Site | Other pages’ body copy (Projektunterstützung, Springeloo, Kontakt body) |
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
- `src/content/pages/produkte.yaml`
- Media: `public/uploads/`
- Admin: `public/admin/config.yml`
