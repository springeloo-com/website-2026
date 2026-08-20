# Quickstart: Verify Sveltia CMS Migration

**Feature**: `006-sveltia-cms` | **Date**: 2026-08-19

## Prerequisites

- Node 22+, npm
- GitHub collaborator (write) on `springeloo-com/website-2026`
- Browser (Chrome/Firefox/Safari)

## 1. Install and build

```bash
npm install
npm run build
```

**Expected**: Build succeeds. `public/admin/sveltia-cms.js` exists.
`dist/admin/sveltia-cms.js` is present. No `decap-cms.js` in `dist/admin/`.

## 2. Local dev server

```bash
npm run dev
```

Open `http://localhost:4321/admin/` (or with base path:
`http://localhost:4321/website-2026/admin/`).

**Expected**: Sveltia CMS login screen appears ("Sign in with GitHub" or
equivalent). The page title still shows "Springeloo Content".

## 3. Authenticate

Click "Sign in with GitHub". The Cloudflare OAuth proxy at
`springeloo-decap-oauth.mf-7e0.workers.dev` handles the OAuth flow.

**Expected**: After GitHub authorization, the Sveltia CMS admin panel loads
showing three collections: Globals, Home page, Produkte page.

## 4. Verify field parity

Navigate to each collection and confirm:

| Collection | Key fields to check |
|------------|-------------------|
| Globals | Brand name, nav labels, footer fields, contact |
| Home page | SEO, hero (eyebrow, headline, badge, image), Leistungen cards (3) |
| Produkte page | SEO, intro, lead, slider (3 slides), products (3 blocks), OSS, CTA |

**Expected**: All fields present and editable. No missing widgets.
`hidden` fields (ids, hrefs, startIndex) are not visible to editors.

## 5. Save a test change

Change the Home hero headline to a test value. Save.

**Expected**: Sveltia CMS creates a branch + PR on
`springeloo-com/website-2026`. The PR diff shows the YAML change in
`src/content/pages/home.yaml`.

## 6. Upload media

Upload a test image via the media panel.

**Expected**: Image appears in `public/uploads/` on the PR branch. YAML field
stores `/uploads/<filename>`.

## 7. Health check script (optional)

```bash
npm run check:cms
```

**Expected**: Script confirms admin HTML references `sveltia-cms`, config
is reachable, and OAuth proxy responds.

## 8. Clean-up verification

Confirm no Decap artifacts remain:

```bash
ls dist/admin/
# Should show: index.html, config.yml, sveltia-cms.js
# Should NOT show: decap-cms.js
```

```bash
grep -r "decap" package.json scripts/
# Should return no matches
```

## Revert test change

Close/discard the test PR on GitHub. No production impact.
