# Contract: Editable Fields (v1)

**Feature**: `002-cloudcannon-editing`  
**Consumer**: CloudCannon editors; Astro build reads the same files

## In scope (editable)

| Surface | Fields |
|---------|--------|
| Globals — nav | `label` only (4 items) |
| Globals — footer | tagline, company, address lines, phone, email, legal labels |
| Globals — contact | address lines, phone, email |
| Home — meta | title, description |
| Home — hero | eyebrow, headline, badge, image+alt, primary/secondary CTA **labels** |
| Home — Leistungen | exactly 3 cards: eyebrow, title, body (Markdown), optional image+alt, CTA **label** |

## Out of scope (developer-only)

| Surface | Control |
|---------|---------|
| All | Layout, spacing, colors, typography tokens |
| Nav / CTA / legal | `href` destinations |
| Home | Card count (locked at 3) |
| Other pages | Section body copy/images (except via globals) |
| Site | Adding pages, components, or Bookshop structures |

## Field types

| Kind | Editor input | Render |
|------|--------------|--------|
| Plain string | text | text node |
| Markdown body | markdown | HTML via Markdown renderer + site CSS |
| Image | image + alt text | `<img>` / Astro Image with object-fit per design |

## File paths (contractual)

- `src/content/site/globals.yaml`
- `src/content/pages/home.yaml` (Markdown bodies as multiline fields **or**
  split `body.md` partials if implementation prefers — must remain Git-tracked)

Paths may be adjusted during implementation only if `cloudcannon.config.yml` and
loaders stay in sync; document any rename in PR.
