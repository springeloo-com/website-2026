# How to change images and text (Astro)

You do **not** need a CMS. Content lives in Astro page files and image files in
the repo. Edit → preview → commit → deploy.

## Quick start

```bash
npm install
npm run dev
```

Open the local URL (usually `http://localhost:4321`). Changes hot-reload.

When done:

```bash
npm run build
npm run preview   # optional production check
git add -A && git commit && git push   # triggers deploy
```

## Where things live

| What | Where |
|------|--------|
| Page text & section structure | `src/pages/*.astro` |
| Shared contact / nav labels | `src/data/navigation.ts` |
| Images used by pages | `src/assets/images/` |
| Favicon / static OG fallback | `public/` |
| Colors, fonts, spacing | `src/styles/tokens.css` |
| Header / footer / buttons | `src/components/*.astro` |

### Pages map

| URL | File |
|-----|------|
| `/` | `src/pages/index.astro` |
| `/projektunterstuetzung` | `src/pages/projektunterstuetzung.astro` |
| `/produkte` | `src/pages/produkte.astro` |
| `/kontakt` | `src/pages/kontakt.astro` |
| `/springeloo` | `src/pages/springeloo.astro` |

## Change text on a page

1. Open the page file (e.g. `src/pages/index.astro`).
2. Find the German copy in the markup or in props near the top.

Example — home SEO + hero headline:

```astro
const title = 'Digitale Unternehmenskultur durch Kompetenzmanagement';
const description =
  'Digitale Tools und Kompetenzen für eine zukunftsfähige Unternehmenskultur — future by professionals.';
```

```astro
<HeroBanner
  headline="Digitale Unternehmenskultur durch Kompetenzmanagement."
  eyebrow="Digitale Tools und Kompetenzen"
  ...
/>
```

3. Save — the browser updates if `npm run dev` is running.
4. Keep **title** / **description** aligned with the visible headline and lead
   (project rule: derive SEO from on-page copy, don’t invent claims).

### Shared company details (footer / contact)

Edit `src/data/navigation.ts`:

- `siteMeta.phone`, `email`, address lines
- `siteMeta.contactPhone`, `contactEmail` (Kontakt page)
- Footer legal link labels
- Navigation labels under `primaryNav`

Nav hrefs must stay within the five routes (or `#anchors` on those pages).

## Change an image

### Preferred: replace a file in `src/assets/images/`

1. Add your new image, e.g. `src/assets/images/hero-office-1.jpg`.
2. Prefer JPG/WebP for photos, SVG for logos/icons.
3. Keep filenames predictable, or update the import in the page.

Pages import images like this:

```astro
import hero1 from '../assets/images/hero-office-1.jpg';
```

Then use `hero1.src` (and pass `imageAlt` for accessibility):

```astro
<HeroBanner
  imageSrc={hero1.src}
  imageAlt="Zwei Fachkräfte im modernen Büro mit Tablet und Kaffee"
  ...
/>
```

### Update alt text

Always change `imageAlt` / `alt` when the picture changes — screen readers and
SEO use that text.

### Carousel slides (home / Produkte)

In `index.astro` or `produkte.astro`, edit the `slides={[...]}` array:

```astro
{
  imageSrc: hero2.src,
  imageAlt: 'Team in einer Besprechung im hellen Büro',
  eyebrow: 'Insight',
  headline: 'Konstanz durch Kultur: Experten, die bleiben.',
}
```

Add/remove slides by adding/removing objects in that array.

### Files in `public/`

Use `public/` for files that must keep a fixed URL:

- `public/favicon.svg`
- `public/og-default.jpg` (fallback social preview)

Reference as `/favicon.svg` (Astro `base` is applied automatically where the
layout builds URLs).

## Change colors or type scale

Edit CSS variables in `src/styles/tokens.css`:

- `--color-blue`, `--color-cream`, …
- `--font-size-*`, `--space-*`

Global layout rules: `src/styles/global.css`.  
Breakpoints: `src/styles/breakpoints.css`.

## Change header / footer / buttons

| Component | File |
|-----------|------|
| Header + logo | `src/components/SiteHeader.astro` |
| Footer | `src/components/SiteFooter.astro` |
| Buttons | `src/components/CTAButton.astro` |
| Content cards | `src/components/ContentCard.astro` |
| Hero | `src/components/HeroBanner.astro` |
| Carousel | `src/components/HeroCarousel.astro` |

Change shared UI once — all pages that use the component update together.

## Checklist before you push

- [ ] Text matches the approved wording (no invented brand copy)
- [ ] Images optimized (avoid multi‑MB files)
- [ ] Meaningful `alt` text on photos
- [ ] `npm run build` succeeds
- [ ] Spot-check desktop + mobile in the browser

## Common mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| Edit only `dist/` | Changes disappear on next build | Edit `src/` only |
| Put huge unoptimized PNGs in `src/assets` | Slow pages | Compress / use WebP/JPG |
| Change nav to a new URL without a page | 404 | Add a page under `src/pages/` or keep existing routes |
| Forget alt text | Accessibility / SEO gap | Update `imageAlt` / `alt` |

## Need a new section on a page?

1. Copy an existing `<section>...</section>` block in that page file.
2. Adjust heading, text, and optional component props.
3. Prefer existing components (`SectionHeading`, `ContentCard`, `CTAButton`)
   instead of duplicating markup.
