import { defineConfig } from 'astro/config';

// GitHub Pages: set base to '/<repo>/' for project sites; keep '/' for user/org or custom domain.
const base = process.env.PUBLIC_BASE_PATH || '/';

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://springeloo.github.io',
  base,
  output: 'static',
  trailingSlash: 'ignore',
});
