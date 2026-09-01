import { UI_PREFERENCE_KEYS } from '@/core/config/keys-config';
import { schedulePreferenceSync } from '@/core/preferences/persistence/sync';
import { applyEffectiveLayoutToShell } from '@/core/preferences/runtime/layout-override';
import type { LayoutMode } from '@/shared/utils/layout/layout-mode';
import { defineStore } from 'pinia';

/** 布局壳偏好状态 */
interface LayoutPreferencesState {
  /** 导航布局模式 */
  layout: LayoutMode;
  /** 侧栏展开状态 */
  sidebarStatus: boolean;
}

/**
 * 布局壳偏好 Store（ui.layout）
 *
 * 只管导航布局模式与侧栏展开状态；界面开关归 displayPreferences。
 */
export const useLayoutPreferencesStore = defineStore('layout-preferences', {
  state: (): LayoutPreferencesState => ({
    layout: 'vertical',
    sidebarStatus: true,
  }),

  actions: {
    /** 设置导航布局模式 */
    setLayout(value: LayoutMode): void {
      this.layout = value;
      applyEffectiveLayoutToShell(value);
      schedulePreferenceSync(UI_PREFERENCE_KEYS.LAYOUT);
    },

    /** 设置侧栏展开状态 */
    setSidebarStatus(value: boolean): void {
      this.sidebarStatus = value;
      schedulePreferenceSync(UI_PREFERENCE_KEYS.LAYOUT);
    },

    /** 应用生效布局到壳层 */
    $applyToShell(): void {
      applyEffectiveLayoutToShell(this.layout);
    },
  },
});
