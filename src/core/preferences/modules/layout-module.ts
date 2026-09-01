import { useLayoutPreferencesStore } from '@/store/modules/preferences/layout-preferences';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';
import { UI_PREFERENCE_KEYS } from '@/core/config/keys-config';
import type { PreferenceModule } from '@/core/preferences/registry';

/** 导航布局模式 + 侧栏展开状态（ui.layout） */
export const layoutModule: PreferenceModule = {
  key: UI_PREFERENCE_KEYS.LAYOUT,

  serialize() {
    return { ...useLayoutPreferencesStore().$state };
  },

  hydrate(value) {
    const patch = omitBy(value, isUndefined);
    if (Object.keys(patch).length > 0) {
      useLayoutPreferencesStore().$patch(patch);
    }
  },

  resetLocal() {
    useLayoutPreferencesStore().$reset();
  },
};
