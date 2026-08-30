import {
  THEME_DEFAULT_COLOR_SCHEME,
  THEME_DEFAULT_NAV_THEME,
  THEME_DEFAULT_PRIMARY_COLOR,
} from '@/core/config/uiConfig';
import { UI_PREFERENCE_KEYS } from '@/core/config/keysConfig';
import type { PreferenceModule } from '@/core/preferences/registry';
import { useThemePreferencesStore } from '@/store/modules/preferences/themePreferences';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';

/** 颜色方案 + 侧栏皮肤 + 品牌主色（ui.theme） */
export const themeModule: PreferenceModule = {
  key: UI_PREFERENCE_KEYS.THEME,

  serialize() {
    const themeStore = useThemePreferencesStore();
    return {
      colorScheme: themeStore.colorScheme,
      navTheme: themeStore.navTheme,
      primaryColor: themeStore.primaryColor,
    };
  },

  hydrate(value) {
    const patch = omitBy(value, isUndefined);
    if (Object.keys(patch).length > 0) {
      useThemePreferencesStore().$patch(patch);
    }
  },

  resetLocal() {
    useThemePreferencesStore().$patch({
      colorScheme: THEME_DEFAULT_COLOR_SCHEME,
      navTheme: THEME_DEFAULT_NAV_THEME,
      primaryColor: THEME_DEFAULT_PRIMARY_COLOR,
    });
  },

  mirrorToDevice() {
    useThemePreferencesStore().$mirrorToDevice();
  },
};
