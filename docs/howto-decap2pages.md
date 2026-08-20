> **Status (2026-08):** This project migrated from **Decap CMS** to
> **[Sveltia CMS](howto-cms.md)** instead of Pages CMS. Keep this note for
> historical context; day-to-day editing uses Sveltia at `/admin/`.

Transitioning from **Decap CMS** to **Pages CMS** is one of the smoothest migrations you can do in static site management. Because both tools are **Git-based**, your core content (Markdown, JSON, YAML files, and images) stays exactly where it is in your GitHub repository. You won't need to migrate a single content file or database.

The migration is essentially replacing your Decap admin interface and converting your Decap configuration file (`config.yml`) into Pages CMS configuration (`.pages.yml`).

---

## Migration Overview

```
Decap CMS Architecture          Pages CMS Architecture
┌───────────────────────┐        ┌───────────────────────┐
│  /admin/index.html    │        │  Pages CMS Web App    │
│  /admin/config.yml    │   ──►  │  (app.pagescms.org)   │
│  (Client-side bundle) │        │  & .pages.yml in repo │
└───────────┬───────────┘        └───────────┬───────────┘
            │                                │
            ▼                                ▼
┌────────────────────────────────────────────────────────┐
│             Your GitHub Repository & Pages             │
└────────────────────────────────────────────────────────┘

```

---

## Steps to Migrate

1. **Create the .pages.yml Config File:** Map Decap collection schema to Pages CMS syntax.
Create a new file at `.pages.yml` in the root of your GitHub repository. Map your Decap `collections` and `fields` to Pages CMS syntax.

* **Media Directory:** Decap's `media_folder: "public/uploads"` becomes `media: { input: "public/uploads", output: "/uploads" }` in `.pages.yml`.
* **Collections:** Rename `collections` definitions to match Pages CMS field types (e.g., `string` → `text`, `rich-text` / `markdown` → `rich-text`, `image` → `image`).

*Example Mapping:*

```yaml
# .pages.yml
media:
  input: public/images
  output: /images

content:
  - name: posts
    label: Blog Posts
    type: collection
    path: content/posts
    format: raw
    fields:
      - name: title
        label: Title
        type: string
        required: true
      - name: date
        label: Publish Date
        type: date
      - name: coverImage
        label: Cover Image
        type: image
      - name: body
        label: Body Content
        type: rich-text

```


2. **Connect Repository to Pages CMS:** Authenticate with GitHub.
1. Go to [app.pagescms.org](https://app.pagescms.org) (or your self-hosted instance).
2. Log in using your GitHub account and grant repository read/write access to your site's repo.
3. Pages CMS will automatically detect `.pages.yml` in your default branch and load your admin panel.


3. **Test Editing and Media Uploads:** Verify schema functionality.
1. Create or edit an entry through Pages CMS.
2. Upload an image asset to ensure paths resolve correctly in your Static Site Generator (SSG).
3. Verify that Pages CMS creates a Git commit on your branch and triggers your GitHub Pages build action as expected.


4. **Clean Up Legacy Decap CMS Files:** Remove client bundle files.
Once team editing is verified, delete the old Decap folder from your repo:

* Delete `/admin/index.html`
* Delete `/admin/config.yml`
* (Optional) Remove any third-party Decap OAuth backend service or proxy server you were running for security authentication.


---

## Syntax Differences: Decap CMS vs. Pages CMS

| Feature | Decap CMS (`/admin/config.yml`) | Pages CMS (`.pages.yml`) |
| --- | --- | --- |
| **Config Location** | `admin/config.yml` | `.pages.yml` (Root directory) |
| **Media Config** | `media_folder`, `public_folder` | `media: { input: "...", output: "..." }` |
| **Markdown Field** | `widget: "markdown"` | `type: "rich-text"` |
| **List / Repeater** | `widget: "list"` | `type: "list"` |
| **Object / Group** | `widget: "object"` | `type: "object"` |
| **Authentication** | External OAuth Proxy / Netlify Identity | Native GitHub App Direct Authorization |

---

## Key Benefits Gained After Migration

* **No OAuth Server Needed:** Decap CMS required an external proxy server (or Netlify Identity) to authenticate GitHub users securely. Pages CMS uses standard GitHub OAuth/Apps directly.
* **Cleaner Repo Structure:** No need to bundle a heavy single-page app (SPA) in an `/admin` route inside your static assets.
* **Modern Interface:** Much faster UI response, better handling of modern Markdown extensions, and better media grid previews.