import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
// Full browser UMD build (includes React). Do NOT use decap-cms-app here —
// that package expects React as a peer and crashes under a plain <script> tag.
const src = join(root, 'node_modules/decap-cms/dist/decap-cms.js');
const destDir = join(root, 'public/admin');
const dest = join(destDir, 'decap-cms.js');

if (!existsSync(src)) {
  console.error('Missing decap-cms. Run: npm install decap-cms@3.8.0 --save');
  process.exit(1);
}

mkdirSync(destDir, { recursive: true });
copyFileSync(src, dest);
console.log(`Copied Decap CMS (UMD) → ${dest}`);
