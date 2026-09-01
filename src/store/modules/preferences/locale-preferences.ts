import { DEFAULT_LOCALE, type LocaleType } from '@/core/config/locale-config';
import { UI_PREFERENCE_KEYS } from '@/core/config/keys-config';
import { readDeviceUiPreferences, writeDeviceUiPreferences } from '@/core/preferences/persistence/device-storage';
import { getIsHydrating, schedulePreferenceSync } from '@/core/preferences/persistence/sync';
import { applyLocaleToI18n } from '@/core/preferences/runtime/locale-effect';
import { defineStore } from 'pinia';

/** 语言偏好状态 */
interface LocalePreferencesState {
  /** 界面语言 */
  locale: string;
}

/**
 * 语言偏好 Store（ui.locale）
 *
 * 未登录页刷新不回退：出厂值优先取 Device LS 缓存。
 */
export const useLocalePreferencesStore = defineStore('locale-preferences', {
  state: (): LocalePreferencesState => ({
    locale: readDeviceUiPreferences()?.locale ?? DEFAULT_LOCALE,
  }),

  actions: {
    /**
     * 设置界面语言并持久化（Device LS + 服务端）；hydrate 期间只改内存与 i18n
     * @param value 语言代码
     */
    setLocale(value: LocaleType): void {
      if (this.locale === value) {
        return;
      }
      this.locale = value;
      applyLocaleToI18n(value);
      if (getIsHydrating()) {
        return;
      }
      this.$mirrorToDevice();
      schedulePreferenceSync(UI_PREFERENCE_KEYS.LOCALE);
    },

    /** 回写语言到 Device LS（冷启动缓存） */
    $mirrorToDevice(): void {
      writeDeviceUiPreferences({ locale: this.locale });
    },
  },
});
