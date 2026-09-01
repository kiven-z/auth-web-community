import { UI_PREFERENCE_KEYS } from '@/core/config/keys-config';
import { schedulePreferenceSync } from '@/core/preferences/persistence/sync';
import { defineStore } from 'pinia';

/** 界面显示开关偏好状态 */
interface DisplayPreferencesState {
  /** 灰色模式 */
  grey: boolean;
  /** 色弱模式 */
  weak: boolean;
  /** 隐藏标签栏 */
  hideTabs: boolean;
  /** 隐藏底部 */
  hideFooter: boolean;
  /** 显示 Logo */
  showLogo: boolean;
  /** 标签风格（smart / card / chrome） */
  showModel: string;
  /** 页面宽度：false 自适应；number 固定宽度 */
  stretch: boolean | number;
}

/**
 * 界面显示开关偏好 Store（ui.display）
 *
 * 管理右侧设置面板的显示开关、标签风格与页宽等界面偏好。
 */
export const useDisplayPreferencesStore = defineStore('display-preferences', {
  state: (): DisplayPreferencesState => ({
    grey: false,
    weak: false,
    hideTabs: false,
    hideFooter: true,
    showLogo: true,
    showModel: 'smart',
    stretch: false,
  }),

  actions: {
    /** 设置灰色模式 */
    setGrey(value: boolean): void {
      this.grey = value;
      document.documentElement.classList.toggle('html-grey', value);
      schedulePreferenceSync(UI_PREFERENCE_KEYS.DISPLAY);
    },

    /** 设置色弱模式 */
    setWeak(value: boolean): void {
      this.weak = value;
      document.documentElement.classList.toggle('html-weakness', value);
      schedulePreferenceSync(UI_PREFERENCE_KEYS.DISPLAY);
    },

    /** 设置隐藏标签栏 */
    setHideTabs(value: boolean): void {
      this.hideTabs = value;
      schedulePreferenceSync(UI_PREFERENCE_KEYS.DISPLAY);
    },

    /** 设置隐藏底部 */
    setHideFooter(value: boolean): void {
      this.hideFooter = value;
      schedulePreferenceSync(UI_PREFERENCE_KEYS.DISPLAY);
    },

    /** 设置显示 Logo */
    setShowLogo(value: boolean): void {
      this.showLogo = value;
      schedulePreferenceSync(UI_PREFERENCE_KEYS.DISPLAY);
    },

    /** 设置标签风格 */
    setShowModel(value: string): void {
      this.showModel = value;
      schedulePreferenceSync(UI_PREFERENCE_KEYS.DISPLAY);
    },

    /** 设置页面宽度 */
    setStretch(value: boolean | number): void {
      this.stretch = value;
      schedulePreferenceSync(UI_PREFERENCE_KEYS.DISPLAY);
    },

    /** 应用界面开关到 DOM（灰色 / 色弱） */
    $applyToDom(): void {
      const html = document.documentElement;
      html.classList.toggle('html-grey', this.grey);
      html.classList.toggle('html-weakness', this.weak);
    },
  },
});
