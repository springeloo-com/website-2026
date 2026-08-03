# Cloudflare Dashboard: Decap OAuth proxy (no Wrangler)

The absolute easiest way to set this up—without setting up local repositories,
installing Node.js, or configuring Wrangler CLI—is to use the **Cloudflare
Dashboard Deploy + GitHub Web UI** workflow.

Here is the step-by-step path to deploy this proxy in under 5 minutes.

---

## 1. Create the GitHub OAuth App

Must be done first to obtain Client ID & Secret.

1. Go to **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Enter temporary placeholder URLs (you will update these after the Worker URL
   is known):
   - **Application name:** `Springeloo Decap CMS`
   - **Homepage URL:** `https://placeholder.workers.dev`
   - **Authorization callback URL:** `https://placeholder.workers.dev/callback`
3. Click **Register application**.
4. Copy the **Client ID**.
5. Click **Generate a new client secret** and copy the secret immediately.

---

## 2. Deploy the Worker via Cloudflare Dashboard

1. Log into your **Cloudflare Dashboard** → **Workers & Pages → Create**.
2. Click **Create Worker**, name it `springeloo-decap-oauth`, and click
   **Deploy**.
3. Click **Edit code** and replace the default worker with the script below.
4. Click **Save and Deploy**.
5. Copy your Worker URL (e.g.
   `https://springeloo-decap-oauth.mf-7e0.workers.dev`).

### Worker script (Decap-compatible)

This matches the handshake Decap expects (`authorizing:github` →
`authorization:github:success:{token}`), includes `provider=github`, and sends
the same `redirect_uri` on both authorize + token exchange.

```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = url.origin;
    // Must match GitHub OAuth App "Authorization callback URL" host+path.
    // Query ?provider=github is allowed by GitHub on top of the registered URL.
    const redirectUri = `${origin}/callback?provider=github`;

    if (url.pathname === "/" || url.pathname === "") {
      return new Response("Hello! Decap OAuth Proxy is running.", { status: 200 });
    }

    // Decap opens: {base_url}/auth?provider=github
    if (url.pathname === "/auth") {
      const provider = url.searchParams.get("provider");
      if (provider && provider !== "github") {
        return new Response("Invalid provider", { status: 400 });
      }
      if (!env.GITHUB_OAUTH_ID || !env.GITHUB_OAUTH_SECRET) {
        return new Response("Missing GITHUB_OAUTH_ID / GITHUB_OAUTH_SECRET", {
          status: 500,
        });
      }

      const authorize =
        "https://github.com/login/oauth/authorize" +
        `?client_id=${encodeURIComponent(env.GITHUB_OAUTH_ID)}` +
        `&scope=${encodeURIComponent("repo,user")}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}`;

      return Response.redirect(authorize, 302);
    }

    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      if (!code) {
        return new Response("Missing code parameter", { status: 400 });
      }

      const tokenResponse = await fetch(
        "https://github.com/login/oauth/access_token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "User-Agent": "Springeloo-Decap-OAuth-Proxy",
          },
          body: JSON.stringify({
            client_id: env.GITHUB_OAUTH_ID,
            client_secret: env.GITHUB_OAUTH_SECRET,
            code,
            // MUST match the redirect_uri used in /auth
            redirect_uri: redirectUri,
          }),
        },
      );

      const data = await tokenResponse.json();
      if (data.error || !data.access_token) {
        const msg = data.error_description || data.error || "No access_token";
        return new Response(
          `<!doctype html><pre>OAuth token error: ${msg}</pre>`,
          { status: 400, headers: { "Content-Type": "text/html;charset=UTF-8" } },
        );
      }

      // Escape token for safe embedding in JS string
      const tokenJson = JSON.stringify({ token: data.access_token });

      const html = `<!doctype html>
<html>
  <head><meta charset="utf-8" /><title>Authorizing Decap…</title></head>
  <body>
    <p>Authorizing Decap…</p>
    <script>
      (function () {
        function receiveMessage(message) {
          window.opener.postMessage(
            "authorization:github:success:" + ${JSON.stringify(tokenJson)},
            "*"
          );
          window.removeEventListener("message", receiveMessage, false);
        }
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:github", "*");
      })();
    </script>
  </body>
</html>`;

      return new Response(html, {
        headers: { "Content-Type": "text/html;charset=UTF-8" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};
```

---

## 3. Set secrets + fix GitHub OAuth App URLs

1. Worker → **Settings → Variables and Secrets** → add **Secrets**:
   - `GITHUB_OAUTH_ID` = GitHub Client ID
   - `GITHUB_OAUTH_SECRET` = GitHub Client Secret
2. Save / redeploy the Worker.
3. Update the GitHub OAuth App:
   - **Homepage URL:** `https://springeloo-decap-oauth.mf-7e0.workers.dev`
   - **Authorization callback URL:**  
     `https://springeloo-decap-oauth.mf-7e0.workers.dev/callback`  
     (no trailing slash; no `/auth`)

---

## 4. Decap `config.yml` (already in this repo)

```yaml
backend:
  name: github
  repo: springeloo-com/website-2026
  branch: main
  base_url: https://springeloo-decap-oauth.mf-7e0.workers.dev
  auth_endpoint: auth
  site_domain: springeloo-com.github.io
```

`base_url` = proxy origin only (no path). `auth_endpoint` = path segment Decap
appends (`/auth`).

---

## 5. How to test the OAuth handshake (important)

Do this in Chrome with DevTools open.

### A. Proxy health (no login)

1. Open  
   `https://springeloo-decap-oauth.mf-7e0.workers.dev/`  
   → must show `Hello! Decap OAuth Proxy is running.`
2. Open  
   `https://springeloo-decap-oauth.mf-7e0.workers.dev/auth?provider=github`  
   → must redirect to `github.com/login/oauth/authorize?...`

### B. Watch the popup handshake

1. Open https://springeloo-com.github.io/website-2026/admin/
2. DevTools → **Console** + **Network**
3. Click **Mit GitHub einloggen** (allow popups for this site)
4. In the **popup** DevTools (right‑click popup → Inspect):
   - After GitHub approval, URL should be  
     `…/callback?code=…&provider=github` (or `provider` in query)
   - Page text should say **Authorizing Decap…** (not an OAuth error)
   - Console should not show `window.opener is null`
5. In the **main admin** Console, filter for messages / errors:
   - Success: popup closes and collections UI appears
   - Fail: stuck on empty login, or console shows auth/API errors

### C. Manual postMessage check (advanced)

On the admin page Console, after a failed login attempt, you can see if Decap
is listening. The proxy must post:

1. `"authorizing:github"` (handshake)
2. then `"authorization:github:success:{\"token\":\"…\"}"`

If step 2 never happens, the Worker token exchange failed (secrets / callback
URL / `redirect_uri` mismatch). Open the popup URL: if you see
`OAuth token error: …`, fix that message first.

### D. Common failure → empty login screen

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Popup shows `OAuth token error` | Wrong secrets or callback mismatch | Re-check Client ID/Secret; callback URL exact |
| Popup stuck on “Authorizing…” | `window.opener` null / blocked | Allow popups; don’t open auth in same tab |
| Popup closes, admin empty | Bad/empty token or postMessage format | Use Worker script above; redeploy |
| Console: repo / 404 / 403 | No write access / wrong `repo` | Collaborator **write** on `springeloo-com/website-2026` |
| Works then blank dashboard | API/content load error | Network tab → `api.github.com` red requests |

---

## Quick Verification Checklist

- [ ] Proxy `/` returns Hello
- [ ] `/auth?provider=github` redirects to GitHub
- [ ] OAuth App callback = `{PROXY}/callback`
- [ ] Worker secrets set; Worker redeployed with script above
- [ ] `config.yml` `base_url` = proxy origin; `auth_endpoint: auth`
- [ ] Login popup shows **Authorizing Decap…** then closes
- [ ] Admin shows Site content collections (not empty login)
