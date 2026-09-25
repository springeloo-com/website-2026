# PRD: Fix Sveltia CMS stale editorial branch (“ref already exists”)

| Field | Value |
|-------|--------|
| Status | Draft |
| Date | 2026-09-25 |
| Owner | Maintainers (website-2026) |
| Related | `publish_mode: editorial_workflow`, collection `site` / entry `projektunterstuetzung` |
| Symptom | Admin save fails with: `A ref named "refs/heads/cms/site/projektunterstuetzung" already exists in the repository.` |

---

## 1. Problem statement

Editors using Sveltia CMS at `/admin/` cannot reliably save changes (including image uploads) for some Site entries. The UI shows a generic save error; the underlying GitHub API error is that the CMS tried to **create** a Git branch that **already exists**.

This blocks the editorial path for Projektunterstützung (and can hit any entry with the same leftover branch pattern).

### Observed error

```text
There was an error while saving the entry. Please try again later.
A ref named "refs/heads/cms/site/projektunterstuetzung" already exists in the repository.
```

---

## 2. Why this happens (root cause)

### How editorial workflow is supposed to work

With `publish_mode: editorial_workflow` in `public/admin/config.yml`:

1. Editor saves an entry (YAML and/or media under `public/uploads/`).
2. Sveltia/Decap-compatible backend creates (or reuses) a **per-entry branch**:
   - Pattern: `cms/{collection}/{entry}`  
   - Example: collection `site` + file `projektunterstuetzung` →  
     `cms/site/projektunterstuetzung`
3. It opens or updates a **PR into `main`**.
4. Maintainer merges → GitHub Pages deploys from `main`.

Saving a picture is not a special path: media is committed on that same CMS branch together with the YAML that references `/uploads/…`.

### What went wrong

GitHub rejects **creating** a ref that already exists (`422 Unprocessable Entity` / “A ref named … already exists”).

That means:

- Branch `cms/site/projektunterstuetzung` is **still on the remote**, and  
- The CMS save path attempted **`POST /git/refs` (create)** instead of **updating** the existing branch tip / open draft.

Typical ways the branch becomes “orphaned” relative to the CMS UI:

| Scenario | Result |
|----------|--------|
| PR was **merged** but the branch was **not deleted** | Next save tries to create `cms/…` again → fail |
| PR was **closed** without delete-branch | Same |
| Editor abandoned a draft; branch left behind | Same |
| CMS UI no longer shows an open draft, but GitHub still has the branch | Same (status desync) |
| Race / bug: CMS does not look up existing `cms/…` before create | Same even with an open PR |

So this is primarily an **editorial-branch lifecycle / reuse** failure, not a broken image widget and not (by itself) an OAuth login problem. OAuth write access is required to create/update refs, but the specific message names an **already-existing** ref.

### Immediate operational workaround (today)

1. In GitHub → **Branches** (or PRs), find `cms/site/projektunterstuetzung`.
2. If an open PR exists for it: finish review (merge or close intentionally).
3. **Delete** the branch after merge/close (or delete the orphan branch if no PR).
4. Retry save in `/admin/` — CMS can create a fresh `cms/site/projektunterstuetzung` (+ PR).

Enable **Settings → General → Pull Requests → Automatically delete head branches** so merged CMS branches do not pile up.

---

## 3. Goals

1. Editors can save any Site entry (text + images) without hitting “ref already exists”.
2. Re-saving the same entry updates the existing editorial branch / PR when a draft is already open.
3. After merge (or intentional discard), the next save starts a clean new branch/PR without manual branch cleanup becoming the normal workflow.
4. Maintainers have a documented recovery path and light automation for leftover `cms/*` branches.

### Non-goals

- Replacing Sveltia CMS or abandoning PR-based editorial review.
- Direct commits to `main` from editors (`publish_mode: simple` only as temporary diagnostics).
- Rewriting media storage off Git / `public/uploads/`.
- Full legal CMS compliance beyond this reliability fix.

---

## 4. Users & jobs to be done

| Persona | Job |
|---------|-----|
| Content editor | Change copy or upload an image on Projektunterstützung (or any Site file) and save successfully every time |
| Maintainer | Review a clear PR, merge, and trust the next editorial save will work without hunting stale branches |
| Developer | Prefer a durable fix in workflow/tooling over repeated manual deletes |

---

## 5. Requirements

### P0 — Unblock editors (ops)

- **R1**: Document the error, cause, and delete-branch workaround in `docs/howto-cms.md` (troubleshooting table).
- **R2**: Enable GitHub “Automatically delete head branches” on `springeloo-com/website-2026` (or org default).
- **R3**: Inventory and delete stale `cms/**` branches that have no open PR (or close abandoned PRs + delete heads).

### P1 — Durable product behavior

- **R4**: On save, if `refs/heads/cms/{collection}/{entry}` already exists, the CMS path MUST **update** that branch (new commit on tip) and open/update the PR — never fail solely because the ref exists.
- **R5**: If the open PR was already merged/closed but the branch remains, save MUST either:
  - **A)** delete/recreate the branch from `main` and open a new PR, or  
  - **B)** reset the existing branch to `main` + new commit and open a new PR,  
  with clear UI status (“previous draft was published; starting a new draft”).
- **R6**: After successful merge of a CMS PR, head branch deletion MUST be automatic (GitHub setting and/or post-merge Action).
- **R7**: Admin UI SHOULD surface the GitHub error text (or a mapped German message) instead of only “Please try again later,” including a hint to reopen the existing draft or contact a maintainer if a stale branch is detected.

### P2 — Guardrails & observability

- **R8**: Optional GitHub Action (scheduled or on `workflow_dispatch`) lists `cms/**` branches older than N days without an open PR and opens an issue or posts a summary for maintainers.
- **R9**: Smoke checklist in CMS how-to: save → confirm PR branch name → merge with delete-on-merge → save again on same entry → expect new PR, no ref error.
- **R10**: Prefer fixing via Sveltia config/upstream behavior or a thin wrapper script; avoid forking the CMS bundle unless upstream cannot meet R4–R5 within a release cycle.

---

## 6. Solution options (decision needed)

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A. Ops + GitHub settings only** | Delete stale branches; enable delete-on-merge; document workaround | Fast | Recurs if CMS still “create-only” when branch exists without open draft |
| **B. Upstream / Sveltia fix** | Ensure editorial save reuses or recovers existing `cms/…` refs | Correct long-term | Depends on Sveltia release / config flags |
| **C. Repo automation** | Action deletes orphaned `cms/**` after merge or on schedule | Reduces recurrence | Does not fix concurrent open-draft reuse bugs |
| **D. Temporary `publish_mode: simple`** | Direct commits to `main` | Unblocks save | Breaks maintainer review contract — **reject for production** |

**Recommended direction:** A + C immediately; pursue B for R4–R5; keep D only for maintainer diagnostics.

---

## 7. Success metrics

- Zero editor reports of “ref already exists” for 30 days after fix.
- Same entry can be saved twice in a row (open draft update) without error.
- After merge + delete-on-merge, a third save creates a new PR successfully.
- Time-to-recover from a stale branch ≤ 5 minutes using the how-to (or automatic).

---

## 8. Acceptance criteria

1. Given an open PR on `cms/site/projektunterstuetzung`, when an editor changes an image and saves, then a new commit appears on that branch / PR updates — no create-ref error.
2. Given the PR was merged and the head branch deleted, when the editor saves again, then a new branch + PR are created successfully.
3. Given a leftover `cms/site/projektunterstuetzung` with **no** open PR, when the editor saves, then the system recovers per R5 (or automation deleted the orphan beforehand) and save succeeds.
4. `docs/howto-cms.md` documents this error and the recovery steps.
5. Delete-on-merge (or equivalent Action) is enabled and verified on one CMS PR.

---

## 9. Risks & open questions

| Risk / question | Notes |
|-----------------|--------|
| Sveltia version behavior | Confirm whether current `@sveltia/cms` already supports reuse and fails only on orphans |
| Permissions | Editors need write to create/update refs and open PRs; maintainers merge |
| Concurrent editors | Two people editing the same entry share one `cms/…` branch — last commit wins; acceptable for now? |
| Media-only commits | Large binaries on long-lived CMS branches; prefer short-lived PRs |
| Naming collisions | Fixed branch names per entry are by design; lifecycle hygiene is mandatory |

**Open question for implementers:** Prefer R5 option A (delete + recreate) vs B (force-reset branch) given branch protection and collaborator rights.

---

## 10. Implementation sketch (out of scope for coding until approved)

1. Unblock: delete `cms/site/projektunterstuetzung` (and siblings) as needed; enable delete-on-merge.
2. Docs: troubleshooting row + short “CMS branches” section in `docs/howto-cms.md`.
3. Investigate Sveltia editorial draft status API / GitHub listing of open PRs with head `cms/…`.
4. Add orphan-branch cleanup Action if upstream reuse is insufficient.
5. Verify acceptance criteria on staging/production admin against real GitHub.

---

## 11. Appendix — mapping to this repo

| Item | Value |
|------|--------|
| Admin | `https://springeloo-com.github.io/website-2026/admin/` |
| Config | `public/admin/config.yml` → `publish_mode: editorial_workflow` |
| Collection / entry | `site` / `projektunterstuetzung` |
| Content file | `src/content/pages/projektunterstuetzung.yaml` |
| Media | `public/uploads/` → `/uploads/…` |
| Existing contract | `specs/006-sveltia-cms/contracts/editorial-workflow.md` |
