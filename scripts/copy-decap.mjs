import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'node_modules/decap-cms-app/dist/decap-cms-app.js');
const destDir = join(root, 'public/admin');
const dest = join(destDir, 'decap-cms.js');

if (!existsSync(src)) {
  console.error(
    'Missing decap-cms-app. Run: npm install decap-cms-app@3.8.0 --save',
  );
  process.exit(1);
}

mkdirSync(destDir, { recursive: true });
copyFileSync(src, dest);
console.log(`Copied Decap CMS → ${dest}`);
