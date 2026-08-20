import { applyThemePreferences } from '@/core/preferences/runtime/apply';
import { NAV_THEME_COLOR_ITEMS, resolvePrimaryColorForNavTheme } from '@/core/preferences/defaults/nav-theme-colors';
import { getLayoutSnapshot, patchLayout } from '@/core/preferences/persistence/storage';
import { type ColorScheme, DEFAULT_COLOR_SCHEME, DEFAULT_NAV_THEME } from '@/core/preferences/runtime/theme-defaults';
import { ref } from 'vue';
import type { NavThemeColorItem } from '../../types';
import { useLayout } from '@/layout/hooks/layout/useLayout';

const COLOR_SCHEMES = new Set<ColorScheme>(['light', 'dark', 'system']);

/**
 * 设置 Element 主色并持久化
 * @param color 色值
 */
function setPrimaryColor(color: string): void {
  patchLayout({ primaryColor: color });
  applyThemePreferences();
}

/**
 * 设置侧栏皮肤并同步主色（方案 A：色板即整套主题）
 * @param navTheme 侧栏皮肤标识
 */
function setNavTheme(navTheme = DEFAULT_NAV_THEME): void {
  patchLayout({
    navTheme,
    primaryColor: resolvePrimaryColorForNavTheme(navTheme),
  });
  applyThemePreferences();
}

/**
 * UI 主题读写（经 preferences storage 网关）
 * @returns 主题读写与 DOM 副作用
 */
export function useUiTheme() {
  const { layoutTheme } = useLayout();
  const layoutSnapshot = getLayoutSnapshot();

  const themeColors = ref<Array<NavThemeColorItem>>([...NAV_THEME_COLOR_ITEMS]);

  /** 是否按深色渲染（登录页开关 / 设置面板 Segmented 共用） */
  const dataTheme = ref<boolean>(
    layoutSnapshot.colorScheme === 'dark' ||
      (layoutSnapshot.colorScheme === 'system' && globalThis.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  const colorScheme = ref<ColorScheme>(
    layoutSnapshot.colorScheme === 'light' ||
      layoutSnapshot.colorScheme === 'dark' ||
      layoutSnapshot.colorScheme === 'system'
      ? layoutSnapshot.colorScheme
      : DEFAULT_COLOR_SCHEME
  );

  /**
   * 浅色 / 深色 / 跟随系统
   * @param scheme 颜色方案；登录页开关可能不传，此时按 dataTheme 同步为 light/dark
   */
  function setColorScheme(scheme?: string): void {
    if (scheme && COLOR_SCHEMES.has(scheme as ColorScheme)) {
      colorScheme.value = scheme as ColorScheme;
    } else {
      colorScheme.value = dataTheme.value ? 'dark' : 'light';
    }

    if (colorScheme.value === 'system') {
      dataTheme.value = globalThis.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      dataTheme.value = colorScheme.value === 'dark';
    }

    patchLayout({ colorScheme: colorScheme.value });
    applyThemePreferences();
  }

  return {
    dataTheme,
    colorScheme,
    layoutTheme,
    themeColors,
    setPrimaryColor,
    setNavTheme,
    setColorScheme,
  };
}
