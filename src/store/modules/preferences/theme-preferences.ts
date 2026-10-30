import { APP_CONFIG, type ColorScheme } from '@/core/config/app-config';
import { resolveEffectiveNavTheme } from '@/core/preferences/runtime/theme-defaults';
import { buildPrimaryColorInlineStyle } from '@/shared/utils/color/primary-color-inline';
import { defineStore } from 'pinia';
import { readSavedPreferences } from './preferences-storage';

const COLOR_SCHEMES = new Set<ColorScheme>(['light', 'dark', 'system']);

let stopSystemThemeWatch: (() => void) | null = null;

/** 主题偏好状态 */
interface ThemePreferencesState {
  /** 颜色方案：浅色 / 深色 / 跟随系统 */
  colorScheme: ColorScheme;
  /** 侧栏皮肤标识 */
  navTheme: string;
  /** 品牌主色 */
  primaryColor: string;
  /** OS 是否偏好深色（运行时信号，不落盘） */
  osPrefersDark: boolean;
}

/**
 * 主题偏好 Store
 *
 * 出厂值优先取本机缓存
 */
export const useThemePreferencesStore = defineStore('theme-preferences', {
  state: (): ThemePreferencesState => {
    const saved = readSavedPreferences();
    return {
      colorScheme: saved?.colorScheme ?? APP_CONFIG.theme.colorScheme,
      navTheme: saved?.navTheme ?? APP_CONFIG.theme.navTheme,
      primaryColor: saved?.primaryColor ?? APP_CONFIG.theme.primaryColor,
      osPrefersDark: globalThis.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false,
    };
  },

  getters: {
    /** 是否按深色渲染 */
    isDarkMode(state): boolean {
      if (state.colorScheme === 'system') {
        return state.osPrefersDark;
      }
      return state.colorScheme === 'dark';
    },
  },

  actions: {
    /** 设置颜色方案 */
    setColorScheme(value: ColorScheme): void {
      if (!COLOR_SCHEMES.has(value)) {
        return;
      }
      this.colorScheme = value;
      this.$applyToDom();
    },

    /**
     * 设置侧栏皮肤并同步主色（色板即整套主题）
     * @param value 侧栏皮肤标识
     */
    setNavTheme(value: string): void {
      const themeItem = APP_CONFIG.theme.navThemes.find((entry) => entry.navTheme === value);
      if (!themeItem) {
        return;
      }
      this.navTheme = value;
      this.primaryColor = themeItem.primaryColor;
      this.$applyToDom();
    },

    /** 设置品牌主色 */
    setPrimaryColor(value: string): void {
      this.primaryColor = value;
      this.$applyToDom();
    },

    /** 应用主题到 DOM */
    $applyToDom(): void {
      const html = document.documentElement;
      const darkMode = this.isDarkMode;
      const effectiveNavTheme = resolveEffectiveNavTheme(this.navTheme, darkMode);

      html.classList.toggle('dark', darkMode);
      html.dataset.theme = effectiveNavTheme;

      const inlineStyle = buildPrimaryColorInlineStyle(this.primaryColor);
      for (const [cssVar, value] of Object.entries(inlineStyle)) {
        html.style.setProperty(cssVar, value);
      }
    },

    /**
     * 全局监听 prefers-color-scheme（幂等，重复调用不会叠加监听）
     * @returns 取消监听
     */
    $startSystemThemeWatch(): () => void {
      if (stopSystemThemeWatch) {
        return stopSystemThemeWatch;
      }

      const applyOsPrefersDark = ({ matches }: { matches: boolean }): void => {
        this.osPrefersDark = matches;
        if (this.colorScheme === 'system') {
          this.$applyToDom();
        }
      };

      const mediaQueryList = globalThis.matchMedia('(prefers-color-scheme: dark)');
      applyOsPrefersDark(mediaQueryList);
      mediaQueryList.addEventListener('change', applyOsPrefersDark);

      stopSystemThemeWatch = () => {
        mediaQueryList.removeEventListener('change', applyOsPrefersDark);
        stopSystemThemeWatch = null;
      };
      return stopSystemThemeWatch;
    },
  },
});
