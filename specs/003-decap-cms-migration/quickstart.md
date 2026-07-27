# Quickstart Validation: Migrate Content Editing to Decap CMS

**Feature**: `003-decap-cms-migration` | **Date**: 2026-07-27

See [data-model.md](./data-model.md), [contracts/editable-fields.md](./contracts/editable-fields.md),
and [contracts/editorial-workflow.md](./contracts/editorial-workflow.md).

## Prerequisites

- Implementation on branch (or merged) with `public/admin/` present
- `cloudcannon.config.yml` removed from editorial path
- GitHub OAuth App + OAuth proxy configured; `backend.base_url` set
- Editor = GitHub **write** collaborator; cannot merge to `main`
- Maintainer can merge PRs; Pages deploys from `main`
- `npm run build` succeeds

## Local checks (without Decap UI)

```bash
npm run build
npm run preview
```

1. Confirm `/admin/` (or `{base}admin/`) serves the Decap shell.
2. Edit `src/content/pages/home.yaml` hero headline locally → rebuild → home
   updates (loaders still work).
3. Set Leistungen cards to 2 → build **fails**.
4. Confirm `cloudcannon.config.yml` is gone (or not required).

## Decap scenarios

### 1. Text edit → PR (not live yet)

1. As editor, open Decap, change home hero headline, save (editorial workflow).
2. Confirm PR to `main` exists; production unchanged.
3. Maintainer merges; production updates after Pages deploy.

### 2. Image replace

1. Replace home hero image + alt via Decap; save → PR → merge.
2. Confirm file under `public/uploads/` and live image/alt.

### 3. Footer / globals

1. Change footer phone via Decap → PR → merge → footer updates sitewide.

### 4. Fixed three cards

1. Edit card 2 Markdown body; confirm UI does not allow adding a fourth card
   (or build rejects ≠ 3).
2. Confirm CTA **href** not editable.

### 5. Permissions

1. User without write cannot publish via Decap.
2. Editor cannot merge PR to `main`; maintainer can.

### 6. No CloudCannon

1. Editorial docs describe Decap only.
2. Editors do not need a CloudCannon account.

## Pass criteria

Hero text, one image, and footer/globals text editable via Decap; Git PR review
before production; layout intact; CloudCannon removed from the workflow.
