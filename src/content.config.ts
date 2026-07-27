/**
 * Declares content folders so Astro does not auto-generate Markdown-only
 * collections. Runtime pages load and validate YAML via `src/lib/content.ts`.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const site = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/site' }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/pages' }),
});

export const collections = { site, pages };
