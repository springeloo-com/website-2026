# Contract: Editorial Workflow (Decap migration)

**Feature**: `003-decap-cms-migration`  
**Actors**: Content editor (GitHub write), Developer/maintainer, GitHub Actions

## Happy path

1. Editor opens `{site}/admin/` (with correct `PUBLIC_BASE_PATH` if project site).
2. Editor signs in with **GitHub OAuth** (via configured OAuth proxy).
3. Editor updates an in-scope field (see `editable-fields.md`) and saves as
   unpublished / in editorial workflow.
4. Decap creates or updates a **pull request** toward `main`.
5. Maintainer reviews diff (copy, images, Markdown impact, card count = 3).
6. Maintainer **merges** PR (editors cannot merge to `main`).
7. GitHub Actions builds Astro and deploys GitHub Pages from `main`.

## Guarantees

| Guarantee | Rule |
|-----------|------|
| No direct production edit | Editorial workflow + branch protection; no editor merge to `main` |
| Reviewable history | Saves appear as Git commits on workflow branches / PRs |
| No CloudCannon | Day-to-day editing uses Decap only; CC config removed |
| Auth | Write collaborators only; others cannot publish via Decap |
| Static public site | Decap JS not required for visitors |

## Failure / edge behavior

| Case | Expected |
|------|----------|
| OAuth failure | No write; retry login |
| Invalid required field | Decap and/or Astro build blocks ship |
| Concurrent edits | Git/PR conflict resolution before merge |
| Card count ≠ 3 | Build fails; do not merge |

## Ops expectations (maintainers)

- GitHub OAuth App + OAuth proxy URL in `public/admin/config.yml`
- Branch protection on `main` (PR required; restricted merge roles)
- Document proxy URL and admin path in `docs/howto-decap.md`

Exact Decap UI labels may vary by version; behavior above is normative.
