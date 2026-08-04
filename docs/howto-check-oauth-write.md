# How to verify Decap GitHub write access

**Important:** The OAuth App **Client ID** and **Client Secret** never write to
the repo. They only mint a **user access token**. Write capability depends on:

1. **Scopes** on that token (`repo` required for Decap saves / PRs)
2. The **user’s** role on `springeloo-com/website-2026` (must be Write+)
3. Org **OAuth App approval** for `springeloo-com`

If any of those fail, Decap login can still work while save fails with  
`API_ERROR: Resource not accessible by integration`.

## Reading a failing check script result

Example of a **failing but informative** run:

```text
x-oauth-scopes:            ← EMPTY (bad)
permissions= { … 'push': True … }
create ref HTTP 403
Resource not accessible by integration
```

What this means:

| Signal | Meaning |
|--------|---------|
| `push: true` | Your **user** `tkamsker` is allowed to push as a collaborator |
| Empty `x-oauth-scopes` | This token is **not** a classic OAuth token with `repo` |
| `Resource not accessible by integration` | GitHub treats the caller as an **App/integration** without write, or an OAuth App blocked for org writes |

So the Client ID/Secret path is minting the **wrong kind of token** (or a token without `repo`), even though your personal admin rights look fine.

### Fix this specific case

1. **Check token prefix** (first characters of `GH_TOKEN`):
   - `gho_` = classic OAuth (correct for Decap)
   - `ghu_` / `ghs_` = GitHub **App** token → wrong credentials in the Worker
   - `ghp_` / `github_pat_` = PAT you pasted by mistake

2. **Confirm you created an OAuth App, not a GitHub App**  
   GitHub → Settings → Developer settings → **OAuth Apps**  
   (not “GitHub Apps”). Put **that** Client ID/Secret into the Worker.

3. **Confirm authorize URL asks for repo**  
   While logging in, popup URL must contain `scope=repo%2Cuser` or `scope=repo,user`.  
   If missing → Worker still has old code → paste script from
   `docs/howto-claudflare.md` → Save & Deploy.

4. **Revoke + re-login** (mandatory after scope/app fix)  
   GitHub → Settings → Applications → Authorized OAuth Apps → revoke
   Springeloo Decap CMS → `/admin/` login again.

5. **Org OAuth policy** (org owner)  
   https://github.com/organizations/springeloo-com/settings/oauth_application_policy  
   Approve the OAuth App for `springeloo-com`.

6. Re-run:

```bash
export GH_TOKEN='gho_...'   # new token after re-login
bash scripts/check-oauth-write.sh
```

**Pass looks like:** `x-oauth-scopes: repo, user` (or similar including `repo`) **and** create-ref **HTTP 201**.

---

## 1. Confirm the Worker asks for write scopes

Open the authorize URL (or click Login and inspect the popup address bar):

```text
https://github.com/login/oauth/authorize?client_id=…&scope=repo%2Cuser&redirect_uri=…
```

You must see `scope=repo,user` (or at least `repo`).

If the Worker still has an old script with a weaker scope, redeploy the script
from `docs/howto-claudflare.md`, then **revoke** the app and log in again.

Check Worker secrets exist (values stay secret — only names):

- Cloudflare → Worker `springeloo-decap-oauth` → Settings → Variables
- `GITHUB_OAUTH_ID`
- `GITHUB_OAUTH_SECRET`

Wrong secret → login/token exchange fails (usually not a silent read-only save).

---

## 2. Capture the live token after Decap login

1. Open https://springeloo-com.github.io/website-2026/admin/ and log in.
2. Chrome DevTools → **Application** → **Local Storage**  
   (or **Session Storage**) for that origin.
3. Look for a Decap / Netlify CMS key that stores a GitHub token  
   (often under a key containing `decap`, `netlify-cms`, or `github`).
4. Or DevTools → **Network** → filter `api.github.com` → open any request →
   **Request Headers** → `Authorization: token gho_…` or `Bearer gho_…`.

Copy the token into your shell (do **not** commit it):

```bash
export GH_TOKEN='gho_xxxxxxxx'   # paste only in your terminal
```

---

## 3. Check token scopes (must include `repo`)

```bash
curl -sS -I -H "Authorization: token $GH_TOKEN" \
  https://api.github.com/user | grep -iE '^(HTTP|x-oauth-scopes|x-accepted-oauth-scopes):'
```

**OK example:**

```text
HTTP/2 200
x-oauth-scopes: repo, user
```

**Not OK:**

- Missing `repo` → revoke app, fix Worker scope, log in again
- `HTTP/2 401` → bad/expired token; log in again

---

## 4. Check repo permission for this token

```bash
# Who am I?
curl -sS -H "Authorization: token $GH_TOKEN" \
  https://api.github.com/user | python3 -c 'import sys,json; u=json.load(sys.stdin); print(u["login"])'

# Permission on the Springeloo site repo
curl -sS -H "Authorization: token $GH_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/springeloo-com/website-2026" \
  | python3 -c 'import sys,json; r=json.load(sys.stdin); print("permissions:", r.get("permissions")); print("private:", r.get("private"))'
```

**OK:** `permissions` includes `"push": true` (and usually `"pull": true`).

**Not OK:**

- `"push": false` → user is only a reader; grant **Write** on the repo
- `404` / `"message": "Not Found"` → org is hiding the repo from this OAuth App  
  → approve the app for org `springeloo-com` (step 5)

---

## 5. Prove write with a dry API call (safe)

Create a throwaway branch ref from `main` tip (delete it afterwards):

```bash
SHA=$(curl -sS -H "Authorization: token $GH_TOKEN" \
  https://api.github.com/repos/springeloo-com/website-2026/git/ref/heads/main \
  | python3 -c 'import sys,json; print(json.load(sys.stdin)["object"]["sha"])')

echo "main sha=$SHA"

# Try to create a test branch
curl -sS -o /tmp/gh-write.json -w "HTTP %{http_code}\n" \
  -X POST -H "Authorization: token $GH_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/springeloo-com/website-2026/git/refs \
  -d "{\"ref\":\"refs/heads/cms-write-test\",\"sha\":\"$SHA\"}"

cat /tmp/gh-write.json
```

| Result | Meaning |
|--------|---------|
| **HTTP 201** | Token can write refs → Decap editorial save should work |
| **HTTP 403** + `Resource not accessible by integration` | Org OAuth policy / wrong app type / no push |
| **HTTP 404** | App not allowed to see org repo |
| **HTTP 422** (ref exists) | Branch name already exists — delete it or pick another name |

Clean up if created:

```bash
curl -sS -X DELETE -H "Authorization: token $GH_TOKEN" \
  https://api.github.com/repos/springeloo-com/website-2026/git/refs/heads/cms-write-test
```

---

## 6. Org OAuth approval checklist (owners)

1. Open  
   https://github.com/organizations/springeloo-com/settings/oauth_application_policy
2. Ensure third-party OAuth access is not blocking the app.
3. Approve **Springeloo Decap CMS** for the organization / this repository.
4. Confirm the app is an **OAuth App** (Developer settings → OAuth Apps),  
   **not** a GitHub App, unless you intentionally built a GitHub App flow.

Also: repo → **Settings → Collaborators and teams** → editor has **Write**.

---

## 7. After fixing: force a fresh token

1. GitHub → Settings → Applications → **Authorized OAuth Apps** → revoke
   Springeloo Decap CMS
2. Hard-refresh `/admin/` → log in again
3. Repeat steps 3–5 with the **new** token
4. Save a tiny text change in Decap → expect a PR, not a 403

---

## Quick map

| Check | Command / place | Pass looks like |
|-------|-----------------|-----------------|
| Scope requested | Authorize URL / Worker | `scope=repo,user` |
| Secrets present | Cloudflare Worker vars | ID + Secret set |
| Token scopes | `curl -I …/user` | `x-oauth-scopes: … repo …` |
| Push right | `…/repos/…/website-2026` | `"push": true` |
| Org allows app | Org OAuth policy page | App granted |
| Write works | POST `git/refs` | HTTP **201** |

Related: `docs/howto-decap.md`, `docs/howto-claudflare.md`.
