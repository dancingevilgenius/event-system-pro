import { cpSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(scriptDir, '..');
const destDir = join(packageRoot, 'src/data/cursor-rules');
const sourceCandidates = [
  join(packageRoot, '../../.cursor/rules'),
  join(packageRoot, 'src/data/cursor-rules'),
];

const sourceDir = sourceCandidates.find((dir) => existsSync(dir));

if (!sourceDir) {
  console.error('sync-cursor-rules: no .cursor/rules directory found.');
  process.exit(1);
}

mkdirSync(destDir, { recursive: true });

const ruleFiles = readdirSync(sourceDir).filter((name) => name.endsWith('.mdc'));

if (ruleFiles.length === 0) {
  console.error(`sync-cursor-rules: no .mdc files found in ${sourceDir}`);
  process.exit(1);
}

for (const fileName of ruleFiles) {
  cpSync(join(sourceDir, fileName), join(destDir, fileName));
}

console.log(`sync-cursor-rules: copied ${ruleFiles.length} rule file(s) to src/data/cursor-rules`);
