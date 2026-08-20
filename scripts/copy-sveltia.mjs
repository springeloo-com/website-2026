import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
// Classic IIFE browser build. Copied at build via this script for self-hosting
// (no CDN at runtime). Do not use the .mjs ESM entry under a plain <script> tag.
const src = join(root, 'node_modules/@sveltia/cms/dist/sveltia-cms.js');
const destDir = join(root, 'public/admin');
const dest = join(destDir, 'sveltia-cms.js');

if (!existsSync(src)) {
  console.error('Missing @sveltia/cms. Run: npm install @sveltia/cms --save');
  process.exit(1);
}

mkdirSync(destDir, { recursive: true });
copyFileSync(src, dest);
console.log(`Copied Sveltia CMS (IIFE) → ${dest}`);
