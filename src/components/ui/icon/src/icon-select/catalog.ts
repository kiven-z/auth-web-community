/**
 * IconSelect 可选图标目录（仅 `ep:` / `ri:`；在线预览用名称列表）。
 * 名称列表由 `scripts/generate-icon-catalog.mjs` 从 `@iconify/json`（或 `@iconify-json/*`）生成。
 * 重新生成：`pnpm generate:icon-catalog` 或 `node scripts/generate-icon-catalog.mjs`。
 */
import epNames from './ep-names.json';
import riNames from './ri-names.json';
import type { IconCollectionMap } from './model';

export const IconJson: IconCollectionMap = {
  'ep:': epNames,
  'ri:': riNames,
};
