# springeloo website 2026

Static corporate website for Springeloo — Astro + GitHub Pages.

## How-tos

- [Deploy to GitHub Pages](docs/howto-deploy.md)
- [Change images and text](docs/howto-edit-content.md)
- [Decap CMS editorial workflow](docs/howto-decap.md) (editorial workflow → PR → maintainer merge)
- [GitHub OAuth proxy for Decap](docs/howto-oauth-proxy.md) (required once for admin login)
- [Figma design drop → layout update](docs/howto-figma-design-drop.md) (tokens → layout → four-width QA; Decap owns copy/images)

## Develop

```bash
npm install
npm run dev
```

Editable content for home, Produkte, and globals lives in:

- `src/content/pages/home.yaml`
- `src/content/pages/produkte.yaml`
- `src/content/site/globals.yaml`

Editors normally change those via **Decap CMS** at `/admin/`; see
[docs/howto-decap.md](docs/howto-decap.md).

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
`specs/002-cloudcannon-editing/`, `specs/003-decap-cms-migration/`,
`specs/004-figma-design-parity/`).
