import { THEME_DEFAULT_NAV_THEME } from '@/core/config/uiConfig';

/** 暗色方案下白侧栏不可用时的回落皮肤 */
const DARK_FALLBACK_NAV_THEME = 'default';

/**
 * 解析实际写入 data-theme 的侧栏皮肤（暗色下隐藏白侧栏）
 * @param navTheme 用户选择的侧栏皮肤
 * @param darkMode 是否按深色渲染
 * @returns 生效侧栏皮肤
 */
export function resolveEffectiveNavTheme(navTheme: string | undefined, darkMode: boolean): string {
  const theme = navTheme ?? THEME_DEFAULT_NAV_THEME;
  if (darkMode && theme === 'light') {
    return DARK_FALLBACK_NAV_THEME;
  }
  return theme;
}
