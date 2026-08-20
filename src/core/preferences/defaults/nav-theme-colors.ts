import { DEFAULT_PRIMARY_COLOR } from '../runtime/theme-defaults';

/** 导航主题色条目（色板预览色 ≠ 一定等于 primaryColor） */
export interface NavThemeColorItem {
  /** 色板展示色 */
  color: string;
  /** 侧栏皮肤标识，对应 html[data-theme] */
  navTheme: string;
}

/**
 * 导航主题色单一事实来源（设置面板色板与选中逻辑共用）
 * 方案 A：点色板即整套主题；light / default 主色均为品牌蓝
 */
export const NAV_THEME_COLOR_ITEMS: readonly NavThemeColorItem[] = [
  { color: '#ffffff', navTheme: 'light' },
  { color: '#1b2a47', navTheme: 'default' },
  { color: '#722ed1', navTheme: 'saucePurple' },
  { color: '#eb2f96', navTheme: 'pink' },
  { color: '#f5222d', navTheme: 'dusk' },
  { color: '#fa541c', navTheme: 'volcano' },
  { color: '#13c2c2', navTheme: 'mingQing' },
  { color: '#52c41a', navTheme: 'auroraGreen' },
  { color: '#2f54eb', navTheme: 'geekBlue' },
  { color: '#fa8c16', navTheme: 'sunsetOrange' },
  { color: '#faad14', navTheme: 'amberYellow' },
  { color: '#00b96b', navTheme: 'cyberGreen' },
  { color: '#2b303a', navTheme: 'darkSlate' },
] as const;

/** navTheme → 色板预览色 */
export const NAV_THEME_COLORS: Readonly<Record<string, string>> = Object.fromEntries(
  NAV_THEME_COLOR_ITEMS.map((item) => [item.navTheme, item.color])
);

/** 选中后主色固定为品牌蓝的侧栏皮肤（预览色不是主色） */
const BRAND_PRIMARY_NAV_THEMES = new Set(['light', 'default']);

/**
 * 选中侧栏皮肤时应写入的主色
 * @param navTheme 侧栏皮肤
 * @returns 主色
 */
export function resolvePrimaryColorForNavTheme(navTheme: string): string {
  if (BRAND_PRIMARY_NAV_THEMES.has(navTheme)) {
    return DEFAULT_PRIMARY_COLOR;
  }
  return NAV_THEME_COLORS[navTheme] ?? DEFAULT_PRIMARY_COLOR;
}
