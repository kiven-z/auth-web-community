import type { LayoutMode } from '@/shared/utils/layout/layout-mode';

/** 导航主题色条目（色板预览色 ≠ 一定等于 primaryColor） */
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

/** 默认品牌主色（改色时同步 tokens/color.scss --auth-color-brand-6） */
export const THEME_DEFAULT_PRIMARY_COLOR = '#006eff';

/**
 * 导航主题色单一事实来源（设置面板色板与选中逻辑共用）
 */
export const NAV_THEME_COLOR_ITEMS: readonly NavThemeColorItem[] = [
  { color: '#ffffff', navTheme: 'light', primaryColor: THEME_DEFAULT_PRIMARY_COLOR },
  { color: '#1b2a47', navTheme: 'default', primaryColor: THEME_DEFAULT_PRIMARY_COLOR },
  { color: '#722ed1', navTheme: 'saucePurple', primaryColor: '#722ed1' },
  { color: '#eb2f96', navTheme: 'pink', primaryColor: '#eb2f96' },
  { color: '#f5222d', navTheme: 'dusk', primaryColor: '#f5222d' },
  { color: '#fa541c', navTheme: 'volcano', primaryColor: '#fa541c' },
  { color: '#13c2c2', navTheme: 'mingQing', primaryColor: '#13c2c2' },
  { color: '#52c41a', navTheme: 'auroraGreen', primaryColor: '#52c41a' },
  { color: '#2f54eb', navTheme: 'geekBlue', primaryColor: '#2f54eb' },
  { color: '#fa8c16', navTheme: 'sunsetOrange', primaryColor: '#fa8c16' },
  { color: '#faad14', navTheme: 'amberYellow', primaryColor: '#faad14' },
  { color: '#00b96b', navTheme: 'cyberGreen', primaryColor: '#00b96b' },
  { color: '#2b303a', navTheme: 'darkSlate', primaryColor: '#2b303a' },
];

/** 默认布局模式 */
export const LAYOUT_DEFAULT_MODE: LayoutMode = 'vertical';
