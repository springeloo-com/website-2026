# Contract: Editorial Workflow (Sveltia CMS)

**Feature**: `006-sveltia-cms`

## Workflow

The editorial workflow is **unchanged** from the Decap CMS era. Sveltia CMS
uses the same `editorial_workflow` publish mode and produces identical Git
operations.

1. Editor opens `/admin/` → Sveltia CMS loads → authenticates via GitHub
   OAuth (Cloudflare Worker proxy).
2. Editor changes a field or uploads media → saves.
3. Sveltia CMS creates a branch + pull request toward `main`.
4. Maintainer reviews the PR diff (copy, images, card/product counts).
5. Maintainer merges to `main`.
6. GitHub Actions builds Astro → deploys to GitHub Pages.

## Roles (unchanged)

| Role | Can edit content | Can merge to `main` | Deploys production |
|------|------------------|---------------------|--------------------|
| Content editor (GitHub write collaborator) | Yes (in-scope fields via Sveltia CMS) | No | No |
| Developer / maintainer | Yes | Yes | Via merge + Actions |

## Invariants

- `publish_mode: editorial_workflow` remains in `config.yml`
- Branch protection on `main` prevents editors from merging
- CTA/nav/legal **hrefs** remain developer-controlled (`hidden` widget)
- Leistungen cards fixed at **3**; Produkte slides and products fixed at **3**
- Media uploads go to `public/uploads/`; paths stored as `/uploads/…`
- German-only content; no i18n structure

## What changed from Decap

| Aspect | Before (Decap) | After (Sveltia) |
|--------|----------------|-----------------|
| Admin UI | Decap CMS (React-based) | Sveltia CMS (Svelte-based) |
| Bundle | `decap-cms.js` (~3 MB) | `sveltia-cms.js` (~2 MB) |
| Config format | `config.yml` | Same `config.yml` — unchanged |
| OAuth | Cloudflare Worker proxy | Same proxy — unchanged |
| Workflow | PR-based editorial | Same — unchanged |
| Content files | YAML in Git | Same — unchanged |
