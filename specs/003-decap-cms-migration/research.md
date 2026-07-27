# Research: Migrate Content Editing to Decap CMS

**Feature**: `003-decap-cms-migration` | **Date**: 2026-07-27

## 1. CMS platform

**Decision**: Use **Decap CMS** (open-source, Git-based) as the sole editorial
UI; remove CloudCannon from the day-to-day workflow.

**Rationale**: Matches iter3 PRD goals (open source, no proprietary SaaS CMS);
content remains in Git YAML already produced by feature 002.

**Alternatives considered**:
- Keep CloudCannon — rejected by PRD / clarify (remove)
- Tina/Forestry — not the chosen product
- Code-only — fails non-developer editing goal

## 2. Authentication

**Decision**: **GitHub OAuth** with Decap `github` backend. Deploy a small
**OAuth proxy** (serverless/edge or existing open-source provider such as
community GitHub OAuth proxies compatible with Decap) and set
`backend.base_url` to that host. Create a GitHub OAuth App with callback to the
proxy. Secrets stay on the proxy, not in the static site.

**Rationale**: Clarify Q1=A; GitHub Pages cannot safely hold OAuth client
secrets; Decap docs require an OAuth client for GitHub backend outside Netlify’s
built-in auth.

**Alternatives considered**:
- Netlify Identity + Git Gateway — rejected (clarify)
- Implicit/no auth — insecure; fails FR-010

## 3. Publish / review path

**Decision**: Enable `publish_mode: editorial_workflow` with publication
`backend.branch: main`. Decap creates/updates **pull requests** for unpublished
entries; **maintainers merge** to `main`. Protect `main` so write-collaborator
editors cannot merge. GitHub Pages continues to deploy from `main` only.

**Rationale**: Satisfies clarify “content branch + PR + maintainer merge” in
Decap-native form. Decap uses **per-entry working branches + PRs** rather than
one long-lived `content` branch; review gate and production isolation are
equivalent for acceptance.

**Alternatives considered**:
- Direct commits to `main` — rejected
- Long-lived `content` branch + custom Action to open PRs — more moving parts
  for same outcome

## 4. Admin hosting

**Decision**: Ship Decap at `public/admin/index.html` + `public/admin/config.yml`
so it deploys with GitHub Pages (respect site `base` / `PUBLIC_BASE_PATH`).

**Rationale**: Zero extra host for the admin SPA; matches static delivery.

**Alternatives considered**:
- Separate admin subdomain — unnecessary for v1
- npm-bundled Decap in Astro route — heavier; CDN script is enough

## 5. Content model mapping

**Decision**: Map Decap `files` collections to existing
`src/content/site/globals.yaml` and `src/content/pages/home.yaml`. Do **not**
restructure YAML. Keep Astro `src/lib/content.ts` validation (Leistungen length
=== 3). Hide href fields in Decap widgets (or omit from editor UI / use
read-only patterns where supported).

**Rationale**: Migration should swap the editor, not the content schema.

**Alternatives considered**:
- Convert to Markdown folders — churn without benefit for this migration
- Expand to all pages — out of scope for this feature

## 6. Media

**Decision**: `media_folder: public/uploads`, `public_folder: /uploads` (adjust
`public_folder` if project base path requires a prefix in docs; paths in YAML
remain `/uploads/...` as today with `publicUrl()`).

**Rationale**: Clarify Q2=A; matches feature 002.

## 7. Rich text

**Decision**: Use Decap `markdown` widget for body fields; `string`/`text` for
headings, labels, SEO.

**Rationale**: Clarify Markdown bodies = full rich text.

## 8. CloudCannon removal

**Decision**: Delete `cloudcannon.config.yml`; replace `docs/howto-cloudcannon.md`
with Decap-first docs (`docs/howto-decap.md`) and update README /
`howto-edit-content.md` links.

**Rationale**: Clarify remove config + replace docs; no dual-editor period.

## 9. Editor permissions

**Decision**: Editors = GitHub collaborators with **write**; `main` branch
protection requires PR + restricts who can merge (maintainers).

**Rationale**: Clarify Q on approved editors.
