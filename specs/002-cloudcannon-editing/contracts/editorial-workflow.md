# Contract: Editorial Workflow

**Feature**: `002-cloudcannon-editing`  
**Actors**: Content editor, Developer/maintainer, GitHub Actions (deploy)

## Happy path

1. Editor authenticates to CloudCannon site linked to this GitHub repo.
2. Editor updates an in-scope field (see `editable-fields.md`).
3. Editor saves → CloudCannon commits to the configured **content branch**.
4. A pull request targeting `main` is created or updated.
5. Developer/maintainer reviews diff (copy, images, Markdown HTML impact).
6. Developer/maintainer merges PR.
7. GitHub Actions builds Astro and deploys Pages from `main`.

## Guarantees

| Guarantee | Rule |
|-----------|------|
| No direct production edit | Editors cannot push/merge to `main` |
| Reviewable history | Every save that changes content yields a Git commit on the content branch |
| Preview vs production | Production reflects content only after `main` merge |
| Role separation | Merge permission = developer/maintainer |

## Failure / edge behavior

| Case | Expected |
|------|----------|
| Invalid/empty required field | CloudCannon validation and/or Astro build failure; do not merge |
| Image upload fail | Previous image retained or explicit placeholder; page usable |
| Concurrent edits | Git/PR conflict resolution before merge |
| Rich text heading mess | Reviewer rejects or fixes before merge |

## CloudCannon configuration expectations

- Branching / publishing mode aligned with content-branch + PR
- Editor permissions: content files only; no merge to `main`
- Maintainer permissions: merge PRs; manage config

Exact CloudCannon UI labels may vary by plan; behavior above is normative.
