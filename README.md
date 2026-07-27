# springeloo website 2026

Static corporate website for Springeloo — Astro + GitHub Pages.

## How-tos

- [Deploy to GitHub Pages](docs/howto-deploy.md)
- [Change images and text](docs/howto-edit-content.md)
- [CloudCannon editorial workflow](docs/howto-cloudcannon.md) (content branch → PR → maintainer merge)

## Develop

```bash
npm install
npm run dev
```

Editable content for home + globals lives in:

- `src/content/pages/home.yaml`
- `src/content/site/globals.yaml`

Editors normally change those via CloudCannon; see the how-to above.

## Build & preview

```bash
npm run build
npm run preview
```

## GitHub Pages `base`

- User/org site or custom domain: leave `PUBLIC_BASE_PATH` unset (`/`).
- Project site (`username.github.io/repo`): set `PUBLIC_BASE_PATH=/repo-name/` in the
  GitHub Actions variables (and optionally locally).

Optional: `PUBLIC_SITE_URL` for absolute canonical/OG URLs.

## Speckit

Feature artifacts live in `specs/` (e.g. `specs/001-springeloo-website/`,
`specs/002-cloudcannon-editing/`).


## Iteration2
**Feature `002-cloudcannon-editing` is implemented** — all **33 tasks** marked done; `npm run build` succeeds.

### What shipped
- **Content**: `src/content/pages/home.yaml`, `src/content/site/globals.yaml`, uploads under `public/uploads/`
- **Loaders**: `src/lib/content.ts` (typed + validation; build fails if cards ≠ 3), `src/lib/markdown.ts`
- **Wiring**: home, header, footer, Kontakt aside read YAML; CTA/nav **hrefs** stay developer-only (hidden in CloudCannon)
- **Config/docs**: `cloudcannon.config.yml`, `docs/howto-cloudcannon.md`, updated edit howto + README

### Still for the team (CloudCannon console)
Connect the repo, set **content branch → PR → maintainer merge**, then walk scenarios in `specs/002-cloudcannon-editing/quickstart.md`. Details in `docs/howto-cloudcannon.md`.

Say if you want a commit on `002-cloudcannon-editing`.