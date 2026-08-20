/** 颜色方案：浅色 / 深色 / 跟随系统 */
export type ColorScheme = 'light' | 'dark' | 'system';

/**
 * 默认品牌主色（JS 侧）
 * 改色时同步改 tokens/color.scss 的 --auth-color-brand-6；
 * 运行时 apply 只内联 brand-6 / brand / primary，色阶由 color-mix + map-element 派生
 */
export const DEFAULT_PRIMARY_COLOR = '#006eff';

/** 默认侧栏皮肤（白侧栏） */
export const DEFAULT_NAV_THEME = 'light';

/** 默认整体颜色方案 */
export const DEFAULT_COLOR_SCHEME: ColorScheme = 'light';

/** 暗色方案下白侧栏不可用时的回落皮肤 */
export const DARK_FALLBACK_NAV_THEME = 'default';

/**
 * 组装主题相关 layout 默认字段（本文件常量）
 * @returns colorScheme / navTheme / primaryColor
 */
export function createDefaultThemeLayoutFields(): Pick<
  ResponsiveStorage['layout'],
  'colorScheme' | 'navTheme' | 'primaryColor'
> {
  return {
    colorScheme: DEFAULT_COLOR_SCHEME,
    navTheme: DEFAULT_NAV_THEME,
    primaryColor: DEFAULT_PRIMARY_COLOR,
  };
}

/**
 * 解析实际写入 data-theme 的侧栏皮肤（暗色下隐藏白侧栏）
 * @param navTheme 用户选择的侧栏皮肤
 * @param darkMode 是否按深色渲染
 * @returns 生效侧栏皮肤
 */
export function resolveEffectiveNavTheme(navTheme: string | undefined, darkMode: boolean): string {
  const theme = navTheme ?? DEFAULT_NAV_THEME;
  if (darkMode && theme === 'light') {
    return DARK_FALLBACK_NAV_THEME;
  }
  return theme;
}
