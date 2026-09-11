/** IconSelect 支持的图标集 Tab 键（与 catalog / tabs 一致） */
export type IconCollectionKey = 'ri:' | 'ep:';

/** 图标集 → 名称列表 */
export type IconCollectionMap = Record<IconCollectionKey, readonly string[]>;

/**
 * 解析离线键名 `ri/xxx`、`ep/xxx`；无法解析时返回 null。
 * 集合段仅 `ep` / `ep:` 进 Element Plus，其余一律 Remix。
 */
export function parseIconModelValue(value: string): { collection: IconCollectionKey; iconName: string } | null {
  const slashIndex = value.indexOf('/');
  if (slashIndex <= 0) {
    return null;
  }
  const raw = value.slice(0, slashIndex);
  return {
    collection: raw === 'ep' || raw === 'ep:' ? 'ep:' : 'ri:',
    iconName: value.slice(slashIndex + 1),
  };
}

/**
 * 图标名所在页（1-based）；不在列表中时回第 1 页。
 */
export function pageForIcon(icons: readonly string[], iconName: string, pageSize: number): number {
  const index = icons.indexOf(iconName);
  if (index < 0) {
    return 1;
  }
  return Math.ceil((index + 1) / pageSize);
}
