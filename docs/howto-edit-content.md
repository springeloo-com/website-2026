# How to change images and text

Most marketing copy and images for the **home page** and **Produkte page**, plus
shared nav labels and contact details, are edited via **Decap CMS** (or by editing
YAML content files in Git). Layout, routes, and other pages still live in Astro —
see **[howto-figma-design-drop.md](howto-figma-design-drop.md)** when design
delivers a new Figma drop (layout is engineering-owned; Decap stays copy/images
only).

## Preferred: Decap CMS

See **[howto-decap.md](howto-decap.md)** for the full workflow:

- Editors save with **editorial workflow** → pull request → **maintainer
  merges** to `main` → GitHub Pages deploys.
- Saving in Decap does **not** update production by itself.
- Open admin at `/admin/` (project site:
  `https://springeloo-com.github.io/website-2026/admin/`).

CloudCannon is no longer part of the editorial path.

### What editors can change

| Surface | Fields |
|---------|--------|
| Home | SEO title/description, hero text, hero image + alt, CTA labels, 3 Leistungen cards (incl. Markdown body) |
| Produkte | SEO, intro headline/image, lead, slider images + names, 3 product blocks (copy + mock/logo images), OSS, CTA label |
| Globals | Nav labels, footer/contact text, legal labels |

CTA and nav **URLs** are developer-only. Home cards, Produkte slides, and
product blocks are each fixed at three.

## Local / Git edits (without Decap)

```bash
npm install
npm run dev
```

Edit:

| What | File |
|------|------|
| Home hero, meta, Leistungen | `src/content/pages/home.yaml` |
| Produkte copy and images | `src/content/pages/produkte.yaml` |
| Nav labels, footer, contact | `src/content/site/globals.yaml` |
| Uploaded images | `public/uploads/` |

Then:

```bash
npm run build
npm run preview   # optional
```

Commit on a feature/content branch; open a PR to `main` for review.

## Developer-only: other pages & layout

| What | Where |
|------|--------|
| Other page copy / structure | `src/pages/*.astro` (except Home, Produkte, and Kontakt contact from globals) |
| Components / layout | `src/components/*.astro` |
| Colors, fonts, spacing | `src/styles/tokens.css` |
| Decap field config | `public/admin/config.yml` |

### Pages map

| URL | File |
|------|------|
| `/` | `src/pages/index.astro` + `src/content/pages/home.yaml` |
| `/projektunterstuetzung` | `src/pages/projektunterstuetzung.astro` |
| `/produkte` | `src/pages/produkte.astro` + `src/content/pages/produkte.yaml` |
| `/kontakt` | `src/pages/kontakt.astro` (+ globals contact) |
| `/springeloo` | `src/pages/springeloo.astro` |
| `/admin/` | `public/admin/` (Decap CMS; editors only) |

## Images

- **Home hero / card images (editable):** upload via Decap to
  `public/uploads/`, or place files there and set `src` / `alt` in YAML.
- **Produkte images (editable):** slider, intro, product mock/logo via Decap
  (same `public/uploads/` folder).
- **Other pages:** import from `src/assets/images/` in the page Astro file, or
  use `public/` for fixed URLs.

Always update **alt** text when the picture changes.

Carousel slides on the home page are still developer-controlled in
`src/pages/index.astro` (they may point at `/uploads/` assets).

## Markdown in card bodies

Card `body` fields accept Markdown (lists, headings). Styles come only from
site CSS (`.rich-text`). Do not paste raw HTML/CSS meant to restyle the layout.

## Checklist before merge

- [ ] Text matches approved wording
- [ ] Images optimized; meaningful alt text
- [ ] Still exactly three Leistungen cards and three Produkte items
- [ ] Href destinations unchanged unless a developer intended that
- [ ] `npm run build` succeeds
- [ ] Spot-check desktop + mobile

## Common mistakes

| Mistake | Fix |
|---------|-----|
| Expect Decap save = live site | Wait for maintainer merge + deploy |
| Edit only `dist/` | Edit content YAML / `src/` only |
| Try to add a fourth Leistungen card or Produkt | Not allowed — ask a developer |
| Change nav href in YAML without review | Hrefs are developer-controlled |
| Look for CloudCannon | Use Decap — see [howto-decap.md](howto-decap.md) |
