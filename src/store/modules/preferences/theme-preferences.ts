import type { ColorScheme } from '@/core/config/ui-config';
import {
  NAV_THEME_COLOR_ITEMS,
  THEME_DEFAULT_COLOR_SCHEME,
  THEME_DEFAULT_NAV_THEME,
  THEME_DEFAULT_PRIMARY_COLOR,
} from '@/core/config/ui-config';
import { UI_PREFERENCE_KEYS } from '@/core/config/keys-config';
import { readDeviceUiPreferences, writeDeviceUiPreferences } from '@/core/preferences/persistence/device-storage';
import { schedulePreferenceSync } from '@/core/preferences/persistence/sync';
import { resolveEffectiveNavTheme } from '@/core/preferences/runtime/theme-defaults';
import { buildPrimaryColorInlineStyle } from '@/shared/utils/color/primary-color-inline';
import { defineStore } from 'pinia';

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
 * 主题偏好 Store（ui.theme）
 *
 * 未登录页刷新不回退：出厂值优先取 Device LS 缓存。
 */
export const useThemePreferencesStore = defineStore('theme-preferences', {
  state: (): ThemePreferencesState => {
    const device = readDeviceUiPreferences();
    return {
      colorScheme: (device?.colorScheme as ColorScheme) ?? THEME_DEFAULT_COLOR_SCHEME,
      navTheme: device?.navTheme ?? THEME_DEFAULT_NAV_THEME,
      primaryColor: device?.primaryColor ?? THEME_DEFAULT_PRIMARY_COLOR,
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
      this.$mirrorToDevice();
      schedulePreferenceSync(UI_PREFERENCE_KEYS.THEME);
    },

    /**
     * 设置侧栏皮肤并同步主色（色板即整套主题）
     * @param value 侧栏皮肤标识
     */
    setNavTheme(value: string): void {
      const themeItem = NAV_THEME_COLOR_ITEMS.find((entry) => entry.navTheme === value);
      if (!themeItem) {
        return;
      }
      this.navTheme = value;
      this.primaryColor = themeItem.primaryColor;
      this.$applyToDom();
      this.$mirrorToDevice();
      schedulePreferenceSync(UI_PREFERENCE_KEYS.THEME);
    },

    /** 设置品牌主色 */
    setPrimaryColor(value: string): void {
      this.primaryColor = value;
      this.$applyToDom();
      this.$mirrorToDevice();
      schedulePreferenceSync(UI_PREFERENCE_KEYS.THEME);
    },

    /** 应用主题到 DOM（主题副作用唯一入口） */
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

    /** 回写主题字段到 Device LS（冷启动缓存） */
    $mirrorToDevice(): void {
      writeDeviceUiPreferences({
        colorScheme: this.colorScheme,
        navTheme: this.navTheme,
        primaryColor: this.primaryColor,
      });
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
