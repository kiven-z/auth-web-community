import { defineStore } from 'pinia';

/**
 * 布局壳展示态（不持久化；设置抽屉等瞬时 UI）
 */
export const useLayoutUiStore = defineStore('layout-ui', {
  state: () => ({
    /** 右侧系统设置面板是否打开 */
    settingsPanelOpen: false,
  }),
  actions: {
    /**
     * 打开系统设置面板
     */
    openSettingsPanel(): void {
      this.settingsPanelOpen = true;
    },
    /**
     * 关闭系统设置面板
     */
    closeSettingsPanel(): void {
      this.settingsPanelOpen = false;
    },
    /**
     * 切换系统设置面板
     * @param open 指定开闭；省略则取反
     */
    toggleSettingsPanel(open?: boolean): void {
      this.settingsPanelOpen = open ?? !this.settingsPanelOpen;
    },
  },
});
