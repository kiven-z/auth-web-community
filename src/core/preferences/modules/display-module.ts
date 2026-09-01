import { useDisplayPreferencesStore } from '@/store/modules/preferences/display-preferences';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';
import { UI_PREFERENCE_KEYS } from '@/core/config/keys-config';
import type { PreferenceModule } from '@/core/preferences/registry';

/** 界面显示开关 + 标签风格 + 页宽（ui.display） */
export const displayModule: PreferenceModule = {
  key: UI_PREFERENCE_KEYS.DISPLAY,

  serialize() {
    return omitBy({ ...useDisplayPreferencesStore().$state }, isUndefined);
  },

  hydrate(value) {
    const patch = omitBy(value, isUndefined);
    if (Object.keys(patch).length > 0) {
      useDisplayPreferencesStore().$patch(patch);
    }
  },

  resetLocal() {
    useDisplayPreferencesStore().$reset();
  },
};
