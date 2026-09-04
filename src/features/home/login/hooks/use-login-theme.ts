import type { ColorScheme } from '@/core/config/ui-config';
import { useThemePreferencesStore } from '@/store/modules/preferences/theme-preferences';
import { ref } from 'vue';

function resolveDataTheme(scheme: ColorScheme): boolean {
  if (scheme === 'system') {
    return globalThis.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return scheme === 'dark';
}

/**
 * 登录页主题：本地 dataTheme 供 View Transition 与插画切换；偏好落盘走 theme store
 * @returns dataTheme、persistToggledTheme
 */
export function useLoginTheme() {
  const themeStore = useThemePreferencesStore();

  // 是否按深色渲染（登录页开关动画依赖本地翻转
  const dataTheme = ref(themeStore.isDarkMode);

  /**
   * 按颜色方案同步本地亮暗并落盘
   * @param scheme 浅色 / 深色 / 跟随系统
   */
  function applyColorScheme(scheme: ColorScheme): void {
    dataTheme.value = resolveDataTheme(scheme);
    themeStore.setColorScheme(scheme);
  }

  /** dataTheme 已翻转后，收成 light/dark 并落盘 */
  function persistToggledTheme(): void {
    themeStore.setColorScheme(dataTheme.value ? 'dark' : 'light');
  }

  applyColorScheme(themeStore.colorScheme);

  return {
    dataTheme,
    persistToggledTheme,
  };
}
