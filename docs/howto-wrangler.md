**Wrangler** is the official Command Line Interface (CLI) tool created by Cloudflare to build, preview, test, and deploy Cloudflare Workers directly from your local terminal.

Instead of clicking through the browser dashboard, Wrangler lets you manage your Worker using code files, configuration manifests, and terminal commands—fitting directly into standard developer workflows and Git repositories.

---

## 1. How Wrangler Fits into the Setup

When setting up a Decap CMS proxy, Wrangler handles four main jobs:

1. **Authentication:** Connects your local terminal securely to your Cloudflare account.
2. **Configuration:** Reads a configuration file (`wrangler.toml`) that defines the Worker's name, custom routes, and environment variables.
3. **Secret Provisioning:** Uploads sensitive credentials (`GITHUB_OAUTH_ID` and `GITHUB_OAUTH_SECRET`) directly to Cloudflare's encrypted key-value store so they are never committed to Git.
4. **Deployment:** Bundles your JavaScript code and pushes it live to Cloudflare’s global edge network.

---

## 2. Core Wrangler Concepts & Files

When working with Wrangler locally, you interact with two main components:

### The `wrangler.toml` File

This is the central configuration file for your Worker. A minimal setup for a Decap OAuth proxy looks like this:

```toml
# The name of your Cloudflare Worker (determines the default workers.dev URL)
name = "springeloo-decap-oauth"

# The entry file containing your worker logic
main = "src/index.js"

# Specifies the runtime compatibility date
compatibility_date = "2026-01-01"

# Optional: Configuration if using a custom domain on Cloudflare
# route = { pattern = "decap-oauth.example.com", zone_name = "example.com", custom_domain = true }

# Non-secret environment variables can be declared here
[vars]
GITHUB_REPO_PRIVATE = "1"

```

### Essential Commands

| Command | What It Does |
| --- | --- |
| `npx wrangler login` | Opens a browser window to authenticate your local machine with your Cloudflare account. |
| `npx wrangler dev` | Starts a local development server that emulates the Cloudflare Worker environment for local testing. |
| `npx wrangler secret put <NAME>` | Prompts you to paste a secret (like an API token or Client Secret) and uploads it securely to Cloudflare. |
| `npx wrangler deploy` | Compiles your project and deploys it live to production. |

---

## 3. The Local Wrangler Workflow (Step-by-Step)

If you prefer using Wrangler over the Cloudflare browser dashboard, the setup flow operates as follows:

1. **Log In via Terminal:** Authenticate CLI with Cloudflare.
Run the login command to grant Wrangler access to your account:

```bash
npx wrangler login

```

This opens your browser. Confirm the prompt to authorize the CLI.


2. **Initialize Project & wrangler.toml:** Set up project files.
Clone the proxy repository or navigate to your Worker folder, then ensure `wrangler.toml` has your desired Worker name:

```toml
name = "springeloo-decap-oauth"
main = "index.js"
compatibility_date = "2026-01-01"

```


3. **Upload OAuth Credentials:** Keep secrets out of version control.
Store your GitHub OAuth app credentials securely in Cloudflare without putting them in code:

```bash
npx wrangler secret put GITHUB_OAUTH_ID
# Paste your GitHub Client ID when prompted

npx wrangler secret put GITHUB_OAUTH_SECRET
# Paste your GitHub Client Secret when prompted

```


4. **Deploy Live:** Push to Cloudflare's edge network.
Deploy the Worker code:

```bash
npx wrangler deploy

```

Terminal output will display your live proxy URL (e.g., `https://springeloo-decap-oauth.<subdomain>.workers.dev`).