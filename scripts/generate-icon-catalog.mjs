/**
 * 从已安装的 Iconify 集合生成 IconSelect 名称列表（ep / ri）。
 *
 * 优先 `@iconify-json/{collection}`，否则回退 `@iconify/json/json/{collection}.json`。
 *
 * 用法：
 *   pnpm generate:icon-catalog
 *   node scripts/generate-icon-catalog.mjs
 */
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'src/components/ui/icon/icon-select');

/**
 * @param {string} collection
 * @returns {string}
 */
function resolveCollectionJson(collection) {
  try {
    return require.resolve(`@iconify-json/${collection}/icons.json`);
  } catch {
    return require.resolve(`@iconify/json/json/${collection}.json`);
  }
}

/**
 * @param {string} collection
 */
function writeNames(collection) {
  const jsonPath = resolveCollectionJson(collection);
  const data = JSON.parse(readFileSync(jsonPath, 'utf8'));
  const names = Object.keys(data.icons ?? {}).sort((a, b) => a.localeCompare(b));
  const outPath = join(outDir, `${collection}-names.json`);
  writeFileSync(outPath, `${JSON.stringify(names, null, 2)}\n`);
  console.log(`Wrote ${names.length} names → ${outPath}`);
}

writeNames('ep');
writeNames('ri');
