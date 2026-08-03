The absolute easiest way to set this up—without setting up local repositories, installing Node.js, or configuring Wrangler CLI—is to use the **Cloudflare Dashboard Deploy + GitHub Web UI** workflow.

Here is the step-by-step path to deploy this proxy in under 5 minutes.

---

1. **Create the GitHub OAuth App:** Must be done first to obtain Client ID & Secret.
1. Go to **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Enter temporary placeholder URLs (you will update these in Step 3):
* **Application name:** `Springeloo Decap CMS`
* **Homepage URL:** `[https://placeholder.workers.dev](https://placeholder.workers.dev)`
* **Authorization callback URL:** `[https://placeholder.workers.dev/callback](https://placeholder.workers.dev/callback)`


3. Click **Register application**.
4. Copy the **Client ID**.
5. Click **Generate a new client secret** and copy the secret immediately.


2. **Deploy the Worker via Cloudflare Dashboard:** No CLI or local clone required.
1. Log into your **Cloudflare Dashboard** and navigate to **Workers & Pages → Create**.
2. Click **Create Worker**, name it `springeloo-decap-oauth`, and click **Deploy**.
3. Click **Edit code** to open the Cloudflare Web Editor.
4. Replace the default worker code with the lightweight `decap-proxy` Worker script below:

```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Health check endpoint
    if (url.pathname === "/" || url.pathname === "") {
      return new Response("Hello! Decap OAuth Proxy is running.", { status: 200 });
    }

    // 1. Redirect to GitHub OAuth page
    if (url.pathname === "/auth") {
      const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${env.GITHUB_OAUTH_ID}&scope=repo`;
      return Response.redirect(githubAuthUrl, 302);
    }

    // 2. Handle Callback from GitHub
    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      if (!code) return new Response("Missing code parameter", { status: 400 });

      const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "User-Agent": "Decap-Worker-Proxy"
        },
        body: JSON.stringify({
          client_id: env.GITHUB_OAUTH_ID,
          client_secret: env.GITHUB_OAUTH_SECRET,
          code: code
        })
      });

      const data = await tokenResponse.json();
      if (data.error) {
        return new Response(`OAuth Error: ${data.error_description || data.error}`, { status: 400 });
      }

      // Post message back to Decap CMS popup window
      const content = `
        <script>
          (function() {
            function recieveMessage(e) {
              window.opener.postMessage(
                'authorization:github:success:${JSON.stringify({ token: data.access_token, provider: "github" })}',
                e.origin
              );
            }
            window.addEventListener("message", recieveMessage, false);
            window.opener.postMessage("authorizing:github", "*");
          })()
        </script>
      `;

      return new Response(content, {
        headers: { "Content-Type": "text/html;charset=UTF-8" }
      });
    }

    return new Response("Not Found", { status: 404 });
  }
};

```

5. Click **Save and Deploy**.
6. Copy your Worker URL from the top left (e.g., `https://springeloo-decap-oauth.<your-subdomain>.workers.dev`).


3. **Set Environment Variables & Update GitHub OAuth App:** Connect proxy to secrets and fix callback matching.
1. In the Cloudflare Worker settings, go to **Settings → Variables and Secrets**.
2. Add two **Secret** environment variables:
* `GITHUB_OAUTH_ID` = *(Your GitHub Client ID)*
* `GITHUB_OAUTH_SECRET` = *(Your GitHub Client Secret)*


3. Click **Deploy / Save**.
4. Return to your **GitHub OAuth App** settings and update the URLs:
* **Homepage URL:** `https://springeloo-decap-oauth.<your-subdomain>.workers.dev`
* **Authorization callback URL:** `https://springeloo-decap-oauth.<your-subdomain>.workers.dev/callback`




4. **Update Decap Config in Website Repository:** Point Decap CMS to the deployed proxy host.
Edit `public/admin/config.yml` in `springeloo-com/website-2026`:

```yaml
backend:
  name: github
  repo: springeloo-com/website-2026
  branch: main
  base_url: https://springeloo-decap-oauth.<your-subdomain>.workers.dev
  auth_endpoint: /auth

```


---

## Quick Verification Checklist

* [ ] Opening `https://springeloo-decap-oauth.<subdomain>.workers.dev` returns `"Hello! Decap OAuth Proxy is running."`
* [ ] Opening `https://springeloo-decap-oauth.<subdomain>.workers.dev/auth` redirects to `[github.com/login/oauth/authorize](https://github.com/login/oauth/authorize)`.
* [ ] `base_url` in `config.yml` has **no trailing slash** and **no `/auth` path**.