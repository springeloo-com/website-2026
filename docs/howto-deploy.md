# How to deploy (GitHub Pages)

This site is a static Astro build. GitHub Actions builds it and publishes the
`dist/` folder to GitHub Pages.

## Prerequisites

- Repo on GitHub
- Node.js 22+ locally (only needed for local preview)
- Permission to change **Settings → Pages** and **Actions**

## 1. Enable GitHub Pages

1. Open the repo on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.

Do not use “Deploy from a branch” for this project — the workflow uploads a
Pages artifact.

## 2. Set repository variables (recommended)

Go to **Settings → Secrets and variables → Actions → Variables**.

| Variable | When to set | Example |
|----------|-------------|---------|
| `PUBLIC_SITE_URL` | Always recommended | `https://your-org.github.io` or `https://your-org.github.io/website-2026` |
| `PUBLIC_BASE_PATH` | Only for **project** sites | `/website-2026/` |

### Which base path?

- **User/org site** (`username.github.io`) or custom domain later → leave
  `PUBLIC_BASE_PATH` unset (defaults to `/`).
- **Project site** (`username.github.io/repo-name`) → set
  `PUBLIC_BASE_PATH=/repo-name/` (leading and trailing slash).

Wrong `base` breaks CSS, images, and internal links.

## 3. Deploy

### Automatic

Push to one of these branches:

- `main`
- `master`
- `001-springeloo-website`

The workflow `.github/workflows/deploy.yml` runs on push and on manual
**workflow_dispatch**.

### Manual

1. **Actions → Deploy to GitHub Pages**
2. **Run workflow**
3. Choose the branch
4. Wait until both **build** and **deploy** jobs are green

The live URL appears on the deploy job summary / Pages settings.

## 4. Verify

1. Open the Pages URL.
2. Check all five routes:
   - `/`
   - `/projektunterstuetzung`
   - `/produkte`
   - `/kontakt`
   - `/springeloo`
3. Confirm styles and images load (if not, fix `PUBLIC_BASE_PATH`).
4. View page source: `canonical` / Open Graph URLs should match
   `PUBLIC_SITE_URL` + path.

## 5. Local production check (optional)

```bash
npm install
PUBLIC_SITE_URL=https://example.com PUBLIC_BASE_PATH=/ npm run build
npm run preview
```

For a project-site simulation:

```bash
PUBLIC_SITE_URL=https://example.com PUBLIC_BASE_PATH=/website-2026/ npm run build
npm run preview
```

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Site is blank / no CSS | Wrong `PUBLIC_BASE_PATH` | Set `/repo-name/` for project sites |
| Workflow fails on `npm ci` | Lockfile out of date | Run `npm install`, commit `package-lock.json` |
| 404 on nested routes | Pages not using Actions artifact | Source must be **GitHub Actions** |
| Deploy job skipped / forbidden | Pages permissions | Ensure workflow `pages: write` and Pages enabled |
| Old content after deploy | Cache / failed deploy | Re-run workflow; hard-refresh browser |

## Custom domain (later)

Custom domain is out of scope for v1 content, but when you add one:

1. Configure the domain under **Settings → Pages**.
2. Set `PUBLIC_SITE_URL` to `https://your-domain.tld`.
3. Usually keep `PUBLIC_BASE_PATH` as `/`.
4. Redeploy.
