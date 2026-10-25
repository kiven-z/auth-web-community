import { i18n } from '@/app/plugins/i18n';
import { DEFAULT_LOCALE, type LocaleType } from '@/core/config/app-config';
import { defineStore } from 'pinia';
import { readSavedPreferences } from './preferences-storage';

/** 语言偏好状态 */
interface LocalePreferencesState {
  /** 界面语言 */
  locale: string;
}

/**
 * 语言偏好 Store
 *
 * 出厂值优先取本机缓存。
 */
export const useLocalePreferencesStore = defineStore('locale-preferences', {
  state: (): LocalePreferencesState => ({
    locale: readSavedPreferences()?.locale ?? DEFAULT_LOCALE,
  }),

  actions: {
    /**
     * 设置界面语言
     * @param value 语言代码
     */
    setLocale(value: LocaleType): void {
      if (this.locale === value) {
        return;
      }
      this.locale = value;
      i18n.global.locale.value = value;
    },
  },
});
