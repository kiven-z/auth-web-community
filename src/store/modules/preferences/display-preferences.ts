import { defineStore } from 'pinia';
import { readSavedPreferences } from './preferences-storage';

/** 界面显示开关偏好状态 */
interface DisplayPreferencesState {
  /** 色弱模式 */
  weak: boolean;
  /** 隐藏底部 */
  hideFooter: boolean;
}

/**
 * 界面显示开关偏好 Store
 *
 * 管理色弱模式与隐藏页脚
 */
export const useDisplayPreferencesStore = defineStore('display-preferences', {
  state: (): DisplayPreferencesState => {
    const saved = readSavedPreferences();
    return {
      weak: saved?.weak ?? false,
      hideFooter: saved?.hideFooter ?? true,
    };
  },

  actions: {
    /** 设置色弱模式 */
    setWeak(value: boolean): void {
      this.weak = value;
      document.documentElement.classList.toggle('html-weakness', value);
    },

    /** 设置隐藏底部 */
    setHideFooter(value: boolean): void {
      this.hideFooter = value;
    },

    /** 应用界面开关到 DOM（色弱） */
    $applyToDom(): void {
      document.documentElement.classList.toggle('html-weakness', this.weak);
    },
  },
});
