import { NAV_THEME_COLOR_ITEMS } from '@/core/config/ui-config';

/** 色板一行：语义名 + CSS 变量阶梯 */
export interface ThemeLabPaletteRow {
  /** 展示名 */
  label: string;
  /** 变量前缀，如 brand → --auth-color-brand-N */
  tokenPrefix: string;
  /** 阶梯序号 */
  steps: readonly number[];
}

/** 冒烟页色板（直接读 --auth-color-*，不经 EP） */
export const THEME_LAB_PALETTE_ROWS: readonly ThemeLabPaletteRow[] = [
  { label: 'brand', tokenPrefix: 'brand', steps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { label: 'success', tokenPrefix: 'success', steps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { label: 'warning', tokenPrefix: 'warning', steps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { label: 'error', tokenPrefix: 'error', steps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { label: 'gray', tokenPrefix: 'gray', steps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] },
] as const;

/**
 * 冒烟页主色预设：从侧栏色板派生真实 primary（light/default → 腾讯蓝），去重
 */
export const THEME_LAB_PRIMARY_PRESETS: readonly string[] = [
  ...new Set(NAV_THEME_COLOR_ITEMS.map((item) => item.primaryColor)),
];
