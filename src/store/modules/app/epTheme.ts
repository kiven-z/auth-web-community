import { DEFAULT_NAV_THEME, DEFAULT_PRIMARY_COLOR } from '@/core/preferences/runtime/theme-defaults';
import { defineStore } from 'pinia';
import { getLayoutSnapshot, patchLayout } from '@/core/preferences/persistence/storage';

/**
 * Element 主色与当前生效侧栏皮肤的运行时镜像（由 applyThemePreferences 写入）
 */
export const useEpThemeStore = defineStore('ep-theme', {
  state: () => {
    const layout = getLayoutSnapshot();
    return {
      primaryColor: layout.primaryColor ?? DEFAULT_PRIMARY_COLOR,
      navTheme: layout.navTheme ?? DEFAULT_NAV_THEME,
    };
  },
  getters: {
    getPrimaryColor(state) {
      return state.primaryColor;
    },
    /** mix 导航模式下 hamburger 的 fill */
    fill(state) {
      if (state.navTheme === 'light') {
        return 'var(--el-color-primary)';
      }
      return 'var(--auth-text-anti)';
    },
  },
  actions: {
    /**
     * 设置主色并持久化
     * @param newColor 色值
     */
    setPrimaryColor(newColor: string): void {
      const layout = getLayoutSnapshot();
      this.navTheme = layout.navTheme ?? DEFAULT_NAV_THEME;
      this.primaryColor = newColor;
      patchLayout({ ...layout, primaryColor: newColor, navTheme: this.navTheme });
    },
  },
});
