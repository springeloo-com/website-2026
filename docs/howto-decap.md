# Decap CMS editorial workflow

Editors change copy and images in **Decap CMS**. The public site only updates
after a **maintainer merges** a pull request into `main` and GitHub Pages
deploys.

Saving in Decap is **not** publishing to production.

CloudCannon is **not** used anymore. Do not connect a CloudCannon site for
day-to-day editing.

## Roles

| Role | Can edit content | Can merge to `main` | Deploys production |
|------|------------------|---------------------|--------------------|
| Content editor (GitHub **write** collaborator) | Yes (in-scope fields via Decap) | No | No |
| Developer / maintainer | Yes | Yes | Via merge + Actions |

Editors authenticate with **GitHub OAuth**. Users without repository write
access cannot publish edits through Decap. Branch protection must prevent
editors from merging to `main`.

## Admin URL

After deploy, open:

- Project site (this repo): `https://springeloo-com.github.io/website-2026/admin/`
- Local: `http://localhost:4321/admin/` (or with base path:
  `http://localhost:4321/website-2026/admin/` when `PUBLIC_BASE_PATH=/website-2026/`)

Config lives at `public/admin/config.yml` (served next to the admin UI).
Decap JS is copied into `public/admin/decap-cms.js` at build time from the
`decap-cms` **UMD** package (includes React). Do not use `decap-cms-app` with a
plain `<script>` tag — that causes a `__CLIENT_INTERNALS…` React crash.

**Important:** “View Source” shows an empty `<body>`. That is normal. After the
script runs you should see **Mit GitHub einloggen** and an `#nc-root` node in
DevTools → Elements.

### Health check (curl / wget)

```bash
npm run check:decap
# or: bash scripts/check-decap.sh
```

## Happy path

1. Open the Decap admin URL and sign in with **GitHub**.
2. Edit an in-scope field (home hero, Leistungen cards, globals nav labels,
   footer/contact).
3. Save → Decap uses **editorial workflow** (creates/updates a **pull request**
   toward `main`). Production is unchanged until merge.
4. Maintainer reviews the diff (copy, images, Markdown HTML impact, still
   exactly three Leistungen cards).
5. Maintainer merges the PR.
6. GitHub Actions builds Astro and deploys GitHub Pages from `main`.

## Maintainer setup (required once)

### 1. GitHub OAuth App + OAuth proxy

GitHub Pages is static and cannot hold OAuth client secrets. Decap’s GitHub
backend needs a small **OAuth proxy** (serverless/edge).

**Full step-by-step:** [howto-oauth-proxy.md](howto-oauth-proxy.md)
(Cloudflare Worker via `decap-proxy`, GitHub OAuth App, secrets, Decap
`base_url`, verification, and troubleshooting).

Summary:

1. Create a **GitHub OAuth App** with callback `{PROXY URL}/callback`.
2. Deploy the OAuth proxy; store **client id/secret** only as proxy secrets.
3. In `public/admin/config.yml`, set `backend.base_url` to the proxy origin
   (replace `https://YOUR-OAUTH-PROXY.example`).

### 2. Branch protection on `main`

1. Require a pull request before merging.
2. Restrict who can merge (maintainers only).
3. Ensure write collaborators can open PRs but cannot merge to `main`.

### 3. Confirm Decap config

- `publish_mode: editorial_workflow`
- Media: `media_folder: public/uploads`, `public_folder: /uploads`
- Collections map to `src/content/site/globals.yaml` and
  `src/content/pages/home.yaml`
- CTA/nav/legal **href** fields use hidden widgets (developer-controlled)
- Leistungen cards: `min: 3` / `max: 3` / `allow_add: false`

## What editors can change

| Surface | Fields |
|---------|--------|
| Home | SEO title/description, hero text, hero image + alt, CTA **labels**, three Leistungen cards (eyebrow, title, Markdown body, optional image + alt, CTA **label**) |
| Globals | Brand name, nav **labels**, footer/contact text, legal **labels** |

Not editable in Decap: layout, spacing, colors, routes, CTA/nav **hrefs**,
card count, other page bodies, home carousel slides.

## Media

Uploads go to `public/uploads/`. Paths in YAML stay like `/uploads/….jpg`.
Always set meaningful **alt** text.

## Local / without Decap UI

You can still edit the YAML files in Git:

| What | File |
|------|------|
| Home | `src/content/pages/home.yaml` |
| Globals | `src/content/site/globals.yaml` |
| Uploads | `public/uploads/` |

Then `npm run build` and open a PR to `main`.

## Checklist before merge

- [ ] Text matches approved wording
- [ ] Images optimized; meaningful alt text
- [ ] Still exactly three Leistungen cards
- [ ] Href destinations unchanged unless a developer intended that
- [ ] `npm run build` succeeds
- [ ] Spot-check desktop + mobile

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Cannot log in | OAuth proxy / `base_url` not set | Complete maintainer OAuth setup |
| Save does nothing / auth error | No write access | Add user as GitHub collaborator with write |
| Production unchanged after save | Expected | Wait for maintainer merge + Pages deploy |
| Build fails on card count | ≠ 3 cards | Restore exactly three cards in YAML |
| Admin 404 on Pages | Wrong base path | Use `/website-2026/admin/` for the project site |
| **Save fails: `API_ERROR: Resource not accessible by integration`** | Org blocks OAuth App / missing write / stale token scopes | See section below |

### Save fails: `Resource not accessible by integration`

Login can work while **save** fails. Decap’s editorial workflow creates a
branch + PR via the GitHub API; that needs a user OAuth token with **write**
access to `springeloo-com/website-2026`, and the org must **allow** the OAuth
App.

Fix in order:

1. **Repo access**  
   GitHub → `springeloo-com/website-2026` → **Settings → Collaborators**  
   Your user needs **Write** (or be an org owner).

2. **Approve the OAuth App for the organization** (required when org
   “OAuth App access restrictions” are on — exact Decap/save error text)  
   Org owner opens:  
   `https://github.com/organizations/springeloo-com/settings/oauth_application_policy`  
   (or **Organization settings → Third-party access**)  
   Find **Springeloo Decap CMS** (or your OAuth App / Client ID `Ov23…`) →
   **Grant** access to the org. Until Grant, login + read can work while
   save / create-ref returns **403**.

3. **Re-authorize with full scopes**  
   Ensure the Cloudflare Worker `/auth` requests `scope=repo,user` (see
   [howto-claudflare.md](howto-claudflare.md)).  
   Then: GitHub → **Settings → Applications → Authorized OAuth Apps** → revoke
   **Springeloo Decap CMS** → open `/admin/` again → **Mit GitHub einloggen**
   and accept the permissions prompt.

4. **Confirm in Chrome DevTools → Network** when saving  
   Look for a red `api.github.com` request (often creating a ref, commit, or
   pull request). Status **403** with that message = still permissions/org
   policy, not Decap field config.

5. **Optional bisect** (maintainer only): temporarily set
   `publish_mode: simple` in `public/admin/config.yml` and save again.  
   - If simple works but editorial fails → focus on PR create permissions /
     branch protection exceptions for the editor.  
   - If both fail → org OAuth approval / write access still wrong.  
   Keep `editorial_workflow` for production once fixed.

### Prove write with curl (full chain)

The Cloudflare Worker is only an OAuth **proxy**. It forwards the logged-in
user’s GitHub rights; it does not invent write access.

```bash
# A) Proxy + authorize URL (no token needed)
bash scripts/check-oauth-chain.sh

# B) After Decap login — paste token from DevTools → Network → api.github.com
export GH_TOKEN='gho_...'
bash scripts/check-oauth-chain.sh

# C) Optional maintainer — also prove Client ID/Secret own that token
export GITHUB_OAUTH_ID='Iv23...'
export GITHUB_OAUTH_SECRET='...'
export GH_TOKEN='gho_...'
bash scripts/check-oauth-chain.sh
```

Pass = authorize `scope` includes `repo`, token prefix `gho_`,
`x-oauth-scopes` includes `repo`, create-ref **HTTP 201**.

Also: [howto-check-oauth-write.md](howto-check-oauth-write.md)

## Related

- [howto-check-oauth-write.md](howto-check-oauth-write.md) — token capability checks
- [howto-oauth-proxy.md](howto-oauth-proxy.md) — create GitHub OAuth App + proxy
- [howto-edit-content.md](howto-edit-content.md) — field map and local edits
- [howto-deploy.md](howto-deploy.md) — GitHub Pages deploy
- Spec quickstart: `specs/003-decap-cms-migration/quickstart.md`
