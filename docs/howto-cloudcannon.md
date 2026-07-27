# CloudCannon editorial workflow

Editors change copy and images in CloudCannon. The public site only updates
after a **maintainer merges** a pull request into `main` and GitHub Pages
deploys.

Saving in CloudCannon is **not** publishing to production.

## Roles

| Role | Can edit content | Can merge to `main` | Deploys production |
|------|------------------|---------------------|--------------------|
| Content editor | Yes (in-scope fields) | No | No |
| Developer / maintainer | Yes | Yes | Via merge + Actions |

## Happy path

1. Open the CloudCannon site linked to this GitHub repo.
2. Edit an in-scope field (home hero, Leistungen cards, globals nav labels,
   footer/contact).
3. Save → CloudCannon commits on the configured **content branch**.
4. A pull request targeting `main` is opened or updated.
5. Maintainer reviews the diff (copy, images, Markdown HTML impact).
6. Maintainer merges the PR.
7. GitHub Actions builds Astro and deploys GitHub Pages from `main`.

## Dashboard setup (maintainer)

Configure these in the CloudCannon site settings (exact labels vary by plan):

1. Connect the GitHub repository.
2. Set publishing / branching so editors commit to a **content branch** (e.g.
   `content`) and open a **PR to `main`** — not direct push to `main`.
3. Grant editors permission to edit content files / collections only.
4. Ensure editors **cannot** merge to `main` (GitHub branch protection +
   CloudCannon role).
5. Confirm `cloudcannon.config.yml` is picked up (collections for globals +
   home; no Bookshop).

Uploads write under `public/uploads/`.

## What editors can change

See `specs/002-cloudcannon-editing/contracts/editable-fields.md`. Summary:

- Home: SEO meta, hero text, hero image + alt, CTA **labels**, three Leistungen
  cards (title, Markdown body, optional image + alt, CTA **label**)
- Globals: nav **labels**, footer/contact text, legal **labels**

## What stays developer-only

- Layout, spacing, colors, typography
- Nav / CTA / legal **hrefs**
- Card count (locked at 3)
- Other page bodies, Bookshop / page builder

## Local preview without CloudCannon

```bash
npm install
# edit src/content/pages/home.yaml or src/content/site/globals.yaml
npm run build
npm run preview
```

## PR review checklist (maintainers)

Before merging a content PR:

- [ ] Diff only touches intended content files and/or `public/uploads/`
- [ ] No unexpected layout/CSS/component changes
- [ ] Required fields non-empty (hero headline, card titles, contact phone/email)
- [ ] Still exactly **three** Leistungen cards
- [ ] CTA / nav **hrefs** unchanged (labels may change)
- [ ] New images have meaningful **alt** text
- [ ] Markdown body: heading order sensible (avoid jumping to h1 inside a card)
- [ ] Markdown body: no overflow / runaway lists on desktop and mobile
- [ ] `npm run build` succeeds (CI or local)

## Remaining CloudCannon console steps (team)

Local repo work for feature `002` is done. Still required in CloudCannon / GitHub:

1. Connect this repo as a CloudCannon site and confirm `cloudcannon.config.yml` loads.
2. Set content-branch + PR-to-`main` publishing (not direct `main` push).
3. Create an editor test user without merge-to-`main` rights.
4. Walk quickstart scenarios 1–6 in `specs/002-cloudcannon-editing/quickstart.md`
   (text PR, image replace, fixed cards, globals, permissions, a11y spot-check).

## Related docs

- [Change content (editors)](howto-edit-content.md)
- [Deploy](howto-deploy.md)
- Spec contracts: `specs/002-cloudcannon-editing/contracts/`
