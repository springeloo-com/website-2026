# Research: Replace Decap CMS with Sveltia CMS

**Feature**: `006-sveltia-cms` | **Date**: 2026-08-19

## R1: Sveltia CMS bundle packaging

**Decision**: Install `@sveltia/cms` via npm and copy
`node_modules/@sveltia/cms/dist/sveltia-cms.js` to `public/admin/sveltia-cms.js`
at build time — same self-hosted pattern as the current Decap setup.

**Rationale**: The Sveltia IIFE bundle (`sveltia-cms.js`, ~2 MB) works
identically to the Decap UMD bundle under a plain `<script>` tag. No
`type="module"` needed. No CDN dependency at runtime.

**Alternatives considered**:
- CDN (`unpkg.com/@sveltia/cms/dist/sveltia-cms.js`): simpler, auto-updates,
  but adds an external runtime dependency — violates the project's
  self-hosted constraint.
- Astro page import (`import { init } from '@sveltia/cms'`): elegant but
  requires an Astro page under `src/pages/admin/` instead of the existing
  `public/admin/` static files. Would change the admin routing approach
  unnecessarily.

## R2: Config compatibility

**Decision**: Keep `public/admin/config.yml` **exactly as-is**. Sveltia CMS is
backward-compatible with Decap/Netlify CMS config format.

**Rationale**: Sveltia CMS documentation confirms full compatibility. All
widgets (`string`, `text`, `markdown`, `image`, `object`, `list`, `hidden`,
`number`) are supported. The `hidden` widget works for developer-only fields.
`editorial_workflow` publish mode is supported.

**Alternatives considered**: None needed — config works unchanged.

## R3: OAuth / authentication

**Decision**: Reuse the existing Cloudflare Worker OAuth proxy
(`springeloo-decap-oauth.mf-7e0.workers.dev`). No proxy changes required.

**Rationale**: Sveltia CMS explicitly documents that third-party OAuth clients
made for Decap/Netlify CMS work without modification. The `base_url` and
`auth_endpoint` in `config.yml` stay the same. Existing browser auth tokens
are reused.

**Alternatives considered**:
- Sveltia CMS Authenticator (their own Cloudflare Worker): would work but
  requires deploying a second worker + new GitHub OAuth App — unnecessary
  when the existing proxy already works.
- Remove proxy entirely: not possible; GitHub Pages is static and cannot
  hold OAuth secrets.

## R4: `local_backend` / `decap-server`

**Decision**: Not applicable — the project does not use `local_backend` or
`decap-server`. No action needed.

**Rationale**: Sveltia CMS does not support `local_backend` / proxy servers.
The existing config has no `local_backend` key. Local editing goes through
GitHub directly (already the team workflow).

## R5: Prebuild script replacement

**Decision**: Create `scripts/copy-sveltia.mjs` mirroring `copy-decap.mjs`.
Update `package.json` `predev` and `prebuild` to call the new script. Delete
`copy-decap.mjs` and remove `decap-cms` from dependencies.

**Rationale**: Same self-hosting pattern, different source package path
(`@sveltia/cms/dist/sveltia-cms.js` vs `decap-cms/dist/decap-cms.js`).

## R6: Health-check scripts

**Decision**: Update `scripts/check-decap.sh` → rename to
`scripts/check-cms.sh`. Update the grep to look for `sveltia-cms` instead of
`decap-cms` in the admin HTML. Update `package.json` script name accordingly.

**Rationale**: Keeps the same verification pattern; just checks for the new
bundle name.

## R7: Documentation updates

**Decision**: Update `docs/howto-decap.md`, `docs/howto-edit-content.md`,
`README.md`, and relevant spec/contract files to reference Sveltia CMS
instead of Decap CMS. The editorial workflow docs stay largely the same since
the PR-based flow is identical.

**Rationale**: Editors need accurate instructions. The workflow is the same;
only the CMS name and admin UI appearance change.
