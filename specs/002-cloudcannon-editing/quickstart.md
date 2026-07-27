# Quickstart Validation: CloudCannon Editable Content

**Feature**: `002-cloudcannon-editing` | **Date**: 2026-07-27

Validate the editorial workflow end-to-end. See [data-model.md](./data-model.md),
[contracts/editable-fields.md](./contracts/editable-fields.md), and
[contracts/editorial-workflow.md](./contracts/editorial-workflow.md).

## Prerequisites

- Repo on branch with implementation merged or checked out
- `npm install` succeeds; `npm run build` succeeds
- CloudCannon site connected to the GitHub repo
- Editor test user (no merge-to-`main` rights)
- Maintainer/developer user (can merge PRs)

## Local content check (without CloudCannon)

```bash
npm run build
npm run preview
```

1. Edit `src/content/pages/home.yaml` hero headline locally.
2. Rebuild/preview — home hero text updates.
3. Edit `src/content/site/globals.yaml` nav label — header updates.
4. Revert or commit on a feature branch as appropriate.

## CloudCannon scenarios

### 1. Text edit → PR (not live yet)

1. As editor, change home hero headline; save.
2. Confirm commit on content branch + PR to `main`.
3. Confirm production site still shows old headline.
4. As maintainer, merge PR; confirm production updates after Pages deploy.

### 2. Image replace

1. As editor, replace home hero image and set alt text; save.
2. In PR, confirm image file + YAML path/alt changed.
3. After merge, confirm hero image and alt on production.

### 3. Leistungen fixed cards

1. Edit card 2 title, Markdown body (include a list), and CTA label.
2. Confirm still exactly three cards in the file and on the page.
3. Confirm editor UI does not offer add/remove card.
4. Confirm CTA **URL** unchanged.

### 4. Globals

1. Change a nav label and footer phone; save → PR → merge.
2. Confirm label/phone update sitewide; nav hrefs unchanged.

### 5. Permissions

1. As editor, attempt to merge the content PR to `main` — must fail / be
   unavailable.
2. As maintainer, merge succeeds.

### 6. Design / a11y spot-check (post-merge)

1. Home desktop + mobile: layout intact; rich text uses site styles.
2. Heading order still sensible; images have alt.
3. `npm run build` green on `main`.

## Pass criteria

All scenarios pass without exposing layout controls or editable hrefs, and
without Bookshop-style add/remove sections.
