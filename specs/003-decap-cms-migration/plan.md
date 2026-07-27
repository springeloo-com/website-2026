# Implementation Plan: Migrate Content Editing to Decap CMS

**Branch**: `003-decap-cms-migration` | **Date**: 2026-07-27 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-decap-cms-migration/spec.md`

**Note**: This plan is produced by `/speckit-plan`. Tasks follow via `/speckit-tasks`.

## Summary

Replace CloudCannon with Decap CMS for editing the existing Git YAML content
(home + globals from feature 002). Serve a static Decap admin UI from the site,
authenticate editors with GitHub OAuth (external OAuth proxy required), use
Decap **editorial workflow** so saves open PRs for maintainer merge to `main`,
keep Astro loaders and layouts unchanged, remove CloudCannon config, and replace
editorial docs. Media stays in `public/uploads/`. German only; Leistungen fixed
at three cards; no page builder.

## Technical Context

**Language/Version**: TypeScript + Astro 5.x (existing); Decap CMS admin as
static HTML/JS (CDN or vendored build)

**Primary Dependencies**: Existing `yaml` + `marked` + content loaders; Decap
CMS (`decap-cms` / `decap-cms-app` via CDN script in `public/admin/`); GitHub
OAuth App + lightweight OAuth proxy (external service or small serverless
function — not part of the Astro runtime). No CloudCannon. No Bookshop.

**Storage**: Existing Git files `src/content/pages/home.yaml`,
`src/content/site/globals.yaml`; media in `public/uploads/`

**Testing**: Manual Decap + PR validation in `quickstart.md` (no automated CMS
E2E required)

**Target Platform**: GitHub repo `springeloo-com/website-2026`; GitHub Pages
static host; Decap admin at site `/admin/`; GitHub OAuth proxy URL configured
in Decap `config.yml`

**Project Type**: Static marketing site + open-source Git CMS migration

**Performance Goals**: No Decap runtime on public marketing pages (admin only);
no regression to static build size for visitor pages beyond admin assets

**Constraints**: Static-first; GitHub OAuth; editorial workflow / PR to `main`;
write collaborators without merge-to-`main`; remove CloudCannon; Markdown
bodies; fixed 3 Leistungen; German only; preserve Figma layout

**Scale/Scope**: Migrate home + globals editorial surface; admin UI + config +
docs + OAuth setup runbook; delete CloudCannon config

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Design-first**: ✅ No redesign; Decap only edits existing content fields
- **Static-first**: ✅ Public site remains Astro static HTML; Decap is
  browser-side Git editor (approved exception — Complexity Tracking). No DB CMS
- **Component modularity**: ✅ Unchanged components/loaders consume YAML
- **Responsive parity**: ✅ Layout/CSS unchanged
- **Accessibility & SEO**: ✅ Alt + meta fields remain editable; PR review for
  Markdown heading order
- **Minimal dependencies**: ✅ Decap via admin CDN/script; no new public-page
  libraries; OAuth proxy is external ops dependency
- **GitHub Pages**: ✅ Unchanged deploy-from-`main`; admin ships in `public/`
- **Spec-driven order**: ✅ Specify → clarify → plan → tasks → implement
- **Maintainability & assets**: ✅ Same uploads path; remove CloudCannon surface
- **Quality gate**: ✅ Build + Decap walkthrough in quickstart

**Post-design re-check (Phase 1)**: ✅ Gates pass with documented Decap + OAuth
proxy exception and CloudCannon removal.

## Project Structure

### Documentation (this feature)

```text
specs/003-decap-cms-migration/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── editable-fields.md
│   └── editorial-workflow.md
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root) — migration delta

```text
public/
├── admin/
│   ├── index.html          # Decap CMS shell
│   └── config.yml          # backend, collections, media, editorial_workflow
└── uploads/                # unchanged media target

src/
├── content/                # unchanged shapes (home.yaml, globals.yaml)
├── lib/content.ts          # keep validation (cards === 3)
└── pages/                  # unchanged consumers

# REMOVE from editorial path:
cloudcannon.config.yml

docs/
├── howto-decap.md          # new primary editorial how-to
├── howto-edit-content.md   # point to Decap
├── howto-cloudcannon.md    # remove or replace with redirect note to Decap
└── howto-deploy.md         # note admin + OAuth proxy prerequisites if needed
```

**Structure Decision**: Keep Astro content model. Add Decap under `public/admin/`.
Use GitHub backend + `publish_mode: editorial_workflow` for PR-based publishing.
Delete CloudCannon config. Document OAuth proxy as required maintainer setup
outside the Astro app.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Decap CMS (constitution “no CMS”) | Spec explicitly migrates off CloudCannon to open-source Git CMS; content stays files | Code-only edits fail marketing need; DB CMS violates static-first harder |
| External GitHub OAuth proxy | GitHub OAuth requires a server callback; static Pages cannot host secrets | Netlify Identity rejected (clarify); skipping auth fails FR-010 |
| Editorial workflow PRs (vs single long-lived `content` branch) | Decap-native PR review matches maintainer-merge requirement | Direct-to-`main` commits rejected by clarify |
