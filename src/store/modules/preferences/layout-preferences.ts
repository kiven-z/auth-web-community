import { APP_CONFIG } from '@/core/config/app-config';
import { applyEffectiveLayoutToShell } from '@/core/preferences/runtime/layout-override';
import type { LayoutMode } from '@/shared/utils/layout/layout-mode';
import { defineStore } from 'pinia';
import { readSavedPreferences } from './preferences-storage';

/** 布局壳偏好状态 */
interface LayoutPreferencesState {
  /** 导航布局模式 */
  layout: LayoutMode;
  /** 侧栏展开状态 */
  sidebarStatus: boolean;
}

/**
 * 布局壳偏好 Store
 *
 * 只管导航布局模式与侧栏展开状态。
 */
export const useLayoutPreferencesStore = defineStore('layout-preferences', {
  state: (): LayoutPreferencesState => {
    const saved = readSavedPreferences();
    return {
      layout: saved?.layout ?? APP_CONFIG.layout.mode,
      sidebarStatus: saved?.sidebarStatus ?? true,
    };
  },

  actions: {
    /** 设置导航布局模式 */
    setLayout(value: LayoutMode): void {
      this.layout = value;
      applyEffectiveLayoutToShell(value);
    },

    /** 设置侧栏展开状态 */
    setSidebarStatus(value: boolean): void {
      this.sidebarStatus = value;
    },

    /** 应用生效布局到壳层 */
    $applyToShell(): void {
      applyEffectiveLayoutToShell(this.layout);
    },
  },
});
