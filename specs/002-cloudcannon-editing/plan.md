# Implementation Plan: CloudCannon Editable Content

**Branch**: `002-cloudcannon-editing` | **Date**: 2026-07-27 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-cloudcannon-editing/spec.md`

**Note**: This plan is produced by `/speckit-plan`. Tasks follow via `/speckit-tasks`.

## Summary

Expose a constrained editorial surface on the existing Astro static site so
non-developers can update home hero copy/images/CTAs, home Leistungen cards
(fixed three slots), and shared globals (nav labels, footer, contact) through
CloudCannon. Content lives as Git files; editor saves open a content-branch PR;
only a developer/maintainer merges to `main` to publish. Layout, URLs, and
design tokens remain developer-controlled. No Bookshop page-builder in v1.

## Technical Context

**Language/Version**: TypeScript (strict) + Astro 5.x (existing site)

**Primary Dependencies**: Existing Astro stack; CloudCannon site config
(`cloudcannon.config.yml`); Markdown/MDX or HTML-sanitized rich text rendering
for body fields (prefer Markdown in content files — see research.md). No
Bookshop in v1.

**Storage**: Git flat files under `src/content/` (and/or `src/data/`) + images in
`public/` or `src/assets/` as configured for CloudCannon uploads

**Testing**: Manual CloudCannon + PR validation scenarios in `quickstart.md`
(no automated CMS E2E required for v1)

**Target Platform**: GitHub-hosted repo; CloudCannon editing UI; GitHub Pages
production from `main`

**Project Type**: Static marketing site + Git-based editorial workflow

**Performance Goals**: No regression vs current static build; editor changes
must not add client CMS runtime to public pages

**Constraints**: Static-first; no DB CMS; no page builder; fixed three cards;
PR publish path; developer-only merge; German-only; Figma layout preserved;
minimal new dependencies

**Scale/Scope**: Globals + home hero + three Leistungen cards; metadata for
home where exposed; extendable pattern for later pages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Design-first**: ✅ Editing only exposes content inside approved layout;
  no redesign (DR-004)
- **Static-first**: ✅ Public site remains static Astro output; CloudCannon is
  Git-synced editorial UI, not a runtime/database CMS (approved exception —
  see Complexity Tracking)
- **Component modularity**: ✅ Pages consume data; components stay reusable
- **Responsive parity**: ✅ Layout/CSS unchanged by edits; PR review catches
  rich-text regressions
- **Accessibility & SEO**: ✅ Real text, editable alt, metadata fields, heading
  checks in PR review
- **Minimal dependencies**: ✅ Prefer Markdown + YAML over Bookshop/page builder
- **GitHub Pages**: ✅ Unchanged deploy-from-`main` pipeline
- **Spec-driven order**: ✅ Specify → clarify → plan → tasks → implement
- **Maintainability & assets**: ✅ Content files + clear upload paths
- **Quality gate**: ✅ Build + visual check + editorial walkthrough in
  quickstart

**Post-design re-check (Phase 1)**: ✅ Gates pass with documented CloudCannon
exception and Bookshop rejection.

## Project Structure

### Documentation (this feature)

```text
specs/002-cloudcannon-editing/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── editable-fields.md
│   └── editorial-workflow.md
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root) — additive

```text
cloudcannon.config.yml          # collections, inputs, branch/PR workflow
src/
├── content/
│   ├── site/
│   │   └── globals.yaml        # nav labels, footer, contact
│   └── pages/
│       └── home.yaml           # hero + leistungen cards + home meta
│           # OR home.md with frontmatter if Markdown bodies preferred
├── components/                 # existing — wired to content props
├── pages/
│   └── index.astro             # loads home + globals content
└── lib/
    └── content.ts              # typed loaders for globals/home
public/
└── uploads/                    # optional CloudCannon image upload target
```

**Structure Decision**: Keep the existing Astro app. Extract editable strings
and images into Git content files consumed by pages/components. Configure
CloudCannon against those files. Do **not** introduce Bookshop structures that
allow arbitrary add/remove of layout blocks.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| CloudCannon editorial layer (constitution “no CMS”) | Spec explicitly approves Git-synced visual editing for non-developers; content remains files in Git | Code-only edits reject marketing workflow; WordPress/DB CMS violates static-first harder |
| Full rich text in body fields | Stakeholder clarification (clarify Q4=C) | Plain text alone rejected by stakeholder; limited rich text not chosen |
| PR + developer merge gate | Stakeholder clarifications (publish Q=B, merge Q=B) | Direct-to-`main` saves increase production typo/layout risk with rich text |
