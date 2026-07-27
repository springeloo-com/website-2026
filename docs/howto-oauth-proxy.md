# How to create a GitHub OAuth proxy for Decap CMS

This guide walks maintainers through setting up a **GitHub OAuth proxy** so
editors can sign into Decap CMS on the Springeloo static site (GitHub Pages).

The public site stays static. The proxy is a tiny separate service that only
handles OAuth — it never hosts the marketing pages and must never store secrets
in this website repository.

Related:

- [howto-decap.md](howto-decap.md) — editorial workflow
- [howto-deploy.md](howto-deploy.md) — GitHub Pages
- Decap config: `public/admin/config.yml`
- Admin UI: `https://springeloo-com.github.io/website-2026/admin/`

## Why you need a proxy

Decap’s GitHub backend authenticates editors with a **GitHub OAuth App**.

That flow needs a **client secret**. GitHub Pages (and any purely static host)
cannot keep that secret safely in the browser or in public repo files.

So you run a small server (usually a **Cloudflare Worker**) that:

1. Starts the GitHub login (`/auth`)
2. Receives GitHub’s callback (`/callback`)
3. Hands a token back to the Decap admin popup via `postMessage`

```text
Editor browser          OAuth proxy              GitHub
     |                      |                      |
     |  Login with GitHub   |                      |
     |--------------------->|  /auth               |
     |                      |--------------------->|
     |                      |  authorize           |
     |                      |<---------------------|
     |                      |  /callback + code    |
     |  token via popup     |                      |
     |<---------------------|                      |
     |  GitHub API (content)|                      |
     |-------------------------------------------->|
```

After login, Decap talks to the **GitHub API** directly with the user’s token.
The proxy is not a CMS backend and does not store site content.

## What you’ll end up with

| Piece | Springeloo example |
|-------|--------------------|
| Website (static) | `https://springeloo-com.github.io/website-2026/` |
| Decap admin | `https://springeloo-com.github.io/website-2026/admin/` |
| OAuth proxy URL | `https://springeloo-decap-oauth.<your-subdomain>.workers.dev` **or** `https://decap-oauth.yourdomain.com` |
| GitHub OAuth App | Owned by a Springeloo org/user admin |
| Decap `backend.base_url` | Same as the proxy URL (no trailing path) |

Pick your **PROXY URL** before you create the OAuth App — the callback URL must
match exactly.

Suggested names:

| Parameter | Suggestion |
|-----------|------------|
| **PROXY URL** | `https://springeloo-decap-oauth.<account>.workers.dev` (fastest) or a custom subdomain you control |
| Worker name | `springeloo-decap-oauth` |
| OAuth App name | `Springeloo Decap CMS` |

## Prerequisites

- Maintainer access to GitHub org/repo `springeloo-com/website-2026`
- Ability to create a **GitHub OAuth App** (user or org)
- A free [Cloudflare](https://dash.cloudflare.com/) account (recommended path below)
- Node.js + terminal (`npx wrangler …`)
- Optional: a DNS zone in Cloudflare if you want a custom proxy hostname

**Recommended implementation:** [sterlingwes/decap-proxy](https://github.com/sterlingwes/decap-proxy) (Cloudflare Worker built for Decap).

Alternatives (same idea, different host): other Decap-compatible OAuth Workers,
or a Railway one-click deploy of a decap-proxy variant. Endpoints must still be
`/auth` and `/callback`.

---

## Step 0 — Decide PROXY URL

Choose one:

### Option A — Cloudflare `workers.dev` (simplest)

1. Create/log into Cloudflare.
2. Note that after deploy, Wrangler will print a URL like:

   `https://springeloo-decap-oauth.<your-subdomain>.workers.dev`

3. Use that full origin (scheme + host, **no** `/auth`) as **PROXY URL**.

You can create the OAuth App after the first deploy if you need the exact
workers.dev hostname, or create the App with a provisional URL and update it.

### Option B — Custom subdomain

Example: `https://decap-oauth.example.com`

Requirements:

- Domain zone managed in Cloudflare (or routable to a Worker)
- You’ll set a Worker route / custom domain later

Use this full origin as **PROXY URL**.

---

## Step 1 — Create the GitHub OAuth App

1. Open GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**  
   Org apps: `https://github.com/organizations/<org>/settings/applications`  
   User apps: [https://github.com/settings/applications/new](https://github.com/settings/applications/new)

2. Fill in:

   | Field | Value |
   |-------|--------|
   | **Application name** | `Springeloo Decap CMS` (or similar) |
   | **Homepage URL** | Your **PROXY URL** (e.g. `https://springeloo-decap-oauth.….workers.dev`) |
   | **Authorization callback URL** | **PROXY URL** + `/callback` (e.g. `https://….workers.dev/callback`) |
   | Application description | Optional |

   Important:

   - Callback must be exactly `{PROXY URL}/callback` (no trailing slash after
     `callback`, HTTPS required).
   - Homepage URL should be the proxy origin (per decap-proxy docs), not the
     GitHub Pages site URL.

3. Click **Register application**.

4. Copy the **Client ID**.

5. Click **Generate a new client secret**, copy the **Client secret** once.
   Store it in a password manager. It will not be shown again.

6. Do **not** commit Client ID/secret into `website-2026`.

Who owns the App?

- Prefer an **organization** OAuth App under `springeloo-com` so it survives
  staff changes.
- The App authorizes users; Decap still needs each editor to be a GitHub
  **write** collaborator on `website-2026`.

---

## Step 2 — Deploy the OAuth proxy (Cloudflare Worker)

### 2.1 Clone decap-proxy (separate from the website repo)

```bash
git clone https://github.com/sterlingwes/decap-proxy.git
cd decap-proxy
cp wrangler.toml.sample wrangler.toml
```

Do not put this Worker source inside the public Springeloo site repo unless you
explicitly want a monorepo ops layout. Secrets must stay out of Pages builds.

### 2.2 Edit `wrangler.toml`

Set at least:

```toml
name = "springeloo-decap-oauth"
```

**If the website repo is private**, set:

```toml
[vars]
GITHUB_REPO_PRIVATE = "1"
```

(Exact key/value may follow the sample file comments — use the sample’s
`GITHUB_REPO_PRIVATE` convention.)

**If you use a custom domain**, uncomment/adapt the route (example):

```toml
route = { pattern = "decap-oauth.example.com", zone_name = "example.com", custom_domain = true }
```

Optionally disable the default workers.dev hostname:

```toml
workers_dev = false
```

Only do that after the custom domain works.

### 2.3 Log in to Cloudflare

```bash
npx wrangler login
```

Or set `CLOUDFLARE_ACCOUNT_ID` + `CLOUDFLARE_API_TOKEN` (token template:
**Edit Cloudflare Workers**).

### 2.4 Deploy once (to get the workers.dev URL if needed)

```bash
npx wrangler deploy
```

Copy the printed Worker URL → that is your **PROXY URL** if you use Option A.

If the OAuth App callback was provisional, update the GitHub OAuth App’s
**Homepage URL** and **Authorization callback URL** to match
`{PROXY URL}` and `{PROXY URL}/callback`.

### 2.5 Add OAuth secrets to the Worker

Via CLI (recommended):

```bash
npx wrangler secret put GITHUB_OAUTH_ID
# paste Client ID

npx wrangler secret put GITHUB_OAUTH_SECRET
# paste Client secret
```

Or in Cloudflare dashboard:

**Workers & Pages → your worker → Settings → Variables and Secrets → Add**  
Type: **Secret** for both `GITHUB_OAUTH_ID` and `GITHUB_OAUTH_SECRET`.

Redeploy if the dashboard asks you to:

```bash
npx wrangler deploy
```

### 2.6 Smoke-test the proxy

1. Open **PROXY URL** in a browser.  
   Expected: a simple “Hello” (or health) page from decap-proxy — proves DNS/Worker routing.
2. Open `{PROXY URL}/auth` briefly.  
   Expected: redirect toward GitHub’s authorize page (you can cancel).

If `/auth` 404s, the Worker deploy or route is wrong.

---

## Step 3 — Point Decap at the proxy

In this repo, edit `public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: springeloo-com/website-2026
  branch: main
  base_url: https://YOUR-REAL-PROXY-HOST   # PROXY URL, no trailing slash
  auth_endpoint: /auth
```

Rules:

- `base_url` = **PROXY URL** only (`https://host`), **not** `…/auth`
- `auth_endpoint` stays `/auth` (leading slash is fine with current Decap)
- `repo` must be exactly `owner/name`
- Keep `publish_mode: editorial_workflow`

Commit on a branch, open a PR, merge to `main`, wait for Pages deploy.

Local check (optional):

```bash
npm run build
npm run preview
# open http://localhost:4321/admin/
# (or …/website-2026/admin/ if PUBLIC_BASE_PATH=/website-2026/)
```

For local admin against the real GitHub backend, `base_url` must still be the
**deployed** proxy (HTTPS). A localhost proxy is possible but out of scope here.

---

## Step 4 — GitHub access and branch protection

OAuth login alone is not enough.

1. **Editors** = GitHub collaborators with **Write** on `website-2026`.
2. Protect **`main`**:
   - Require pull request before merging
   - Restrict who can merge (maintainers only)
   - Editors must be able to open/update PRs but **not** merge to `main`
3. Decap **editorial workflow** creates/updates PRs; production updates only
   after maintainer merge + Actions deploy.

---

## Step 5 — End-to-end verification

1. Open `https://springeloo-com.github.io/website-2026/admin/`
2. Click **Login with GitHub**
3. Approve the OAuth App (first time)
4. Confirm the Decap UI loads collections (Globals / Home)
5. Change a harmless text field (e.g. hero eyebrow), save
6. Confirm a PR toward `main` appears
7. Confirm production is **unchanged** until a maintainer merges
8. Maintainer merges → Pages deploy → text appears live

Also verify:

- A user **without** write access cannot publish
- An editor **cannot** merge the content PR to `main`

---

## Security checklist

- [ ] Client secret only in Cloudflare Worker secrets (or equivalent host secrets)
- [ ] Secret never committed to `website-2026` / never in `public/`
- [ ] OAuth callback URL is exactly `{PROXY URL}/callback`
- [ ] Proxy is HTTPS
- [ ] Repo write access limited to approved editors
- [ ] `main` branch protection enabled
- [ ] Rotate Client secret if it leaks; update Worker secret + redeploy

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Login popup closes / “Failed to authenticate” | Wrong `base_url` or callback mismatch | `base_url` = PROXY URL; GitHub callback = `{PROXY URL}/callback` |
| Redirect URI mismatch | OAuth App callback typo | Edit OAuth App; must match Worker host exactly |
| Proxy “Hello” works, Decap login fails | Secrets missing/wrong | Re-set `GITHUB_OAUTH_ID` / `GITHUB_OAUTH_SECRET`; redeploy |
| Auth OK, “repo not found” / cannot load entries | Wrong `repo` or private-repo flag | Check `springeloo-com/website-2026`; set private-repo var if needed |
| Auth OK, cannot save | No write permission | Grant collaborator **Write** |
| Save works, site unchanged | Expected | Merge PR to `main`; wait for Pages |
| CORS / blocked popup | Browser blocking popups | Allow popups for the admin origin |
| Admin 404 | Wrong Pages base path | Use `/website-2026/admin/` on the project site |
| Works on Pages, fails on localhost | Expected without tunnel | Test on deployed admin, or run a local proxy variant |

Official Decap notes:
[Using GitHub with an OAuth proxy](https://decapcms.org/docs/backends-overview/#using-github-with-an-oauth-proxy).

---

## Optional: custom domain for the proxy

1. Add the hostname in Cloudflare DNS (proxied).
2. Attach it to the Worker (custom domain / route in `wrangler.toml`).
3. Update GitHub OAuth App Homepage + Callback to the new host.
4. Update `backend.base_url` in `public/admin/config.yml`.
5. Redeploy Worker + merge site config.

---

## Optional: rotate secrets

1. GitHub OAuth App → generate new client secret.
2. `npx wrangler secret put GITHUB_OAUTH_SECRET`
3. Redeploy Worker.
4. Revoke/delete the old secret in GitHub when ready.
5. Ask editors to log in again if sessions break.

---

## What this proxy does *not* do

- It does **not** replace GitHub Pages or the Astro build
- It does **not** store YAML content
- It does **not** grant merge rights to `main`
- It does **not** remove the need for write collaborators
- It is **not** CloudCannon / Netlify Identity

---

## Quick reference (Springeloo)

```yaml
# public/admin/config.yml (after proxy is live)
backend:
  name: github
  repo: springeloo-com/website-2026
  branch: main
  base_url: https://REPLACE-WITH-PROXY-URL
  auth_endpoint: /auth
```

```bash
# Proxy deploy (in the decap-proxy clone)
npx wrangler login
npx wrangler secret put GITHUB_OAUTH_ID
npx wrangler secret put GITHUB_OAUTH_SECRET
npx wrangler deploy
```

```text
GitHub OAuth callback = {PROXY URL}/callback
Decap admin           = https://springeloo-com.github.io/website-2026/admin/
```
