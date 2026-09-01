import { UI_PREFERENCE_KEYS } from '@/core/config/keys-config';
import type { PreferenceModule } from '@/core/preferences/registry';
import { useTagsPreferencesStore } from '@/store/modules/preferences/tags/tags-preferences';
import { parseTagsPreferenceValue, toPersistedTag } from '../persistence/tags';

/** 多标签页快照（跨浏览器恢复） */
export const tagsModule: PreferenceModule = {
  key: UI_PREFERENCE_KEYS.TAGS,

  serialize() {
    const tagsStore = useTagsPreferencesStore();
    return {
      enabled: tagsStore.enabled,
      items: tagsStore.multiTags.map(toPersistedTag),
    };
  },

  hydrate(value) {
    const tags = parseTagsPreferenceValue(value);
    useTagsPreferencesStore().hydrateTags(value.enabled as boolean, tags);
  },

  resetLocal() {
    useTagsPreferencesStore().$reset();
  },
};
