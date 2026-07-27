# How to change images and text

Most marketing copy and images for the **home page**, plus shared nav labels and
contact details, are edited via **CloudCannon** (or by editing YAML content
files in Git). Layout, routes, and other pages still live in Astro.

## Preferred: CloudCannon

See **[howto-cloudcannon.md](howto-cloudcannon.md)** for the full workflow:

- Editors save on a **content branch** → pull request → **maintainer merges** to
  `main` → GitHub Pages deploys.
- Saving in CloudCannon does **not** update production by itself.

### What editors can change

| Surface | Fields |
|---------|--------|
| Home | SEO title/description, hero text, hero image + alt, CTA labels, 3 Leistungen cards (incl. Markdown body) |
| Globals | Nav labels, footer/contact text, legal labels |

CTA and nav **URLs** are developer-only. Card count is fixed at three.

## Local / Git edits (without CloudCannon)

```bash
npm install
npm run dev
```

Edit:

| What | File |
|------|------|
| Home hero, meta, Leistungen | `src/content/pages/home.yaml` |
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
| Non-home page copy / structure | `src/pages/*.astro` (except Kontakt aside contact from globals) |
| Components / layout | `src/components/*.astro` |
| Colors, fonts, spacing | `src/styles/tokens.css` |
| CloudCannon field config | `cloudcannon.config.yml` |

### Pages map

| URL | File |
|-----|------|
| `/` | `src/pages/index.astro` + `src/content/pages/home.yaml` |
| `/projektunterstuetzung` | `src/pages/projektunterstuetzung.astro` |
| `/produkte` | `src/pages/produkte.astro` |
| `/kontakt` | `src/pages/kontakt.astro` (+ globals contact) |
| `/springeloo` | `src/pages/springeloo.astro` |

## Images

- **Home hero / card images (editable):** upload via CloudCannon to
  `public/uploads/`, or place files there and set `src` / `alt` in YAML.
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
- [ ] Still exactly three Leistungen cards
- [ ] Href destinations unchanged unless a developer intended that
- [ ] `npm run build` succeeds
- [ ] Spot-check desktop + mobile

## Common mistakes

| Mistake | Fix |
|---------|-----|
| Expect CloudCannon save = live site | Wait for maintainer merge + deploy |
| Edit only `dist/` | Edit content YAML / `src/` only |
| Try to add a fourth Leistungen card | Not allowed in v1 — ask a developer |
| Change nav href in YAML without review | Hrefs are developer-controlled |
