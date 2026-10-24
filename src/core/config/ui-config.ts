import type { LayoutMode } from '@/shared/utils/layout/layout-mode';

/** 导航主题色条目 */
interface NavThemeColorItem {
  /** 色板展示色 */
  color: string;
  /** 侧栏皮肤标识，对应 html[data-theme] */
  navTheme: string;
  /** 选中后写入的主色 */
  primaryColor: string;
}

/** 颜色方案：浅色 / 深色 / 跟随系统 */
export type ColorScheme = 'light' | 'dark' | 'system';

/** 默认颜色方案 */
export const THEME_DEFAULT_COLOR_SCHEME: ColorScheme = 'light';

/** 默认侧栏皮肤 */
export const THEME_DEFAULT_NAV_THEME = 'light';

/** 默认品牌主色 */
export const THEME_DEFAULT_PRIMARY_COLOR = '#006eff';

/**
 * 导航主题色单一事实来源
 */
export const NAV_THEME_COLOR_ITEMS: readonly NavThemeColorItem[] = [
  { color: '#ffffff', navTheme: 'light', primaryColor: THEME_DEFAULT_PRIMARY_COLOR },
  { color: '#1b2a47', navTheme: 'default', primaryColor: THEME_DEFAULT_PRIMARY_COLOR },
  { color: '#722ed1', navTheme: 'saucePurple', primaryColor: '#722ed1' },
  { color: '#13c2c2', navTheme: 'mingQing', primaryColor: '#13c2c2' },
  { color: '#00b96b', navTheme: 'cyberGreen', primaryColor: '#00b96b' },
  { color: '#fa8c16', navTheme: 'sunsetOrange', primaryColor: '#fa8c16' },
];

/** 默认布局模式 */
export const LAYOUT_DEFAULT_MODE: LayoutMode = 'vertical';
