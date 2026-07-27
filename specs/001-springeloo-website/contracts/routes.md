# Contract: Public Routes

**Feature**: `001-springeloo-website`  
**Consumer**: Browsers, crawlers, link previews  
**Transport**: HTTPS static files on GitHub Pages

## Routes

| Method | Path | Page id | Required landmarks |
|--------|------|---------|-------------------|
| GET | `/` | `landing` | `header`, `main`, `footer` |
| GET | `/projektunterstuetzung` | `projektunterstuetzung` | `header`, `main`, `footer` |
| GET | `/produkte` | `produkte` | `header`, `main`, `footer` |
| GET | `/kontakt` | `kontakt` | `header`, `main`, `footer` |
| GET | `/springeloo` | `springeloo` | `header`, `main`, `footer` |

Paths are relative to Astro `base` (default `/`). With a non-root `base`, all
paths are prefixed accordingly; canonical URLs MUST include the effective base.

## Response expectations

- `Content-Type`: `text/html` for pages
- Status: `200` for the five routes above after deploy
- No server-rendered personalization; no authenticated endpoints
- No form `POST` handlers in v1

## Document metadata (every page)

| Tag / field | Requirement |
|-------------|-------------|
| `<html lang="de">` | Required |
| `<title>` | Unique; from Figma headline |
| `<meta name="description">` | Unique; from Figma lead |
| `<link rel="canonical">` | Absolute URL for this page |
| Open Graph `og:title`, `og:description`, `og:url`, `og:type` | Required |
| Twitter card tags | Required (`summary_large_image` if hero image available, else `summary`) |

## Navigation contract

Primary destinations MUST be reachable from header (desktop) and mobile menu
without requiring nested expansion. Nested items MAY deepen IA but MUST only
`href` to the routes above or `#` anchors on those pages.

## Out of contract (v1)

- `/impressum`, `/datenschutz`, or other legal-only routes
- API JSON endpoints
- Preview draft routes
- English path aliases
