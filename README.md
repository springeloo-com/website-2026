# springeloo website 2026

Static corporate website for Springeloo — Astro + GitHub Pages.

## How-tos

- [Deploy to GitHub Pages](docs/howto-deploy.md)
- [Change images and text in Astro](docs/howto-edit-content.md)

## Develop

```bash
npm install
npm run dev
```

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

Feature artifacts live in `specs/001-springeloo-website/`.
