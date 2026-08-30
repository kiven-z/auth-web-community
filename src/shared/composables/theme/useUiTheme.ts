import type { ColorScheme } from '@/core/config/uiConfig';
import { useThemePreferencesStore } from '@/store/modules/preferences/themePreferences';
import { ref } from 'vue';

/**
 * 登录页主题切换（含 View Transition 用的本地 dataTheme）
 * @returns dataTheme / colorScheme / setColorScheme
 */
export function useUiTheme() {
  const themeStore = useThemePreferencesStore();

  /** 是否按深色渲染（登录页开关动画依赖本地翻转） */
  const dataTheme = ref(themeStore.isDarkMode);
  const colorScheme = ref<ColorScheme>(themeStore.colorScheme);

  /**
   * 浅色 / 深色 / 跟随系统
   * @param scheme 颜色方案；登录页开关可能不传，此时按 dataTheme 同步为 light/dark
   */
  function setColorScheme(scheme?: string): void {
    if (scheme === 'light' || scheme === 'dark' || scheme === 'system') {
      colorScheme.value = scheme;
    } else {
      colorScheme.value = dataTheme.value ? 'dark' : 'light';
    }

    if (colorScheme.value === 'system') {
      dataTheme.value = globalThis.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      dataTheme.value = colorScheme.value === 'dark';
    }

    themeStore.setColorScheme(colorScheme.value);
  }

  return {
    dataTheme,
    colorScheme,
    setColorScheme,
  };
}
