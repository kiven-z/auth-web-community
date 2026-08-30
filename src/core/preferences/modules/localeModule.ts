import { DEFAULT_LOCALE } from '@/core/config/localeConfig';
import { UI_PREFERENCE_KEYS } from '@/core/config/keysConfig';
import type { PreferenceModule } from '@/core/preferences/registry';
import { useLocalePreferencesStore } from '@/store/modules/preferences/localePreferences';

/** 界面语言（ui.locale） */
export const localeModule: PreferenceModule = {
  key: UI_PREFERENCE_KEYS.LOCALE,

  serialize() {
    return { locale: useLocalePreferencesStore().locale };
  },

  hydrate(value) {
    if (typeof value.locale === 'string') {
      useLocalePreferencesStore().$patch({ locale: value.locale });
    }
  },

  resetLocal() {
    useLocalePreferencesStore().$patch({ locale: DEFAULT_LOCALE });
  },

  mirrorToDevice() {
    useLocalePreferencesStore().$mirrorToDevice();
  },
};
