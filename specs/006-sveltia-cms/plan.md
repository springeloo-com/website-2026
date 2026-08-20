# Implementation Plan: Replace Decap CMS with Sveltia CMS

**Branch**: `006-sveltia-cms` | **Date**: 2026-08-19 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/006-sveltia-cms/spec.md`

## Summary

Replace the Decap CMS admin interface with Sveltia CMS — a drop-in successor
that uses the same `config.yml` format, the same GitHub backend, and the same
OAuth proxy. The migration is a bundle swap + clean-up, with zero changes to
content YAML files, Astro pages, or the build/deploy pipeline.

## Technical Context

**Language/Version**: Node 22 (Astro build), vanilla HTML/JS (admin shell)

**Primary Dependencies**: `@sveltia/cms` (replaces `decap-cms`), Astro 7.x (unchanged)

**Storage**: Git-based YAML files — `src/content/pages/home.yaml`, `produkte.yaml`, `src/content/site/globals.yaml` (unchanged)

**Testing**: Manual smoke-test via `/admin/` login + save; `npm run build` verification

**Target Platform**: GitHub Pages (static), browser-based admin UI

**Project Type**: Static site with Git-based headless CMS admin

**Performance Goals**: Admin loads in < 3s; no regression from Decap

**Constraints**: Self-hosted bundle (no external CDN at runtime); existing Cloudflare OAuth proxy reused

**Scale/Scope**: 3 content collections, ~5 editors, single-language (German)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Design-first**: No Figma change involved; admin UI is Sveltia's own
  interface — no custom design work ✅
- **Static-first**: Delivery remains static Astro HTML/CSS; CMS admin is an
  existing approved component (Decap → Sveltia is a like-for-like swap) ✅
- **Component modularity**: No Astro component changes ✅
- **Responsive parity**: Not applicable — admin UI is third-party ✅
- **Accessibility & SEO**: Not applicable to admin panel ✅
- **Minimal dependencies**: Swaps one dep (`decap-cms`) for one dep
  (`@sveltia/cms`); net zero new dependencies ✅
- **GitHub Pages**: Build output unchanged; `/admin/` served as static
  files exactly as before ✅
- **Spec-driven order**: Spec written → plan → tasks → implement ✅
- **Maintainability & assets**: Simpler (Sveltia is lighter, actively
  maintained, no React bundling needed) ✅
- **Quality gate**: Done when admin works, build passes, Decap is removed ✅

> All gates pass. No complexity tracking entries needed.

## Project Structure

### Documentation (this feature)

```text
specs/006-sveltia-cms/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── editorial-workflow.md
└── tasks.md             # Phase 2 output (/speckit-tasks)
```

### Source Code (repository root)

```text
public/
├── admin/
│   ├── index.html          # Script tag → sveltia-cms.js (was decap-cms.js)
│   ├── config.yml          # UNCHANGED
│   └── sveltia-cms.js      # New: copied from @sveltia/cms at build time
├── uploads/                # UNCHANGED
scripts/
├── copy-sveltia.mjs        # New: replaces copy-decap.mjs
├── copy-decap.mjs          # DELETED at clean-up
├── check-decap.sh          # Updated to check Sveltia (or removed)
src/                        # UNCHANGED
```

**Structure Decision**: Only `public/admin/` and `scripts/` are touched.
All Astro source, content YAML, and build pipeline files are unchanged.

## Complexity Tracking

No constitution violations. No entries needed.
